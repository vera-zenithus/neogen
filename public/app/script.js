// 제니스어스연구소 회계시스템 JavaScript

// 전역 변수
let accounts = [];
let journalEntries = [];
let currentJournalId = 1;

// 데이터 저장 키
const STORAGE_KEYS = {
    ACCOUNTS: 'zenithus_accounts',
    JOURNAL_ENTRIES: 'zenithus_journal_entries',
    CURRENT_JOURNAL_ID: 'zenithus_current_journal_id',
    LEARNED_PATTERNS: 'zenithus_learned_patterns'
};

// AI 분류를 위한 학습 패턴
let learnedPatterns = [];
let currentRecommendation = null;

// 기본 계정과목 템플릿 (다국어 지원)
const DEFAULT_ACCOUNTS = [
    // 자산
    { code: '101', name: '현금', nameEn: 'Cash', type: 'asset', balance: 0 },
    { code: '102', name: '보통예금', nameEn: 'Bank Deposits', type: 'asset', balance: 0 },
    { code: '103', name: '매출채권', nameEn: 'Accounts Receivable', type: 'asset', balance: 0 },
    { code: '104', name: '재고자산', nameEn: 'Inventory', type: 'asset', balance: 0 },
    { code: '105', name: '건물', nameEn: 'Buildings', type: 'asset', balance: 0 },
    { code: '106', name: '장비', nameEn: 'Equipment', type: 'asset', balance: 0 },
    
    // 부채
    { code: '201', name: '매입채무', nameEn: 'Accounts Payable', type: 'liability', balance: 0 },
    { code: '202', name: '단기차입금', nameEn: 'Short-term Loans', type: 'liability', balance: 0 },
    { code: '203', name: '미지급금', nameEn: 'Accrued Expenses', type: 'liability', balance: 0 },
    { code: '204', name: '장기차입금', nameEn: 'Long-term Loans', type: 'liability', balance: 0 },
    
    // 자본
    { code: '301', name: '자본금', nameEn: 'Share Capital', type: 'equity', balance: 0 },
    { code: '302', name: '이익잉여금', nameEn: 'Retained Earnings', type: 'equity', balance: 0 },
    { code: '303', name: '당기순이익', nameEn: 'Net Income', type: 'equity', balance: 0 },
    
    // 수익
    { code: '401', name: '매출', nameEn: 'Sales Revenue', type: 'revenue', balance: 0 },
    { code: '402', name: '기타수익', nameEn: 'Other Revenue', type: 'revenue', balance: 0 },
    { code: '403', name: '이자수익', nameEn: 'Interest Income', type: 'revenue', balance: 0 },
    
    // 비용
    { code: '501', name: '매출원가', nameEn: 'Cost of Goods Sold', type: 'expense', balance: 0 },
    { code: '502', name: '급여', nameEn: 'Salaries & Wages', type: 'expense', balance: 0 },
    { code: '503', name: '임차료', nameEn: 'Rent Expense', type: 'expense', balance: 0 },
    { code: '504', name: '사무용품비', nameEn: 'Office Supplies', type: 'expense', balance: 0 },
    { code: '505', name: '통신비', nameEn: 'Communication Expense', type: 'expense', balance: 0 },
    { code: '506', name: '이자비용', nameEn: 'Interest Expense', type: 'expense', balance: 0 }
];

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

// 데이터 로드
function loadData() {
    const savedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    const savedJournalEntries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    const savedCurrentId = localStorage.getItem(STORAGE_KEYS.CURRENT_JOURNAL_ID);
    const savedPatterns = localStorage.getItem(STORAGE_KEYS.LEARNED_PATTERNS);
    
    if (savedAccounts) {
        accounts = JSON.parse(savedAccounts);
    }
    
    if (savedJournalEntries) {
        journalEntries = JSON.parse(savedJournalEntries);
    }
    
    if (savedCurrentId) {
        currentJournalId = parseInt(savedCurrentId);
    }
    
    if (savedPatterns) {
        learnedPatterns = JSON.parse(savedPatterns);
    }
}

// 데이터 저장
function saveData() {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journalEntries));
    localStorage.setItem(STORAGE_KEYS.CURRENT_JOURNAL_ID, currentJournalId.toString());
    localStorage.setItem(STORAGE_KEYS.LEARNED_PATTERNS, JSON.stringify(learnedPatterns));
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

// 최근 거래 렌더링
function renderRecentTransactions() {
    const recentContainer = document.getElementById('recentTransactions');
    const recentEntries = journalEntries.slice(-5).reverse();
    
    if (recentEntries.length === 0) {
        recentContainer.innerHTML = '<p class="no-data">아직 거래가 없습니다.</p>';
        return;
    }
    
    let html = '<div class="recent-transactions">';
    recentEntries.forEach(entry => {
        html += `
            <div class="transaction-item">
                <div class="transaction-date">${entry.date}</div>
                <div class="transaction-desc">${entry.description}</div>
                <div class="transaction-amount">${formatCurrency(entry.entries[0].amount)}</div>
            </div>
        `;
    });
    html += '</div>';
    
    recentContainer.innerHTML = html;
}

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

// 분개장 렌더링
function renderJournalEntries() {
    console.log('📝 분개장 렌더링 시작, 총 분개 수:', journalEntries.length);
    console.log('분개 데이터:', journalEntries);
    const tbody = document.getElementById('journalTableBody');
    
    if (journalEntries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center no-data">분개 내역이 없습니다.</td></tr>';
        return;
    }
    
    let html = '';
    journalEntries.forEach((entry, index) => {
        console.log(`📋 분개 ${index + 1}:`, entry);
        entry.entries.forEach((line, lineIndex) => {
            console.log(`  └─ 라인 ${lineIndex + 1}:`, {
                account: line.account,
                amount: line.amount,
                debit: line.debit,
                credit: line.credit,
                accountName: getAccountName(line.account),
                description: entry.description
            });
            
            html += `
                <tr>
                    ${lineIndex === 0 ? `<td rowspan="${entry.entries.length}">${entry.date}</td>` : ''}
                    <td>${getAccountName(line.account)}</td>
                    ${lineIndex === 0 ? `<td rowspan="${entry.entries.length}">${entry.description}</td>` : ''}
                    <td>${line.debit ? formatCurrency(line.amount) : ''}</td>
                    <td>${line.credit ? formatCurrency(line.amount) : ''}</td>
                    ${lineIndex === 0 ? `<td rowspan="${entry.entries.length}">
                        <button class="btn btn-small btn-primary" onclick="editJournalEntry(${index})" style="margin-right: 5px;">수정</button>
                        <button class="btn btn-small btn-secondary" onclick="deleteJournalEntry(${index})">삭제</button>
                    </td>` : ''}
                </tr>
            `;
        });
    });
    
    tbody.innerHTML = html;
}

// 계정명 가져오기
function getAccountName(accountCode) {
    const account = accounts.find(acc => acc.code === accountCode);
    return account ? `${account.code} ${account.name}` : accountCode;
}

// 원장 선택 업데이트
function updateLedgerSelect() {
    const select = document.getElementById('ledgerAccountSelect');
    select.innerHTML = '<option value="">계정을 선택하세요</option>';
    
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.code;
        option.textContent = `${account.code} ${account.name}`;
        select.appendChild(option);
    });
}

// 원장 표시
function showLedger() {
    const accountCode = document.getElementById('ledgerAccountSelect').value;
    const ledgerContent = document.getElementById('ledgerContent');
    
    if (!accountCode) {
        ledgerContent.innerHTML = '<p class="no-data">계정을 선택해주세요.</p>';
        return;
    }
    
    const account = accounts.find(acc => acc.code === accountCode);
    const accountEntries = [];
    
    // 해당 계정의 모든 거래 찾기
    console.log(`🔍 ${accountCode} 계정의 거래 내역 검색 중...`);
    console.log('전체 분개 내역:', journalEntries);
    
    journalEntries.forEach((entry, entryIndex) => {
        entry.entries.forEach((line, lineIndex) => {
            console.log(`분개 ${entryIndex + 1}-${lineIndex + 1}: 계정=${line.account}, 찾는계정=${accountCode}, 일치=${line.account === accountCode}`);
            
            // 계정 코드 정규화 후 비교
            const lineAccountCode = String(line.account).trim();
            const searchAccountCode = String(accountCode).trim();
            
            // 계정 코드만 추출 (예: "601 사무용품비" → "601")
            const extractAccountCode = (accountStr) => {
                return accountStr.split(' ')[0].trim();
            };
            
            const normalizedLineCode = extractAccountCode(lineAccountCode);
            const normalizedSearchCode = extractAccountCode(searchAccountCode);
            
            if (normalizedLineCode === normalizedSearchCode) {
                console.log(`✅ 매칭된 거래 발견: ${line.account} (정규화된 코드: ${normalizedLineCode})`);
                accountEntries.push({
                    date: entry.date,
                    description: entry.description,
                    debit: line.debit ? line.amount : 0,
                    credit: line.credit ? line.amount : 0
                });
            }
        });
    });
    
    console.log(`📝 ${accountCode} 계정의 총 거래 수: ${accountEntries.length}`);
    
    if (accountEntries.length === 0) {
        ledgerContent.innerHTML = '<p class="no-data">거래 내역이 없습니다.</p>';
        return;
    }
    
    // 잔액 계산
    let balance = 0;
    let html = `
        <div class="ledger-header">
            <h4>${account.code} ${account.name} 원장</h4>
        </div>
        <table>
            <thead>
                <tr>
                    <th>날짜</th>
                    <th>적요</th>
                    <th>차변</th>
                    <th>대변</th>
                    <th>잔액</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    accountEntries.forEach(entry => {
        if (account.type === 'asset' || account.type === 'expense') {
            balance += entry.debit - entry.credit;
        } else {
            balance += entry.credit - entry.debit;
        }
        
        html += `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td>${entry.debit ? formatCurrency(entry.debit) : ''}</td>
                <td>${entry.credit ? formatCurrency(entry.credit) : ''}</td>
                <td>${formatCurrency(balance)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    ledgerContent.innerHTML = html;
}

// 재무제표 생성
function generateReports() {
    console.log('📊 재무제표 생성 시작...');
    console.log('현재 계정 데이터:', accounts.map(acc => ({
        code: acc.code, 
        name: acc.name, 
        type: acc.type, 
        balance: acc.balance
    })));
    
    generateBalanceSheet();
    generateIncomeStatement();
    generateSocietyReport();
    
    console.log('✅ 재무제표 생성 완료!');
}

// 대차대조표 생성
function generateBalanceSheet() {
    console.log('🔄 대차대조표 생성 시작...');
    const balanceSheet = document.getElementById('balanceSheet');
    
    if (!balanceSheet) {
        console.error('❌ balanceSheet 엘리먼트를 찾을 수 없습니다!');
        return;
    }
    
    const assets = accounts.filter(acc => acc.type === 'asset');
    const liabilities = accounts.filter(acc => acc.type === 'liability');
    const equity = accounts.filter(acc => acc.type === 'equity');
    
    console.log('📊 대차대조표 데이터:', {
        assets: assets.map(a => ({name: a.name, balance: a.balance})),
        liabilities: liabilities.map(l => ({name: l.name, balance: l.balance})),
        equity: equity.map(e => ({name: e.name, balance: e.balance}))
    });
    
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');
    const netIncome = totalRevenue - totalExpenses;
    
    let html = `
        <div class="financial-statement">
            <div class="statement-header">대차대조표</div>
            <div class="statement-body">
                <div class="statement-section">
                    <h4>자산</h4>
    `;
    
    let totalAssets = 0;
    assets.forEach(account => {
        if (account.balance !== 0) {
            html += `<div class="statement-item">
                <span>${account.name}</span>
                <span>${formatCurrency(account.balance)}</span>
            </div>`;
            totalAssets += account.balance;
        }
    });
    
    html += `
                    <div class="statement-item statement-total">
                        <span>자산 총계</span>
                        <span>${formatCurrency(totalAssets)}</span>
                    </div>
                </div>
                
                <div class="statement-section">
                    <h4>부채</h4>
    `;
    
    let totalLiabilities = 0;
    liabilities.forEach(account => {
        if (account.balance !== 0) {
            html += `<div class="statement-item">
                <span>${account.name}</span>
                <span>${formatCurrency(account.balance)}</span>
            </div>`;
            totalLiabilities += account.balance;
        }
    });
    
    html += `
                    <div class="statement-item statement-total">
                        <span>부채 총계</span>
                        <span>${formatCurrency(totalLiabilities)}</span>
                    </div>
                </div>
                
                <div class="statement-section">
                    <h4>자본</h4>
    `;
    
    let totalEquity = 0;
    equity.forEach(account => {
        if (account.balance !== 0) {
            html += `<div class="statement-item">
                <span>${account.name}</span>
                <span>${formatCurrency(account.balance)}</span>
            </div>`;
            totalEquity += account.balance;
        }
    });
    
    if (netIncome !== 0) {
        html += `<div class="statement-item">
            <span>당기순이익</span>
            <span>${formatCurrency(netIncome)}</span>
        </div>`;
        totalEquity += netIncome;
    }
    
    html += `
                    <div class="statement-item statement-total">
                        <span>자본 총계</span>
                        <span>${formatCurrency(totalEquity)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    balanceSheet.innerHTML = html;
    console.log('✅ 대차대조표 생성 완료!');
}

// 손익계산서 생성
function generateIncomeStatement() {
    console.log('📈 손익계산서 생성 시작...');
    const incomeStatement = document.getElementById('incomeStatement');
    
    if (!incomeStatement) {
        console.error('❌ incomeStatement 엘리먼트를 찾을 수 없습니다!');
        return;
    }
    
    const revenue = accounts.filter(acc => acc.type === 'revenue');
    const expenses = accounts.filter(acc => acc.type === 'expense');
    
    let html = `
        <div class="financial-statement">
            <div class="statement-header">손익계산서</div>
            <div class="statement-body">
                <div class="statement-section">
                    <h4>수익</h4>
    `;
    
    let totalRevenue = 0;
    revenue.forEach(account => {
        if (account.balance !== 0) {
            html += `<div class="statement-item">
                <span>${account.name}</span>
                <span>${formatCurrency(account.balance)}</span>
            </div>`;
            totalRevenue += account.balance;
        }
    });
    
    html += `
                    <div class="statement-item statement-total">
                        <span>수익 총계</span>
                        <span>${formatCurrency(totalRevenue)}</span>
                    </div>
                </div>
                
                <div class="statement-section">
                    <h4>비용</h4>
    `;
    
    let totalExpenses = 0;
    expenses.forEach(account => {
        if (account.balance !== 0) {
            html += `<div class="statement-item">
                <span>${account.name}</span>
                <span>${formatCurrency(account.balance)}</span>
            </div>`;
            totalExpenses += account.balance;
        }
    });
    
    html += `
                    <div class="statement-item statement-total">
                        <span>비용 총계</span>
                        <span>${formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
                
                <div class="statement-section">
                    <div class="statement-item statement-total">
                        <span>당기순이익</span>
                        <span>${formatCurrency(totalRevenue - totalExpenses)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    incomeStatement.innerHTML = html;
    console.log('✅ 손익계산서 생성 완료!');
}

// 유형별 총계 계산
function calculateTotalByType(type) {
    return accounts
        .filter(acc => acc.type === type)
        .reduce((sum, acc) => sum + acc.balance, 0);
}

// 통화 형식 포맷 (국제기준 지원)
function formatCurrency(amount) {
    // 🌍 국제기준 통화가 설정되어 있으면 사용
    const currency = localStorage.getItem('zenithus_report_currency');
    if (currency && typeof formatInternationalCurrency === 'function') {
        return formatInternationalCurrency(amount, currency);
    }
    
    // 기본 한국 원화 포맷
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0
    }).format(amount);
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

// 분개 입력 모달 열기
function openJournalModal() {
    document.getElementById('journalModal').style.display = 'block';
    document.getElementById('journalDate').value = new Date().toISOString().split('T')[0];
    updateJournalAccountSelects();
    updateJournalBalance();
}

// 분개 입력 모달 닫기
function closeJournalModal() {
    document.getElementById('journalModal').style.display = 'none';
    document.getElementById('journalForm').reset();
    
    // 분개 입력 행을 하나만 남기고 삭제
    const journalEntries = document.getElementById('journalEntries');
    const rows = journalEntries.querySelectorAll('.journal-entry-row');
    for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
    }
    
    updateJournalBalance();
}

// 분개 입력 행 추가
function addJournalEntryRow() {
    const journalEntries = document.getElementById('journalEntries');
    const newRow = document.createElement('div');
    newRow.className = 'journal-entry-row';
    newRow.innerHTML = `
        <select class="debit-account" required>
            <option value="">차변 계정 선택</option>
        </select>
        <input type="number" class="debit-amount" placeholder="차변 금액" min="0" step="1">
        <select class="credit-account" required>
            <option value="">대변 계정 선택</option>
        </select>
        <input type="number" class="credit-amount" placeholder="대변 금액" min="0" step="1">
        <button type="button" class="btn btn-small" onclick="removeJournalEntry(this)">삭제</button>
    `;
    
    journalEntries.appendChild(newRow);
    updateJournalAccountSelects();
    
    // 새로 추가된 입력 필드에 이벤트 리스너 추가
    newRow.querySelectorAll('.debit-amount, .credit-amount').forEach(input => {
        input.addEventListener('input', updateJournalBalance);
    });
}

// 분개 입력 행 삭제
function removeJournalEntry(button) {
    const rows = document.querySelectorAll('.journal-entry-row');
    if (rows.length > 1) {
        button.parentElement.remove();
        updateJournalBalance();
    }
}

// 분개 계정 선택 옵션 업데이트 (차변/대변별 필터링)
function updateJournalAccountSelects() {
    const debitSelects = document.querySelectorAll('.debit-account');
    const creditSelects = document.querySelectorAll('.credit-account');
    
    // 차변 계정 (자산, 비용)
    const debitAccounts = accounts.filter(account => 
        account.type === 'asset' || account.type === 'expense'
    );
    const debitOptionsHtml = debitAccounts.map(account => 
        `<option value="${account.code}">${account.code} ${account.name}</option>`
    ).join('');
    
    // 대변 계정 (부채, 자본, 수익)
    const creditAccounts = accounts.filter(account => 
        account.type === 'liability' || account.type === 'equity' || account.type === 'revenue'
    );
    const creditOptionsHtml = creditAccounts.map(account => 
        `<option value="${account.code}">${account.code} ${account.name}</option>`
    ).join('');
    
    debitSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">차변 계정 선택 (자산, 비용)</option>' + debitOptionsHtml;
        select.value = currentValue;
    });
    
    creditSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">대변 계정 선택 (부채, 자본, 수익)</option>' + creditOptionsHtml;
        select.value = currentValue;
    });
}

