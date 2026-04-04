// === NeoGen: Ledger Module ===

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
