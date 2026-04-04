// === NeoGen: Accounts Module ===

// 계정과목 렌더링
function renderAccounts() {
    console.log('💼 renderAccounts 시작...');
    console.log('현재 accounts 배열:', accounts.map(acc => ({
        code: acc.code,
        name: acc.name,
        type: acc.type,
        balance: acc.balance
    })));

    const categories = ['asset', 'liability', 'equity', 'revenue', 'expense'];
    const containers = {
        'asset': 'assetAccounts',
        'liability': 'liabilityAccounts',
        'equity': 'equityAccounts',
        'revenue': 'revenueAccounts',
        'expense': 'expenseAccounts'
    };

    categories.forEach(category => {
        const container = document.getElementById(containers[category]);
        const categoryAccounts = accounts.filter(acc => acc.type === category);

        console.log(`${category} 계정들:`, categoryAccounts.map(acc => ({
            code: acc.code,
            name: acc.name,
            balance: acc.balance
        })));

        if (categoryAccounts.length === 0) {
            container.innerHTML = '<p class="no-data">계정이 없습니다.</p>';
            return;
        }

        let html = '';
        categoryAccounts.forEach(account => {
            // 현재 언어에 따라 계정명 선택 (한국어 페이지는 항상 한국어)
            const currentLang = 'ko';
            const accountName = account.name;

            html += `
                <div class="account-item">
                    <div>
                        <div class="account-code">${account.code}</div>
                        <div class="account-name">${accountName}</div>
                    </div>
                    <div class="account-balance">${formatCurrency(account.balance)}</div>
                </div>
            `;
        });

        container.innerHTML = html;
    });

    console.log('✅ 계정관리 페이지 렌더링 완료');
}

// 계정 추가 모달 열기
function openAccountModal() {
    document.getElementById('accountModal').style.display = 'block';
}

// 계정 추가 모달 닫기
function closeAccountModal() {
    document.getElementById('accountModal').style.display = 'none';
    document.getElementById('accountForm').reset();
}

// 계정 추가
function addAccount(event) {
    event.preventDefault();

    const code = document.getElementById('accountCode').value;
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;

    // 중복 코드 검사
    if (accounts.find(acc => acc.code === code)) {
        alert('이미 존재하는 계정코드입니다.');
        return;
    }

    accounts.push({
        code: code,
        name: name,
        type: type,
        balance: 0
    });

    saveData();
    renderAccounts();
    updateLedgerSelect();
    updateJournalAccountSelects();
    closeAccountModal();

    alert('계정이 추가되었습니다.');
}

// 계정 잔액 업데이트
function updateAccountBalances(journalEntry) {
    console.log('🔄 계정 잔액 업데이트 시작...', journalEntry);

    journalEntry.entries.forEach(entry => {
        // 🔧 계정 코드 정규화 (파일 업로드 호환성)
        const accountCode = extractAccountCode(entry.account);
        const account = accounts.find(acc => acc.code === accountCode);

        if (account) {
            console.log(`📝 계정 업데이트: ${account.name} (${account.code})`);
            console.log(`   원본 계정: ${entry.account} → 정규화: ${accountCode}`);
            console.log(`   이전 잔액: ${account.balance}`);
            console.log(`   거래 금액: ${entry.amount}, 차변: ${entry.debit}, 대변: ${entry.credit}`);

            if (account.type === 'asset' || account.type === 'expense') {
                // 자산, 비용: 차변 증가, 대변 감소
                if (entry.debit) {
                    account.balance += entry.amount;
                    console.log(`   차변 처리: +${entry.amount}`);
                } else if (entry.credit) {
                    account.balance -= entry.amount;
                    console.log(`   대변 처리: -${entry.amount}`);
                }
            } else {
                // 부채, 자본, 수익: 대변 증가, 차변 감소
                if (entry.credit) {
                    account.balance += entry.amount;
                    console.log(`   대변 처리: +${entry.amount}`);
                } else if (entry.debit) {
                    account.balance -= entry.amount;
                    console.log(`   차변 처리: -${entry.amount}`);
                }
            }

            console.log(`   새로운 잔액: ${account.balance}`);
        } else {
            console.error(`❌ 계정을 찾을 수 없습니다: ${entry.account} (정규화: ${accountCode})`);
        }
    });

    console.log('✅ 계정 잔액 업데이트 완료!');
}
