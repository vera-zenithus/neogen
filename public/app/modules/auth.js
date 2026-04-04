// === NeoGen: Auth Module ===

let currentUser = null;

// ── 인증 상태 감지 ──────────────────────────────
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        await onUserLoggedIn(user);
    } else {
        currentUser = null;
        onUserLoggedOut();
    }
});

// ── 로그인 모달 열기/닫기 ──────────────────────────────
function openLoginModal() {
    const modal = document.getElementById('loginScreen');
    if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginScreen');
    if (modal) modal.style.display = 'none';
}

// ── 로그인 후 처리 ──────────────────────────────
async function onUserLoggedIn(user) {
    closeLoginModal();

    // 유저 정보 표시
    const userNameEl  = document.getElementById('userName');
    const userPhotoEl = document.getElementById('userPhoto');
    const userTierEl  = document.getElementById('userTier');

    if (userNameEl)  userNameEl.textContent  = user.displayName || user.email;
    if (userPhotoEl) userPhotoEl.src          = user.photoURL || 'neo-character.png';
    if (userTierEl)  userTierEl.textContent   = '🌱 Free';

    // Firestore에서 유저 플랜 확인
    await checkUserPlan(user.uid);

    // 데이터 로드 (Firestore → localStorage fallback)
    await loadUserData(user.uid);

    // 헤더 상태 업데이트
    updateHeaderAuthState(true);

    // 데이터 동기화 후 UI 갱신
    updateAllPages();

    showNeoBubble(`안녕하세요, ${user.displayName?.split(' ')[0] || ''}! 👋 네오예요!`, 3000);
}

// ── 로그아웃 후 처리 ──────────────────────────────
function onUserLoggedOut() {
    updateHeaderAuthState(false);
}

// ── Google 로그인 ──────────────────────────────
async function signInWithGoogle() {
    try {
        setLoginLoading(true);
        await auth.signInWithPopup(googleProvider);
    } catch (error) {
        console.error('Google 로그인 오류:', error);
        showLoginError(getAuthErrorMessage(error.code));
        setLoginLoading(false);
    }
}

// ── 이메일 로그인 ──────────────────────────────
async function signInWithEmail() {
    const email    = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        showLoginError('이메일과 비밀번호를 입력해주세요.');
        return;
    }

    try {
        setLoginLoading(true);
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('이메일 로그인 오류:', error);
        showLoginError(getAuthErrorMessage(error.code));
        setLoginLoading(false);
    }
}

// ── 이메일 회원가입 ──────────────────────────────
async function signUpWithEmail() {
    const email    = document.getElementById('loginEmail')?.value?.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        showLoginError('이메일과 비밀번호를 입력해주세요.');
        return;
    }
    if (password.length < 6) {
        showLoginError('비밀번호는 6자 이상이어야 합니다.');
        return;
    }

    try {
        setLoginLoading(true);
        await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('회원가입 오류:', error);
        showLoginError(getAuthErrorMessage(error.code));
        setLoginLoading(false);
    }
}

// ── 로그아웃 ──────────────────────────────
async function signOut() {
    if (!confirm('로그아웃 하시겠습니까?')) return;
    try {
        await auth.signOut();
    } catch (error) {
        console.error('로그아웃 오류:', error);
    }
}

// ── 비밀번호 재설정 ──────────────────────────────
async function resetPassword() {
    const email = document.getElementById('loginEmail')?.value?.trim();
    if (!email) {
        showLoginError('이메일을 입력 후 클릭해주세요.');
        return;
    }
    try {
        await auth.sendPasswordResetEmail(email);
        showLoginError('✅ 재설정 이메일을 보냈어요! 메일함을 확인해주세요.');
    } catch (error) {
        showLoginError(getAuthErrorMessage(error.code));
    }
}

// ── 유저 플랜 확인 ──────────────────────────────
async function checkUserPlan(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        const userTierEl = document.getElementById('userTier');

        if (doc.exists) {
            const data = doc.data();
            const plan = data.plan || 'free';

            if (userTierEl) {
                const tierLabels = {
                    free:         '🌱 Free',
                    pro:          '⚡ Pro',
                    organization: '🏢 Organization'
                };
                userTierEl.textContent = tierLabels[plan] || '🌱 Free';
            }

            window.userPlan = plan;
        } else {
            // 신규 유저 → Firestore에 등록
            await db.collection('users').doc(uid).set({
                plan:      'free',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                email:     auth.currentUser?.email || ''
            });
            window.userPlan = 'free';
        }
    } catch (error) {
        console.error('플랜 확인 오류:', error);
        window.userPlan = 'free';
    }
}

