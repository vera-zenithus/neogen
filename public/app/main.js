// === NeoGen: Main Module ===

// 초기화 함수
function init() {
    loadData();
    setupEventListeners();
    renderDashboard();
    renderAccounts();
    renderJournalEntries();
    updateLedgerSelect();
    generateReports();

    // 기본 계정이 없으면 생성 (완전히 빈 상태일 때만)
    if (accounts.length === 0) {
        console.log('📋 계정과목이 없음 - 기본 계정 생성');
        accounts = [...DEFAULT_ACCOUNTS];
        saveData();
    } else {
        console.log('📋 기존 계정과목 유지:', accounts.length, '개');
    }

    // 세션 정리
    sessionStorage.clear();

    // Smart Input 날짜 초기화
    const smartDateField = document.getElementById('smartDate');
    if (smartDateField) {
        smartDateField.value = new Date().toISOString().split('T')[0];
    }

    // 파일 업로드 초기화
    initFileUpload();

    // 네오 초기화 (개선된 버전)
    initNeo();

    // AI 성능 모니터링 초기화
    initAIPerformanceMonitoring();

    // 초기화 버튼에 직접 이벤트 리스너 추가
    setTimeout(() => {
        const resetButton = document.querySelector('button[title="모든 데이터 초기화"]');
        if (resetButton) {
            console.log('🔧 초기화 버튼 찾음, 이벤트 리스너 추가');
            resetButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔄 초기화 버튼 클릭 이벤트 감지');
                resetAllData();
            });
        } else {
            console.error('❌ 초기화 버튼을 찾을 수 없음');
        }
    }, 1000);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 탭 변경 시 데이터 새로고침
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                renderDashboard();
                renderAccounts();
                renderJournalEntries();
                updateLedgerSelect();
                generateReports();
            }, 100);
        });
    });

    // 분개 입력 폼의 실시간 계산
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('debit-amount') ||
            e.target.classList.contains('credit-amount')) {
            updateJournalBalance();
        }
    });
}

// 탭 전환 함수
function showTab(tabName, triggerElement = null) {
    // 모든 탭 컨텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 선택된 탭 활성화
    document.getElementById(tabName).classList.add('active');

    // 해당 탭 버튼도 활성화 (triggerElement가 있거나 찾을 수 있으면)
    if (triggerElement) {
        triggerElement.classList.add('active');
    } else {
        // 탭 이름으로 버튼 찾기 (더 안전한 방법)
        const tabButton = document.querySelector(`[onclick*="showTab('${tabName}')"]`);
        if (tabButton) {
            tabButton.classList.add('active');
        }
    }

    // 네오 컨텍스트 업데이트
    updateNeoContext(tabName);

    // 데이터 새로고침
    switch(tabName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'accounts':
            renderAccounts();
            break;
        case 'journal':
            renderJournalEntries();
            break;
        case 'ledger':
            updateLedgerSelect();
            break;
        case 'reports':
            generateReports();
            break;
        case 'smart-input':
            initSmartInput();
            break;
        case 'annual-report':
            initAnnualReport();
            break;
    }
}

// 대시보드 렌더링
function renderDashboard() {
    console.log('📈 renderDashboard 시작...');
    console.log('현재 accounts 배열:', accounts.map(acc => ({
        code: acc.code,
        name: acc.name,
        type: acc.type,
        balance: acc.balance
    })));

    const totalAssets = calculateTotalByType('asset');
    const totalLiabilities = calculateTotalByType('liability');
    const totalEquity = calculateTotalByType('equity');
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');
    const netIncome = totalRevenue - totalExpenses;

    console.log('💰 대시보드 계산 결과:');
    console.log(`   총 자산: ${totalAssets}`);
    console.log(`   총 부채: ${totalLiabilities}`);
    console.log(`   총 자본: ${totalEquity}`);
    console.log(`   총 수익: ${totalRevenue}`);
    console.log(`   총 비용: ${totalExpenses}`);
    console.log(`   순이익: ${netIncome}`);

    document.getElementById('totalAssets').textContent = formatCurrency(totalAssets);
    document.getElementById('totalLiabilities').textContent = formatCurrency(totalLiabilities);
    document.getElementById('totalEquity').textContent = formatCurrency(totalEquity + netIncome);
    document.getElementById('netIncome').textContent = formatCurrency(netIncome);

    console.log('✅ 대시보드 DOM 업데이트 완료');

    // 최근 거래 표시
    renderRecentTransactions();
}