// 분개 균형 계산
function updateJournalBalance() {
    const debitAmounts = document.querySelectorAll('.debit-amount');
    const creditAmounts = document.querySelectorAll('.credit-amount');
    
    let debitTotal = 0;
    let creditTotal = 0;
    
    debitAmounts.forEach(input => {
        const value = parseFloat(input.value) || 0;
        debitTotal += value;
    });
    
    creditAmounts.forEach(input => {
        const value = parseFloat(input.value) || 0;
        creditTotal += value;
    });
    
    document.getElementById('debitTotal').textContent = formatCurrency(debitTotal);
    document.getElementById('creditTotal').textContent = formatCurrency(creditTotal);
    
    const balanceCheck = document.querySelector('.balance-check');
    const balanceStatus = document.getElementById('balanceStatus');
    
    if (debitTotal === creditTotal && debitTotal > 0) {
        balanceCheck.className = 'balance-check balanced';
        balanceStatus.textContent = '✅ 균형';
        balanceStatus.style.color = '#28a745';
    } else if (debitTotal === 0 && creditTotal === 0) {
        balanceCheck.className = 'balance-check';
        balanceStatus.textContent = '';
    } else {
        balanceCheck.className = 'balance-check unbalanced';
        balanceStatus.textContent = '❌ 불균형';
        balanceStatus.style.color = '#e17055';
    }
}