// ── Firestore 데이터 로드 ──────────────────────────────
async function loadUserData(uid) {
    try {
        const doc = await db.collection('userData').doc(uid).get();
        if (doc.exists) {
            const data = doc.data();
            if (data.accounts)      accounts      = data.accounts;
            if (data.journalEntries) journalEntries = data.journalEntries;
            if (data.currentJournalId) currentJournalId = data.currentJournalId;
            if (data.learnedPatterns)  learnedPatterns  = data.learnedPatterns;
            console.log('☁️ Firestore에서 데이터 로드 완료');
        } else {
            // 기존 localStorage 데이터 있으면 마이그레이션
            loadData();
            if (accounts.length > 0 || journalEntries.length > 0) {
                await saveUserDataToFirestore(uid);
                console.log('📦 localStorage → Firestore 마이그레이션 완료');
            }
        }
    } catch (error) {
        console.error('데이터 로드 오류:', error);
        loadData(); // fallback to localStorage
    }
}

// ── Firestore 저장 ──────────────────────────────
async function saveUserDataToFirestore(uid) {
    try {
        await db.collection('userData').doc(uid).set({
            accounts,
            journalEntries,
            currentJournalId,
            learnedPatterns,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Firestore 저장 오류:', error);
    }
}

// saveData 오버라이드 (localStorage + Firestore 동시 저장)
const _originalSaveData = typeof saveData === 'function' ? saveData : null;
function saveData() {
    // localStorage
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS,          JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES,   JSON.stringify(journalEntries));
    localStorage.setItem(STORAGE_KEYS.CURRENT_JOURNAL_ID, currentJournalId.toString());
    localStorage.setItem(STORAGE_KEYS.LEARNED_PATTERNS,  JSON.stringify(learnedPatterns));

    // Firestore (비동기, 로그인 상태일 때만)
    if (currentUser) {
        saveUserDataToFirestore(currentUser.uid);
    }
}

// ── 프리미엄 기능 체크 ──────────────────────────────
function isPremium() {
    return window.userPlan === 'pro' || window.userPlan === 'organization';
}

function requirePremium(featureName) {
    if (!isPremium()) {
        showNeoBubble(`⚡ "${featureName}"은 Pro 플랜 기능이에요!<br>업그레이드하면 네오 AI를 제한 없이 사용할 수 있어요!`, 4000);
        showUpgradeModal();
        return false;
    }
    return true;
}

// ── 업그레이드 모달 ──────────────────────────────
function showUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) modal.style.display = 'flex';
}

function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) modal.style.display = 'none';
}

// ── UI 헬퍼 ──────────────────────────────
// ── 헤더 로그인 상태 반영 ──────────────────────────────
function updateHeaderAuthState(isLoggedIn) {
    const userInfoBar  = document.getElementById('userInfoBar');
    const loginBtn     = document.getElementById('headerLoginBtn');

    if (isLoggedIn) {
        if (userInfoBar) userInfoBar.style.display = 'flex';
        if (loginBtn)    loginBtn.style.display    = 'none';
        // 저장 유도 배너 숨기기
        const banner = document.getElementById('saveNudgeBanner');
        if (banner) banner.style.display = 'none';
    } else {
        if (userInfoBar) userInfoBar.style.display = 'none';
        if (loginBtn)    loginBtn.style.display    = 'flex';
        // 저장 유도 배너 표시
        const banner = document.getElementById('saveNudgeBanner');
        if (banner) banner.style.display = 'flex';
    }
}

function showLoginError(message) {
    const el = document.getElementById('loginError');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
    }
}

function setLoginLoading(loading) {
    const btn = document.getElementById('googleLoginBtn');
    if (btn) btn.disabled = loading;
    const emailBtn = document.getElementById('emailLoginBtn');
    if (emailBtn) emailBtn.disabled = loading;
}

function toggleAuthMode() {
    const signupMode  = document.getElementById('signupMode');
    const loginMode   = document.getElementById('loginMode');
    const errorEl     = document.getElementById('loginError');
    if (errorEl) errorEl.style.display = 'none';
    if (signupMode && loginMode) {
        const isSignup = signupMode.style.display !== 'none';
        signupMode.style.display = isSignup ? 'none'  : 'block';
        loginMode.style.display  = isSignup ? 'block' : 'none';
    }
}

// ── 에러 메시지 한국어화 ──────────────────────────────
function getAuthErrorMessage(code) {
    const messages = {
        'auth/user-not-found':       '등록되지 않은 이메일이에요.',
        'auth/wrong-password':       '비밀번호가 틀렸어요.',
        'auth/email-already-in-use': '이미 사용 중인 이메일이에요.',
        'auth/invalid-email':        '올바른 이메일 형식이 아니에요.',
        'auth/weak-password':        '비밀번호가 너무 약해요. (6자 이상)',
        'auth/popup-closed-by-user': '로그인 창이 닫혔어요. 다시 시도해주세요.',
        'auth/network-request-failed': '네트워크 오류예요. 인터넷 연결을 확인해주세요.',
    };
    return messages[code] || '오류가 발생했어요. 다시 시도해주세요.';
}