// 전체 페이지 실시간 업데이트 시스템
function updateAllPages() {
    console.log('🔄 전체 시스템 업데이트 시작...');

    try {
        // 1. 대시보드 업데이트
        console.log('📈 대시보드 업데이트 중...');
        renderDashboard();

        // 2. 계정관리 페이지 업데이트
        console.log('💼 계정관리 페이지 업데이트 중...');
        renderAccounts();

        // 3. 분개장 업데이트
        console.log('📝 분개장 업데이트 중...');
        renderJournalEntries();

        // 4. 총계정원장 업데이트 (현재 선택된 계정이 있다면)
        console.log('🏦 총계정원장 업데이트 중...');
        updateLedgerSelect();
        const currentLedgerAccount = document.getElementById('ledgerAccountSelect')?.value;
        if (currentLedgerAccount) {
            showLedger();
        }

        // 5. 재무제표 업데이트 (중요!)
        console.log('📊 재무제표 업데이트 중...');
        generateReports();

        // 6. 연말공시 데이터 업데이트 (폼이 작성되어 있다면)
        console.log('🌐 연말공시 업데이트 중...');
        updateAnnualReportData();

        // 7. 학습 패턴 업데이트
        console.log('🧠 AI 학습패턴 업데이트 중...');
        renderLearnedPatterns();

        // 8. 데이터 일관성 검증
        console.log('🔍 데이터 일관성 검증 중...');
        const isConsistent = validateDataConsistency();
        if (!isConsistent) {
            console.error('❌ 데이터 일관성 검증 실패');
        }

        console.log('✅ 전체 시스템 업데이트 완료!');

    } catch (error) {
        console.error('❌ updateAllPages 오류:', error);
        alert('페이지 업데이트 중 오류가 발생했습니다: ' + error.message);
    }
}

// 페이지 간 데이터 일관성 검증
function validateDataConsistency() {
    const totalAssets = calculateTotalByType('asset');
    const totalLiabilities = calculateTotalByType('liability');
    const totalEquity = calculateTotalByType('equity');
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');

    // 대차대조표 균형 검증
    const balanceSheetDifference = totalAssets - (totalLiabilities + totalEquity + (totalRevenue - totalExpenses));

    if (Math.abs(balanceSheetDifference) > 0.01) {
        console.warn('⚠️ 대차대조표 불균형 감지:', balanceSheetDifference);
        showNeoBubble('⚠️ 데이터 불일치가 감지되었어요. 확인이 필요합니다!', 3000);
        return false;
    }

    console.log('✅ 대차대조표 균형 확인됨');
    return true;
}

