// === NeoGen: Annual Report Module ===

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

    alert('HTML 파일이 다운로드되었습니다!\n\n학회 홈페이지에 업로드하시면 됩니다.');
}

// HTML 복사
function copyAnnualHTML() {
    if (!window.generatedAnnualHTML) {
        alert('먼저 공시 페이지를 생성해주세요.');
        return;
    }

    navigator.clipboard.writeText(window.generatedAnnualHTML).then(() => {
        alert('HTML 코드가 클립보드에 복사되었습니다!\n\n홈페이지 편집기에 붙여넣기 하시면 됩니다.');
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
