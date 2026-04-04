// === NeoGen: Reports Module ===

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