// 자동 저장 및 백업 시스템
function autoSaveAndSync() {
    saveData();

    // 로컬 스토리지 백업
    const backupData = {
        accounts: accounts,
        journalEntries: journalEntries,
        learnedPatterns: learnedPatterns,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('neogen_backup', JSON.stringify(backupData));

    // 네오에게 저장 완료 알림
    if (Math.random() < 0.3) { // 30% 확률로 저장 알림
        showNeoBubble('💾 데이터가 안전하게 저장되었어요!', 1500);
    }
}

// 스마트 데이터 초기화 함수 (계정과목 구조는 보존)
function resetAllData() {
    console.log('🔄 스마트 초기화 함수 호출됨');

    const confirmMessage = `⚠️ 입력된 거래 데이터를 초기화하시겠습니까?

다음 데이터가 삭제됩니다:
• 모든 분개 내역 (거래 기록)
• 계정별 잔액 (0원으로 리셋)
• 학습된 AI 패턴
• AI 성능 데이터

✅ 계정과목 구조는 그대로 유지됩니다!
이 작업은 되돌릴 수 없습니다!`;

    if (confirm(confirmMessage)) {
        console.log('✅ 첫 번째 확인 완료');

        const secondConfirm = confirm('정말로 모든 데이터를 삭제하시겠습니까?\n마지막 확인입니다!');

        if (secondConfirm) {
            console.log('✅ 두 번째 확인 완료, 초기화 시작...');

            try {
                // 거래 데이터만 초기화 (계정과목 구조는 보존)
                console.log('🧹 거래 데이터 초기화 시작...');

                // 1. 분개 내역 삭제
                journalEntries = [];
                localStorage.removeItem(STORAGE_KEYS.JOURNAL_ENTRIES);
                console.log('✅ 분개 내역 삭제 완료');

                // 2. 계정 잔액을 0으로 리셋 (계정과목은 유지)
                accounts.forEach(account => {
                    account.balance = 0;
                });
                localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
                console.log('✅ 계정 잔액 리셋 완료 (계정과목 구조 보존)');

                // 3. AI 학습 데이터 초기화
                learnedPatterns = [];
                localStorage.removeItem(STORAGE_KEYS.LEARNED_PATTERNS);
                console.log('✅ AI 학습 패턴 삭제 완료');

                // 4. 분개 ID 리셋
                currentJournalId = 1;
                localStorage.setItem(STORAGE_KEYS.CURRENT_JOURNAL_ID, '1');
                console.log('✅ 분개 ID 리셋 완료');

                // 5. 현재 추천 초기화
                currentRecommendation = null;

                // UI 즉시 초기화 (새로고침 전에)
                clearAllDisplays();

                // 스마트 초기화 완료 (계정과목 구조 보존)

                console.log('💾 전역 변수 및 UI 초기화 완료');

                // AI 성능 데이터 초기화
                if (window.aiPerformance) {
                    window.aiPerformance = {
                        totalClassifications: 0,
                        correctClassifications: 0,
                        userCorrections: 0,
                        averageConfidence: 0,
                        lastUpdated: Date.now()
                    };
                    console.log('🤖 AI 성능 데이터 초기화 완료');
                }

                // 네오 알림
                console.log('✅ 초기화 완료! 즉시 페이지 새로고침 실행');

                // 즉시 페이지 새로고침으로 완전히 초기화 (캐시 무시)
                window.location.reload(true);

            } catch (error) {
                console.error('❌ 초기화 중 오류 발생:', error);
                alert('초기화 중 오류가 발생했습니다: ' + error.message);
            }
        } else {
            console.log('❌ 두 번째 확인 취소됨');
        }
    } else {
        console.log('❌ 첫 번째 확인 취소됨');
    }
}

// 백업 데이터를 엑셀로 다운로드
function downloadBackup() {
    try {
        const wb = XLSX.utils.book_new();

        // 1. 계정과목 시트
        const accountsData = [
            ['계정코드', '계정명', '계정유형', '현재잔액', '백업일시']
        ];
        accounts.forEach(account => {
            accountsData.push([
                account.code,
                account.name,
                getAccountTypeKorean(account.type),
                account.balance,
                new Date().toLocaleString('ko-KR')
            ]);
        });
        const accountsSheet = XLSX.utils.aoa_to_sheet(accountsData);
        XLSX.utils.book_append_sheet(wb, accountsSheet, '계정과목');

        // 2. 분개장 시트
        const journalData = [
            ['날짜', '적요', '계정코드', '계정명', '차변', '대변', '분개번호']
        ];
        journalEntries.forEach(entry => {
            entry.entries.forEach(line => {
                const account = accounts.find(acc => acc.code === line.account);
                journalData.push([
                    entry.date,
                    entry.description,
                    line.account,
                    account ? account.name : '',
                    line.debit ? line.amount : '',
                    line.credit ? line.amount : '',
                    entry.id
                ]);
            });
        });
        const journalSheet = XLSX.utils.aoa_to_sheet(journalData);
        XLSX.utils.book_append_sheet(wb, journalSheet, '분개장');

        // 3. 재무요약 시트
        const totalAssets = calculateTotalByType('asset');
        const totalLiabilities = calculateTotalByType('liability');
        const totalEquity = calculateTotalByType('equity');
        const totalRevenue = calculateTotalByType('revenue');
        const totalExpenses = calculateTotalByType('expense');
        const netIncome = totalRevenue - totalExpenses;

        const summaryData = [
            ['항목', '금액', '백업일시'],
            ['총 자산', totalAssets, new Date().toLocaleString('ko-KR')],
            ['총 부채', totalLiabilities, ''],
            ['총 자본', totalEquity, ''],
            ['총 수익', totalRevenue, ''],
            ['총 비용', totalExpenses, ''],
            ['당기순이익', netIncome, ''],
            ['', '', ''],
            ['거래 건수', journalEntries.length, ''],
            ['계정 수', accounts.length, ''],
            ['학습된 패턴', learnedPatterns.length, '']
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, '재무요약');

        // 4. 학습된 패턴 시트
        if (learnedPatterns.length > 0) {
            const patternsData = [
                ['키워드', '차변계정', '대변계정', '사용횟수', '마지막사용']
            ];
            learnedPatterns.forEach(pattern => {
                patternsData.push([
                    pattern.keywords.join(', '),
                    pattern.debitAccount,
                    pattern.creditAccount,
                    pattern.count,
                    pattern.lastUsed || ''
                ]);
            });
            const patternsSheet = XLSX.utils.aoa_to_sheet(patternsData);
            XLSX.utils.book_append_sheet(wb, patternsSheet, '학습패턴');
        }

        // 파일 다운로드
        const fileName = `neogen_backup_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);

        showNeoBubble('💾 엑셀 백업 파일이 다운로드되었습니다!', 2000);

    } catch (error) {
        console.error('백업 생성 오류:', error);
        alert('백업 파일 생성 중 오류가 발생했습니다.');
    }
}

// 모든 화면 표시 초기화
function clearAllDisplays() {
    console.log('🧹 모든 화면 표시 초기화 중...');

    // 대시보드 초기화
    const totalAssets = document.getElementById('totalAssets');
    const totalLiabilities = document.getElementById('totalLiabilities');
    const totalEquity = document.getElementById('totalEquity');
    const netIncome = document.getElementById('netIncome');

    if (totalAssets) totalAssets.textContent = '₩0';
    if (totalLiabilities) totalLiabilities.textContent = '₩0';
    if (totalEquity) totalEquity.textContent = '₩0';
    if (netIncome) netIncome.textContent = '₩0';

    // 최근 거래 초기화
    const recentTransactions = document.getElementById('recentTransactions');
    if (recentTransactions) {
        recentTransactions.innerHTML = '<p class="no-data">아직 거래가 없습니다.</p>';
    }

    // 계정 관리 초기화
    const accountCategories = ['assetAccounts', 'liabilityAccounts', 'equityAccounts', 'revenueAccounts', 'expenseAccounts'];
    accountCategories.forEach(categoryId => {
        const container = document.getElementById(categoryId);
        if (container) {
            container.innerHTML = '<p class="no-data">계정이 없습니다.</p>';
        }
    });

    // 분개장 초기화
    const journalTableBody = document.getElementById('journalTableBody');
    if (journalTableBody) {
        journalTableBody.innerHTML = '<tr><td colspan="6" class="no-data">아직 분개 내역이 없습니다.</td></tr>';
    }

    // 총계정원장 초기화
    const ledgerContent = document.getElementById('ledgerContent');
    if (ledgerContent) {
        ledgerContent.innerHTML = '<p class="no-data">계정을 선택해주세요.</p>';
    }

    // 재무제표 초기화
    const balanceSheet = document.getElementById('balanceSheet');
    const incomeStatement = document.getElementById('incomeStatement');
    const societyReport = document.getElementById('societyReport');

    if (balanceSheet) {
        balanceSheet.innerHTML = `
            <div class="financial-statement">
                <div class="statement-header">대차대조표</div>
                <div class="statement-body">
                    <p class="no-data">아직 데이터가 없습니다.</p>
                </div>
            </div>
        `;
    }

    if (incomeStatement) {
        incomeStatement.innerHTML = `
            <div class="financial-statement">
                <div class="statement-header">손익계산서</div>
                <div class="statement-body">
                    <p class="no-data">아직 데이터가 없습니다.</p>
                </div>
            </div>
        `;
    }

    if (societyReport) {
        societyReport.innerHTML = `
            <div class="financial-statement">
                <div class="statement-header">단체 보고서</div>
                <div class="statement-body">
                    <p class="no-data">아직 데이터가 없습니다.</p>
                </div>
            </div>
        `;
    }

    // 학습 패턴 초기화
    const learnedPatternsEl = document.getElementById('learnedPatterns');
    if (learnedPatternsEl) {
        learnedPatternsEl.innerHTML = '<p class="no-data">아직 학습된 패턴이 없습니다.</p>';
    }

    // 연말공시 초기화
    const annualReportContent = document.getElementById('annualReportContent');
    if (annualReportContent) {
        annualReportContent.innerHTML = '';
    }

    // 스마트 입력 폼 초기화
    const smartInputForm = document.getElementById('smartInputForm');
    if (smartInputForm) {
        smartInputForm.reset();
    }

    // AI 추천 결과 숨기기
    const aiRecommendation = document.getElementById('aiRecommendation');
    if (aiRecommendation) {
        aiRecommendation.style.display = 'none';
    }

    console.log('✅ 모든 화면 표시 초기화 완료');
}

// 홈으로 이동 함수
function goToHome() {
    console.log('🏠 홈으로 이동');

    // 모든 탭 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // 스마트입력 탭 활성화 (새로운 홈 화면)
    const smartInputBtn = document.querySelector('.tab-btn[onclick*="smart-input"]');
    const smartInputContent = document.getElementById('smart-input');

    if (smartInputBtn) smartInputBtn.classList.add('active');
    if (smartInputContent) smartInputContent.classList.add('active');

    // 스마트입력 새로고침
    console.log('✅ 스마트입력으로 이동 완료 (새로운 홈)');

    // 네오 환영 메시지
    showNeoBubble('🏠 네오젠 홈으로 돌아왔어요! 환영합니다! ✨', 2000);
}

// 피드백 폼 제출 핸들러
function handleFeedbackSubmit(event) {
    // 로컬 환경에서는 Netlify 폼이 작동하지 않으므로 처리
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        event.preventDefault();

        const name = event.target.name.value;
        const email = event.target.email.value;
        const category = event.target.category.value;
        const message = event.target.message.value;

        console.log('📩 피드백 제출 (로컬 환경):', {
            name,
            email,
            category,
            message
        });

        alert(`💬 피드백 감사합니다!\n\n✨ 로컬 환경에서는 실제 전송되지 않습니다.\n📤 Netlify 배포 후에 정상 작동합니다.\n\n입력하신 내용:\n이름: ${name}\n분류: ${category}\n내용: ${message.substring(0, 50)}...`);

        // 폼 초기화
        event.target.reset();

        return false;
    }

    // Netlify 환경에서는 기본 동작 수행
    return true;
}

// 데이터 동기화 알림 표시
function showDataSyncNotification() {
    // 네오 말풍선으로 업데이트 알림
    showNeoBubble('🎉 모든 데이터가 실시간으로 업데이트되었어요!<br>📊 대시보드, 📋 재무제표, 📚 총계정원장까지 모두 최신 상태입니다!', 4000);

    // 시각적 업데이트 효과
    addUpdateEffect();
}

// 시각적 업데이트 효과
function addUpdateEffect() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        if (!tab.classList.contains('active')) {
            tab.style.animation = 'pulse-update 1s ease-in-out';
            setTimeout(() => {
                tab.style.animation = '';
            }, 1000);
        }
    });
}

// 테스트 데이터 입력 기능 (작년 학회 자료 테스트용)
function loadTestData() {
    // 예시 학회 회계 데이터
    const testJournalEntries = [
        {
            id: 1,
            date: '2023-01-15',
            description: '연회비 수입',
            entries: [
                { account: '102', amount: 1500000, debit: true, credit: false },
                { account: '401', amount: 1500000, debit: false, credit: true }
            ]
        },
        {
            id: 2,
            date: '2023-02-10',
            description: '학술대회 개최비',
            entries: [
                { account: '503', amount: 800000, debit: true, credit: false },
                { account: '102', amount: 800000, debit: false, credit: true }
            ]
        },
        {
            id: 3,
            date: '2023-03-05',
            description: '사무용품 구입',
            entries: [
                { account: '504', amount: 150000, debit: true, credit: false },
                { account: '102', amount: 150000, debit: false, credit: true }
            ]
        },
        {
            id: 4,
            date: '2023-04-20',
            description: '논문집 출간비',
            entries: [
                { account: '505', amount: 600000, debit: true, credit: false },
                { account: '102', amount: 600000, debit: false, credit: true }
            ]
        }
    ];

    if (confirm('테스트 데이터를 로드하시겠습니까? 기존 데이터는 삭제됩니다.')) {
        // 기존 데이터 초기화
        journalEntries.length = 0;
        accounts.forEach(account => account.balance = 0);

        // 테스트 데이터 로드
        journalEntries.push(...testJournalEntries);
        currentJournalId = testJournalEntries.length + 1;

        // 계정 잔액 업데이트
        testJournalEntries.forEach(entry => {
            updateAccountBalances(entry);
        });

        saveData();

        // 화면 새로고침
        renderDashboard();
        renderAccounts();
        renderJournalEntries();
        updateLedgerSelect();
        generateReports();

        alert('테스트 데이터가 로드되었습니다!');
    }
}

// 초기화 버튼 직접 연결 확인
function testResetButton() {
    console.log('🔧 초기화 버튼 테스트');
    resetAllData();
}

// 기본 계정 생성 함수 (초기화 후 필요시 사용)
function createDefaultAccounts() {
    if (accounts.length === 0) {
        accounts = [...DEFAULT_ACCOUNTS];
        saveData();
        renderAccounts();
        updateJournalAccountSelects();
        updateLedgerSelect();
        showNeoBubble('✅ 기본 계정과목이 생성되었습니다!', 2000);
        console.log('📋 기본 계정과목 생성 완료');
    } else {
        alert('이미 계정과목이 존재합니다.');
    }
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const accountModal = document.getElementById('accountModal');
    const journalModal = document.getElementById('journalModal');

    if (event.target === accountModal) {
        closeAccountModal();
    }
    if (event.target === journalModal) {
        closeJournalModal();
    }

    const editJournalModal = document.getElementById('editJournalModal');
    if (event.target === editJournalModal) {
        closeEditJournalModal();
    }
};

// 전역 에러 핸들링 (자동 버그 리포트 유도)
window.addEventListener('error', function(e) {
    console.error('에러 발생:', e);

    // 에러 발생시 사용자에게 피드백 요청
    if (confirm('오류가 발생했습니다. 개발팀에 리포트를 보내주시겠어요?')) {
        scrollToFeedback();

        setTimeout(() => {
            const typeSelect = document.querySelector('select[name="type"]');
            const messageTextarea = document.querySelector('textarea[name="message"]');

            if (typeSelect) typeSelect.value = '버그신고';
            if (messageTextarea) {
                messageTextarea.value = `자동 에러 리포트\n\n에러 내용: ${e.message}\n페이지: ${window.location.href}\n시간: ${new Date().toLocaleString()}\n\n추가 설명:`;
            }
        }, 500);
    }
});

// DOM 로드 완료 시 초기화
// 탭 콘텐츠를 동적으로 불러오는 경우, 주요 탭이 로드된 후 init()을 실행한다.
document.addEventListener('DOMContentLoaded', function() {
    // loadTab이 정의되어 있으면(분리된 탭 구조) 주요 탭을 먼저 로드 후 init 실행
    if (typeof window.loadTab === 'function') {
        var coreTabs = ['smart-input', 'file-import', 'dashboard', 'accounts', 'journal', 'ledger', 'reports'];
        Promise.all(coreTabs.map(function(t) { return window.loadTab(t); }))
            .then(init)
            .catch(function(err) {
                console.warn('[tab preload] 일부 탭 로드 실패, init 실행:', err);
                init();
            });
    } else {
        init();
    }
});

// 디버깅용: 전역 함수로 초기화 함수 노출
window.resetAllData = resetAllData;
window.testResetButton = testResetButton;
window.createDefaultAccounts = createDefaultAccounts;

// === 결제 (Toss: 국내 / Paddle: 해외) ===
function startCheckout(plan) {
    if (!currentUser) {
        showNeoBubble('업그레이드하려면 먼저 로그인이 필요해요!', 3000);
        closeUpgradeModal();
        openLoginModal();
        return;
    }
    showPaymentMethodModal(plan);
}

function showPaymentMethodModal(plan) {
    const existing = document.getElementById('paymentMethodModal');
    if (existing) existing.remove();
    closeUpgradeModal();

    const modal = document.createElement('div');
    modal.id = 'paymentMethodModal';
    modal.style.cssText = `
        position:fixed; inset:0; z-index:9000;
        background:rgba(15,23,42,0.8); backdrop-filter:blur(8px);
        display:flex; align-items:center; justify-content:center;
    `;
    modal.innerHTML = `
        <div style="background:var(--neo-navy-mid); border:1px solid rgba(6,182,212,0.25);
             border-radius:20px; padding:32px; max-width:360px; width:90%; text-align:center;">
            <h3 style="color:white; margin:0 0 8px;">지역 선택</h3>
            <p style="color:rgba(255,255,255,0.4); font-size:13px; margin:0 0 24px;">
                결제 지역을 선택해주세요
            </p>
            <button onclick="proceedCheckout('toss','${plan}')"
                    style="width:100%; padding:14px; border-radius:12px; border:none;
                           background:#3182f6; color:white; font-weight:700; font-size:15px;
                           cursor:pointer; font-family:inherit; margin-bottom:10px;">
                🇰🇷 Korea
            </button>
            <button onclick="proceedCheckout('paddle','${plan}')"
                    style="width:100%; padding:14px; border-radius:12px; border:none;
                           background:linear-gradient(135deg,#06b6d4,#3b82f6); color:white;
                           font-weight:700; font-size:15px; cursor:pointer; font-family:inherit;
                           margin-bottom:16px;">
                🌍 International
            </button>
            <button onclick="document.getElementById('paymentMethodModal').remove()"
                    style="background:none; border:none; color:rgba(255,255,255,0.3);
                           font-size:13px; cursor:pointer; font-family:inherit;">
                취소
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function proceedCheckout(provider, plan) {
    document.getElementById('paymentMethodModal')?.remove();

    if (provider === 'toss') {
        await startTossCheckout(plan);
    } else {
        await startPaddleCheckout(plan);
    }
}

// ── 월간/연간 토글 ──────────────────────────────
function setUpgradePeriod(period) {
    window._upgradePlan = period === 'yearly' ? 'pro_yearly' : 'pro_monthly';

    const monthlyBtn = document.getElementById('toggleMonthly');
    const yearlyBtn  = document.getElementById('toggleYearly');
    const priceEl    = document.getElementById('upgradePrice');
    const periodEl   = document.getElementById('upgradePeriodLabel');

    const isYearly = period === 'yearly';
    monthlyBtn.style.background = isYearly ? 'transparent' : 'var(--neo-cyan)';
    monthlyBtn.style.color      = isYearly ? 'rgba(255,255,255,0.5)' : 'var(--neo-navy)';
    yearlyBtn.style.background  = isYearly ? 'var(--neo-cyan)' : 'transparent';
    yearlyBtn.style.color       = isYearly ? 'var(--neo-navy)' : 'rgba(255,255,255,0.5)';

    priceEl.textContent  = isYearly ? '$99' : '$14';
    periodEl.textContent = isYearly ? '/년' : '/월';
}

// ── Toss 결제 ──────────────────────────────
async function startTossCheckout(plan) {
    const PRICES = { pro_monthly: 20000, pro_yearly: 140000 };
    const tossKey = process.env.TOSS_CLIENT_KEY || 'test_ck_placeholder';
    const customerKey = `neogen-${currentUser.uid}`;

    try {
        const tossPayments = await TossPayments(tossKey);
        const payment = tossPayments.payment({ customerKey });
        await payment.requestBillingAuth({
            method: 'CARD',
            successUrl: `${location.origin}/api/toss-issue-billing-key?uid=${currentUser.uid}&plan=${plan}&email=${encodeURIComponent(currentUser.email || '')}`,
            failUrl:    `${location.origin}/?payment=fail`,
            customerEmail: currentUser.email || '',
            customerName:  currentUser.displayName || ''
        });
    } catch (err) {
        console.error('Toss 오류:', err);
        showNeoBubble('결제 중 오류가 발생했어요.', 3000);
    }
}

// ── Paddle 결제 ──────────────────────────────
async function startPaddleCheckout(plan) {
    try {
        const res = await fetch('/api/paddle-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan, uid: currentUser.uid, email: currentUser.email })
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            throw new Error(data.error || 'Paddle 오류');
        }
    } catch (err) {
        console.error('Paddle 오류:', err);
        showNeoBubble(`결제 오류: ${err.message}`, 5000);
    }
}
