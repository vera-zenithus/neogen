/**
 * 🌍 네오젠 국제화 (i18n) 시스템
 * 다국어 지원을 위한 번역 및 현지화 모듈
 */

class NeoGenI18n {
    constructor() {
        this.currentLanguage = this.getDefaultLanguage();
        this.translations = {};
        this.loadTranslations();
        this.initLanguageSelector();
    }

    /**
     * 기본 언어 감지
     */
    getDefaultLanguage() {
        // URL 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && ['ko', 'en'].includes(urlLang)) {
            return urlLang;
        }

        // localStorage 확인
        const savedLang = localStorage.getItem('neogen_language');
        if (savedLang && ['ko', 'en'].includes(savedLang)) {
            return savedLang;
        }

        // 브라우저 언어 감지
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('ko')) {
            return 'ko';
        }

        // 기본값: 영어 (글로벌 시장 우선)
        return 'en';
    }

    /**
     * 번역 데이터 로드
     */
    loadTranslations() {
        this.translations = {
            ko: {
                // 헤더 및 네비게이션
                'header.title': '🤖 네오젠 (NeoGen)',
                'header.subtitle': 'AI 기반 스마트 회계 관리 시스템',
                'nav.dashboard': '📊 대시보드',
                'nav.accounts': '📋 계정관리',
                'nav.journal': '📝 분개장',
                'nav.ledger': '📚 총계정원장',
                'nav.reports': '📊 재무제표',
                'nav.smart_input': '🤖 스마트입력',
                'nav.annual_report': '🌐 연말공시',
                'nav.feedback': '💬 피드백',

                // 대시보드
                'dashboard.financial_status': '📊 재무현황',
                'dashboard.total_assets': '총 자산',
                'dashboard.total_liabilities': '총 부채',
                'dashboard.net_assets': '자본',
                'dashboard.net_income': '당기순이익',
                'dashboard.recent_transactions': '최근 거래',
                'dashboard.quick_actions': '빠른 작업',
                'dashboard.no_transactions': '아직 거래가 없습니다.',

                // 계정 관리
                'accounts.title': '계정과목 관리',
                'accounts.add_account': '계정 추가',
                'accounts.account_code': '계정코드',
                'accounts.account_name': '계정명',
                'accounts.account_type': '계정유형',
                'accounts.balance': '잔액',
                'accounts.actions': '작업',
                'accounts.select_type': '선택하세요',
                'accounts.placeholder_code': '예: 101',
                'accounts.placeholder_name': '예: 현금',

                // 분개장
                'journal.title': '분개 작성',
                'journal.add_entry': '분개 추가',
                'journal.date': '날짜',
                'journal.description': '적요',
                'journal.debit_account': '차변 계정',
                'journal.credit_account': '대변 계정',
                'journal.amount': '금액',

                // 재무제표
                'reports.title': '재무제표 및 리포트',
                'reports.balance_sheet': '대차대조표',
                'reports.income_statement': '손익계산서',
                'reports.export_pdf': 'PDF 다운로드',
                'reports.export_excel': '엑셀 다운로드',
                'reports.print': '인쇄',
                'reports.test_data': '테스트 데이터',

                // 공통 메시지
                'common.no_data': '데이터가 없습니다.',
                'common.loading': '로딩 중...',
                'common.save': '저장',
                'common.cancel': '취소',
                'common.edit': '수정',
                'common.delete': '삭제',

                // 피드백 & 문의
                'feedback.title': '💬 피드백 & 문의',
                'feedback.name': '이름',
                'feedback.email': '이메일',
                'feedback.type': '문의 유형',
                'feedback.message': '메시지',
                'feedback.type_bug': '버그 신고',
                'feedback.type_feature': '기능 제안',
                'feedback.type_question': '사용 문의',
                'feedback.type_business': '비즈니스 문의',
                'feedback.type_other': '기타',
                'feedback.select_type': '선택해주세요',
                'feedback.submit': '전송',
                'feedback.placeholder_name': '성함을 입력해주세요',
                'feedback.placeholder_email': '이메일 주소를 입력해주세요',
                'feedback.placeholder_message': '문의사항이나 의견을 자세히 적어주세요',

                // 네오젠 소개
                'intro.tagline': 'AI 기반 스마트 회계 관리 시스템',
                'intro.description': '학회, 단체, 개인을 위한 무료 복식부기 회계 솔루션',
                'intro.features': '🤖 AI 자동분류 | 📊 재무제표 생성 | 🌐 연말공시 | 💰 무료 사용',

                // 버튼
                'button.add': '추가',
                'button.edit': '수정',
                'button.delete': '삭제',
                'button.save': '저장',
                'button.cancel': '취소',
                'button.export_pdf': 'PDF 내보내기',
                'button.export_excel': 'Excel 내보내기',
                'button.print': '인쇄',
                'button.generate': '생성',
                'button.download': '다운로드',
                'button.analyze': 'AI 분석',
                'button.apply': '적용',

                // 메시지
                'message.welcome': '네오젠에 오신 것을 환영합니다!',
                'message.data_saved': '데이터가 저장되었습니다.',
                'message.error_occurred': '오류가 발생했습니다.',
                'message.no_data': '데이터가 없습니다.',
                'message.beta_service': '⚠️ 베타 서비스',

                // 폼 라벨
                'form.account_code': '계정코드',
                'form.account_name': '계정명',
                'form.account_type': '계정유형',
                'form.date': '날짜',
                'form.description': '적요',
                'form.amount': '금액',
                'form.debit': '차변',
                'form.credit': '대변',

                // 계정 유형
                'account_type.asset': '자산',
                'account_type.liability': '부채',
                'account_type.equity': '자본',
                'account_type.revenue': '수익',
                'account_type.expense': '비용',

                // 리포트
                'report.balance_sheet': '대차대조표',
                'report.income_statement': '손익계산서',
                'report.trial_balance': '시산표',
                'report.cash_flow': '현금흐름표',

                // 푸터
                'footer.copyright': '© 2025 Zenithus Labs. All rights reserved.',
                'footer.domains': 'zenithus.co.kr | zenithuslabs.com',
                'footer.privacy_policy': '개인정보처리방침',
                'footer.terms_of_service': '이용약관',
                'footer.beta': '⚠️ 베타'
            },

            en: {
                // Header & Navigation
                'header.title': '🤖 NeoGen AI Accounting',
                'header.subtitle': 'Smart Accounting Management System Powered by AI',
                'nav.dashboard': '📊 Dashboard',
                'nav.accounts': '📋 Chart of Accounts',
                'nav.journal': '📝 Journal Entries',
                'nav.ledger': '📚 General Ledger',
                'nav.reports': '📊 Financial Reports',
                'nav.smart_input': '🤖 Smart Input',
                'nav.annual_report': '🌐 Annual Disclosure',
                'nav.feedback': '💬 Feedback',

                // Dashboard
                'dashboard.financial_status': '📊 Financial Overview',
                'dashboard.total_assets': 'Total Assets',
                'dashboard.total_liabilities': 'Total Liabilities',
                'dashboard.net_assets': 'Net Assets',
                'dashboard.net_income': 'Net Income',
                'dashboard.recent_transactions': 'Recent Transactions',
                'dashboard.quick_actions': 'Quick Actions',
                'dashboard.no_transactions': 'No transactions yet.',

                // Accounts Management
                'accounts.title': 'Chart of Accounts',
                'accounts.add_account': 'Add Account',
                'accounts.account_code': 'Account Code',
                'accounts.account_name': 'Account Name',
                'accounts.account_type': 'Account Type',
                'accounts.balance': 'Balance',
                'accounts.actions': 'Actions',
                'accounts.select_type': 'Please select',
                'accounts.placeholder_code': 'e.g., 101',
                'accounts.placeholder_name': 'e.g., Cash',

                // Journal Entries
                'journal.title': 'Journal Entries',
                'journal.add_entry': 'Add Entry',
                'journal.date': 'Date',
                'journal.description': 'Description',
                'journal.debit_account': 'Debit Account',
                'journal.credit_account': 'Credit Account',
                'journal.amount': 'Amount',

                // Financial Reports
                'reports.title': 'Financial Reports',
                'reports.balance_sheet': 'Balance Sheet',
                'reports.income_statement': 'Income Statement',
                'reports.export_pdf': 'Download PDF',
                'reports.export_excel': 'Download Excel',
                'reports.print': 'Print',
                'reports.test_data': 'Test Data',

                // Common Messages
                'common.no_data': 'No data available.',
                'common.loading': 'Loading...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.edit': 'Edit',
                'common.delete': 'Delete',

                // Feedback & Contact
                'feedback.title': '💬 Feedback & Contact',
                'feedback.name': 'Name',
                'feedback.email': 'Email',
                'feedback.type': 'Inquiry Type',
                'feedback.message': 'Message',
                'feedback.type_bug': 'Bug Report',
                'feedback.type_feature': 'Feature Request',
                'feedback.type_question': 'Usage Question',
                'feedback.type_business': 'Business Inquiry',
                'feedback.type_other': 'Other',
                'feedback.select_type': 'Please select',
                'feedback.submit': 'Submit',
                'feedback.placeholder_name': 'Enter your name',
                'feedback.placeholder_email': 'Enter your email address',
                'feedback.placeholder_message': 'Please describe your inquiry or feedback in detail',

                // NeoGen Introduction
                'intro.tagline': 'AI-Powered Smart Accounting Management System',
                'intro.description': 'Free double-entry bookkeeping solution for academic societies, organizations, and individuals',
                'intro.features': '🤖 AI Auto-Classification | 📊 Financial Reports | 🌐 Annual Disclosure | 💰 Free to Use',

                // Buttons
                'button.add': 'Add',
                'button.edit': 'Edit',
                'button.delete': 'Delete',
                'button.save': 'Save',
                'button.cancel': 'Cancel',
                'button.export_pdf': 'Export PDF',
                'button.export_excel': 'Export Excel',
                'button.print': 'Print',
                'button.generate': 'Generate',
                'button.download': 'Download',
                'button.analyze': 'AI Analysis',
                'button.apply': 'Apply',

                // Messages
                'message.welcome': 'Welcome to NeoGen AI Accounting!',
                'message.data_saved': 'Data has been saved successfully.',
                'message.error_occurred': 'An error occurred.',
                'message.no_data': 'No data available.',
                'message.beta_service': '⚠️ Beta Service',

                // Form Labels
                'form.account_code': 'Account Code',
                'form.account_name': 'Account Name',
                'form.account_type': 'Account Type',
                'form.date': 'Date',
                'form.description': 'Description',
                'form.amount': 'Amount',
                'form.debit': 'Debit',
                'form.credit': 'Credit',

                // Account Types
                'account_type.asset': 'Assets',
                'account_type.liability': 'Liabilities',
                'account_type.equity': 'Equity',
                'account_type.revenue': 'Revenue',
                'account_type.expense': 'Expenses',

                // Reports
                'report.balance_sheet': 'Balance Sheet',
                'report.income_statement': 'Income Statement',
                'report.trial_balance': 'Trial Balance',
                'report.cash_flow': 'Cash Flow Statement',

                // Footer
                'footer.copyright': '© 2025 Zenithus Labs. All rights reserved.',
                'footer.domains': 'zenithus.co.kr | zenithuslabs.com',
                'footer.privacy_policy': 'Privacy Policy',
                'footer.terms_of_service': 'Terms of Service',
                'footer.beta': '⚠️ Beta'
            }
        };
    }

    /**
     * 언어 선택기 초기화
     */
    initLanguageSelector() {
        // 언어 선택 버튼이 없으면 생성
        if (!document.getElementById('language-selector')) {
            this.createLanguageSelector();
        }
        
        // 현재 언어로 페이지 번역
        this.translatePage();
    }

    /**
     * 언어 선택기 생성
     */
    createLanguageSelector() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // 한국어 페이지에서는 선택기를 생성하지 않음 (수동 언어 전환기가 이미 있음)
        if (this.currentLanguage === 'ko') return;

        const selectorContainer = document.createElement('div');
        selectorContainer.id = 'global-selectors';
        selectorContainer.className = 'global-selectors';
        
        // 언어 선택기
        const languageSelector = document.createElement('div');
        languageSelector.className = 'selector-group';
        languageSelector.innerHTML = `
            <label>🌍</label>
            <select id="language-select" onchange="i18n.changeLanguage(this.value)">
                <option value="ko" ${this.currentLanguage === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            </select>
        `;

        // 통화 선택기
        const currencySelector = document.createElement('div');
        currencySelector.className = 'selector-group';
        const currentCurrency = this.getUserCurrency();
        const currencies = this.getSupportedCurrencies();
        
        let currencyOptions = '';
        for (const [code, info] of Object.entries(currencies)) {
            currencyOptions += `<option value="${code}" ${currentCurrency === code ? 'selected' : ''}>${info.symbol} ${code}</option>`;
        }
        
        currencySelector.innerHTML = `
            <label>💰</label>
            <select id="currency-select" onchange="i18n.setCurrency(this.value)">
                ${currencyOptions}
            </select>
        `;

        selectorContainer.appendChild(languageSelector);
        selectorContainer.appendChild(currencySelector);
        header.appendChild(selectorContainer);
    }

    /**
     * 번역 텍스트 가져오기
     */
    t(key, defaultValue = key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        return translation || defaultValue;
    }

    /**
     * 언어 변경
     */
    changeLanguage(language) {
        if (!['ko', 'en'].includes(language)) return;
        
        this.currentLanguage = language;
        localStorage.setItem('neogen_language', language);
        this.translatePage();
        
        // URL 업데이트 (히스토리 추가 없이)
        const url = new URL(window.location);
        url.searchParams.set('lang', language);
        window.history.replaceState({}, '', url);
        
        // 이벤트 발생
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language }
        }));
        
        // 계정 목록 다시 렌더링 (언어별 계정명 표시)
        if (typeof renderAccounts === 'function') {
            renderAccounts();
        }
    }

    /**
     * 페이지 번역
     */
    translatePage() {
        // data-i18n 속성을 가진 모든 요소 번역
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // title 속성 번역
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // placeholder 속성 번역
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // 페이지 제목 업데이트
        const pageTitle = this.currentLanguage === 'ko' 
            ? '네오젠 (NeoGen) - AI 회계시스템'
            : 'NeoGen - AI Accounting System';
        document.title = pageTitle;

        // HTML lang 속성 업데이트
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * 현재 언어 가져오기
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 지원 통화 목록
     */
    getSupportedCurrencies() {
        return {
            'USD': { symbol: '$', name: 'US Dollar', locale: 'en-US' },
            'EUR': { symbol: '€', name: 'Euro', locale: 'en-GB' },
            'GBP': { symbol: '£', name: 'British Pound', locale: 'en-GB' },
            'KRW': { symbol: '₩', name: 'Korean Won', locale: 'ko-KR' },
            'CAD': { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
            'AUD': { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
            'JPY': { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
            'CNY': { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' }
        };
    }

    /**
     * 현재 사용자 통화 가져오기
     */
    getUserCurrency() {
        // localStorage에서 사용자 설정 확인
        const savedCurrency = localStorage.getItem('neogen_currency');
        if (savedCurrency && this.getSupportedCurrencies()[savedCurrency]) {
            return savedCurrency;
        }

        // 언어별 기본 통화
        const defaultCurrencies = {
            'ko': 'KRW',
            'en': 'USD'
        };

        return defaultCurrencies[this.currentLanguage] || 'USD';
    }

    /**
     * 통화 설정
     */
    setCurrency(currency) {
        if (this.getSupportedCurrencies()[currency]) {
            localStorage.setItem('neogen_currency', currency);
            window.dispatchEvent(new CustomEvent('currencyChanged', {
                detail: { currency }
            }));
        }
    }

    /**
     * 숫자 포맷팅 (통화별)
     */
    formatCurrency(amount, currency = null, options = {}) {
        if (!currency) {
            currency = this.getUserCurrency();
        }

        const currencyInfo = this.getSupportedCurrencies()[currency];
        if (!currencyInfo) {
            currency = 'USD';
        }

        const locale = currencyInfo?.locale || (this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US');
        
        const defaultOptions = {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
            maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2
        };
        
        return new Intl.NumberFormat(locale, { ...defaultOptions, ...options }).format(amount);
    }

    /**
     * 간단한 금액 표시 (심볼만)
     */
    formatAmount(amount, currency = null) {
        if (!currency) {
            currency = this.getUserCurrency();
        }

        const currencyInfo = this.getSupportedCurrencies()[currency];
        const symbol = currencyInfo?.symbol || '$';
        
        const formattedNumber = new Intl.NumberFormat(
            this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US'
        ).format(amount);
        
        return `${symbol} ${formattedNumber}`;
    }

    /**
     * 날짜 포맷팅 (지역별)
     */
    formatDate(date, options = {}) {
        const locale = this.currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
        const defaultOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    }
}

// 전역 인스턴스 생성
const i18n = new NeoGenI18n();

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    i18n.initLanguageSelector();
});

// ESModule 호환성
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeoGenI18n;
}
