// === NeoGen: Data Module ===

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
