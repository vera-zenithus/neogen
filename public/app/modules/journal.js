// === NeoGen: Journal Module ===

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