// 분개 저장
function addJournalEntry(event) {
    event.preventDefault();
    
    const date = document.getElementById('journalDate').value;
    const description = document.getElementById('journalDescription').value;
    
    const entryRows = document.querySelectorAll('.journal-entry-row');
    const entries = [];
    
    let debitTotal = 0;
    let creditTotal = 0;
    
    entryRows.forEach(row => {
        const debitAccount = row.querySelector('.debit-account').value;
        const debitAmount = parseFloat(row.querySelector('.debit-amount').value) || 0;
        const creditAccount = row.querySelector('.credit-account').value;
        const creditAmount = parseFloat(row.querySelector('.credit-amount').value) || 0;
        
        if (debitAccount && debitAmount > 0) {
            entries.push({
                account: debitAccount,
                amount: debitAmount,
                debit: true,
                credit: false
            });
            debitTotal += debitAmount;
        }
        
        if (creditAccount && creditAmount > 0) {
            entries.push({
                account: creditAccount,
                amount: creditAmount,
                debit: false,
                credit: true
            });
            creditTotal += creditAmount;
        }
    });
    
    // 균형 검사
    if (debitTotal !== creditTotal) {
        alert('차변과 대변의 합계가 일치하지 않습니다.');
        return;
    }
    
    if (entries.length === 0) {
        alert('분개 내역을 입력해주세요.');
        return;
    }
    
    // 분개 저장
    const journalEntry = {
        id: currentJournalId++,
        date: date,
        description: description,
        entries: entries
    };
    
    journalEntries.push(journalEntry);
    
    // 계정 잔액 업데이트
    updateAccountBalances(journalEntry);
    
    saveData();
    renderJournalEntries();
    renderDashboard();
    renderAccounts();
    generateReports();
    closeJournalModal();
    
    // 네오 추적 및 반응
    if (journalEntries.length === 1) {
        trackUserAction('first_entry');
    } else {
        trackUserAction('journal_entry_added');
    }
    
    alert('분개가 저장되었습니다.');
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

// 🔧 계정 코드 추출 헬퍼 함수
function extractAccountCode(accountString) {
    if (!accountString) return '';
    
    // "601 사무용품비" → "601"
    // "101" → "101" (그대로)
    const parts = accountString.toString().trim().split(' ');
    return parts[0];
}

// 분개 삭제
function deleteJournalEntry(index) {
    if (confirm('이 분개를 삭제하시겠습니까?')) {
        const entry = journalEntries[index];
        
        // 계정 잔액 되돌리기
        entry.entries.forEach(entryLine => {
            const account = accounts.find(acc => acc.code === entryLine.account);
            if (account) {
                if (account.type === 'asset' || account.type === 'expense') {
                    if (entryLine.debit) {
                        account.balance -= entryLine.amount;
                    } else {
                        account.balance += entryLine.amount;
                    }
                } else {
                    if (entryLine.credit) {
                        account.balance -= entryLine.amount;
                    } else {
                        account.balance += entryLine.amount;
                    }
                }
            }
        });
        
        journalEntries.splice(index, 1);
        saveData();
        renderJournalEntries();
        renderDashboard();
        renderAccounts();
        generateReports();
    }
}

// 분개 수정 기능
let currentEditIndex = -1;

function editJournalEntry(index) {
    console.log('✏️ 분개 수정 시작:', index);
    currentEditIndex = index;
    const entry = journalEntries[index];
    
    // 모달 필드에 기존 데이터 로드
    document.getElementById('editJournalDate').value = entry.date;
    document.getElementById('editJournalDescription').value = entry.description;
    
    // 분개 내역 동적 생성
    const editEntriesContainer = document.getElementById('editJournalEntries');
    editEntriesContainer.innerHTML = '';
    
    entry.entries.forEach((line, lineIndex) => {
        const entryRow = document.createElement('div');
        entryRow.className = 'edit-journal-entry-row';
        entryRow.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr auto 1fr auto auto; gap: 10px; align-items: center; margin-bottom: 10px; padding: 15px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa;">
                <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 5px;">
                        ${line.debit ? '차변 계정' : '대변 계정'}
                    </label>
                    <select class="edit-account" data-line-index="${lineIndex}" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="">계정 선택</option>
                    </select>
                </div>
                <div style="text-align: center; padding: 0 10px; font-size: 1.2em;">
                    ${line.debit ? '→' : '←'}
                </div>
                <div>
                    <label style="display: block; font-weight: 500; margin-bottom: 5px;">금액</label>
                    <input type="number" class="edit-amount" data-line-index="${lineIndex}" value="${line.amount}" min="0" step="1" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="text-align: center;">
                    <span style="padding: 5px 10px; background: ${line.debit ? '#28a745' : '#dc3545'}; color: white; border-radius: 4px; font-size: 0.85em;">
                        ${line.debit ? '차변' : '대변'}
                    </span>
                </div>
                <div style="text-align: center;">
                    <span style="color: #6c757d; font-size: 0.9em;">
                        ${getAccountName(line.account)}
                    </span>
                </div>
            </div>
        `;
        editEntriesContainer.appendChild(entryRow);
        
        // 차변/대변에 적절한 계정만 추가
        const accountSelect = entryRow.querySelector('.edit-account');
        const appropriateAccounts = getAppropriateAccounts(line.debit);
        
        appropriateAccounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.code;
            option.textContent = `${account.code} - ${account.name}`;
            option.selected = account.code === line.account;
            accountSelect.appendChild(option);
        });
    });
    
    // 잔액 계산 이벤트 리스너 추가
    updateEditBalance();
    editEntriesContainer.addEventListener('input', updateEditBalance);
    
    // 모달 표시
    document.getElementById('editJournalModal').style.display = 'block';
}

function updateEditBalance() {
    const amounts = document.querySelectorAll('#editJournalEntries .edit-amount');
    let debitTotal = 0;
    let creditTotal = 0;
    
    amounts.forEach(input => {
        const lineIndex = parseInt(input.dataset.lineIndex);
        const entry = journalEntries[currentEditIndex].entries[lineIndex];
        const amount = parseFloat(input.value) || 0;
        
        if (entry.debit) {
            debitTotal += amount;
        } else {
            creditTotal += amount;
        }
    });
    
    document.getElementById('editDebitTotal').textContent = formatCurrency(debitTotal);
    document.getElementById('editCreditTotal').textContent = formatCurrency(creditTotal);
    
    const balanceStatus = document.getElementById('editBalanceStatus');
    if (debitTotal === creditTotal && debitTotal > 0) {
        balanceStatus.textContent = '✅ 균형';
        balanceStatus.style.color = '#28a745';
    } else {
        balanceStatus.textContent = '❌ 불균형';
        balanceStatus.style.color = '#dc3545';
    }
}

function saveJournalEdit(event) {
    event.preventDefault();
    
    const newDate = document.getElementById('editJournalDate').value;
    const newDescription = document.getElementById('editJournalDescription').value;
    
    // 기존 분개의 잔액 효과 제거
    const oldEntry = journalEntries[currentEditIndex];
    oldEntry.entries.forEach(line => {
        const account = accounts.find(acc => acc.code === line.account);
        if (account) {
            if (account.type === 'asset' || account.type === 'expense') {
                if (line.debit) {
                    account.balance -= line.amount;
                } else {
                    account.balance += line.amount;
                }
            } else {
                if (line.credit) {
                    account.balance -= line.amount;
                } else {
                    account.balance += line.amount;
                }
            }
        }
    });
    
    // 새로운 분개 내역 생성
    const newEntries = [];
    const amounts = document.querySelectorAll('#editJournalEntries .edit-amount');
    const accountSelects = document.querySelectorAll('#editJournalEntries .edit-account');
    
    amounts.forEach((input, index) => {
        const lineIndex = parseInt(input.dataset.lineIndex);
        const oldLine = oldEntry.entries[lineIndex];
        const newAccount = accountSelects[index].value;
        const newAmount = parseFloat(input.value) || 0;
        
        newEntries.push({
            account: newAccount,
            amount: newAmount,
            debit: oldLine.debit,
            credit: oldLine.credit
        });
    });
    
    // 분개 업데이트
    journalEntries[currentEditIndex] = {
        ...oldEntry,
        date: newDate,
        description: newDescription,
        entries: newEntries
    };
    
    // 새로운 잔액 효과 적용
    updateAccountBalances(journalEntries[currentEditIndex]);
    
    saveData();
    updateAllPages();
    closeEditJournalModal();
    
    console.log('✅ 분개 수정 완료');
    alert('분개가 성공적으로 수정되었습니다! 🎉');
}

function closeEditJournalModal() {
    document.getElementById('editJournalModal').style.display = 'none';
    currentEditIndex = -1;
}

// 차변/대변에 적절한 계정 반환
function getAppropriateAccounts(isDebit) {
    if (isDebit) {
        // 차변에 올 수 있는 계정: 자산, 비용
        return accounts.filter(account => 
            account.type === 'asset' || account.type === 'expense'
        );
    } else {
        // 대변에 올 수 있는 계정: 부채, 자본, 수익
        return accounts.filter(account => 
            account.type === 'liability' || account.type === 'equity' || account.type === 'revenue'
        );
    }
}

// 전체 시스템 일괄 적용 기능
function batchApplyToLedger() {
    console.log('🔄 전체 시스템 일괄 적용 시작...');
    
    if (journalEntries.length === 0) {
        alert('적용할 분개 내역이 없습니다.\n먼저 파일을 가져오거나 분개를 입력해주세요.');
        return;
    }
    
    const confirmMessage = `🔄 전체 시스템 일괄 적용을 시작하시겠습니까?

📋 처리 내용:
• 총 ${journalEntries.length}개의 분개 내역 적용
• 🏦 총계정원장 업데이트
• 📊 재무제표 자동 생성 (대차대조표, 손익계산서)
• 📈 대시보드 실시간 반영
• 💼 계정관리 잔액 업데이트
• 🌐 연말공시 데이터 동기화

✨ 모든 페이지가 완전히 동기화됩니다!
이 작업은 몇 초 정도 소요됩니다.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // 진행 상황 표시
    showBatchApplyProgress();
    
    setTimeout(() => {
        try {
            // 1. 모든 계정 잔액 초기화
            console.log('🔄 1단계: 계정 잔액 초기화...');
            accounts.forEach(account => {
                account.balance = 0;
            });
            
            let processedEntries = 0;
            let errorCount = 0;
            
            // 2. 모든 분개를 순차적으로 적용
            console.log('📝 2단계: 분개 내역 적용 시작...');
            journalEntries.forEach((entry, index) => {
                try {
                    updateAccountBalances(entry);
                    processedEntries++;
                    console.log(`✅ 분개 ${index + 1}/${journalEntries.length} 적용 완료`);
                } catch (error) {
                    console.error(`❌ 분개 ${index + 1} 적용 실패:`, error);
                    errorCount++;
                }
            });
            
            // 3. 전체 시스템 업데이트 (모든 페이지)
            console.log('🔄 3단계: 전체 시스템 업데이트 중...');
            updateAllPages();
            console.log('✅ 3단계 완료: 전체 시스템 업데이트');
            
            // 4. 추가 재무제표 검증 및 갱신
            console.log('📊 4단계: 재무제표 최종 검증...');
            generateReports();
            updateAnnualReportData();
            validateDataConsistency();
            
            // 5. 데이터 저장
            console.log('💾 5단계: 데이터 저장...');
            saveData();
            
            // 6. 완료 메시지
            hideBatchApplyProgress();
            
            const resultMessage = `🎉 전체 시스템 일괄적용 완료!

📊 처리 결과:
• ✅ 성공: ${processedEntries}개 분개 적용
• ❌ 실패: ${errorCount}개 분개
• 💼 처리된 계정: ${accounts.length}개

🔄 업데이트된 영역:
• 📈 대시보드 - 최신 재무 현황 반영
• 💼 계정관리 - 모든 계정 잔액 업데이트  
• 🏦 총계정원장 - 거래 내역 완전 적용
• 📊 재무제표 - 대차대조표, 손익계산서 갱신
• 🌐 연말공시 - 데이터 동기화 완료

✨ 모든 페이지가 완전히 동기화되었습니다! 🎉`;
            
            alert(resultMessage);
            
            // 7. 재무제표 탭으로 이동 (전체 결과 확인)
            showTab('reports');
            
            console.log('✅ 전체 시스템 일괄적용 완료!');
            
        } catch (error) {
            console.error('❌ 일괄 적용 중 오류 발생:', error);
            hideBatchApplyProgress();
            alert('일괄 적용 중 오류가 발생했습니다: ' + error.message);
        }
    }, 1000);
}

// 진행 상황 표시
function showBatchApplyProgress() {
    const progressHtml = `
        <div id="batchApplyModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">전체 시스템 적용 중...</h3>
                <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin-bottom: 15px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6); animation: progress-bar 3s ease-in-out infinite;"></div>
                </div>
                <p style="color: #64748b; margin: 0; text-align: left;">
                    🔄 대시보드, 계정관리, 총계정원장,<br>
                    📊 재무제표, 연말공시 모든 영역을<br>
                    ✨ 완전히 동기화하고 있습니다...
                </p>
            </div>
        </div>
        <style>
            @keyframes progress-bar {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
            }
        </style>
    `;
    
    document.body.insertAdjacentHTML('beforeend', progressHtml);
}

// 진행 상황 숨기기
function hideBatchApplyProgress() {
    const modal = document.getElementById('batchApplyModal');
    if (modal) {
        modal.remove();
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
}

// 학회 리포트 생성
function generateSocietyReport() {
    generateKeyMetrics();
    generateMonthlyStatus();
}

// 주요 재무 지표 생성
function generateKeyMetrics() {
    const keyMetrics = document.getElementById('keyMetrics');
    
    const totalAssets = calculateTotalByType('asset');
    const totalLiabilities = calculateTotalByType('liability');
    const totalEquity = calculateTotalByType('equity');
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');
    const netIncome = totalRevenue - totalExpenses;
    
    // 재무 건전성 지표
    const currentRatio = totalLiabilities > 0 ? (totalAssets / totalLiabilities) : 0;
    const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100) : 0;
    
    let html = `
        <div class="metric-item">
            <span>총 자산</span>
            <span class="metric-value">${formatCurrency(totalAssets)}</span>
        </div>
        <div class="metric-item">
            <span>순자산 (자본)</span>
            <span class="metric-value metric-${totalEquity + netIncome >= 0 ? 'positive' : 'negative'}">${formatCurrency(totalEquity + netIncome)}</span>
        </div>
        <div class="metric-item">
            <span>당기순이익</span>
            <span class="metric-value metric-${netIncome >= 0 ? 'positive' : 'negative'}">${formatCurrency(netIncome)}</span>
        </div>
        <div class="metric-item">
            <span>유동비율</span>
            <span class="metric-value">${currentRatio.toFixed(2)}</span>
        </div>
        <div class="metric-item">
            <span>순이익률</span>
            <span class="metric-value metric-${profitMargin >= 0 ? 'positive' : 'negative'}">${profitMargin.toFixed(1)}%</span>
        </div>
    `;
    
    keyMetrics.innerHTML = html;
}

// 월별 수지 현황 생성 (향후 개선 가능)
function generateMonthlyStatus() {
    const monthlyStatus = document.getElementById('monthlyStatus');
    
    // 현재는 전체 기간 요약만 표시 (향후 월별 분석 기능 추가 가능)
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');
    const netIncome = totalRevenue - totalExpenses;
    
    let html = `
        <div class="metric-item">
            <span>총 수익</span>
            <span class="metric-value metric-positive">${formatCurrency(totalRevenue)}</span>
        </div>
        <div class="metric-item">
            <span>총 비용</span>
            <span class="metric-value metric-negative">${formatCurrency(totalExpenses)}</span>
        </div>
        <div class="metric-item">
            <span>순수지</span>
            <span class="metric-value metric-${netIncome >= 0 ? 'positive' : 'negative'}">${formatCurrency(netIncome)}</span>
        </div>
        <div class="metric-item">
            <span>수익성</span>
            <span class="metric-value">${netIncome >= 0 ? '흑자 운영' : '적자 운영'}</span>
        </div>
    `;
    
    if (journalEntries.length > 0) {
        const lastTransactionDate = journalEntries[journalEntries.length - 1].date;
        html += `
            <div class="metric-item">
                <span>최근 거래일</span>
                <span class="metric-value">${lastTransactionDate}</span>
            </div>
        `;
    }
    
    monthlyStatus.innerHTML = html;
}

// PDF 내보내기 기능
async function exportToPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // 한글 폰트 설정 (기본 폰트 사용)
        doc.setFont('helvetica');
        
        // 제목
        doc.setFontSize(20);
        doc.text('제니스어스 회계시스템 재무보고서', 20, 30);
        
        // 생성일자
        doc.setFontSize(12);
        const today = new Date().toLocaleDateString('ko-KR');
        doc.text(`생성일: ${today}`, 20, 45);
        
        // 주요 재무 지표
        doc.setFontSize(16);
        doc.text('주요 재무 현황', 20, 65);
        
        const totalAssets = calculateTotalByType('asset');
        const totalLiabilities = calculateTotalByType('liability');
        const totalEquity = calculateTotalByType('equity');
        const totalRevenue = calculateTotalByType('revenue');
        const totalExpenses = calculateTotalByType('expense');
        const netIncome = totalRevenue - totalExpenses;
        
        doc.setFontSize(12);
        let yPos = 80;
        doc.text(`총 자산: ${formatCurrency(totalAssets)}`, 20, yPos);
        yPos += 10;
        doc.text(`총 부채: ${formatCurrency(totalLiabilities)}`, 20, yPos);
        yPos += 10;
        doc.text(`자본: ${formatCurrency(totalEquity + netIncome)}`, 20, yPos);
        yPos += 10;
        doc.text(`당기순이익: ${formatCurrency(netIncome)}`, 20, yPos);
        yPos += 20;
        
        // 분개 내역
        if (journalEntries.length > 0) {
            doc.setFontSize(16);
            doc.text('최근 거래 내역', 20, yPos);
            yPos += 15;
            
            doc.setFontSize(10);
            const recentEntries = journalEntries.slice(-10); // 최근 10개 거래
            
            recentEntries.forEach(entry => {
                if (yPos > 250) { // 페이지 넘김
                    doc.addPage();
                    yPos = 30;
                }
                
                doc.text(`${entry.date} - ${entry.description}`, 20, yPos);
                yPos += 7;
                
                entry.entries.forEach(line => {
                    const accountName = getAccountName(line.account);
                    const amount = formatCurrency(line.amount);
                    if (line.debit) {
                        doc.text(`  차변: ${accountName} ${amount}`, 25, yPos);
                    } else {
                        doc.text(`  대변: ${accountName} ${amount}`, 25, yPos);
                    }
                    yPos += 6;
                });
                yPos += 5;
            });
        }
        
        // PDF 다운로드
        doc.save('zenithus-accounting-report.pdf');
        alert('PDF 파일이 다운로드되었습니다!');
        
    } catch (error) {
        console.error('PDF 생성 오류:', error);
        alert('PDF 생성 중 오류가 발생했습니다.');
    }
}

// 엑셀 내보내기 기능
function exportToExcel() {
    try {
        const wb = XLSX.utils.book_new();
        
        // 1. 계정과목 시트
        const accountsData = [
            ['계정코드', '계정명', '계정유형', '잔액']
        ];
        accounts.forEach(account => {
            accountsData.push([
                account.code,
                account.name,
                getAccountTypeKorean(account.type),
                account.balance
            ]);
        });
        const accountsSheet = XLSX.utils.aoa_to_sheet(accountsData);
        XLSX.utils.book_append_sheet(wb, accountsSheet, '계정과목');
        
        // 2. 분개장 시트
        const journalData = [
            ['날짜', '적요', '계정코드', '계정명', '차변', '대변']
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
                    line.credit ? line.amount : ''
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
            ['항목', '금액'],
            ['총 자산', totalAssets],
            ['총 부채', totalLiabilities],
            ['자본', totalEquity + netIncome],
            ['총 수익', totalRevenue],
            ['총 비용', totalExpenses],
            ['당기순이익', netIncome]
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, '재무요약');
        
        // 엑셀 파일 다운로드
        XLSX.writeFile(wb, 'zenithus-accounting-data.xlsx');
        alert('엑셀 파일이 다운로드되었습니다!');
        
    } catch (error) {
        console.error('엑셀 생성 오류:', error);
        alert('엑셀 생성 중 오류가 발생했습니다.');
    }
}

// 계정 유형 한글 변환
function getAccountTypeKorean(type) {
    const types = {
        'asset': '자산',
        'liability': '부채',
        'equity': '자본',
        'revenue': '수익',
        'expense': '비용'
    };
    return types[type] || type;
}

// 인쇄 기능
function printReports() {
    const printContent = `
        <html>
        <head>
            <title>제니스어스 회계시스템 재무보고서</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 30px; }
                .section h3 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .metric { display: flex; justify-content: space-between; padding: 5px 0; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>제니스어스 회계시스템 재무보고서</h1>
                <p>생성일: ${new Date().toLocaleDateString('ko-KR')}</p>
            </div>
            
            <div class="section">
                <h3>주요 재무 현황</h3>
                <div class="metric">총 자산: ${formatCurrency(calculateTotalByType('asset'))}</div>
                <div class="metric">총 부채: ${formatCurrency(calculateTotalByType('liability'))}</div>
                <div class="metric">자본: ${formatCurrency(calculateTotalByType('equity') + (calculateTotalByType('revenue') - calculateTotalByType('expense')))}</div>
                <div class="metric">당기순이익: ${formatCurrency(calculateTotalByType('revenue') - calculateTotalByType('expense'))}</div>
            </div>
            
            <div class="section">
                ${document.getElementById('balanceSheet').innerHTML}
            </div>
            
            <div class="section">
                ${document.getElementById('incomeStatement').innerHTML}
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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

//==========================================
// AI 스마트 입력 시스템
//==========================================

// 스마트 입력 초기화
function initSmartInput() {
    document.getElementById('smartDate').value = new Date().toISOString().split('T')[0];
    renderLearnedPatterns();
}

// AI 거래 분석
function analyzeTransaction() {
    const description = document.getElementById('smartDescription').value.trim();
    const amount = parseFloat(document.getElementById('smartAmount').value);
    const date = document.getElementById('smartDate').value;
    const transactionType = document.getElementById('transactionType').value;
    
    if (!description || !amount || !date) {
        alert('거래 내용, 금액, 날짜를 모두 입력해주세요.');
        return;
    }
    
    // 네오 등장! 분석 시작
    showNeoAnalyzing();
    
    // AI 분석 실행 (약간의 지연으로 네오 등장 효과)
    setTimeout(() => {
        const recommendation = classifyTransaction(description, amount, transactionType);
        hideNeoAnalyzing();
        displayRecommendation(recommendation);
        showNeoSuccess();
    }, 1500);
}

// 네오 분석 중 표시
function showNeoAnalyzing() {
    const neoDiv = document.getElementById('neoAnalyzing');
    if (neoDiv) {
        neoDiv.style.display = 'block';
        setTimeout(() => {
            neoDiv.classList.add('show');
        }, 100);
    }
}

// 네오 분석 완료 숨김
function hideNeoAnalyzing() {
    const neoDiv = document.getElementById('neoAnalyzing');
    if (neoDiv) {
        neoDiv.classList.remove('show');
        setTimeout(() => {
            neoDiv.style.display = 'none';
        }, 300);
    }
}

// 네오 성공 메시지
function showNeoSuccess() {
    const successMessages = [
        '분석 완료! 🎉 추천 분개를 확인해보세요!',
        '완벽해요! AI가 똑똑하게 분류했어요! ✨',
        '잘하고 있어요! 회계 실력이 늘고 있어요! 💪',
        '훌륭해요! 이제 저장하고 다음 거래를 입력해보세요! 🚀'
    ];
    const message = successMessages[Math.floor(Math.random() * successMessages.length)];
    showNeoBubble(message, 3000);
    
    // 사용자 행동 기록
    trackUserAction('smart_input_success');
}

// 네오 말풍선 제어
function showNeoBubble(message, duration = 5000) {
    const bubble = document.getElementById('neoBubble');
    if (bubble) {
        bubble.innerHTML = message;
        bubble.classList.add('show');
        
        if (duration > 0) {
            setTimeout(() => {
                bubble.classList.remove('show');
            }, duration);
        }
    }
}

function toggleNeoBubble() {
    const bubble = document.getElementById('neoBubble');
    if (bubble) {
        if (bubble.classList.contains('show')) {
            bubble.classList.remove('show');
        } else {
            const contextualMessage = getContextualNeoMessage();
            showNeoBubble(contextualMessage, 5000);
        }
    }
}

// 상황별 맞춤 네오 메시지 시스템
function getContextualNeoMessage() {
    const currentTab = neoContext.currentTab;
    const userLevel = neoContext.helpLevel;
    const actionCount = neoContext.userActions.length;
    
    // 초보자를 위한 단계별 가이드
    if (userLevel === 'beginner' && actionCount < 3) {
        return getBeginnerGuideMessage(currentTab);
    }
    
    // 탭별 맞춤 메시지
    switch (currentTab) {
        case 'smart-input':
            return getSmartInputTips();
        case 'journal':
            return getJournalTips();
        case 'accounts':
            return getAccountsTips();
        case 'ledger':
            return getLedgerTips();
        case 'reports':
            return getReportsTips();
        case 'annual':
            return getAnnualTips();
        default:
            return getGeneralTips();
    }
}

function getBeginnerGuideMessage(currentTab) {
    const beginnerMessages = {
        'dashboard': '👋 네오젠에 오신 걸 환영해요!<br>🚀 <strong>AI 스마트 입력</strong>부터 시작해보세요!',
        'smart-input': '💡 여기가 핵심이에요!<br>거래 내용만 입력하면 <strong>AI가 자동으로 분개를 만들어드려요!</strong>',
        'journal': '📝 분개장이에요!<br>모든 거래 내역을 여기서 확인할 수 있어요!',
        'accounts': '📊 계정 관리 페이지예요!<br>새로운 계정을 추가하거나 기존 계정을 수정할 수 있어요!',
        'ledger': '📈 총계정원장이에요!<br>특정 계정의 모든 거래를 한눈에 볼 수 있어요!',
        'reports': '📋 재무제표 생성 페이지예요!<br>PDF나 Excel로 내보낼 수 있어요!',
        'annual': '🌟 연말 공시 페이지예요!<br>투명한 조직 운영을 위한 특별 기능이에요!'
    };
    
    return beginnerMessages[currentTab] || beginnerMessages['dashboard'];
}

function getSmartInputTips() {
    const tips = [
        '💡 <strong>팁:</strong> "사무용품 구입 5만원" 이렇게 구체적으로 써보세요!',
        '🎯 <strong>비밀:</strong> 금액과 내용을 정확히 쓸수록 AI가 더 똑똑해져요!',
        '✨ <strong>노하우:</strong> 거래 상대방도 함께 쓰면 더 정확해요!',
        '🚀 <strong>꿀팁:</strong> 비슷한 거래를 반복하면 AI가 학습해서 더 빨라져요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getJournalTips() {
    const tips = [
        '📝 <strong>잠깐!</strong> 분개 내역을 더블클릭하면 수정할 수 있어요!',
        '🔍 <strong>알고 계셨나요?</strong> 날짜순으로 정렬되어 관리가 쉬워요!',
        '💼 <strong>프로 팁:</strong> 정기적으로 확인하면 실수를 줄일 수 있어요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getAccountsTips() {
    const tips = [
        '📊 <strong>계정 관리 팁:</strong> 자주 쓰는 계정을 먼저 추가해보세요!',
        '🎯 <strong>추천:</strong> 학회라면 "회비수입", "행사비" 계정이 유용해요!',
        '✨ <strong>꿀팁:</strong> 계정명을 명확하게 하면 나중에 찾기 쉬워요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getLedgerTips() {
    const tips = [
        '📈 <strong>총계정원장 활용법:</strong> 현금 계정을 자주 확인해보세요!',
        '💰 <strong>체크 포인트:</strong> 잔액이 음수면 뭔가 이상할 수 있어요!',
        '🔍 <strong>분석 팁:</strong> 월별로 패턴을 보면 예산 계획에 도움돼요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getReportsTips() {
    const reportCount = journalEntries.length;
    if (reportCount === 0) {
        return '📋 <strong>아직 데이터가 없어요!</strong><br>먼저 AI 스마트 입력에서 거래를 입력해보세요!';
    }
    
    const tips = [
        '📊 <strong>재무제표 완성!</strong> PDF로 저장해서 회의에서 발표해보세요!',
        '💼 <strong>프로 팁:</strong> 정기적으로 재무제표를 만들면 조직 상황을 파악하기 쉬워요!',
        `🎉 <strong>현재 ${reportCount}개 거래 기록!</strong> 투명한 회계 관리를 하고 계시네요!`
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getAnnualTips() {
    const tips = [
        '🌟 <strong>연말 공시!</strong> 투명한 조직의 상징이에요!',
        '🏆 <strong>차별화 포인트:</strong> 이런 기능이 있는 회계 시스템은 네오젠이 유일해요!',
        '💡 <strong>활용법:</strong> 홈페이지에 올리면 조직 신뢰도가 UP!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getGeneralTips() {
    const tips = [
        '😊 안녕하세요! 회계 업무 어떠세요?<br>궁금한 게 있으면 언제든 말씀해주세요!',
        '🚀 AI 스마트 입력을 써보셨나요?<br>정말 편리해요!',
        '💙 네오젠과 함께 하는 회계, 어떠세요?<br>더 나은 기능이 필요하면 피드백 주세요!',
        '⭐ 오늘도 투명한 회계 관리 화이팅이에요!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// 스마트 네오 시스템
let neoContext = {
    userActions: [],
    currentTab: 'dashboard',
    lastInteraction: Date.now(),
    helpLevel: 'beginner' // beginner, intermediate, advanced
};

// 네오 초기 인사
// 네오 초기 인사 - 개선된 버전
function initNeo() {
    // 자동완성 기능 초기화
    initNeoSearchAutocomplete();
    
    setTimeout(() => {
        const welcomeMessages = [
            '안녕하세요! 네오입니다 ✨<br>AI 기반 스마트 회계를 도와드릴게요!',
            '반가워요! 저는 네오예요 🤖<br>회계가 어려우시면 언제든 물어보세요!',
            '네오가 도착했어요! 🚀<br>스마트한 회계 관리를 시작해볼까요?'
        ];
        const message = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        showNeoBubble(message, 4000);
    }, 2000);
    
    // 사용량 기반 맞춤 도움말
    setTimeout(() => {
        if (neoContext.userActions.length === 0) {
            showNeoBubble('아직 기능을 사용해보지 않으셨네요? 😊<br>🚀 <strong>AI 스마트 입력</strong>부터 시작해보세요!', 5000);
        }
    }, 300000); // 5분
    
    // 주기적 도움말 (10분마다)
    setInterval(() => {
        if (neoContext.userActions.length > 0 && Math.random() < 0.3) { // 30% 확률
            const helpfulTips = [
                '💡 팁: 거래 내용을 자세히 적을수록 AI 분류가 정확해져요!',
                '🎯 알고 계셨나요? 네오는 사용할수록 더 똑똑해진답니다!',
                '📊 재무제표도 확인해보세요! 자동으로 생성되어 있어요!',
                '🔍 궁금한 회계 용어가 있으면 검색해보세요!'
            ];
            const tip = helpfulTips[Math.floor(Math.random() * helpfulTips.length)];
            showNeoBubble(tip, 3000);
        }
    }, 600000); // 10분
}

// 커밍순 기능
function showComingSoon(feature) {
    const featureNames = {
        'tutorial': '회계 튜토리얼'
    };
    
    showNeoBubble(`🚧 <strong>${featureNames[feature] || feature}</strong>가 곧 출시됩니다!<br>✨ 더 나은 기능으로 찾아뵐게요!`, 4000);
    
    // 네오 캐릭터 진동 효과
    const neoHelper = document.getElementById('neoHelper');
    if (neoHelper) {
        neoHelper.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            neoHelper.style.animation = '';
        }, 500);
    }
}

// 네오 AI 검색 기능 (베라 아이디어)
// 네오 AI 검색 기능 (베라의 아이디어) - 개선된 버전
function handleNeoSearch(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('neoSearchInput').value.trim();
        if (query) {
            searchWithNeo(query);
        }
    }
}

// 네오 검색 자동완성 기능
function initNeoSearchAutocomplete() {
    const searchInput = document.getElementById('neoSearchInput');
    if (!searchInput) return;
    
    const suggestions = [
        '복식부기란?', '분개 작성법', '대차대조표', '손익계산서',
        '자산 계정', '부채 계정', '수익 계정', '비용 계정',
        '회계 원리', '재무제표 읽는 법', '학회 회계', '단체 회계'
    ];
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length > 1) {
            const matches = suggestions.filter(s => s.toLowerCase().includes(value));
            showSearchSuggestions(matches);
        } else {
            hideSearchSuggestions();
        }
    });
}

function showSearchSuggestions(suggestions) {
    let suggestionBox = document.getElementById('neoSearchSuggestions');
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'neoSearchSuggestions';
        suggestionBox.className = 'neo-search-suggestions';
        document.getElementById('neoSearchInput').parentNode.appendChild(suggestionBox);
    }
    
    if (suggestions.length > 0) {
        suggestionBox.innerHTML = suggestions.slice(0, 5).map(s => 
            `<div class="suggestion-item" onclick="selectSuggestion('${s}')">${s}</div>`
        ).join('');
        suggestionBox.style.display = 'block';
    } else {
        suggestionBox.style.display = 'none';
    }
}

function hideSearchSuggestions() {
    const suggestionBox = document.getElementById('neoSearchSuggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
    }
}

function selectSuggestion(suggestion) {
    document.getElementById('neoSearchInput').value = suggestion;
    hideSearchSuggestions();
    searchWithNeo(suggestion);
}

function searchWithNeo(query) {
    const resultDiv = document.getElementById('neoSearchResult');
    const inputField = document.getElementById('neoSearchInput');
    
    // 검색 중 표시
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '🤖 네오가 검색 중입니다...';
    
    // 네오 캐릭터 애니메이션
    const neoHelper = document.getElementById('neoHelper');
    if (neoHelper) {
        neoHelper.classList.add('analyzing');
    }
    
    // AI 검색 시뮬레이션 (실제로는 간단한 키워드 매칭)
    setTimeout(() => {
        const answer = getNeoAnswer(query);
        resultDiv.innerHTML = `🤖 <strong>네오의 답변:</strong><br><br>${answer}`;
        
        // 애니메이션 종료
        if (neoHelper) {
            neoHelper.classList.remove('analyzing');
        }
        
        // 입력 필드 클리어
        inputField.value = '';
        
        // 사용자 행동 추적
        trackUserAction('neo_search');
        
        // 플로팅 네오 메시지
        setTimeout(() => {
            showNeoBubble('도움이 되셨나요? 😊<br>더 궁금한 게 있으시면 언제든 물어보세요!', 3000);
        }, 1000);
        
    }, 2000); // 2초 지연으로 AI 느낌 연출
}

function getNeoAnswer(query) {
    const lowerQuery = query.toLowerCase();
    
    // 회계 용어 사전
    const answers = {
        '복식부기': `<strong>복식부기</strong>는 모든 거래를 <strong>차변(借方)</strong>과 <strong>대변(貸方)</strong> 두 측면에서 기록하는 회계 방법입니다.<br><br>
        📊 <strong>핵심 원리:</strong><br>
        • 차변 합계 = 대변 합계 (항상 균형)<br>
        • 모든 거래는 최소 2개 계정에 영향<br>
        • 자산 증가 = 차변, 부채·자본 증가 = 대변<br><br>
        💡 <strong>예시:</strong> 현금 10만원으로 사무용품 구입<br>
        차변: 사무용품비 100,000원<br>
        대변: 현금 100,000원`,
        
        '분개': `<strong>분개(分介)</strong>는 발생한 거래를 복식부기 원리에 따라 차변과 대변으로 나누어 기록하는 것입니다.<br><br>
        📝 <strong>분개 순서:</strong><br>
        1. 거래 내용 파악<br>
        2. 영향받는 계정 식별<br>
        3. 계정별 증감 판단<br>
        4. 차변/대변 배치<br><br>
        🎯 <strong>네오젠 팁:</strong> AI 스마트 입력을 사용하면 자동으로 분개를 추천해드려요!`,
        
        '계정과목': `<strong>계정과목</strong>은 거래를 분류하기 위한 회계상의 계정 항목입니다.<br><br>
        📋 <strong>5가지 기본 분류:</strong><br>
        🏦 <strong>자산</strong>: 현금, 매출채권, 재고자산 등<br>
        💳 <strong>부채</strong>: 매입채무, 대출금 등<br>
        💰 <strong>자본</strong>: 자본금, 이익잉여금 등<br>
        📈 <strong>수익</strong>: 매출액, 이자수익 등<br>
        📉 <strong>비용</strong>: 매출원가, 판관비 등<br><br>
        💡 각 계정마다 고유 번호(계정코드)를 부여해서 관리해요!`,
        
        '차변': `<strong>차변(借方, Debit)</strong>은 복식부기에서 왼쪽에 기록하는 부분입니다.<br><br>
        📊 <strong>차변에 기록되는 경우:</strong><br>
        • 자산의 증가<br>
        • 부채의 감소<br>
        • 자본의 감소<br>
        • 비용의 발생<br>
        • 수익의 감소<br><br>
        🎯 <strong>기억법:</strong> "자산↑, 비용↑ = 차변"`,
        
        '대변': `<strong>대변(貸方, Credit)</strong>은 복식부기에서 오른쪽에 기록하는 부분입니다.<br><br>
        📊 <strong>대변에 기록되는 경우:</strong><br>
        • 자산의 감소<br>
        • 부채의 증가<br>
        • 자본의 증가<br>
        • 수익의 발생<br>
        • 비용의 감소<br><br>
        🎯 <strong>기억법:</strong> "부채↑, 자본↑, 수익↑ = 대변"`,
        
        '재무제표': `<strong>재무제표</strong>는 기업의 재무 상태와 경영 성과를 나타내는 회계 보고서입니다.<br><br>
        📋 <strong>주요 재무제표:</strong><br>
        📊 <strong>재무상태표</strong>: 자산, 부채, 자본의 현황<br>
        📈 <strong>손익계산서</strong>: 수익과 비용, 순이익<br>
        💸 <strong>현금흐름표</strong>: 현금의 유입과 유출<br>
        💰 <strong>자본변동표</strong>: 자본의 변동 내역<br><br>
        🚀 <strong>네오젠에서는</strong> 입력된 데이터로 자동으로 재무제표를 생성해드려요!`
    };
    
    // 키워드 매칭
    for (const [keyword, answer] of Object.entries(answers)) {
        if (lowerQuery.includes(keyword)) {
            return answer;
        }
    }
    
    // 일반적인 질문 패턴 매칭
    if (lowerQuery.includes('무엇') || lowerQuery.includes('뭐')) {
        return `🤔 좀 더 구체적인 회계 용어로 질문해주세요!<br><br>
        📚 <strong>추천 검색어:</strong><br>
        • 복식부기<br>
        • 분개<br>
        • 계정과목<br>
        • 차변<br>
        • 대변<br>
        • 재무제표<br><br>
        💡 예시: "복식부기란 무엇인가요?"`;
    }
    
    if (lowerQuery.includes('어떻게') || lowerQuery.includes('방법')) {
        return `📖 <strong>네오젠 사용법:</strong><br><br>
        1️⃣ <strong>AI 스마트 입력</strong>에서 거래 내용 입력<br>
        2️⃣ AI가 자동으로 분개 추천<br>
        3️⃣ 추천 분개 확인 후 저장<br>
        4️⃣ 재무제표에서 결과 확인<br><br>
        🎯 <strong>핵심:</strong> 거래 내용을 구체적으로 입력할수록 더 정확한 분개를 받을 수 있어요!`;
    }
    
    // 기본 답변
    return `죄송해요, "${query}"에 대한 정보를 찾지 못했어요. 😅<br><br>
    🔍 <strong>다른 키워드로 검색해보세요:</strong><br>
    • 복식부기, 분개, 계정과목<br>
    • 차변, 대변, 재무제표<br>
    • 자산, 부채, 자본, 수익, 비용<br><br>
    💬 또는 피드백 섹션에서 질문을 남겨주시면 더 자세히 답변드릴게요!`;
}

// 파일 가져오기 기능 (베라의 혁신 아이디어)
let uploadedFileData = null;

// 드래그 앤 드롭 초기화
function initFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    if (!uploadArea) return;
    
    // 드래그 이벤트 처리
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2563eb';
        uploadArea.style.backgroundColor = '#eff6ff';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.backgroundColor = '#f8fafc';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.backgroundColor = '#f8fafc';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
}

function handleFileUpload(fileOrInput) {
    let file;
    
    // input 요소에서 호출된 경우
    if (fileOrInput.files) {
        file = fileOrInput.files[0];
    } else {
        // 파일 객체가 직접 전달된 경우 (드래그 앤 드롭)
        file = fileOrInput;
    }
    
    if (!file) {
        alert('파일을 선택해주세요.');
        return;
    }
    
    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기가 10MB를 초과합니다. 더 작은 파일을 선택해주세요.');
        return;
    }
    
    // 파일 형식 확인
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(fileExtension)) {
        alert('지원하지 않는 파일 형식입니다. CSV 또는 Excel 파일을 선택해주세요.');
        return;
    }
    
    console.log('파일 업로드 시작:', file.name, file.size, 'bytes');
    showNeoBubble('🚀 파일을 분석 중이에요!<br>잠시만 기다려주세요...', 3000);
    
    const reader = new FileReader();
    
    reader.onerror = function() {
        alert('파일을 읽는 중 오류가 발생했습니다.');
        console.error('FileReader error');
    };
    
    if (file.name.endsWith('.csv')) {
        reader.onload = function(e) {
            try {
                let csvData = e.target.result;
                console.log('원본 CSV 데이터 길이:', csvData.length);
                
                // BOM 제거 (한글 CSV 파일 처리)
                if (csvData.charCodeAt(0) === 0xFEFF) {
                    csvData = csvData.slice(1);
                    console.log('BOM 제거됨');
                }
                
                // 줄바꿈 통일
                csvData = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                
                console.log('처리된 CSV 데이터 길이:', csvData.length);
                console.log('첫 500자:', csvData.substring(0, 500));
                
                const parsedData = parseCSV(csvData);
                console.log('최종 파싱된 데이터:', parsedData);
                
                if (parsedData.length === 0) {
                    alert('CSV 파일에서 데이터를 찾을 수 없습니다.');
                    return;
                }
                
                displayFilePreview(parsedData, file.name);
            } catch (error) {
                console.error('CSV 파싱 오류:', error);
                alert(`CSV 파일을 분석하는 중 오류가 발생했습니다: ${error.message}`);
            }
        };
        
        // UTF-8로 읽기 시도
        reader.readAsText(file, 'UTF-8');
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        reader.onload = function(e) {
            try {
                console.log('Excel 파일 처리 중...', file.name);
                
                // XLSX 라이브러리로 실제 엑셀 파일 읽기
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                console.log('워크북 시트 목록:', workbook.SheetNames);
                
                // 첫 번째 시트 선택
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                
                // JSON 형태로 변환
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                console.log('엑셀 데이터:', jsonData);
                
                if (jsonData.length === 0) {
                    alert('엑셀 파일에 데이터가 없습니다.');
                    return;
                }
                
                // 빈 행 제거
                const filteredData = jsonData.filter(row => 
                    row && row.length > 0 && row.some(cell => cell !== undefined && cell !== '')
                );
                
                if (filteredData.length < 2) {
                    alert('엑셀 파일에 충분한 데이터가 없습니다. 최소 헤더와 1개 행이 필요합니다.');
                    return;
                }
                
                console.log('필터링된 데이터:', filteredData);
                displayFilePreview(filteredData, file.name);
                
            } catch (error) {
                console.error('Excel 파일 처리 오류:', error);
                alert(`Excel 파일을 분석하는 중 오류가 발생했습니다: ${error.message}`);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

function parseCSV(csvText) {
    console.log('CSV 파싱 시작...');
    console.log('원본 텍스트 길이:', csvText.length);
    console.log('첫 200자:', csvText.substring(0, 200));
    
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    console.log('총 라인 수:', lines.length);
    
    // 첫 번째 라인으로 구분자 감지
    const firstLine = lines[0] || '';
    console.log('첫 번째 라인:', firstLine);
    
    let delimiter = ',';
    
    // 다양한 구분자 시도
    const delimiters = [',', ';', '\t', '|'];
    let maxColumns = 0;
    
    for (const testDelimiter of delimiters) {
        const testColumns = firstLine.split(testDelimiter).length;
        console.log(`구분자 "${testDelimiter}": ${testColumns}개 컬럼`);
        
        if (testColumns > maxColumns) {
            maxColumns = testColumns;
            delimiter = testDelimiter;
        }
    }
    
    console.log(`선택된 구분자: "${delimiter}" (${maxColumns}개 컬럼)`);
    
    // 선택된 구분자로 파싱
    const result = lines.map((line, lineIndex) => {
        const columns = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
                current += char; // 따옴표도 포함
            } else if (char === delimiter && !inQuotes) {
                columns.push(current.trim().replace(/^"|"$/g, '')); // 앞뒤 따옴표 제거
                current = '';
            } else {
                current += char;
            }
        }
        
        // 마지막 컬럼 추가
        columns.push(current.trim().replace(/^"|"$/g, ''));
        
        if (lineIndex < 3) {
            console.log(`라인 ${lineIndex + 1}:`, columns);
        }
        
        return columns;
    }).filter(row => row.some(cell => cell && cell.length > 0));
    
    console.log('파싱 완료:', `${result.length}행 ${result[0]?.length || 0}컬럼`);
    return result;
}

function displayFilePreview(data, fileName) {
    uploadedFileData = data;
    
    console.log('미리보기 데이터:', data);
    console.log('파일명:', fileName);
    
    const previewDiv = document.getElementById('previewTable');
    const headers = data[0] || [];
    
    // 파일 분석 결과 먼저 표시
    let resultHTML = '';
    
    // 파일 분석 요약
    resultHTML += `
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
            <h4 style="margin: 0 0 10px 0; color: white;">🎉 파일 분석 완료!</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 15px;">
                <div>
                    <div style="font-size: 24px; font-weight: 700;">${data.length}</div>
                    <div style="opacity: 0.9; font-size: 14px;">총 행수</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700;">${headers.length}</div>
                    <div style="opacity: 0.9; font-size: 14px;">총 컬럼수</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700;">${data.length - 1}</div>
                    <div style="opacity: 0.9; font-size: 14px;">데이터 행</div>
                </div>
            </div>
        </div>
    `;
    
    // 발견된 컬럼 정보
    if (headers.length > 1) {
        resultHTML += `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h5 style="color: #1e293b; margin: 0 0 15px 0; display: flex; align-items: center;">
                    <span style="background: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px;">✓</span>
                    발견된 컬럼 정보 (${headers.length}개)
                </h5>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    ${headers.map((header, index) => 
                        `<div style="background: white; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; align-items: center;">
                            <span style="background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 12px; font-weight: 600;">${index + 1}</span>
                            <span style="color: #374151; font-weight: 500;">${header || '(빈 컬럼)'}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    } else {
        resultHTML += `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h5 style="color: #dc2626; margin: 0 0 10px 0; display: flex; align-items: center;">
                    <span style="margin-right: 10px;">⚠️</span>
                    컬럼 인식 문제 발생
                </h5>
                <p style="color: #7f1d1d; margin: 0; line-height: 1.5;">
                    파일에서 ${headers.length}개 컬럼만 발견되었습니다. 
                    CSV 파일의 구분자가 쉼표(,)가 아닐 수 있습니다.<br>
                    Excel로 파일을 열어서 "다른 이름으로 저장" → "CSV UTF-8" 형식으로 저장 후 다시 시도해보세요.
                </p>
            </div>
        `;
    }
    
    // 미리보기 테이블
    resultHTML += '<h5 style="color: #1e293b; margin: 20px 0 10px 0;">📋 데이터 미리보기</h5>';
    resultHTML += '<div style="overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; background: white;">';
    resultHTML += '<table style="width: 100%; border-collapse: collapse;">';
    
    const previewRows = Math.min(data.length, 8);
    for (let i = 0; i < previewRows; i++) {
        const row = data[i];
        resultHTML += '<tr>';
        
        row.forEach((cell, cellIndex) => {
            const tag = i === 0 ? 'th' : 'td';
            const style = i === 0 ? 
                'background: #2563eb; color: white; padding: 12px; text-align: left; font-weight: 600; border-bottom: 1px solid #1e40af;' :
                'padding: 12px; border-bottom: 1px solid #f1f5f9; color: #374151;';
            
            let cellValue = cell;
            if (cellValue === null || cellValue === undefined) {
                cellValue = '';
            }
            
            resultHTML += `<${tag} style="${style}">${cellValue}</${tag}>`;
        });
        resultHTML += '</tr>';
    }
    resultHTML += '</table>';
    resultHTML += '</div>';
    
    if (data.length > 8) {
        resultHTML += `<p style="text-align: center; color: #64748b; margin: 15px 0; font-style: italic;">... 외 ${data.length - 8}개 행</p>`;
    }
    
    previewDiv.innerHTML = resultHTML;
    
    // 컬럼 선택 드롭다운 생성
    populateColumnSelectors(headers);
    
    // 미리보기 영역 표시
    document.getElementById('filePreview').style.display = 'block';
    
    // 사용자 친화적 메시지
    if (headers.length > 1) {
        showNeoBubble(`🎉 완벽해요!<br>${headers.length}개 컬럼을 모두 인식했어요!`, 4000);
    } else {
        showNeoBubble(`⚠️ 컬럼이 ${headers.length}개만 인식되었어요<br>CSV 형식을 확인해주세요!`, 5000);
    }
}

function populateColumnSelectors(headers) {
    console.log('컬럼 선택기 생성 중...', headers);
    
    const selectors = ['dateColumn', 'descriptionColumn', 'withdrawalColumn', 'depositColumn'];
    
    selectors.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        if (!select) {
            console.error(`선택기를 찾을 수 없음: ${selectorId}`);
            return;
        }
        
        select.innerHTML = '<option value="">선택하세요</option>';
        
        headers.forEach((header, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${index + 1}열: ${header || '(빈 컬럼)'}`;
            select.appendChild(option);
        });
    });
    
    // 우리은행 거래내역 및 일반적인 패턴 자동 매핑
    headers.forEach((header, index) => {
        if (!header) return;
        
        const lowerHeader = header.toLowerCase().trim();
        console.log(`컬럼 ${index + 1}: "${header}" (분석: "${lowerHeader}")`);
        
        // 날짜 패턴 매핑
        if (lowerHeader.includes('날짜') || lowerHeader.includes('date') || 
            lowerHeader.includes('거래일') || lowerHeader.includes('일자') ||
            lowerHeader.includes('transaction') && lowerHeader.includes('date')) {
            document.getElementById('dateColumn').value = index;
            console.log(`날짜 컬럼으로 매핑: ${index + 1}열`);
        }
        
        // 거래내용 패턴 매핑  
        else if (lowerHeader.includes('내용') || lowerHeader.includes('설명') || 
                 lowerHeader.includes('적요') || lowerHeader.includes('거래내용') ||
                 lowerHeader.includes('description') || lowerHeader.includes('memo') ||
                 lowerHeader.includes('거래처') || lowerHeader.includes('상대방')) {
            document.getElementById('descriptionColumn').value = index;
            console.log(`내용 컬럼으로 매핑: ${index + 1}열`);
        }
        
        // 지급(출금) 패턴 매핑
        else if (lowerHeader.includes('출금') || lowerHeader.includes('지급') || 
                 lowerHeader.includes('지출') || lowerHeader.includes('차변') ||
                 lowerHeader.includes('withdrawal') || lowerHeader.includes('debit') ||
                 lowerHeader.includes('payment') || lowerHeader.includes('pay')) {
            document.getElementById('withdrawalColumn').value = index;
            console.log(`지급 컬럼으로 매핑: ${index + 1}열`);
        }
        
        // 입금(수입) 패턴 매핑
        else if (lowerHeader.includes('입금') || lowerHeader.includes('수입') || 
                 lowerHeader.includes('대변') || lowerHeader.includes('deposit') ||
                 lowerHeader.includes('credit') || lowerHeader.includes('income') ||
                 lowerHeader.includes('revenue') || lowerHeader.includes('receive')) {
            document.getElementById('depositColumn').value = index;
            console.log(`입금 컬럼으로 매핑: ${index + 1}열`);
        }
    });
    
    // 매핑 결과 표시
    setTimeout(() => {
        const mappingResults = [];
        const dateCol = document.getElementById('dateColumn').value;
        const descCol = document.getElementById('descriptionColumn').value;
        const withdrawalCol = document.getElementById('withdrawalColumn').value;
        const depositCol = document.getElementById('depositColumn').value;
        
        if (dateCol) mappingResults.push(`📅 날짜: ${parseInt(dateCol) + 1}열`);
        if (descCol) mappingResults.push(`📝 내용: ${parseInt(descCol) + 1}열`);
        if (withdrawalCol) mappingResults.push(`💸 지급: ${parseInt(withdrawalCol) + 1}열`);
        if (depositCol) mappingResults.push(`💰 입금: ${parseInt(depositCol) + 1}열`);
        
        if (mappingResults.length >= 2) {
            showNeoBubble(`🎯 자동 매핑 완료!<br>${mappingResults.join(' | ')}`, 5000);
        } else {
            showNeoBubble('⚠️ 최소 날짜와 내용은 필수예요<br>컬럼을 확인해주세요!', 4000);
        }
    }, 500);
}

