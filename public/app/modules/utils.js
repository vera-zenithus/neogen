// === NeoGen: Utils Module ===

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

// 유형별 총계 계산
function calculateTotalByType(type) {
    return accounts
        .filter(acc => acc.type === type)
        .reduce((sum, acc) => sum + acc.balance, 0);
}

// 계정명 가져오기
function getAccountName(accountCode) {
    const account = accounts.find(acc => acc.code === accountCode);
    return account ? `${account.code} ${account.name}` : accountCode;
}

// 🔧 계정 코드 추출 헬퍼 함수
function extractAccountCode(accountString) {
    if (!accountString) return '';

    // "601 사무용품비" → "601"
    // "101" → "101" (그대로)
    const parts = accountString.toString().trim().split(' ');
    return parts[0];
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