function convertToDoubleEntry() {
    if (!uploadedFileData) {
        alert('먼저 파일을 업로드해주세요.');
        return;
    }
    
    const dateCol = document.getElementById('dateColumn').value;
    const descCol = document.getElementById('descriptionColumn').value;
    const withdrawalCol = document.getElementById('withdrawalColumn').value;
    const depositCol = document.getElementById('depositColumn').value;
    
    if (!dateCol || !descCol) {
        alert('날짜와 내용 컬럼은 필수 선택 항목입니다.');
        return;
    }
    
    if (!withdrawalCol && !depositCol) {
        alert('지급 또는 입금 컬럼 중 최소 하나는 선택해야 합니다.');
        return;
    }
    
    showNeoAnalyzing();
    
    setTimeout(() => {
        let successCount = 0;
        let errorCount = 0;
        
        // 헤더 제외하고 데이터 처리
        for (let i = 1; i < uploadedFileData.length; i++) {
            const row = uploadedFileData[i];
            
            try {
                const date = row[dateCol];
                const description = row[descCol];
                
                // 지급/입금 금액 처리
                let amount = 0;
                let isWithdrawal = false;
                
                if (withdrawalCol && row[withdrawalCol]) {
                    const withdrawalAmount = parseFloat(String(row[withdrawalCol]).replace(/[^\d.-]/g, ''));
                    if (!isNaN(withdrawalAmount) && withdrawalAmount > 0) {
                        amount = withdrawalAmount;
                        isWithdrawal = true;
                    }
                }
                
                if (!amount && depositCol && row[depositCol]) {
                    const depositAmount = parseFloat(String(row[depositCol]).replace(/[^\d.-]/g, ''));
                    if (!isNaN(depositAmount) && depositAmount > 0) {
                        amount = depositAmount;
                        isWithdrawal = false;
                    }
                }
                
                if (date && description && amount > 0) {
                    // AI 기반 자동 분개 생성
                    const journalEntry = generateJournalEntryFromCSV(date, description, amount, isWithdrawal);
                    
                    // 분개 저장
                    journalEntries.push(journalEntry);
                    updateAccountBalances(journalEntry);
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                console.error('행 처리 오류:', error, '행 데이터:', row);
                errorCount++;
            }
        }
        
        // 모든 화면 업데이트
        saveData();
        renderJournalEntries();
        renderDashboard();
        renderAccounts();
        generateReports();
        
        hideNeoAnalyzing();
        showConversionResult(successCount, errorCount);
        
        // 네오 축하 메시지
        showNeoBubble(`🎉 변환 완료!<br>${successCount}개의 분개가 생성되었어요!`, 5000);
        
        // 사용자 행동 추적
        trackUserAction('file_conversion');
        
    }, 3000);
}

function generateJournalEntryFromCSV(date, description, amount, isWithdrawal) {
    // AI 기반 계정 추천 로직 (지급/입금 구분 기반)
    const classification = classifyTransactionFromDescription(description, isWithdrawal);
    
    const journalEntry = {
        id: currentJournalId++,
        date: date,
        description: description,
        entries: [
            {
                account: classification.debitAccount,
                amount: amount,
                debit: true,
                credit: false
            },
            {
                account: classification.creditAccount,
                amount: amount,
                debit: false,
                credit: true
            }
        ]
    };
    
    console.log('🔥 CSV에서 생성된 분개 데이터:', journalEntry);
    return journalEntry;
}

function classifyTransactionFromDescription(description, isWithdrawal) {
    const desc = description.toLowerCase();
    
    if (isWithdrawal) {
        // 지급(지출) 거래 - 비용 계정을 차변에 기록
        
        // 구체적인 비용 분류
        if (desc.includes('사무') || desc.includes('office') || desc.includes('용품') || desc.includes('stationery')) {
            return {
                debitAccount: '601 사무용품비',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('강사') || desc.includes('honorarium') || desc.includes('lecturer') || desc.includes('강의')) {
            return {
                debitAccount: '602 강사료',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('임대') || desc.includes('rent') || desc.includes('사용료') || desc.includes('임차')) {
            return {
                debitAccount: '603 임대료',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('교통') || desc.includes('transport') || desc.includes('차량') || desc.includes('taxi') || desc.includes('버스') || desc.includes('지하철')) {
            return {
                debitAccount: '604 교통비',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('식') || desc.includes('food') || desc.includes('meal') || desc.includes('음식') || desc.includes('식사')) {
            return {
                debitAccount: '605 식비',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('통신') || desc.includes('전화') || desc.includes('인터넷') || desc.includes('phone') || desc.includes('internet')) {
            return {
                debitAccount: '606 통신비',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('수도') || desc.includes('전기') || desc.includes('가스') || desc.includes('utility') || desc.includes('공과금')) {
            return {
                debitAccount: '607 공과금',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('도서') || desc.includes('book') || desc.includes('서적') || desc.includes('자료')) {
            return {
                debitAccount: '608 도서구입비',
                creditAccount: '101 현금'
            };
        } else if (desc.includes('회의') || desc.includes('meeting') || desc.includes('세미나') || desc.includes('워크샵')) {
            return {
                debitAccount: '609 회의비',
                creditAccount: '101 현금'
            };
        }
        
        // 기본값 (기타 지출)
        return {
            debitAccount: '699 기타비용',
            creditAccount: '101 현금'
        };
        
    } else {
        // 입금(수입) 거래 - 수익 계정을 대변에 기록
        
        if (desc.includes('회비') || desc.includes('membership') || desc.includes('fee') || desc.includes('dues')) {
            return {
                debitAccount: '101 현금',
                creditAccount: '401 회비수익'
            };
        } else if (desc.includes('후원') || desc.includes('기부') || desc.includes('donation') || desc.includes('sponsor')) {
            return {
                debitAccount: '101 현금',
                creditAccount: '402 후원금수익'
            };
        } else if (desc.includes('교육') || desc.includes('강의') || desc.includes('교육비') || desc.includes('training') || desc.includes('education')) {
            return {
                debitAccount: '101 현금',
                creditAccount: '403 교육수익'
            };
        } else if (desc.includes('이자') || desc.includes('interest') || desc.includes('예금')) {
            return {
                debitAccount: '101 현금',
                creditAccount: '404 이자수익'
            };
        } else if (desc.includes('판매') || desc.includes('매출') || desc.includes('sales') || desc.includes('revenue')) {
            return {
                debitAccount: '101 현금',
                creditAccount: '405 매출액'
            };
        }
        
        // 기본값 (기타 수입)
        return {
            debitAccount: '101 현금',
            creditAccount: '499 기타수익'
        };
    }
}

function showConversionResult(successCount, errorCount) {
    const resultDiv = document.getElementById('conversionResult');
    const summaryDiv = document.getElementById('conversionSummary');
    
    summaryDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; text-align: center;">
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--success-green);">${successCount}</div>
                <div style="color: var(--neutral-gray);">성공</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--neutral-gray);">${errorCount}</div>
                <div style="color: var(--neutral-gray);">오류</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--primary-blue);">${successCount + errorCount}</div>
                <div style="color: var(--neutral-gray);">총 처리</div>
            </div>
        </div>
        <div style="margin-top: 15px; text-align: center; color: var(--neutral-gray);">
            🤖 AI가 거래 내용을 분석하여 자동으로 계정을 분류했습니다!
        </div>
    `;
    
    resultDiv.style.display = 'block';
}

// 테스트용 Excel 파일 생성
function generateTestExcel() {
    try {
        // 테스트 데이터
        const testData = [
            ['날짜', '내용', '금액', '유형'],
            ['2024-01-15', '사무용품 구입', 50000, '비용'],
            ['2024-01-20', '회비 수입', 200000, '수익'],
            ['2024-01-25', '강사료 지급', 150000, '비용'],
            ['2024-02-01', '임대료 지급', 300000, '비용'],
            ['2024-02-05', '교통비', 25000, '비용'],
            ['2024-02-10', '도서구입비', 80000, '비용'],
            ['2024-02-15', '회원 회비', 150000, '수익'],
            ['2024-02-20', '회의비', 45000, '비용']
        ];
        
        // 워크북과 워크시트 생성
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(testData);
        
        // 컬럼 너비 설정
        ws['!cols'] = [
            { wch: 12 }, // 날짜
            { wch: 20 }, // 내용
            { wch: 15 }, // 금액
            { wch: 10 }  // 유형
        ];
        
        // 워크시트를 워크북에 추가
        XLSX.utils.book_append_sheet(wb, ws, '회계데이터');
        
        // 파일 다운로드
        XLSX.writeFile(wb, 'test-accounting-data.xlsx');
        
        showNeoBubble('📊 테스트용 Excel 파일이 다운로드되었어요!<br>이 파일로 업로드 테스트를 해보세요!', 4000);
        
    } catch (error) {
        console.error('Excel 파일 생성 오류:', error);
        alert('Excel 파일 생성 중 오류가 발생했습니다.');
    }
}

// 사용자 행동 추적
function trackUserAction(action) {
    neoContext.userActions.push({
        action: action,
        timestamp: Date.now(),
        tab: neoContext.currentTab
    });
    
    // 사용자 레벨 자동 조정
    if (neoContext.userActions.length > 10) {
        neoContext.helpLevel = 'intermediate';
    }
    if (neoContext.userActions.length > 50) {
        neoContext.helpLevel = 'advanced';
    }
    
    // 특정 행동에 따른 맞춤 반응
    reactToUserAction(action);
}

function reactToUserAction(action) {
    switch (action) {
        case 'smart_input_success':
            // 연속 성공 시 격려
            const recentSuccesses = neoContext.userActions.filter(a => 
                a.action === 'smart_input_success' && 
                Date.now() - a.timestamp < 300000 // 5분 이내
            ).length;
            
            if (recentSuccesses >= 3) {
                setTimeout(() => {
                    showNeoBubble('와! 연속으로 잘하고 계시네요! 🔥<br>이제 재무제표도 확인해보세요!', 4000);
                }, 2000);
            }
            break;
            
        case 'first_entry':
            setTimeout(() => {
                showNeoBubble('첫 번째 거래 입력 완료! 🎉<br>이제 패턴을 학습해서 다음엔 더 빨라질 거예요!', 3000);
            }, 1000);
            break;
    }
}

// 탭 변경 감지
function updateNeoContext(tabName) {
    neoContext.currentTab = tabName;
    neoContext.lastInteraction = Date.now();
    
    // 탭 전환 시 도움말 제공 (초보자만)
    if (neoContext.helpLevel === 'beginner' && neoContext.userActions.length < 5) {
        setTimeout(() => {
            const message = getBeginnerGuideMessage(tabName);
            showNeoBubble(message, 4000);
        }, 1000);
    }
}

// 거래 분류 AI 엔진
function classifyTransaction(description, amount, transactionType) {
    const desc = description.toLowerCase();
    
    // 1. 학습된 패턴 매칭
    const learnedMatch = findLearnedPattern(desc);
    if (learnedMatch) {
        return {
            debitAccount: learnedMatch.debitAccount,
            creditAccount: learnedMatch.creditAccount,
            confidence: Math.min(95, 60 + learnedMatch.count * 10),
            reasoning: `학습된 패턴 (${learnedMatch.count}회 사용)`
        };
    }
    
    // 2. 룰 기반 분류
    const ruleBasedResult = applyClassificationRules(desc, amount, transactionType);
    return ruleBasedResult;
}

// 학습된 패턴 검색
function findLearnedPattern(description) {
    return learnedPatterns.find(pattern => {
        const keywords = pattern.keywords;
        return keywords.some(keyword => description.includes(keyword));
    });
}

// 분류 규칙 적용
function applyClassificationRules(description, amount, transactionType) {
    const rules = [
        // 수입 관련
        {
            keywords: ['회비', '연회비', '등록비', '참가비', '매출', '수입', '입금'],
            debit: '102', // 보통예금
            credit: '401', // 매출
            confidence: 85,
            reasoning: '수입 관련 키워드 감지'
        },
        
        // 학회 특화 수입
        {
            keywords: ['학회비', '회원비', '논문비', '심사료'],
            debit: '102', // 보통예금
            credit: '401', // 매출
            confidence: 90,
            reasoning: '학회 수입 키워드 감지'
        },
        
        // 사무용품
        {
            keywords: ['사무용품', '문구', '펜', '종이', '복사', '인쇄', '스테이플러'],
            debit: '504', // 사무용품비
            credit: '102', // 보통예금
            confidence: 90,
            reasoning: '사무용품 키워드 감지'
        },
        
        // 임차료/장소비
        {
            keywords: ['임차료', '임대료', '장소대여', '회의실', '강당', '세미나실', '대회장'],
            debit: '503', // 임차료
            credit: '102', // 보통예금
            confidence: 88,
            reasoning: '장소/임차료 키워드 감지'
        },
        
        // 통신비
        {
            keywords: ['통신비', '전화비', '인터넷', '휴대폰', '카톡', '화상회의'],
            debit: '505', // 통신비
            credit: '102', // 보통예금
            confidence: 85,
            reasoning: '통신비 키워드 감지'
        },
        
        // 식사/간식
        {
            keywords: ['식사', '간식', '커피', '도시락', '케이터링', '다과'],
            debit: '502', // 급여 (복리후생비 대신)
            credit: '102', // 보통예금
            confidence: 80,
            reasoning: '식사/간식 키워드 감지'
        },
        
        // 교통비
        {
            keywords: ['교통비', '택시', '버스', '지하철', '기차', '항공료', '출장'],
            debit: '502', // 급여 (교통비 대신)
            credit: '102', // 보통예금
            confidence: 85,
            reasoning: '교통비 키워드 감지'
        },
        
        // 현금 관련
        {
            keywords: ['현금', '출금', '인출'],
            debit: '101', // 현금
            credit: '102', // 보통예금
            confidence: 95,
            reasoning: '현금 거래 키워드 감지'
        }
    ];
    
    // 거래 유형별 기본 처리
    if (transactionType === 'income') {
        return {
            debitAccount: '102', // 보통예금
            creditAccount: '401', // 매출
            confidence: 75,
            reasoning: '수입 거래로 선택됨'
        };
    }
    
    if (transactionType === 'transfer') {
        return {
            debitAccount: '101', // 현금
            creditAccount: '102', // 보통예금
            confidence: 80,
            reasoning: '이체/자산 이동으로 선택됨'
        };
    }
    
    // 룰 매칭
    for (const rule of rules) {
        if (rule.keywords.some(keyword => description.includes(keyword))) {
            return {
                debitAccount: rule.debit,
                creditAccount: rule.credit,
                confidence: rule.confidence,
                reasoning: rule.reasoning
            };
        }
    }
    
    // 기본값 (지출로 가정)
    return {
        debitAccount: '504', // 사무용품비
        creditAccount: '102', // 보통예금
        confidence: 60,
        reasoning: '기본 지출 분류 (수동 확인 권장)'
    };
}

// 추천 결과 표시
function displayRecommendation(recommendation) {
    const aiRecommendation = document.getElementById('aiRecommendation');
    const recommendedEntry = document.getElementById('recommendedEntry');
    const confidenceScore = document.getElementById('confidenceScore');
    
    const debitAccount = accounts.find(acc => acc.code === recommendation.debitAccount);
    const creditAccount = accounts.find(acc => acc.code === recommendation.creditAccount);
    const amount = parseFloat(document.getElementById('smartAmount').value);
    
    recommendedEntry.innerHTML = `
        <div class="recommended-entry">
            <div class="entry-line">
                <span class="account-info debit-side">차변: ${debitAccount.code} ${debitAccount.name}</span>
                <span class="amount-info debit-side">${formatCurrency(amount)}</span>
            </div>
            <div class="entry-line">
                <span class="account-info credit-side">대변: ${creditAccount.code} ${creditAccount.name}</span>
                <span class="amount-info credit-side">${formatCurrency(amount)}</span>
            </div>
        </div>
        <p style="margin-top: 10px; color: #6c757d; font-style: italic;">
            📝 분류 근거: ${recommendation.reasoning}
        </p>
    `;
    
    confidenceScore.textContent = recommendation.confidence;
    confidenceScore.className = getConfidenceClass(recommendation.confidence);
    
    currentRecommendation = {
        ...recommendation,
        amount: amount,
        date: document.getElementById('smartDate').value,
        description: document.getElementById('smartDescription').value
    };
    
    console.log('💡 currentRecommendation 설정:', currentRecommendation);
    
    aiRecommendation.style.display = 'block';
}

// 신뢰도에 따른 CSS 클래스
function getConfidenceClass(confidence) {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
}

// 추천 분개 적용
function applyRecommendation() {
    if (!currentRecommendation) {
        alert('추천 결과가 없습니다.');
        return;
    }
    
    const journalEntry = {
        id: currentJournalId++,
        date: currentRecommendation.date,
        description: currentRecommendation.description,
        entries: [
            {
                account: currentRecommendation.debitAccount,
                amount: currentRecommendation.amount,
                debit: true,
                credit: false
            },
            {
                account: currentRecommendation.creditAccount,
                amount: currentRecommendation.amount,
                debit: false,
                credit: true
            }
        ]
    };
    
    console.log('🔥 생성된 분개 데이터:', journalEntry);
    
    journalEntries.push(journalEntry);
    updateAccountBalances(journalEntry);
    
    // 패턴 학습
    learnFromTransaction(currentRecommendation.description, currentRecommendation.debitAccount, currentRecommendation.creditAccount);
    
    // AI 성능 추적 - 사용자가 추천을 수락했으므로 정확한 것으로 간주
    if (window.aiPerformance && currentRecommendation.confidence) {
        updateAIPerformance(true, currentRecommendation.confidence);
    }
    
    saveData();
    
    // 전체 시스템 실시간 업데이트
    updateAllPages();
    
    // 입력 폼 초기화
    clearSmartInput();
    
    // 성공 메시지와 함께 학습 알림
    const successMessage = '분개가 성공적으로 저장되었습니다!\n네오가 이 패턴을 학습했어요! 🧠\n\n모든 페이지가 자동으로 업데이트되었습니다! ✨';
    alert(successMessage);
    
    // 사용자에게 업데이트된 내용 알림
    showDataSyncNotification();
}

// 패턴 학습
function learnFromTransaction(description, debitAccount, creditAccount) {
    const keywords = extractKeywords(description);
    
    // 기존 패턴 업데이트 또는 새 패턴 생성
    let existingPattern = learnedPatterns.find(pattern => 
        pattern.debitAccount === debitAccount && 
        pattern.creditAccount === creditAccount &&
        pattern.keywords.some(keyword => keywords.includes(keyword))
    );
    
    if (existingPattern) {
        existingPattern.count++;
        // 새로운 키워드 추가
        keywords.forEach(keyword => {
            if (!existingPattern.keywords.includes(keyword)) {
                existingPattern.keywords.push(keyword);
            }
        });
    } else {
        learnedPatterns.push({
            keywords: keywords,
            debitAccount: debitAccount,
            creditAccount: creditAccount,
            count: 1,
            createdAt: new Date().toISOString()
        });
    }
    
    renderLearnedPatterns();
}

// 키워드 추출
function extractKeywords(description) {
    const words = description.toLowerCase()
        .replace(/[^\w\s가-힣]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1);
    
    return [...new Set(words)]; // 중복 제거
}

// 학습된 패턴 렌더링
function renderLearnedPatterns() {
    const learnedPatternsDiv = document.getElementById('learnedPatterns');
    
    if (learnedPatterns.length === 0) {
        learnedPatternsDiv.innerHTML = '<p class="no-data">아직 학습된 패턴이 없습니다. 거래를 입력하시면 패턴을 학습합니다.</p>';
        return;
    }
    
    let html = '';
    learnedPatterns
        .sort((a, b) => b.count - a.count) // 사용 빈도순 정렬
        .forEach(pattern => {
            const debitAccount = accounts.find(acc => acc.code === pattern.debitAccount);
            const creditAccount = accounts.find(acc => acc.code === pattern.creditAccount);
            
            html += `
                <div class="pattern-item">
                    <div>
                        <div class="pattern-description">${pattern.keywords.slice(0, 3).join(', ')}</div>
                        <div class="pattern-classification">
                            차변: ${debitAccount?.name || pattern.debitAccount} → 
                            대변: ${creditAccount?.name || pattern.creditAccount}
                        </div>
                    </div>
                    <span class="pattern-count">${pattern.count}회</span>
                </div>
            `;
        });
    
    learnedPatternsDiv.innerHTML = html;
}

// 추천 수정
function editRecommendation() {
    if (!currentRecommendation) return;
    
    // 기존 분개장으로 이동하여 수정
    showTab('journal');
    openJournalModal();
    
    // 추천 데이터로 폼 채우기
    document.getElementById('journalDate').value = currentRecommendation.date;
    document.getElementById('journalDescription').value = currentRecommendation.description;
    
    // 첫 번째 분개 행에 데이터 설정
    const firstRow = document.querySelector('.journal-entry-row');
    if (firstRow) {
        firstRow.querySelector('.debit-account').value = currentRecommendation.debitAccount;
        firstRow.querySelector('.debit-amount').value = currentRecommendation.amount;
        firstRow.querySelector('.credit-account').value = currentRecommendation.creditAccount;
        firstRow.querySelector('.credit-amount').value = currentRecommendation.amount;
    }
    
    updateJournalBalance();
}

// 추천 초기화
function clearRecommendation() {
    document.getElementById('aiRecommendation').style.display = 'none';
    currentRecommendation = null;
}

// 스마트 입력 폼 초기화
function clearSmartInput() {
    document.getElementById('smartDescription').value = '';
    document.getElementById('smartAmount').value = '';
    document.getElementById('transactionType').value = '';
    clearRecommendation();
}

// 스마트 분류 업데이트 (거래 유형 변경 시)
function updateSmartClassification() {
    const description = document.getElementById('smartDescription').value.trim();
    const amount = parseFloat(document.getElementById('smartAmount').value);
    
    if (description && amount) {
        analyzeTransaction();
    }
}

//==========================================
// 연말 공시 시스템
//==========================================

// 연말 공시 초기화
function initAnnualReport() {
    // 현재 연도 설정
    const currentYear = new Date().getFullYear();
    document.getElementById('reportYear').value = currentYear;
    
    // 국제기준 초기화
    initInternationalStandards();
}

// 🌍 국제회계기준 관련 함수들
function initInternationalStandards() {
    // 기본값 설정
    const savedStandard = localStorage.getItem('zenithus_accounting_standard') || 'k-ifrs';
    const savedCurrency = localStorage.getItem('zenithus_report_currency') || 'KRW';
    
    document.getElementById('accountingStandard').value = savedStandard;
    document.getElementById('reportCurrency').value = savedCurrency;
    
    updateAccountingStandardInfo();
    updateCurrencyFormat();
}

function updateAccountingStandardInfo() {
    const standard = document.getElementById('accountingStandard').value;
    localStorage.setItem('zenithus_accounting_standard', standard);
    
    const standardInfo = {
        'k-ifrs': {
            name: 'K-IFRS (한국채택국제회계기준)',
            description: '한국에서 채택한 국제재무보고기준으로, 상장기업 및 금융회사에 적용',
            format: 'Korean Format'
        },
        'ifrs-sme': {
            name: 'IFRS for SMEs (중소기업국제재무보고기준)',
            description: '중소기업과 비영리단체를 위한 간소화된 국제재무보고기준',
            format: 'International Format'
        },
        'us-gaap': {
            name: 'US GAAP (미국회계기준)',
            description: '미국 일반공정회계원칙, 특히 비영리조직(ASC 958) 적용',
            format: 'US Format'
        },
        'custom': {
            name: '기타 (자체기준)',
            description: '조직 특성에 맞는 자체적인 회계기준',
            format: 'Custom Format'
        }
    };
    
    console.log(`🌍 회계기준 변경: ${standardInfo[standard].name}`);
    
    // ESG 통합보고서 옵션 표시/숨김
    const reportType = document.getElementById('reportType');
    const esgOption = reportType.querySelector('option[value="esg-integrated"]');
    if (standard === 'ifrs-sme' || standard === 'us-gaap') {
        esgOption.style.display = 'block';
    } else {
        esgOption.style.display = 'none';
        if (reportType.value === 'esg-integrated') {
            reportType.value = 'annual';
        }
    }
}

function updateCurrencyFormat() {
    const currency = document.getElementById('reportCurrency').value;
    localStorage.setItem('zenithus_report_currency', currency);
    
    const currencyInfo = {
        'KRW': { symbol: '₩', format: 'ko-KR', name: '한국 원화' },
        'USD': { symbol: '$', format: 'en-US', name: '미국 달러' },
        'EUR': { symbol: '€', format: 'de-DE', name: '유로' },
        'GBP': { symbol: '£', format: 'en-GB', name: '영국 파운드' },
        'CAD': { symbol: 'C$', format: 'en-CA', name: '캐나다 달러' },
        'AUD': { symbol: 'A$', format: 'en-AU', name: '호주 달러' }
    };
    
    console.log(`💱 보고통화 변경: ${currencyInfo[currency].name} (${currencyInfo[currency].symbol})`);
    
    // 실시간 재무제표 업데이트
    if (typeof generateReports === 'function') {
        generateReports();
    }
}

// 국제기준에 따른 통화 포맷팅
function formatInternationalCurrency(amount, currencyCode = null) {
    const currency = currencyCode || localStorage.getItem('zenithus_report_currency') || 'KRW';
    
    const currencyInfo = {
        'KRW': { symbol: '₩', format: 'ko-KR', decimals: 0 },
        'USD': { symbol: '$', format: 'en-US', decimals: 2 },
        'EUR': { symbol: '€', format: 'de-DE', decimals: 2 },
        'GBP': { symbol: '£', format: 'en-GB', decimals: 2 },
        'CAD': { symbol: 'C$', format: 'en-CA', decimals: 2 },
        'AUD': { symbol: 'A$', format: 'en-AU', decimals: 2 }
    };
    
    const info = currencyInfo[currency];
    const formatted = new Intl.NumberFormat(info.format, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: info.decimals,
        maximumFractionDigits: info.decimals
    }).format(amount);
    
    return formatted;
}

// 연말 공시 HTML 생성
function generateAnnualReport() {
    const orgName = document.getElementById('organizationName').value.trim();
    const reportYear = document.getElementById('reportYear').value;
    const reportType = document.getElementById('reportType').value;
    const presidentName = document.getElementById('presidentName').value.trim();
    const treasurerName = document.getElementById('treasurerName').value.trim();
    
    // 🌍 국제기준 정보 수집
    const accountingStandard = document.getElementById('accountingStandard').value;
    const reportCurrency = document.getElementById('reportCurrency').value;
    
    if (!orgName) {
        alert('기관/단체/학회명을 입력해주세요.');
        return;
    }
    
    console.log(`🌍 국제기준 연말공시 생성 시작...`);
    console.log(`📊 회계기준: ${accountingStandard}, 통화: ${reportCurrency}`);
    
    // 재무 데이터 계산
    const totalAssets = calculateTotalByType('asset');
    const totalLiabilities = calculateTotalByType('liability');
    const totalEquity = calculateTotalByType('equity');
    const totalRevenue = calculateTotalByType('revenue');
    const totalExpenses = calculateTotalByType('expense');
    const netIncome = totalRevenue - totalExpenses;
    const finalEquity = totalEquity + netIncome;
    
    // 🌍 국제기준 적용
    const internationalData = {
        orgName,
        reportYear,
        reportType,
        presidentName,
        treasurerName,
        accountingStandard,
        reportCurrency,
        financialData: {
            totalAssets,
            totalLiabilities,
            totalEquity: finalEquity,
            totalRevenue,
            totalExpenses,
            netIncome
        },
        journalEntries: journalEntries.slice(),
        accounts: accounts.slice(),
        
        // 🌍 국제기준 메타데이터
        standardInfo: getAccountingStandardInfo(accountingStandard),
        currencyInfo: getCurrencyInfo(reportCurrency),
        
        // ESG 데이터 (ESG 통합보고서인 경우)
        esgData: reportType === 'esg-integrated' ? generateESGData() : null
    };
    
    // HTML 생성 (국제기준 적용)
    const annualHTML = createInternationalAnnualReportHTML(internationalData);
    
    // 미리보기 표시
    showAnnualPreview(annualHTML);
    
    console.log(`✅ 국제기준 연말공시 생성 완료!`);
}

// 회계기준 정보 반환
function getAccountingStandardInfo(standard) {
    const standardsDB = {
        'k-ifrs': {
            fullName: 'Korean International Financial Reporting Standards',
            localName: 'K-IFRS (한국채택국제회계기준)',
            authority: '한국회계기준원(KASB)',
            applicableFrom: '2011년',
            language: 'Korean',
            compliance: ['IFRS Foundation', 'IASB Standards']
        },
        'ifrs-sme': {
            fullName: 'International Financial Reporting Standard for Small and Medium-sized Entities',
            localName: 'IFRS for SMEs (중소기업국제재무보고기준)',
            authority: 'IFRS Foundation',
            applicableFrom: '2009년',
            language: 'International (Multi-language)',
            compliance: ['IASB', 'IFRS Foundation', '140+ Countries']
        },
        'us-gaap': {
            fullName: 'United States Generally Accepted Accounting Principles',
            localName: 'US GAAP (미국회계기준)',
            authority: 'Financial Accounting Standards Board (FASB)',
            applicableFrom: '1973년',
            language: 'English',
            compliance: ['FASB ASC 958', 'SEC', 'PCAOB']
        },
        'custom': {
            fullName: 'Custom Accounting Framework',
            localName: '기타 (자체기준)',
            authority: 'Organization-specific',
            applicableFrom: 'As defined',
            language: 'As applicable',
            compliance: ['Internal Policies', 'Local Regulations']
        }
    };
    
    return standardsDB[standard] || standardsDB['custom'];
}

// 통화 정보 반환
function getCurrencyInfo(currency) {
    const currenciesDB = {
        'KRW': { 
            name: 'Korean Won', 
            localName: '한국 원화',
            symbol: '₩', 
            format: 'ko-KR', 
            decimals: 0,
            country: 'South Korea',
            isoCode: 'KRW'
        },
        'USD': { 
            name: 'US Dollar', 
            localName: '미국 달러',
            symbol: '$', 
            format: 'en-US', 
            decimals: 2,
            country: 'United States',
            isoCode: 'USD'
        },
        'EUR': { 
            name: 'Euro', 
            localName: '유로',
            symbol: '€', 
            format: 'de-DE', 
            decimals: 2,
            country: 'European Union',
            isoCode: 'EUR'
        },
        'GBP': { 
            name: 'British Pound', 
            localName: '영국 파운드',
            symbol: '£', 
            format: 'en-GB', 
            decimals: 2,
            country: 'United Kingdom',
            isoCode: 'GBP'
        },
        'CAD': { 
            name: 'Canadian Dollar', 
            localName: '캐나다 달러',
            symbol: 'C$', 
            format: 'en-CA', 
            decimals: 2,
            country: 'Canada',
            isoCode: 'CAD'
        },
        'AUD': { 
            name: 'Australian Dollar', 
            localName: '호주 달러',
            symbol: 'A$', 
            format: 'en-AU', 
            decimals: 2,
            country: 'Australia',
            isoCode: 'AUD'
        }
    };
    
    return currenciesDB[currency] || currenciesDB['USD'];
}

// ESG 데이터 생성 (ESG 통합보고서용)
function generateESGData() {
    return {
        environmental: {
            scope: 'Environmental Impact',
            metrics: [
                { name: 'Carbon Footprint', value: 'Not applicable (Financial Institution)', unit: 'tCO2e' },
                { name: 'Energy Efficiency', value: 'Digital-first operations', unit: 'Qualitative' },
                { name: 'Waste Management', value: 'Paperless transactions', unit: 'Qualitative' }
            ]
        },
        social: {
            scope: 'Social Responsibility',
            metrics: [
                { name: 'Community Impact', value: 'SME Financial Transparency', unit: 'Qualitative' },
                { name: 'Stakeholder Engagement', value: 'Open Source Technology', unit: 'Qualitative' },
                { name: 'Accessibility', value: 'Multi-language Support', unit: 'Qualitative' }
            ]
        },
        governance: {
            scope: 'Governance & Ethics',
            metrics: [
                { name: 'Transparency', value: 'Full Data Visibility', unit: 'Score: 10/10' },
                { name: 'Data Security', value: 'Local Storage Only', unit: 'Score: 10/10' },
                { name: 'Compliance', value: 'International Standards', unit: 'Score: 10/10' }
            ]
        }
    };
}

// 🌍 국제기준 연말공시 HTML 템플릿 생성
function createInternationalAnnualReportHTML(data) {
    // 기본 언어 및 형식 결정
    const language = data.currencyInfo.format.startsWith('ko') ? 'ko' : 'en';
    const isESGReport = data.reportType === 'esg-integrated';
    
    // 보고서 타입명
    const reportTypeNames = {
        'annual': language === 'ko' ? '연말 재무공시' : 'Annual Financial Disclosure',
        'general': language === 'ko' ? '정기총회 재무보고' : 'General Assembly Financial Report',
        'audit': language === 'ko' ? '감사보고서' : 'Audit Report',
        'government': language === 'ko' ? '정부제출용 재무제표' : 'Government Financial Statements',
        'esg-integrated': language === 'ko' ? 'ESG 통합보고서' : 'ESG Integrated Report'
    };
    
    const reportTitle = reportTypeNames[data.reportType];
    const generateDate = new Date().toLocaleDateString(data.currencyInfo.format);
    
    // 국제기준 배지 HTML
    const internationalBadges = `
        <div class="international-badge">🌍 ${data.standardInfo.localName}</div>
        <div class="international-badge">💱 ${data.currencyInfo.localName} (${data.currencyInfo.symbol})</div>
        ${isESGReport ? '<div class="international-badge">🌿 ESG Integrated</div>' : ''}
    `;
    
    // 회계기준 정보 섹션
    const standardsSection = `
        <div class="card standards-info" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-left: none;">
            <h2 style="color: white; border-bottom-color: rgba(255,255,255,0.3);">🌍 ${language === 'ko' ? '적용 회계기준' : 'Accounting Standards Applied'}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div>
                    <strong>${language === 'ko' ? '기준명' : 'Standard'}:</strong><br>
                    ${data.standardInfo.fullName}<br>
                    <small>${data.standardInfo.localName}</small>
                </div>
                <div>
                    <strong>${language === 'ko' ? '발행기관' : 'Authority'}:</strong><br>
                    ${data.standardInfo.authority}
                </div>
                <div>
                    <strong>${language === 'ko' ? '보고통화' : 'Reporting Currency'}:</strong><br>
                    ${data.currencyInfo.name} (${data.currencyInfo.symbol})<br>
                    <small>${data.currencyInfo.country}</small>
                </div>
                <div>
                    <strong>${language === 'ko' ? '준수기준' : 'Compliance'}:</strong><br>
                    ${data.standardInfo.compliance.join(', ')}
                </div>
            </div>
        </div>
    `;
    
    // ESG 섹션 (ESG 통합보고서인 경우에만)
    let esgSection = '';
    if (isESGReport && data.esgData) {
        esgSection = `
        <div class="card esg-section" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border-left: none;">
            <h2 style="color: white; border-bottom-color: rgba(255,255,255,0.3);">🌿 ESG ${language === 'ko' ? '성과 및 영향' : 'Performance & Impact'}</h2>
            
            <h3 style="margin-top: 20px;">🌱 Environmental</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                ${data.esgData.environmental.metrics.map(metric => `
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <strong>${metric.name}</strong><br>
                        <small>${metric.value} ${metric.unit}</small>
                    </div>
                `).join('')}
            </div>
            
            <h3 style="margin-top: 20px;">👥 Social</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                ${data.esgData.social.metrics.map(metric => `
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <strong>${metric.name}</strong><br>
                        <small>${metric.value} ${metric.unit}</small>
                    </div>
                `).join('')}
            </div>
            
            <h3 style="margin-top: 20px;">🏛️ Governance</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                ${data.esgData.governance.metrics.map(metric => `
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                        <strong>${metric.name}</strong><br>
                        <small>${metric.value} ${metric.unit}</small>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }
    
    // 국제기준 CSS 추가
    const internationalCSS = `
        .international-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            margin: 10px 5px;
            font-size: 0.9em;
            backdrop-filter: blur(10px);
        }
    `;
    
    // 기존 HTML에 국제기준 요소 추가
    const originalHTML = createAnnualReportHTML(data);
    
    // 배지와 섹션을 추가
    const modifiedHTML = originalHTML
        .replace(
            '<div class="intro-section">',
            internationalBadges + '<div class="intro-section">'
        )
        .replace(
            '</style>',
            internationalCSS + '</style>'
        )
        .replace(
            '<div class="card">',
            standardsSection + esgSection + '<div class="card">'
        )
        .replace(
            `<title>${data.orgName} ${data.reportYear}년`,
            `<title>${data.orgName} ${data.reportYear} ${reportTitle}`
        )
        .replace(
            'NeoGen AI Accounting System',
            `NeoGen AI Accounting System v2.0 (${data.standardInfo.localName})`
        );
    
    return modifiedHTML;
}

// 연말 공시 HTML 템플릿 생성 (기존 버전)
function createAnnualReportHTML(data) {
    const reportTypeNames = {
        'annual': '연말 재무공시',
        'general': '정기총회 재무보고',
        'audit': '감사보고서',
        'government': '정부제출용 재무제표'
    };
    
    const generateDate = new Date().toLocaleDateString('ko-KR');
    
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${data.orgName} ${data.reportYear}년 ${reportTypeNames[data.reportType]}</title>
    <meta name="description" content="${data.orgName} ${data.reportYear}년 재무공시 - 네오젠(NeoGen) by Zenithus Labs로 생성">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .card h2 {
            color: #495057;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .financial-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-item {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border-left: 5px solid #667eea;
        }
        
        .summary-label {
            font-size: 0.9em;
            color: #6c757d;
            margin-bottom: 5px;
        }
        
        .summary-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
        }
        
        .financial-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        .financial-table th,
        .financial-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        
        .financial-table th {
            background: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        
        .financial-table tr:hover {
            background: #f8f9fa;
        }
        
        .amount {
            text-align: right;
            font-weight: 500;
        }
        
        .total-row {
            background: #f8f9fa;
            font-weight: bold;
        }
        
        .footer {
            background: #495057;
            color: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-top: 40px;
        }
        
        .footer p {
            margin-bottom: 10px;
        }
        
        .signature-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-top: 30px;
            text-align: center;
        }
        
        .signature-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e9ecef;
        }
        
        .signature-title {
            font-weight: bold;
            color: #495057;
            margin-bottom: 20px;
        }
        
        .signature-line {
            border-top: 2px solid #495057;
            margin-top: 40px;
            padding-top: 10px;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .financial-summary {
                grid-template-columns: 1fr;
            }
            
            .card {
                padding: 20px;
            }
        }
        
        @media print {
            body {
                background: white;
            }
            
            .container {
                max-width: none;
                padding: 0;
            }
            
            .card {
                box-shadow: none;
                border: 1px solid #ddd;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${data.orgName}</h1>
            <div class="subtitle">${data.reportYear}년 ${reportTypeNames[data.reportType]}</div>
            <div style="margin-top: 15px; font-size: 0.9em; opacity: 0.8;">
                생성일: ${generateDate} | 네오젠(NeoGen) by Zenithus Labs
            </div>
        </header>
        
        <div class="card">
            <h2>📊 재무현황 요약</h2>
            <div class="financial-summary">
                <div class="summary-item">
                    <div class="summary-label">총 자산</div>
                    <div class="summary-value">${formatCurrency(data.financialData.totalAssets)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">총 부채</div>
                    <div class="summary-value">${formatCurrency(data.financialData.totalLiabilities)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">순자산</div>
                    <div class="summary-value">${formatCurrency(data.financialData.totalEquity)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">당기순이익</div>
                    <div class="summary-value" style="color: ${data.financialData.netIncome >= 0 ? '#28a745' : '#dc3545'}">${formatCurrency(data.financialData.netIncome)}</div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>📋 대차대조표</h2>
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>계정과목</th>
                        <th class="amount">금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e3f2fd; font-weight: bold;">
                        <td>【자산】</td>
                        <td class="amount">${formatCurrency(data.financialData.totalAssets)}</td>
                    </tr>
                    ${generateAccountRows(data.accounts, 'asset')}
                    <tr style="background: #fff3e0; font-weight: bold;">
                        <td>【부채】</td>
                        <td class="amount">${formatCurrency(data.financialData.totalLiabilities)}</td>
                    </tr>
                    ${generateAccountRows(data.accounts, 'liability')}
                    <tr style="background: #e8f5e8; font-weight: bold;">
                        <td>【자본】</td>
                        <td class="amount">${formatCurrency(data.financialData.totalEquity)}</td>
                    </tr>
                    ${generateAccountRows(data.accounts, 'equity')}
                    ${data.financialData.netIncome !== 0 ? `
                    <tr>
                        <td style="padding-left: 20px;">당기순이익</td>
                        <td class="amount">${formatCurrency(data.financialData.netIncome)}</td>
                    </tr>` : ''}
                </tbody>
            </table>
        </div>
        
        <div class="card">
            <h2>📈 손익계산서</h2>
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>계정과목</th>
                        <th class="amount">금액</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: #e8f5e8; font-weight: bold;">
                        <td>【수익】</td>
                        <td class="amount">${formatCurrency(data.financialData.totalRevenue)}</td>
                    </tr>
                    ${generateAccountRows(data.accounts, 'revenue')}
                    <tr style="background: #ffebee; font-weight: bold;">
                        <td>【비용】</td>
                        <td class="amount">${formatCurrency(data.financialData.totalExpenses)}</td>
                    </tr>
                    ${generateAccountRows(data.accounts, 'expense')}
                    <tr class="total-row">
                        <td><strong>당기순이익</strong></td>
                        <td class="amount" style="color: ${data.financialData.netIncome >= 0 ? '#28a745' : '#dc3545'}">
                            <strong>${formatCurrency(data.financialData.netIncome)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        ${data.journalEntries.length > 0 ? `
        <div class="card">
            <h2>📝 주요 거래내역</h2>
            <table class="financial-table">
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>내용</th>
                        <th class="amount">금액</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.journalEntries.slice(-10).map(entry => `
                        <tr>
                            <td>${entry.date}</td>
                            <td>${entry.description}</td>
                            <td class="amount">${formatCurrency(entry.entries[0].amount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>` : ''}
        
        <div class="footer">
            <div style="margin-bottom: 20px;">
                <p style="font-size: 1.1em; font-weight: bold;">${data.orgName}</p>
                <p>위 재무제표는 ${data.reportYear}년 회계기간의 재무상태와 경영성과를</p>
                <p>적정하게 표시하고 있음을 확인합니다.</p>
            </div>
            
            <div class="signature-section">
                ${data.presidentName ? `
                <div class="signature-box">
                    <div class="signature-title">회장</div>
                    <div class="signature-line">${data.presidentName}</div>
                </div>` : ''}
                ${data.treasurerName ? `
                <div class="signature-box">
                    <div class="signature-title">재무이사</div>
                    <div class="signature-line">${data.treasurerName}</div>
                </div>` : ''}
                <div class="signature-box">
                    <div class="signature-title">작성일</div>
                    <div class="signature-line">${generateDate}</div>
                </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 0.9em; opacity: 0.7;">
                <p>본 재무보고서는 네오젠(NeoGen) by Zenithus Labs를 통해 생성되었습니다.</p>
                <p>zenithus.co.kr | zenithuslabs.com</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// 계정별 행 생성
function generateAccountRows(accounts, type) {
    return accounts
        .filter(acc => acc.type === type && acc.balance !== 0)
        .map(account => `
            <tr>
                <td style="padding-left: 20px;">${account.name}</td>
                <td class="amount">${formatCurrency(account.balance)}</td>
            </tr>
        `).join('');
}

// 미리보기 표시
function showAnnualPreview(htmlContent) {
    const previewDiv = document.getElementById('annualPreview');
    const iframe = document.getElementById('annualFrame');
    
    // iframe에 HTML 내용 삽입
    iframe.srcdoc = htmlContent;
    
    // 전역 변수에 저장 (다운로드용)
    window.generatedAnnualHTML = htmlContent;
    
    previewDiv.style.display = 'block';
    
    // 미리보기로 스크롤
    previewDiv.scrollIntoView({ behavior: 'smooth' });
}

// HTML 다운로드
function downloadAnnualHTML() {
    if (!window.generatedAnnualHTML) {
        alert('먼저 공시 페이지를 생성해주세요.');
        return;
    }
    
    const orgName = document.getElementById('organizationName').value.trim();
    const reportYear = document.getElementById('reportYear').value;
    const filename = `${orgName}_${reportYear}년_재무공시.html`;
    
    const blob = new Blob([window.generatedAnnualHTML], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('HTML 파일이 다운로드되었습니다!\\n\\n학회 홈페이지에 업로드하시면 됩니다.');
}

// HTML 복사
function copyAnnualHTML() {
    if (!window.generatedAnnualHTML) {
        alert('먼저 공시 페이지를 생성해주세요.');
        return;
    }
    
    navigator.clipboard.writeText(window.generatedAnnualHTML).then(() => {
        alert('HTML 코드가 클립보드에 복사되었습니다!\\n\\n홈페이지 편집기에 붙여넣기 하시면 됩니다.');
    }).catch(() => {
        // 클립보드 API가 지원되지 않는 경우
        const textArea = document.createElement('textarea');
        textArea.value = window.generatedAnnualHTML;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('HTML 코드가 복사되었습니다!');
    });
}

// 새창에서 보기
function openPreviewWindow() {
    if (!window.generatedAnnualHTML) {
        alert('먼저 공시 페이지를 생성해주세요.');
        return;
    }
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(window.generatedAnnualHTML);
    newWindow.document.close();
}

//==========================================
// 피드백 시스템
//==========================================

// 피드백 섹션으로 스크롤
function scrollToFeedback() {
    const feedbackSection = document.querySelector('section');
    if (feedbackSection) {
        feedbackSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // 문의 유형을 버그신고로 미리 설정
        setTimeout(() => {
            const typeSelect = document.querySelector('select[name="type"]');
            if (typeSelect) {
                typeSelect.value = '버그신고';
            }
        }, 500);
    }
}

// 특정 기능 버그 리포트
function reportBug(feature) {
    scrollToFeedback();
    
    setTimeout(() => {
        const typeSelect = document.querySelector('select[name="type"]');
        const messageTextarea = document.querySelector('textarea[name="message"]');
        
        if (typeSelect) typeSelect.value = '버그신고';
        if (messageTextarea) {
            messageTextarea.value = `[${feature}] 기능에서 문제가 발생했습니다.\n\n문제 상황:\n\n\n사용 환경:\n- 브라우저: \n- 운영체제: \n- 기타:`;
            messageTextarea.focus();
        }
    }, 800);
}

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

// 페이지 로드 시 초기화
// AI 성능 모니터링 시스템
function initAIPerformanceMonitoring() {
    // AI 분류 정확도 추적
    window.aiPerformance = {
        totalClassifications: 0,
        correctClassifications: 0,
        userCorrections: 0,
        averageConfidence: 0,
        lastUpdated: Date.now()
    };
    
    // 저장된 성능 데이터 로드
    const savedPerformance = localStorage.getItem('neogen_ai_performance');
    if (savedPerformance) {
        window.aiPerformance = { ...window.aiPerformance, ...JSON.parse(savedPerformance) };
    }
}

// AI 성능 업데이트
function updateAIPerformance(wasCorrect, confidence, userCorrected = false) {
    window.aiPerformance.totalClassifications++;
    if (wasCorrect) window.aiPerformance.correctClassifications++;
    if (userCorrected) window.aiPerformance.userCorrections++;
    
    // 평균 신뢰도 계산
    const currentAvg = window.aiPerformance.averageConfidence;
    const total = window.aiPerformance.totalClassifications;
    window.aiPerformance.averageConfidence = ((currentAvg * (total - 1)) + confidence) / total;
    
    window.aiPerformance.lastUpdated = Date.now();
    
    // 성능 데이터 저장
    localStorage.setItem('neogen_ai_performance', JSON.stringify(window.aiPerformance));
    
    // 성능 기반 네오 메시지
    if (window.aiPerformance.totalClassifications % 10 === 0) {
        const accuracy = (window.aiPerformance.correctClassifications / window.aiPerformance.totalClassifications * 100).toFixed(1);
        showNeoBubble(`🎯 AI 정확도: ${accuracy}%<br>계속 학습하고 있어요!`, 3000);
    }
}

// AI 성능 리포트 생성
function generateAIPerformanceReport() {
    const perf = window.aiPerformance;
    const accuracy = perf.totalClassifications > 0 ? 
        (perf.correctClassifications / perf.totalClassifications * 100).toFixed(1) : 0;
    
    return {
        totalClassifications: perf.totalClassifications,
        accuracy: accuracy,
        averageConfidence: perf.averageConfidence.toFixed(1),
        userCorrections: perf.userCorrections,
        improvementRate: perf.userCorrections > 0 ? 
            ((perf.totalClassifications - perf.userCorrections) / perf.totalClassifications * 100).toFixed(1) : 100
    };
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

// 연말공시 데이터 업데이트
function updateAnnualReportData() {
    const orgNameField = document.getElementById('orgName');
    if (orgNameField && orgNameField.value) {
        // 연말공시 폼이 작성되어 있다면 미리보기 업데이트
        const previewElement = document.getElementById('annualReportContent');
        if (previewElement && previewElement.innerHTML.trim() !== '') {
            // 자동으로 새 데이터로 연말공시 재생성
            setTimeout(() => {
                generateAnnualReport();
                showNeoBubble('📄 연말공시도 최신 데이터로 업데이트되었어요!', 2000);
            }, 500);
        }
    }
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
    const learnedPatterns = document.getElementById('learnedPatterns');
    if (learnedPatterns) {
        learnedPatterns.innerHTML = '<p class="no-data">아직 학습된 패턴이 없습니다.</p>';
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

// 초기화 버튼 직접 연결 확인
function testResetButton() {
    console.log('🔧 초기화 버튼 테스트');
    resetAllData();
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', init);

// 기본 계정 생성 함수 (초기화 후 필요시 사용)
function createDefaultAccounts() {
    if (accounts.length === 0) {
        accounts = [...DEFAULT_ACCOUNTS];
        saveData();
        renderAccounts();
        updateAccountSelects();
        showNeoBubble('✅ 기본 계정과목이 생성되었습니다!', 2000);
        console.log('📋 기본 계정과목 생성 완료');
    } else {
        alert('이미 계정과목이 존재합니다.');
    }
}

// 디버깅용: 전역 함수로 초기화 함수 노출
window.resetAllData = resetAllData;
window.testResetButton = testResetButton;
window.createDefaultAccounts = createDefaultAccounts;
