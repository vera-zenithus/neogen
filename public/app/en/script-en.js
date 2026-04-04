/**
 * 🇺🇸 NeoGen English Version - AI Accounting System
 * Zenithus Labs - "At the Zenith, Together"
 */

// Data storage
let accounts = [];
let journalEntries = [];
let currentJournalId = 1;
let learnedPatterns = [];
let currentRecommendation = null;

// Storage keys
const STORAGE_KEYS = {
    ACCOUNTS: 'neogen_accounts_en',
    JOURNAL_ENTRIES: 'neogen_journal_en',
    CURRENT_JOURNAL_ID: 'neogen_current_id_en',
    LEARNED_PATTERNS: 'neogen_patterns_en'
};

// Default Chart of Accounts (English)
const DEFAULT_ACCOUNTS = [
    // Assets
    { code: '101', name: 'Cash', type: 'asset', balance: 0 },
    { code: '102', name: 'Bank Deposits', type: 'asset', balance: 0 },
    { code: '103', name: 'Accounts Receivable', type: 'asset', balance: 0 },
    { code: '104', name: 'Inventory', type: 'asset', balance: 0 },
    { code: '105', name: 'Buildings', type: 'asset', balance: 0 },
    { code: '106', name: 'Equipment', type: 'asset', balance: 0 },
    
    // Liabilities
    { code: '201', name: 'Accounts Payable', type: 'liability', balance: 0 },
    { code: '202', name: 'Short-term Loans', type: 'liability', balance: 0 },
    { code: '203', name: 'Accrued Expenses', type: 'liability', balance: 0 },
    { code: '204', name: 'Long-term Loans', type: 'liability', balance: 0 },
    
    // Equity
    { code: '301', name: 'Share Capital', type: 'equity', balance: 0 },
    { code: '302', name: 'Retained Earnings', type: 'equity', balance: 0 },
    { code: '303', name: 'Net Income', type: 'equity', balance: 0 },
    
    // Revenue
    { code: '401', name: 'Sales Revenue', type: 'revenue', balance: 0 },
    { code: '402', name: 'Other Revenue', type: 'revenue', balance: 0 },
    { code: '403', name: 'Interest Income', type: 'revenue', balance: 0 },
    
    // Expenses
    { code: '501', name: 'Cost of Goods Sold', type: 'expense', balance: 0 },
    { code: '502', name: 'Salaries & Wages', type: 'expense', balance: 0 },
    { code: '503', name: 'Rent Expense', type: 'expense', balance: 0 },
    { code: '504', name: 'Office Supplies', type: 'expense', balance: 0 },
    { code: '505', name: 'Communication Expense', type: 'expense', balance: 0 },
    { code: '506', name: 'Interest Expense', type: 'expense', balance: 0 }
];

// Initialize application
function init() {
    console.log('🚀 Starting NeoGen initialization...');
    
    try {
    loadData();
    initCurrency();
    setupEventListeners();
        
        // Safely render components with DOM checks
        console.log('📈 Initializing dashboard...');
        safeRenderDashboard();
        
        console.log('📊 Initializing accounts...');
    renderAccounts();
        
        console.log('📝 Initializing journal...');
        safeRenderJournalEntries();
        
        console.log('🏦 Initializing ledger...');
        updateAccountSelects();
        
        console.log('📊 Initializing reports...');
    generateReports();
    
    // Create default accounts if none exist
    if (accounts.length === 0) {
            console.log('🏗️ Creating default accounts...');
        accounts = [...DEFAULT_ACCOUNTS];
        saveData();
    }
    
        console.log('✅ NeoGen initialized successfully!');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        console.error('Stack trace:', error.stack);
    }
    
    // Initialize Smart Input date (safe)
    const smartDateField = document.getElementById('smartDate');
    if (smartDateField) {
        smartDateField.value = new Date().toISOString().split('T')[0];
    }
    
    // Initialize Neo (safe)
    try {
    initNeo();
    } catch (error) {
        console.warn('⚠️ Neo initialization skipped:', error.message);
    }
}

// Smart Neo System for English Version
let neoContext = {
    userActions: [],
    currentTab: 'dashboard',
    lastInteraction: Date.now(),
    helpLevel: 'beginner' // beginner, intermediate, advanced
};

// Load data from localStorage
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

// Save data to localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(journalEntries));
    localStorage.setItem(STORAGE_KEYS.CURRENT_JOURNAL_ID, currentJournalId.toString());
    localStorage.setItem(STORAGE_KEYS.LEARNED_PATTERNS, JSON.stringify(learnedPatterns));
}

// Event listeners
function setupEventListeners() {
    // Tab switching
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            e.target.classList.add('active');
            const tabId = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
            document.getElementById(tabId).classList.add('active');
        }
    });

    // Global error handling
    window.addEventListener('error', function(event) {
        console.error('Error occurred:', event.error);
        if (confirm('An error occurred. Would you like to report this bug to help us improve NeoGen?')) {
            reportBug(event.error);
        }
    });
}

// Tab switching function
function showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Update Neo context
    updateNeoContext(tabName);
    
    // Update content based on tab
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

// Safe render dashboard
function safeRenderDashboard() {
    console.log('📈 Safe rendering dashboard...');
    
    const totalAssets = calculateTotal('asset');
    const totalLiabilities = calculateTotal('liability');
    const totalEquity = calculateTotal('equity');
    const netIncome = calculateTotal('revenue') - calculateTotal('expense');
    
    // Safe DOM updates
    const assetsEl = document.getElementById('totalAssets');
    const liabilitiesEl = document.getElementById('totalLiabilities');
    const equityEl = document.getElementById('totalEquity');
    const incomeEl = document.getElementById('netIncome');
    const recentEl = document.getElementById('recentTransactions');
    
    safeSetTextContent('totalAssets', formatCurrency(totalAssets));
    safeSetTextContent('totalLiabilities', formatCurrency(totalLiabilities));
    safeSetTextContent('totalEquity', formatCurrency(totalEquity));
    safeSetTextContent('netIncome', formatCurrency(netIncome));
    
    // Show recent transactions (safe)
    if (journalEntries.length === 0) {
        safeSetInnerHTML('recentTransactions', '<p class="no-data">No transactions yet.</p>');
    } else {
        const recent = journalEntries.slice(-5).reverse();
        let html = '<div class="recent-transactions">';
        recent.forEach(entry => {
            html += `
                <div class="transaction-item">
                    <div class="transaction-date">${entry.date}</div>
                    <div class="transaction-desc">${entry.description}</div>
                    <div class="transaction-amount">${formatCurrency(entry.amount)}</div>
                </div>
            `;
        });
        html += '</div>';
        safeSetInnerHTML('recentTransactions', html);
    }
    
    console.log('✅ Dashboard rendered safely');
}

// Legacy render dashboard (for compatibility)
function renderDashboard() {
    safeRenderDashboard();
}

// Render accounts
function renderAccounts() {
    console.log('📊 Rendering accounts...');
    const tbody = document.getElementById('accountsTableBody');
    if (!tbody) {
        console.warn('⚠️ accountsTableBody not found, skipping accounts rendering');
        return;
    }
    
    if (accounts.length === 0) {
        safeSetInnerHTML('accountsTableBody', '<tr><td colspan="5" class="no-data">No accounts yet.</td></tr>');
            return;
        }
        
        let html = '';
    accounts.forEach(account => {
            html += `
            <tr>
                <td>${account.code}</td>
                <td>${account.name}</td>
                <td>${account.type}</td>
                <td class="amount">${formatCurrency(account.balance)}</td>
                <td>
                    <button class="btn-small btn-primary" onclick="editAccount('${account.code}')">✏️ Edit</button>
                    <button class="btn-small btn-danger" onclick="deleteAccount('${account.code}')">🗑️ Delete</button>
                </td>
            </tr>
            `;
        });
        
    safeSetInnerHTML('accountsTableBody', html);
    console.log('✅ Accounts rendered successfully');
}

// Calculate total for account type
function calculateTotal(type) {
    return accounts
        .filter(acc => acc.type === type)
        .reduce((sum, acc) => sum + acc.balance, 0);
}

// Global currency management
let currentCurrency = 'USD';

// Initialize currency from localStorage
function initCurrency() {
    const savedCurrency = localStorage.getItem('neogen_currency_en');
    if (savedCurrency) {
        currentCurrency = savedCurrency;
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = currentCurrency;
        }
    }
}

// Change currency
function changeCurrency(newCurrency) {
    currentCurrency = newCurrency;
    localStorage.setItem('neogen_currency_en', newCurrency);
    
    // Refresh all displays
    renderDashboard();
    renderAccounts();
    renderJournalEntries();
    generateReports();
    
    // Update any ledger display
    const ledgerSelect = document.getElementById('ledgerAccountSelect');
    if (ledgerSelect && ledgerSelect.value) {
        showLedger();
    }
}

// Get currency info
function getCurrencyInfo(currency = currentCurrency) {
    const currencies = {
        'USD': { symbol: '$', name: 'US Dollar', locale: 'en-US' },
        'EUR': { symbol: '€', name: 'Euro', locale: 'en-GB' },
        'GBP': { symbol: '£', name: 'British Pound', locale: 'en-GB' },
        'KRW': { symbol: '₩', name: 'Korean Won', locale: 'ko-KR' },
        'CAD': { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
        'AUD': { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
        'JPY': { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
        'CNY': { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' }
    };
    
    return currencies[currency] || currencies['USD'];
}

// Format currency with current selection
function formatCurrency(amount) {
    // 🌍 Use international currency if set for annual reports
    const reportCurrency = localStorage.getItem('zenithus_report_currency');
    if (reportCurrency && typeof formatInternationalCurrency === 'function') {
        return formatInternationalCurrency(amount, reportCurrency);
    }
    
    // Use existing currency system for other functions
    const currencyInfo = getCurrencyInfo(currentCurrency);
    
    return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currentCurrency,
        minimumFractionDigits: currentCurrency === 'KRW' || currentCurrency === 'JPY' ? 0 : 2
    }).format(amount);
}

// Account modal functions
function openAccountModal() {
    // Reset to add mode
    document.getElementById('accountCode').readOnly = false;
    const form = document.getElementById('accountForm');
    form.onsubmit = addAccount;
    
    // Reset modal title
    const modalTitle = document.querySelector('#accountModal h3');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Account';
    }
    
    document.getElementById('accountModal').style.display = 'block';
}

function addAccount(event) {
    event.preventDefault();
    
    const code = document.getElementById('accountCode').value;
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;
    
    // Check if account code already exists
    if (accounts.find(acc => acc.code === code)) {
        alert('Account code already exists!');
        return;
    }
    
    // Add new account
    accounts.push({
        code: code,
        name: name,
        type: type,
        balance: 0
    });
    
    saveData();
    renderAccounts();
    updateAccountSelects();
    closeAccountModal();
    
    alert('Account added successfully!');
}

// Edit account function
function editAccount(accountCode) {
    const account = accounts.find(acc => acc.code === accountCode);
    if (!account) {
        alert('Account not found!');
        return;
    }
    
    // Pre-fill the form with existing account data
    document.getElementById('accountCode').value = account.code;
    document.getElementById('accountName').value = account.name;
    document.getElementById('accountType').value = account.type;
    
    // Make code field readonly for editing
    document.getElementById('accountCode').readOnly = true;
    
    // Change form behavior to edit mode
    const form = document.getElementById('accountForm');
    form.onsubmit = function(event) {
        updateAccount(event, accountCode);
    };
    
    // Update modal title
    const modalTitle = document.querySelector('#accountModal h3');
    if (modalTitle) {
        modalTitle.textContent = '✏️ Edit Account';
    }
    
    // Open modal
    document.getElementById('accountModal').style.display = 'block';
}

// Update account function
function updateAccount(event, originalCode) {
    event.preventDefault();
    
    const code = document.getElementById('accountCode').value;
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;
    
    if (!code || !name || !type) {
        alert('Please fill all fields');
        return;
    }
    
    // Find and update the account
    const accountIndex = accounts.findIndex(acc => acc.code === originalCode);
    if (accountIndex !== -1) {
        accounts[accountIndex].name = name;
        accounts[accountIndex].type = type;
        // Note: code is readonly in edit mode
        
        saveData();
        renderAccounts();
        updateAccountSelects();
        closeAccountModal();
        
        alert('Account updated successfully!');
    } else {
        alert('Error updating account!');
    }
}

function closeAccountModal() {
    document.getElementById('accountModal').style.display = 'none';
    document.getElementById('accountForm').reset();
    
    // Reset form to add mode
    document.getElementById('accountCode').readOnly = false;
    const form = document.getElementById('accountForm');
    form.onsubmit = addAccount;
    
    // Reset modal title
    const modalTitle = document.querySelector('#accountModal h3');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Account';
    }
}

// Delete account function
function deleteAccount(accountCode) {
    const account = accounts.find(acc => acc.code === accountCode);
    if (!account) {
        alert('Account not found!');
        return;
    }
    
    // Check if account has transactions
    const hasTransactions = journalEntries.some(entry => 
        entry.entries.some(line => line.accountCode === accountCode)
    );
    
    if (hasTransactions) {
        if (!confirm(`Account "${account.name}" has transaction history. Are you sure you want to delete it?`)) {
            return;
        }
    } else {
        if (!confirm(`Are you sure you want to delete account "${account.name}"?`)) {
            return;
        }
    }
    
    // Remove account from array
    const accountIndex = accounts.findIndex(acc => acc.code === accountCode);
    if (accountIndex !== -1) {
        accounts.splice(accountIndex, 1);
        
        saveData();
        renderAccounts();
        updateAccountSelects();
        
        alert('Account deleted successfully!');
    } else {
        alert('Error deleting account!');
    }
}

// Journal modal functions
function openJournalModal() {
    updateAccountSelects();
    const journalDateField = document.getElementById('journalDate');
    if (journalDateField) {
        journalDateField.value = new Date().toISOString().split('T')[0];
    }
    const journalModal = document.getElementById('journalModal');
    if (journalModal) {
        journalModal.style.display = 'block';
    }
}

function closeJournalModal() {
    const journalModal = document.getElementById('journalModal');
    if (journalModal) {
        journalModal.style.display = 'none';
    }
    const journalForm = document.getElementById('journalForm');
    if (journalForm) {
        journalForm.reset();
    }
}

// Batch Apply functions
function batchApplyToLedger() {
    console.log('🔄 Starting full system batch apply...');
    
    if (journalEntries.length === 0) {
        alert('No journal entries to apply.\nPlease import a file or add journal entries first.');
        return;
    }
    
    const confirmMessage = `🔄 Start full system batch apply?

📋 Processing content:
• Total ${journalEntries.length} journal entries to apply
• 🏦 Update General Ledger
• 📊 Auto-generate Financial Statements (Balance Sheet, Income Statement)
• 📈 Real-time Dashboard update
• 💼 Update Account Management balances
• 🌐 Synchronize Annual Report data

✨ All pages will be completely synchronized!
This process will take a few seconds.`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Show progress
    showBatchApplyProgress();
    
    setTimeout(() => {
        try {
            // 1. Reset all account balances
            console.log('🔄 Step 1: Resetting account balances...');
            accounts.forEach(account => {
                account.balance = 0;
            });
            
            let processedEntries = 0;
            let errorCount = 0;
            
            // 2. Apply all journal entries sequentially
            console.log('📝 Step 2: Starting journal entry application...');
            journalEntries.forEach((entry, index) => {
                try {
                    updateAccountBalances(entry);
                    processedEntries++;
                    console.log(`✅ Journal ${index + 1}/${journalEntries.length} applied successfully`);
                } catch (error) {
                    console.error(`❌ Journal ${index + 1} application failed:`, error);
                    errorCount++;
                }
            });
            
            // 3. Update entire system (all pages)
            console.log('🔄 Step 3: Updating entire system...');
            updateAllPages();
            console.log('✅ Step 3 complete: Full system update');
            
            // 4. Additional financial statement validation and update
            console.log('📊 Step 4: Final financial statement validation...');
            generateReports();
            updateAnnualReportData();
            validateDataConsistency();
            
            // 5. Save data
            console.log('💾 Step 5: Saving data...');
            saveData();
            
            // 6. Completion message
            hideBatchApplyProgress();
            
            const resultMessage = `🎉 Full system batch apply complete!

📊 Processing results:
• ✅ Success: ${processedEntries} journal entries applied
• ❌ Failed: ${errorCount} journal entries
• 💼 Processed accounts: ${accounts.length}

🔄 Updated areas:
• 📈 Dashboard - Latest financial status reflected
• 💼 Account Management - All account balances updated  
• 🏦 General Ledger - Transaction history fully applied
• 📊 Financial Statements - Balance Sheet, Income Statement updated
• 🌐 Annual Report - Data synchronization complete

✨ All pages are completely synchronized! 🎉`;
            
            alert(resultMessage);
            
            // 7. Navigate to Financial Statements tab (to view complete results)
            showTab('reports');
            
            console.log('✅ Full system batch apply complete!');
            
        } catch (error) {
            console.error('❌ Error during batch apply:', error);
            hideBatchApplyProgress();
            alert('Error occurred during batch apply: ' + error.message);
        }
    }, 1000);
}

function showBatchApplyProgress() {
    const progressHtml = `
        <div id="batchApplyModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h3 style="color: #1e293b; margin-bottom: 15px;">Applying to Full System...</h3>
                <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; margin-bottom: 15px; overflow: hidden;">
                    <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981, #8b5cf6); animation: progress-bar 3s ease-in-out infinite;"></div>
                </div>
                <p style="color: #64748b; margin: 0; text-align: left;">
                    🔄 Dashboard, Account Management, General Ledger,<br>
                    📊 Financial Statements, Annual Report - all areas<br>
                    ✨ are being completely synchronized...
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

function hideBatchApplyProgress() {
    const modal = document.getElementById('batchApplyModal');
    if (modal) {
        modal.remove();
    }
}

// System update functions
function updateAllPages() {
    console.log('🔄 Starting full system update...');
    
    try {
        // 1. Update dashboard
        console.log('📈 Updating dashboard...');
        safeRenderDashboard();
        
        // 2. Update account management page  
        console.log('💼 Updating account management page...');
        renderAccounts();
        
        // 3. Update journal
        console.log('📝 Updating journal...');
        safeRenderJournalEntries();
        
        // 4. Update general ledger (if an account is currently selected)
        console.log('🏦 Updating general ledger...');
        updateLedgerSelect();
        const currentLedgerAccount = document.getElementById('ledgerAccountSelect')?.value;
        if (currentLedgerAccount) {
            showLedger();
        }
        
        // 5. Update financial statements (important!)
        console.log('📊 Updating financial statements...');
        generateReports();
        
        // 6. Update annual report data (if form is filled)
        console.log('🌐 Updating annual report...');
        updateAnnualReportData();
        
        // 7. Data validation
        console.log('✅ Validating data consistency...');
        validateDataConsistency();
        
        console.log('✅ Full system update complete!');
        
    } catch (error) {
        console.error('❌ Error during system update:', error);
        alert('Error during system update: ' + error.message);
    }
}

function updateAnnualReportData() {
    try {
        // Update annual report if organization data exists
        const orgNameEl = document.getElementById('organizationName') || document.getElementById('orgName');
        if (orgNameEl && orgNameEl.value) {
            console.log('📋 Annual report data updated');
        }
    } catch (error) {
        console.warn('⚠️ Annual report update error:', error);
    }
}

function validateDataConsistency() {
    try {
        console.log('🔍 Validating data consistency...');
        
        // Check account balance consistency
        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;
        
        accounts.forEach(account => {
            switch(account.type) {
                case 'asset':
                    totalAssets += account.balance;
                    break;
                case 'liability':
                    totalLiabilities += account.balance;
                    break;
                case 'equity':
                    totalEquity += account.balance;
                    break;
            }
        });
        
        const balanceCheck = Math.abs(totalAssets - (totalLiabilities + totalEquity));
        if (balanceCheck > 0.01) {
            console.warn(`⚠️ Balance sheet imbalance detected: ${balanceCheck}`);
        } else {
            console.log('✅ Balance sheet is balanced');
        }
        
    } catch (error) {
        console.warn('⚠️ Data validation error:', error);
    }
}

// Neo Character functions
function toggleNeoBubble() {
    console.log('🤖 Neo clicked!');
    const bubble = document.getElementById('neoBubble');
    console.log('💬 Bubble element:', bubble);
    
    if (bubble) {
        if (bubble.classList.contains('show')) {
            console.log('📴 Hiding bubble');
            bubble.classList.remove('show');
        } else {
            console.log('📢 Showing bubble');
            const contextualMessage = getContextualNeoMessage();
            showNeoBubble(contextualMessage, 5000);
        }
    } else {
        console.error('❌ Neo bubble element not found!');
    }
}

function getContextualNeoMessage() {
    const messages = [
        "Hi! I'm Neo ✨ Need help with bookkeeping?",
        "📊 Want to learn about financial statements?",
        "💡 Try the Smart Input - I'll categorize transactions automatically!",
        "🔍 You can ask me any accounting questions anytime!",
        "📈 Check the Dashboard for your financial overview!",
        "📝 Use Journal Entries to record transactions manually!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
}

function showNeoBubble(message, duration = 3000) {
    console.log('💬 showNeoBubble called with:', message);
    const bubble = document.getElementById('neoBubble');
    console.log('🎯 Bubble found:', bubble);
    
    if (bubble) {
        console.log('✅ Setting bubble message and showing...');
        safeSetInnerHTML('neoBubble', message);
        bubble.classList.add('show');
        console.log('📝 Bubble classes:', bubble.className);
        console.log('🎨 Bubble styles:', window.getComputedStyle(bubble).opacity, window.getComputedStyle(bubble).visibility);
        
        setTimeout(() => {
            console.log('⏰ Hiding bubble after timeout');
            bubble.classList.remove('show');
        }, duration);
    } else {
        console.error('❌ Bubble element not found in showNeoBubble!');
    }
}

function updateAccountSelects() {
    const debitSelect = document.getElementById('debitAccount');
    const creditSelect = document.getElementById('creditAccount');
    const ledgerSelect = document.getElementById('ledgerAccountSelect');
    
    // Sort accounts by code for better organization
    const sortedAccounts = [...accounts].sort((a, b) => a.code.localeCompare(b.code));
    
    const accountOptions = sortedAccounts.map(acc => 
        `<option value="${acc.code}">${acc.code} - ${acc.name}</option>`
    ).join('');
    
    if (debitSelect) {
        debitSelect.innerHTML = '<option value="">Select debit account</option>' + accountOptions;
    }
    if (creditSelect) {
        creditSelect.innerHTML = '<option value="">Select credit account</option>' + accountOptions;
    }
    if (ledgerSelect) {
        ledgerSelect.innerHTML = '<option value="">Select an account to view ledger</option>' + accountOptions;
    }
}

function addJournalEntry(event) {
    event.preventDefault();
    
    // Safe value retrieval
    const dateEl = document.getElementById('journalDate');
    const descEl = document.getElementById('journalDescription');
    const debitEl = document.getElementById('debitAccount');
    const creditEl = document.getElementById('creditAccount');
    const amountEl = document.getElementById('journalAmount');
    
    if (!dateEl || !descEl || !debitEl || !creditEl || !amountEl) {
        alert('Form elements not found! Please refresh the page.');
        return;
    }
    
    const date = dateEl.value;
    const description = descEl.value;
    const debitAccountCode = debitEl.value;
    const creditAccountCode = creditEl.value;
    const amount = parseFloat(amountEl.value);
    
    // Validate
    if (debitAccountCode === creditAccountCode) {
        alert('Debit and credit accounts must be different!');
        return;
    }
    
    // Find accounts
    const debitAccount = accounts.find(acc => acc.code === debitAccountCode);
    const creditAccount = accounts.find(acc => acc.code === creditAccountCode);
    
    if (!debitAccount || !creditAccount) {
        alert('Selected accounts not found!');
        return;
    }
    
    // Create journal entry
    const entry = {
        id: currentJournalId++,
        date: date,
        description: description,
        debitAccount: debitAccountCode,
        creditAccount: creditAccountCode,
        amount: amount,
        entries: [
            {
                account: debitAccountCode,
                accountName: debitAccount.name,
                debit: amount,
                credit: 0
            },
            {
                account: creditAccountCode,
                accountName: creditAccount.name,
                debit: 0,
                credit: amount
            }
        ]
    };
    
    // Update account balances
    if (['asset', 'expense'].includes(debitAccount.type)) {
        debitAccount.balance += amount;
    } else {
        debitAccount.balance -= amount;
    }
    
    if (['liability', 'equity', 'revenue'].includes(creditAccount.type)) {
        creditAccount.balance += amount;
    } else {
        creditAccount.balance -= amount;
    }
    
    journalEntries.push(entry);
    saveData();
    renderJournalEntries();
    renderDashboard();
    closeJournalModal();
    
    alert('Journal entry added successfully!');
}

// Render journal entries
// Safe render journal entries
function safeRenderJournalEntries() {
    console.log('📝 Safe rendering journal entries...');
    const tbody = document.getElementById('journalTableBody');
    
    if (!tbody) {
        console.warn('⚠️ journalTableBody not found, skipping journal rendering');
        return;
    }
    
    if (journalEntries.length === 0) {
        safeSetInnerHTML('journalTableBody', '<tr><td colspan="6" class="no-data">No journal entries yet.</td></tr>');
        return;
    }
    
    let html = '';
    journalEntries.forEach(entry => {
        entry.entries.forEach((entryLine, index) => {
            html += `
                <tr>
                    ${index === 0 ? `<td rowspan="2">${entry.date}</td>` : ''}
                    <td>${entryLine.accountName}</td>
                    ${index === 0 ? `<td rowspan="2">${entry.description}</td>` : ''}
                    <td>${entryLine.debit > 0 ? formatCurrency(entryLine.debit) : ''}</td>
                    <td>${entryLine.credit > 0 ? formatCurrency(entryLine.credit) : ''}</td>
                    ${index === 0 ? `<td rowspan="2"><button class="btn btn-small btn-danger" onclick="deleteJournalEntry(${entry.id})">Delete</button></td>` : ''}
                </tr>
            `;
        });
    });
    
    safeSetInnerHTML('journalTableBody', html);
    console.log('✅ Journal entries rendered safely');
}

// Legacy function (for compatibility)
function renderJournalEntries() {
    safeRenderJournalEntries();
}

// Delete journal entry
function deleteJournalEntry(entryId) {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
        return;
    }
    
    const entryIndex = journalEntries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) return;
    
    const entry = journalEntries[entryIndex];
    
    // Reverse account balance changes
    entry.entries.forEach(entryLine => {
        const account = accounts.find(acc => acc.code === entryLine.account);
        if (account) {
            if (entryLine.debit > 0) {
                if (['asset', 'expense'].includes(account.type)) {
                    account.balance -= entryLine.debit;
                } else {
                    account.balance += entryLine.debit;
                }
            }
            if (entryLine.credit > 0) {
                if (['liability', 'equity', 'revenue'].includes(account.type)) {
                    account.balance -= entryLine.credit;
                } else {
                    account.balance += entryLine.credit;
                }
            }
        }
    });
    
    journalEntries.splice(entryIndex, 1);
    saveData();
    renderJournalEntries();
    renderDashboard();
}

// Ledger functions
function updateLedgerSelect() {
    updateAccountSelects();
}

function showLedger() {
    const accountCode = document.getElementById('ledgerAccountSelect').value;
    const ledgerContent = document.getElementById('ledgerContent');
    
    if (!accountCode) {
        ledgerContent.innerHTML = '<p class="no-data">Please select an account to view its general ledger.</p>';
        return;
    }
    
    const account = accounts.find(acc => acc.code === accountCode);
    if (!account) {
        ledgerContent.innerHTML = '<p class="no-data">Account not found.</p>';
        return;
    }
    
    // Get transactions for this account
    const transactions = [];
    journalEntries.forEach(entry => {
        entry.entries.forEach(entryLine => {
            if (entryLine.account === accountCode) {
                transactions.push({
                    date: entry.date,
                    description: entry.description,
                    debit: entryLine.debit,
                    credit: entryLine.credit
                });
            }
        });
    });
    
    // Sort transactions by date
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let html = `
        <div class="ledger-header">
            <h4>General Ledger - ${account.code} ${account.name}</h4>
            <p class="account-type">Account Type: ${account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
            <p class="current-balance">Current Balance: ${formatCurrency(account.balance)}</p>
        </div>
    `;
    
    if (transactions.length === 0) {
        html += '<p class="no-data">No transactions recorded for this account yet.</p>';
    } else {
        html += `
            <div class="ledger-table-container">
                <table class="ledger-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction Description</th>
                            <th>Debit Amount</th>
                            <th>Credit Amount</th>
                            <th>Running Balance</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        let runningBalance = 0;
        transactions.forEach((trans, index) => {
            if (trans.debit > 0) {
                if (['asset', 'expense'].includes(account.type)) {
                    runningBalance += trans.debit;
                } else {
                    runningBalance -= trans.debit;
                }
            }
            if (trans.credit > 0) {
                if (['liability', 'equity', 'revenue'].includes(account.type)) {
                    runningBalance += trans.credit;
                } else {
                    runningBalance -= trans.credit;
                }
            }
            
            html += `
                <tr class="${index % 2 === 0 ? 'even-row' : 'odd-row'}">
                    <td>${new Date(trans.date).toLocaleDateString('en-US')}</td>
                    <td>${trans.description}</td>
                    <td class="amount-debit">${trans.debit > 0 ? formatCurrency(trans.debit) : '-'}</td>
                    <td class="amount-credit">${trans.credit > 0 ? formatCurrency(trans.credit) : '-'}</td>
                    <td class="amount-balance ${runningBalance >= 0 ? 'positive' : 'negative'}">${formatCurrency(runningBalance)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <div class="ledger-summary">
                <p><strong>Total Transactions:</strong> ${transactions.length}</p>
                <p><strong>Final Balance:</strong> ${formatCurrency(runningBalance)}</p>
            </div>
        `;
    }
    
    ledgerContent.innerHTML = html;
}

// Report generation
function generateReports() {
    console.log('📊 Generating reports...');
    generateBalanceSheet();
    generateIncomeStatement();
    // generateSocietyReport(); // Commented out as societyReport element doesn't exist in English page
    console.log('✅ Reports generated successfully');
}

function generateBalanceSheet() {
    console.log('🏛️ Generating balance sheet...');
    const balanceSheetDiv = document.getElementById('balanceSheet');
    if (!balanceSheetDiv) {
        console.warn('⚠️ balanceSheet element not found, skipping balance sheet generation');
        return;
    }
    
    const assets = accounts.filter(acc => acc.type === 'asset' && acc.balance !== 0);
    const liabilities = accounts.filter(acc => acc.type === 'liability' && acc.balance !== 0);
    const equity = accounts.filter(acc => acc.type === 'equity' && acc.balance !== 0);
    
    let html = `
        <div class="report-header">
            <h4>📊 Balance Sheet</h4>
            <p class="report-date">As of ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    `;
    
    // Assets Section
    html += '<div class="report-section"><h5>💰 ASSETS</h5><table class="report-table">';
    let totalAssets = 0;
    
    if (assets.length === 0) {
        html += '<tr><td colspan="2" class="no-data">No asset accounts with balances</td></tr>';
    } else {
        assets.sort((a, b) => a.code.localeCompare(b.code)).forEach(acc => {
            html += `<tr><td>${acc.code} - ${acc.name}</td><td class="amount">${formatCurrency(acc.balance)}</td></tr>`;
            totalAssets += acc.balance;
        });
    }
    html += `<tr class="total-row"><td><strong>Total Assets</strong></td><td class="amount"><strong>${formatCurrency(totalAssets)}</strong></td></tr></table></div>`;
    
    // Liabilities Section
    html += '<div class="report-section"><h5>💳 LIABILITIES</h5><table class="report-table">';
    let totalLiabilities = 0;
    
    if (liabilities.length === 0) {
        html += '<tr><td colspan="2" class="no-data">No liability accounts with balances</td></tr>';
    } else {
        liabilities.sort((a, b) => a.code.localeCompare(b.code)).forEach(acc => {
            html += `<tr><td>${acc.code} - ${acc.name}</td><td class="amount">${formatCurrency(acc.balance)}</td></tr>`;
            totalLiabilities += acc.balance;
        });
    }
    html += `<tr class="total-row"><td><strong>Total Liabilities</strong></td><td class="amount"><strong>${formatCurrency(totalLiabilities)}</strong></td></tr></table></div>`;
    
    // Equity Section
    html += '<div class="report-section"><h5>🏛️ NET ASSETS (EQUITY)</h5><table class="report-table">';
    let totalEquity = 0;
    
    if (equity.length === 0) {
        html += '<tr><td colspan="2" class="no-data">No equity accounts with balances</td></tr>';
    } else {
        equity.sort((a, b) => a.code.localeCompare(b.code)).forEach(acc => {
            html += `<tr><td>${acc.code} - ${acc.name}</td><td class="amount">${formatCurrency(acc.balance)}</td></tr>`;
            totalEquity += acc.balance;
        });
    }
    
    const netIncome = calculateTotal('revenue') - calculateTotal('expense');
    if (netIncome !== 0) {
        html += `<tr><td>Current Year Net Income</td><td class="amount ${netIncome >= 0 ? 'positive' : 'negative'}">${formatCurrency(netIncome)}</td></tr>`;
        totalEquity += netIncome;
    }
    
    html += `<tr class="total-row"><td><strong>Total Net Assets</strong></td><td class="amount"><strong>${formatCurrency(totalEquity)}</strong></td></tr></table></div>`;
    
    // Accounting Equation Check
    const difference = totalAssets - (totalLiabilities + totalEquity);
    if (Math.abs(difference) > 0.01) {
        html += `<div class="balance-check error">⚠️ Balance Sheet Error: Assets - (Liabilities + Equity) = ${formatCurrency(difference)}</div>`;
    } else {
        html += `<div class="balance-check success">✅ Balance Sheet is balanced: Assets = Liabilities + Equity</div>`;
    }
    
    safeSetInnerHTML('balanceSheet', html);
    console.log('✅ Balance sheet generated successfully');
}

function generateIncomeStatement() {
    console.log('📈 Generating income statement...');
    const incomeStatementDiv = document.getElementById('incomeStatement');
    if (!incomeStatementDiv) {
        console.warn('⚠️ incomeStatement element not found, skipping income statement generation');
        return;
    }
    
    const revenue = accounts.filter(acc => acc.type === 'revenue' && acc.balance !== 0);
    const expenses = accounts.filter(acc => acc.type === 'expense' && acc.balance !== 0);
    
    let html = `
        <div class="report-header">
            <h4>📈 Income Statement</h4>
            <p class="report-date">For the Year Ended ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
    `;
    
    // Revenue Section
    html += '<div class="report-section"><h5>💰 REVENUE</h5><table class="report-table">';
    let totalRevenue = 0;
    
    if (revenue.length === 0) {
        html += '<tr><td colspan="2" class="no-data">No revenue recorded yet</td></tr>';
    } else {
        revenue.sort((a, b) => a.code.localeCompare(b.code)).forEach(acc => {
            html += `<tr><td>${acc.code} - ${acc.name}</td><td class="amount">${formatCurrency(acc.balance)}</td></tr>`;
            totalRevenue += acc.balance;
        });
    }
    html += `<tr class="total-row"><td><strong>Total Revenue</strong></td><td class="amount"><strong>${formatCurrency(totalRevenue)}</strong></td></tr></table></div>`;
    
    // Expenses Section
    html += '<div class="report-section"><h5>💸 EXPENSES</h5><table class="report-table">';
    let totalExpenses = 0;
    
    if (expenses.length === 0) {
        html += '<tr><td colspan="2" class="no-data">No expenses recorded yet</td></tr>';
    } else {
        expenses.sort((a, b) => a.code.localeCompare(b.code)).forEach(acc => {
            html += `<tr><td>${acc.code} - ${acc.name}</td><td class="amount">${formatCurrency(acc.balance)}</td></tr>`;
            totalExpenses += acc.balance;
        });
    }
    html += `<tr class="total-row"><td><strong>Total Expenses</strong></td><td class="amount"><strong>${formatCurrency(totalExpenses)}</strong></td></tr></table></div>`;
    
    // Net Income Section
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0;
    
    html += `
        <div class="report-section net-income-section">
            <table class="report-table">
                <tr class="net-income-row ${netIncome >= 0 ? 'profit' : 'loss'}">
                    <td><strong>NET ${netIncome >= 0 ? 'INCOME' : 'LOSS'}</strong></td>
                    <td class="amount"><strong>${formatCurrency(netIncome)}</strong></td>
                </tr>
            </table>
            <div class="income-analysis">
                <p><strong>Profit Margin:</strong> ${profitMargin}%</p>
                <p><strong>Performance:</strong> ${netIncome >= 0 ? '✅ Profitable' : '⚠️ Loss'}</p>
                ${totalRevenue > 0 && totalExpenses > 0 ? 
                    `<p><strong>Expense Ratio:</strong> ${((totalExpenses / totalRevenue) * 100).toFixed(1)}%</p>` : 
                    ''
                }
            </div>
        </div>
    `;
    
    safeSetInnerHTML('incomeStatement', html);
    console.log('✅ Income statement generated successfully');
}

function generateSocietyReport() {
    console.log('📋 Generating society report...');
    const societyReportDiv = document.getElementById('societyReport');
    if (!societyReportDiv) {
        console.warn('⚠️ societyReport element not found, skipping society report generation');
        return;
    }
    
    const totalRevenue = calculateTotal('revenue');
    const totalExpenses = calculateTotal('expense');
    const netIncome = totalRevenue - totalExpenses;
    const totalAssets = calculateTotal('asset');
    const totalLiabilities = calculateTotal('liability');
    const netAssets = totalAssets - totalLiabilities;
    
    let html = `
        <div class="report-header">
            <h4>🏛️ Organization Summary</h4>
            <p class="report-date">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div class="report-section">
            <h5>📊 Financial Position</h5>
            <table class="report-table">
                <tr><td>Total Revenue</td><td class="amount positive">${formatCurrency(totalRevenue)}</td></tr>
                <tr><td>Total Expenses</td><td class="amount">${formatCurrency(totalExpenses)}</td></tr>
                <tr class="net-income-row ${netIncome >= 0 ? 'profit' : 'loss'}">
                    <td><strong>Net ${netIncome >= 0 ? 'Income' : 'Loss'}</strong></td>
                    <td class="amount"><strong>${formatCurrency(netIncome)}</strong></td>
                </tr>
                <tr><td>Total Assets</td><td class="amount">${formatCurrency(totalAssets)}</td></tr>
                <tr><td>Total Liabilities</td><td class="amount">${formatCurrency(totalLiabilities)}</td></tr>
                <tr class="total-row">
                    <td><strong>Net Assets</strong></td>
                    <td class="amount"><strong>${formatCurrency(netAssets)}</strong></td>
                </tr>
            </table>
        </div>
        
        <div class="report-section">
            <h5>📈 Key Performance Metrics</h5>
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${journalEntries.length}</div>
                    <div class="metric-label">Total Transactions</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${accounts.filter(acc => acc.balance !== 0).length}</div>
                    <div class="metric-label">Active Accounts</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value ${netIncome >= 0 ? 'positive' : 'negative'}">${totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0}%</div>
                    <div class="metric-label">Profit Margin</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}%</div>
                    <div class="metric-label">Expense Ratio</div>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h5>💡 Financial Health Indicators</h5>
            <div class="health-indicators">
                <div class="indicator ${netIncome >= 0 ? 'good' : 'warning'}">
                    <span class="indicator-icon">${netIncome >= 0 ? '✅' : '⚠️'}</span>
                    <span>Profitability: ${netIncome >= 0 ? 'Positive' : 'Negative'}</span>
                </div>
                <div class="indicator ${netAssets >= 0 ? 'good' : 'warning'}">
                    <span class="indicator-icon">${netAssets >= 0 ? '✅' : '⚠️'}</span>
                    <span>Net Assets: ${netAssets >= 0 ? 'Positive' : 'Negative'}</span>
                </div>
                <div class="indicator ${journalEntries.length >= 5 ? 'good' : 'info'}">
                    <span class="indicator-icon">${journalEntries.length >= 5 ? '✅' : 'ℹ️'}</span>
                    <span>Transaction Activity: ${journalEntries.length >= 5 ? 'Active' : 'Getting Started'}</span>
                </div>
            </div>
        </div>
        
        <div class="report-section">
            <h5>🎯 Quick Insights</h5>
            <div class="insights">
                ${totalRevenue > 0 ? 
                    `<p>• Organization generated <strong>${formatCurrency(totalRevenue)}</strong> in total revenue</p>` : 
                    '<p>• No revenue recorded yet - consider adding membership fees or other income sources</p>'
                }
                ${totalExpenses > 0 ? 
                    `<p>• Total expenses amount to <strong>${formatCurrency(totalExpenses)}</strong></p>` : 
                    '<p>• No expenses recorded yet - start tracking operational costs</p>'
                }
                ${journalEntries.length > 0 ? 
                    `<p>• ${journalEntries.length} transactions have been recorded in the system</p>` : 
                    '<p>• Ready to start recording transactions - use the Smart Input feature for easy entry</p>'
                }
            </div>
        </div>
    `;
    
    societyReportDiv.innerHTML = html;
    console.log('✅ Society report generated successfully');
}

// Export functions
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('NeoGen Financial Reports', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    // Get report content
    const balanceSheet = document.getElementById('balanceSheet').innerText;
    const incomeStatement = document.getElementById('incomeStatement').innerText;
    
    doc.setFontSize(16);
    doc.text('Balance Sheet', 20, 50);
    doc.setFontSize(10);
    
    const lines = balanceSheet.split('\n');
    let yPosition = 60;
    
    lines.forEach(line => {
        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
    });
    
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Income Statement', 20, 20);
    doc.setFontSize(10);
    
    const incomeLines = incomeStatement.split('\n');
    yPosition = 30;
    
    incomeLines.forEach(line => {
        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
    });
    
    doc.save('neogen_financial_reports.pdf');
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    // Accounts sheet
    const accountsData = accounts.map(acc => ({
        'Account Code': acc.code,
        'Account Name': acc.name,
        'Account Type': acc.type,
        'Balance': acc.balance
    }));
    const accountsWS = XLSX.utils.json_to_sheet(accountsData);
    XLSX.utils.book_append_sheet(wb, accountsWS, 'Accounts');
    
    // Journal entries sheet
    const journalData = [];
    journalEntries.forEach(entry => {
        entry.entries.forEach(line => {
            journalData.push({
                'Date': entry.date,
                'Description': entry.description,
                'Account': line.accountName,
                'Debit': line.debit,
                'Credit': line.credit
            });
        });
    });
    const journalWS = XLSX.utils.json_to_sheet(journalData);
    XLSX.utils.book_append_sheet(wb, journalWS, 'Journal Entries');
    
    // Summary sheet
    const summaryData = [
        { 'Item': 'Total Assets', 'Amount': calculateTotal('asset') },
        { 'Item': 'Total Liabilities', 'Amount': calculateTotal('liability') },
        { 'Item': 'Total Equity', 'Amount': calculateTotal('equity') },
        { 'Item': 'Total Revenue', 'Amount': calculateTotal('revenue') },
        { 'Item': 'Total Expenses', 'Amount': calculateTotal('expense') },
        { 'Item': 'Net Income', 'Amount': calculateTotal('revenue') - calculateTotal('expense') }
    ];
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');
    
    XLSX.writeFile(wb, 'neogen_accounting_data.xlsx');
}

function printReports() {
    const printWindow = window.open('', '_blank');
    const reportContent = `
        <html>
        <head>
            <title>NeoGen Financial Reports</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1, h2, h3, h4 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total-row { background-color: #e8f4f8; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>NeoGen Financial Reports</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            
            <h2>Balance Sheet</h2>
            ${document.getElementById('balanceSheet').innerHTML}
            
            <h2>Income Statement</h2>
            ${document.getElementById('incomeStatement').innerHTML}
            
            <h2>Society Report</h2>
            ${document.getElementById('societyReport').innerHTML}
        </body>
        </html>
    `;
    
    printWindow.document.write(reportContent);
    printWindow.document.close();
    printWindow.print();
}

// Load test data
function loadTestData() {
    if (!confirm('This will load sample data for demonstration. Continue?')) {
        return;
    }
    
    // Add comprehensive test transactions for academic society
    const testTransactions = [
        { date: '2024-01-15', desc: 'Annual membership fees collected', debit: '101', credit: '401', amount: 5000 },
        { date: '2024-01-20', desc: 'Office supplies and stationery', debit: '504', credit: '101', amount: 250 },
        { date: '2024-02-01', desc: 'Conference venue rental', debit: '503', credit: '101', amount: 1200 },
        { date: '2024-02-15', desc: 'Workshop registration fees', debit: '101', credit: '401', amount: 8500 },
        { date: '2024-03-01', desc: 'Keynote speaker honorarium', debit: '502', credit: '101', amount: 2000 },
        { date: '2024-03-15', desc: 'Research grant received', debit: '101', credit: '402', amount: 15000 },
        { date: '2024-04-01', desc: 'Internet and communication', debit: '505', credit: '101', amount: 180 },
        { date: '2024-04-10', desc: 'Publication printing costs', debit: '504', credit: '101', amount: 800 },
        { date: '2024-05-01', desc: 'Travel expenses for conference', debit: '504', credit: '101', amount: 650 },
        { date: '2024-05-15', desc: 'Corporate sponsorship received', debit: '101', credit: '402', amount: 10000 }
    ];
    
    testTransactions.forEach(trans => {
        const debitAccount = accounts.find(acc => acc.code === trans.debit);
        const creditAccount = accounts.find(acc => acc.code === trans.credit);
        
        if (debitAccount && creditAccount) {
            const entry = {
                id: currentJournalId++,
                date: trans.date,
                description: trans.desc,
                debitAccount: trans.debit,
                creditAccount: trans.credit,
                amount: trans.amount,
                entries: [
                    {
                        account: trans.debit,
                        accountName: debitAccount.name,
                        debit: trans.amount,
                        credit: 0
                    },
                    {
                        account: trans.credit,
                        accountName: creditAccount.name,
                        debit: 0,
                        credit: trans.amount
                    }
                ]
            };
            
            // Update balances
            if (['asset', 'expense'].includes(debitAccount.type)) {
                debitAccount.balance += trans.amount;
            } else {
                debitAccount.balance -= trans.amount;
            }
            
            if (['liability', 'equity', 'revenue'].includes(creditAccount.type)) {
                creditAccount.balance += trans.amount;
            } else {
                creditAccount.balance -= trans.amount;
            }
            
            journalEntries.push(entry);
        }
    });
    
    saveData();
    renderDashboard();
    renderAccounts();
    renderJournalEntries();
    generateReports();
    
    alert('Test data loaded successfully!');
}

// Smart Input functions
function initSmartInput() {
    console.log('Smart Input initialized');
}

function analyzeTransaction() {
    // Safe value retrieval
    const descEl = document.getElementById('smartDescription');
    const amountEl = document.getElementById('smartAmount');
    const dateEl = document.getElementById('smartDate');
    const typeEl = document.getElementById('smartType');
    
    if (!descEl || !amountEl || !dateEl || !typeEl) {
        alert('Smart input form elements not found! Please check the page.');
        return;
    }
    
    const description = descEl.value;
    const amount = parseFloat(amountEl.value);
    const date = dateEl.value;
    const type = typeEl.value;
    
    if (!description || !amount || !date) {
        alert('Please enter description, amount, and date');
        return;
    }
    
    // Neo appears! Analysis starts
    showNeoAnalyzing();
    
    // AI analysis with delay for Neo effect
    setTimeout(() => {
        analyzeWithAI(description, amount, type);
    }, 1500);
}

function analyzeWithAI(description, amount, type) {
    // Advanced AI classification for English
    let recommendedDebit = '';
    let recommendedCredit = '';
    let confidence = 0;
    
    const keywords = {
        // Office & Administrative
        'office supplies': { debit: '504', credit: '101', confidence: 0.95 },
        'supplies': { debit: '504', credit: '101', confidence: 0.9 },
        'stationery': { debit: '504', credit: '101', confidence: 0.9 },
        'paper': { debit: '504', credit: '101', confidence: 0.85 },
        'printer': { debit: '504', credit: '101', confidence: 0.9 },
        
        // Rent & Facilities
        'rent': { debit: '503', credit: '101', confidence: 0.95 },
        'lease': { debit: '503', credit: '101', confidence: 0.9 },
        'venue': { debit: '503', credit: '101', confidence: 0.9 },
        'facility': { debit: '503', credit: '101', confidence: 0.85 },
        'room': { debit: '503', credit: '101', confidence: 0.8 },
        
        // Salaries & Personnel
        'salary': { debit: '502', credit: '101', confidence: 0.95 },
        'wage': { debit: '502', credit: '101', confidence: 0.95 },
        'honorarium': { debit: '502', credit: '101', confidence: 0.9 },
        'speaker fee': { debit: '502', credit: '101', confidence: 0.9 },
        'consultant': { debit: '502', credit: '101', confidence: 0.85 },
        
        // Revenue - Membership & Fees
        'membership': { debit: '101', credit: '401', confidence: 0.9 },
        'dues': { debit: '101', credit: '401', confidence: 0.9 },
        'registration': { debit: '101', credit: '401', confidence: 0.85 },
        'conference fee': { debit: '101', credit: '401', confidence: 0.9 },
        'workshop fee': { debit: '101', credit: '401', confidence: 0.85 },
        'seminar': { debit: '101', credit: '401', confidence: 0.8 },
        'training': { debit: '101', credit: '401', confidence: 0.8 },
        
        // Revenue - General
        'donation': { debit: '101', credit: '402', confidence: 0.9 },
        'grant': { debit: '101', credit: '402', confidence: 0.9 },
        'sponsorship': { debit: '101', credit: '402', confidence: 0.85 },
        'funding': { debit: '101', credit: '402', confidence: 0.8 },
        
        // Communication & Technology
        'phone': { debit: '505', credit: '101', confidence: 0.9 },
        'internet': { debit: '505', credit: '101', confidence: 0.9 },
        'telecommunication': { debit: '505', credit: '101', confidence: 0.85 },
        'website': { debit: '505', credit: '101', confidence: 0.8 },
        
        // Travel & Events
        'travel': { debit: '504', credit: '101', confidence: 0.8 },
        'transportation': { debit: '504', credit: '101', confidence: 0.8 },
        'hotel': { debit: '504', credit: '101', confidence: 0.85 },
        'meal': { debit: '504', credit: '101', confidence: 0.8 },
        'catering': { debit: '504', credit: '101', confidence: 0.85 }
    };
    
    for (const [keyword, recommendation] of Object.entries(keywords)) {
        if (description.toLowerCase().includes(keyword)) {
            recommendedDebit = recommendation.debit;
            recommendedCredit = recommendation.credit;
            confidence = recommendation.confidence;
            break;
        }
    }
    
    if (recommendedDebit && recommendedCredit) {
        const debitAccount = accounts.find(acc => acc.code === recommendedDebit);
        const creditAccount = accounts.find(acc => acc.code === recommendedCredit);
        
        currentRecommendation = {
            description,
            amount,
            debitAccount: recommendedDebit,
            creditAccount: recommendedCredit,
            confidence
        };
        
        hideNeoAnalyzing();
        displayRecommendation(debitAccount, creditAccount, confidence);
        showNeoSuccess();
    } else {
        hideNeoAnalyzing();
        showNeoBubble('Hmm, I need more specific details to classify this. 🤔', 3000);
    }
}

// Neo analysis display functions
function showNeoAnalyzing() {
    const neoDiv = document.getElementById('neoAnalyzing');
    if (neoDiv) {
        neoDiv.style.display = 'block';
        setTimeout(() => {
            neoDiv.classList.add('show');
        }, 100);
    }
}

function hideNeoAnalyzing() {
    const neoDiv = document.getElementById('neoAnalyzing');
    if (neoDiv) {
        neoDiv.classList.remove('show');
        setTimeout(() => {
            neoDiv.style.display = 'none';
        }, 300);
    }
}

function showNeoSuccess() {
    const successMessages = [
        'Analysis complete! 🎉 Check out my recommendation!',
        'Perfect! AI classified it smartly! ✨',
        'Great job! Your accounting skills are improving! 💪',
        'Excellent! Now save it and try the next transaction! 🚀'
    ];
    const message = successMessages[Math.floor(Math.random() * successMessages.length)];
    showNeoBubble(message, 3000);
    
    // Track user action
    trackUserAction('smart_input_success');
}

// Neo bubble control
function showNeoBubble(message, duration = 5000) {
    console.log(`🤖 Neo: ${message}`);
    if (safeSetInnerHTML('neoBubble', message)) {
    const bubble = document.getElementById('neoBubble');
    if (bubble) {
        bubble.classList.add('show');
        
        if (duration > 0) {
            setTimeout(() => {
                bubble.classList.remove('show');
            }, duration);
            }
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

// Neo initial greeting
function initNeo() {
    setTimeout(() => {
        showNeoBubble('Hi! I\'m Neo ✨<br>Let me help you with AI-powered accounting!', 4000);
    }, 2000);
    
    // Check usage after 5 minutes
    setTimeout(() => {
        if (neoContext.userActions.length === 0) {
            showNeoBubble('Haven\'t tried our features yet? 😊<br>🚀 Start with <strong>AI Smart Input</strong>!', 5000);
        }
    }, 300000); // 5 minutes
}

// Neo AI Search Feature (English Version - Vera's Idea)
function handleNeoSearchEn(event) {
    if (event.key === 'Enter') {
        const query = document.getElementById('neoSearchInputEn').value.trim();
        if (query) {
            searchWithNeoEn(query);
        }
    }
}

function searchWithNeoEn(query) {
    const resultDiv = document.getElementById('neoSearchResultEn');
    const inputField = document.getElementById('neoSearchInputEn');
    
    // Show searching (safe)
    if (resultDiv) {
    resultDiv.style.display = 'block';
        safeSetInnerHTML('neoSearchResultEn', '🤖 Neo is searching...');
    }
    
    // Neo character animation
    const neoHelper = document.getElementById('neoHelper');
    if (neoHelper) {
        neoHelper.classList.add('analyzing');
    }
    
    // AI search simulation (simple keyword matching)
    setTimeout(() => {
        const answer = getNeoAnswerEn(query);
        safeSetInnerHTML('neoSearchResultEn', `🤖 <strong>Neo's Answer:</strong><br><br>${answer}`);
        
        // End animation
        if (neoHelper) {
            neoHelper.classList.remove('analyzing');
        }
        
        // Clear input field
        inputField.value = '';
        
        // Track user action
        trackUserAction('neo_search');
        
        // Floating Neo message
        setTimeout(() => {
            showNeoBubble('Was that helpful? 😊<br>Feel free to ask more questions anytime!', 3000);
        }, 1000);
        
    }, 2000); // 2 second delay for AI effect
}

function getNeoAnswerEn(query) {
    const lowerQuery = query.toLowerCase();
    
    // Accounting terminology dictionary
    const answers = {
        'double-entry': `<strong>Double-entry bookkeeping</strong> is an accounting method where every transaction is recorded in <strong>Debit</strong> and <strong>Credit</strong> sides.<br><br>
        📊 <strong>Core Principles:</strong><br>
        • Total Debits = Total Credits (always balanced)<br>
        • Every transaction affects at least 2 accounts<br>
        • Assets increase = Debit, Liabilities/Equity increase = Credit<br><br>
        💡 <strong>Example:</strong> Purchase office supplies for $100 cash<br>
        Debit: Office Supplies $100<br>
        Credit: Cash $100`,
        
        'journal': `<strong>Journal Entry</strong> is recording transactions in double-entry format by dividing them into debit and credit sides.<br><br>
        📝 <strong>Journal Entry Process:</strong><br>
        1. Understand the transaction<br>
        2. Identify affected accounts<br>
        3. Determine increase/decrease for each account<br>
        4. Place in debit/credit sides<br><br>
        🎯 <strong>NeoGen Tip:</strong> Use AI Smart Input for automatic journal entry recommendations!`,
        
        'account': `<strong>Chart of Accounts</strong> are accounting categories used to classify transactions.<br><br>
        📋 <strong>5 Basic Categories:</strong><br>
        🏦 <strong>Assets</strong>: Cash, Accounts Receivable, Inventory, etc.<br>
        💳 <strong>Liabilities</strong>: Accounts Payable, Loans, etc.<br>
        💰 <strong>Equity</strong>: Capital, Retained Earnings, etc.<br>
        📈 <strong>Revenue</strong>: Sales, Interest Income, etc.<br>
        📉 <strong>Expenses</strong>: Cost of Goods Sold, Operating Expenses, etc.<br><br>
        💡 Each account has a unique account code for management!`,
        
        'debit': `<strong>Debit</strong> is the left side of double-entry bookkeeping.<br><br>
        📊 <strong>Debit is used for:</strong><br>
        • Asset increases<br>
        • Liability decreases<br>
        • Equity decreases<br>
        • Expense increases<br>
        • Revenue decreases<br><br>
        🎯 <strong>Memory trick:</strong> "Assets↑, Expenses↑ = Debit"`,
        
        'credit': `<strong>Credit</strong> is the right side of double-entry bookkeeping.<br><br>
        📊 <strong>Credit is used for:</strong><br>
        • Asset decreases<br>
        • Liability increases<br>
        • Equity increases<br>
        • Revenue increases<br>
        • Expense decreases<br><br>
        🎯 <strong>Memory trick:</strong> "Liabilities↑, Equity↑, Revenue↑ = Credit"`,
        
        'financial statements': `<strong>Financial Statements</strong> are accounting reports showing financial position and performance.<br><br>
        📋 <strong>Main Financial Statements:</strong><br>
        📊 <strong>Balance Sheet</strong>: Assets, Liabilities, and Equity status<br>
        📈 <strong>Income Statement</strong>: Revenue, Expenses, and Net Income<br>
        💸 <strong>Cash Flow Statement</strong>: Cash inflows and outflows<br>
        💰 <strong>Statement of Equity</strong>: Changes in equity<br><br>
        🚀 <strong>In NeoGen,</strong> financial statements are automatically generated from your entries!`,
        
        'bookkeeping': `<strong>Bookkeeping</strong> is the systematic recording of financial transactions.<br><br>
        📚 <strong>Key Components:</strong><br>
        • Recording daily transactions<br>
        • Maintaining accurate records<br>
        • Following accounting principles<br>
        • Preparing financial reports<br><br>
        🤖 <strong>NeoGen makes it easy</strong> with AI-powered automation and smart recommendations!`,
        
        'balance sheet': `<strong>Balance Sheet</strong> shows a company's financial position at a specific point in time.<br><br>
        ⚖️ <strong>Balance Sheet Equation:</strong><br>
        Assets = Liabilities + Equity<br><br>
        📊 <strong>Components:</strong><br>
        🏦 <strong>Assets:</strong> What the company owns<br>
        💳 <strong>Liabilities:</strong> What the company owes<br>
        💰 <strong>Equity:</strong> Owner's stake in the company<br><br>
        💡 The balance sheet must always balance!`,
        
        'income statement': `<strong>Income Statement</strong> shows a company's revenues and expenses over a period of time.<br><br>
        📈 <strong>Key Components:</strong><br>
        • Revenue (Income)<br>
        • Expenses (Costs)<br>
        • Net Income (Profit/Loss)<br><br>
        🎯 <strong>Formula:</strong><br>
        Net Income = Revenue - Expenses<br><br>
        📊 Also called "Profit & Loss Statement" or "P&L"`
    };
    
    // Keyword matching
    for (const [keyword, answer] of Object.entries(answers)) {
        if (lowerQuery.includes(keyword)) {
            return answer;
        }
    }
    
    // General question pattern matching
    if (lowerQuery.includes('what') || lowerQuery.includes('define')) {
        return `🤔 Please ask about specific accounting terms!<br><br>
        📚 <strong>Suggested searches:</strong><br>
        • double-entry<br>
        • journal<br>
        • accounts<br>
        • debit<br>
        • credit<br>
        • financial statements<br><br>
        💡 Example: "What is double-entry bookkeeping?"`;
    }
    
    if (lowerQuery.includes('how') || lowerQuery.includes('method')) {
        return `📖 <strong>How to use NeoGen:</strong><br><br>
        1️⃣ Enter transaction details in <strong>AI Smart Input</strong><br>
        2️⃣ AI automatically recommends journal entries<br>
        3️⃣ Review and save the recommended entries<br>
        4️⃣ Check results in Financial Reports<br><br>
        🎯 <strong>Key tip:</strong> The more specific your transaction description, the more accurate the journal entry recommendations!`;
    }
    
    // Default response
    return `Sorry, I couldn't find information about "${query}". 😅<br><br>
    🔍 <strong>Try searching for:</strong><br>
    • double-entry, journal, accounts<br>
    • debit, credit, financial statements<br>
    • assets, liabilities, equity, revenue, expenses<br><br>
    💬 Or leave a question in the feedback section for a detailed answer!`;
}

// User action tracking
function trackUserAction(action) {
    neoContext.userActions.push({
        action: action,
        timestamp: Date.now(),
        tab: neoContext.currentTab
    });
    
    // Auto-adjust user level
    if (neoContext.userActions.length > 10) {
        neoContext.helpLevel = 'intermediate';
    }
    if (neoContext.userActions.length > 50) {
        neoContext.helpLevel = 'advanced';
    }
    
    // Contextual reactions
    reactToUserAction(action);
}

function reactToUserAction(action) {
    switch (action) {
        case 'smart_input_success':
            // Encourage consecutive successes
            const recentSuccesses = neoContext.userActions.filter(a => 
                a.action === 'smart_input_success' && 
                Date.now() - a.timestamp < 300000 // 5 minutes
            ).length;
            
            if (recentSuccesses >= 3) {
                setTimeout(() => {
                    showNeoBubble('Wow! You\'re doing great! 🔥<br>Check out the Financial Reports too!', 4000);
                }, 2000);
            }
            break;
            
        case 'first_entry':
            setTimeout(() => {
                showNeoBubble('First transaction completed! 🎉<br>The AI will learn from this and get faster!', 3000);
            }, 1000);
            break;
    }
}

// Tab change detection
function updateNeoContext(tabName) {
    neoContext.currentTab = tabName;
    neoContext.lastInteraction = Date.now();
    
    // Provide help for beginners on tab change
    if (neoContext.helpLevel === 'beginner' && neoContext.userActions.length < 5) {
        setTimeout(() => {
            const message = getBeginnerGuideMessage(tabName);
            showNeoBubble(message, 4000);
        }, 1000);
    }
}

// Contextual Neo message system
function getContextualNeoMessage() {
    const currentTab = neoContext.currentTab;
    const userLevel = neoContext.helpLevel;
    const actionCount = neoContext.userActions.length;
    
    // Beginner step-by-step guide
    if (userLevel === 'beginner' && actionCount < 3) {
        return getBeginnerGuideMessage(currentTab);
    }
    
    // Tab-specific messages
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
        'dashboard': '👋 Welcome to NeoGen!<br>🚀 Start with <strong>AI Smart Input</strong>!',
        'smart-input': '💡 This is the core feature!<br>Just enter transaction details and <strong>AI creates journal entries automatically!</strong>',
        'journal': '📝 This is the Journal!<br>All your transaction records are here!',
        'accounts': '📊 Account Management page!<br>Add new accounts or modify existing ones!',
        'ledger': '📈 General Ledger!<br>See all transactions for specific accounts!',
        'reports': '📋 Financial Reports page!<br>Export to PDF or Excel!',
        'annual': '🌟 Annual Disclosure page!<br>A special feature for transparent organization management!'
    };
    
    return beginnerMessages[currentTab] || beginnerMessages['dashboard'];
}

function getSmartInputTips() {
    const tips = [
        '💡 <strong>Tip:</strong> Try "Office supplies purchase $50" - be specific!',
        '🎯 <strong>Secret:</strong> The more accurate your description and amount, the smarter AI gets!',
        '✨ <strong>Know-how:</strong> Including vendor names makes it even more precise!',
        '🚀 <strong>Pro tip:</strong> Repeated similar transactions help AI learn patterns!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getJournalTips() {
    const tips = [
        '📝 <strong>Did you know?</strong> Double-click journal entries to edit them!',
        '🔍 <strong>Fun fact:</strong> Everything is sorted by date for easy management!',
        '💼 <strong>Pro tip:</strong> Regular reviews help catch mistakes early!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getAccountsTips() {
    const tips = [
        '📊 <strong>Account Management tip:</strong> Add frequently used accounts first!',
        '🎯 <strong>Suggestion:</strong> For associations, "Membership Revenue", "Event Expenses" are useful!',
        '✨ <strong>Pro tip:</strong> Clear account names make searching easier later!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getLedgerTips() {
    const tips = [
        '📈 <strong>Ledger usage:</strong> Check Cash account frequently!',
        '💰 <strong>Check point:</strong> Negative balances might indicate issues!',
        '🔍 <strong>Analysis tip:</strong> Monthly patterns help with budget planning!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getReportsTips() {
    const reportCount = journalEntries.length;
    if (reportCount === 0) {
        return '📋 <strong>No data yet!</strong><br>Start by entering transactions in AI Smart Input!';
    }
    
    const tips = [
        '📊 <strong>Reports ready!</strong> Save as PDF for presentations!',
        '💼 <strong>Pro tip:</strong> Regular financial reports help track organization health!',
        `🎉 <strong>Currently ${reportCount} transactions recorded!</strong> Great transparent management!`
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getAnnualTips() {
    const tips = [
        '🌟 <strong>Annual Disclosure!</strong> The symbol of transparent organizations!',
        '🏆 <strong>Unique feature:</strong> NeoGen is the only accounting system with this!',
        '💡 <strong>Usage tip:</strong> Post on your website to boost organization credibility!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function getGeneralTips() {
    const tips = [
        '😊 Hello! How\'s your accounting work going?<br>Feel free to ask if you need help!',
        '🚀 Have you tried AI Smart Input?<br>It\'s really convenient!',
        '💙 How do you like accounting with NeoGen?<br>Send feedback for better features!',
        '⭐ Keep up the great transparent management!'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

function displayRecommendation(debitAccount, creditAccount, confidence) {
    const recommendationDiv = document.getElementById('aiRecommendation');
    const contentDiv = document.getElementById('recommendationContent');
    
    contentDiv.innerHTML = `
        <div class="recommendation-item">
            <strong>Confidence:</strong> ${(confidence * 100).toFixed(0)}%
        </div>
        <div class="recommendation-item">
            <strong>Debit:</strong> ${debitAccount.code} - ${debitAccount.name}
        </div>
        <div class="recommendation-item">
            <strong>Credit:</strong> ${creditAccount.code} - ${creditAccount.name}
        </div>
        <div class="recommendation-item">
            <strong>Amount:</strong> ${formatCurrency(currentRecommendation.amount)}
        </div>
    `;
    
    recommendationDiv.style.display = 'block';
}

function applyRecommendation() {
    if (!currentRecommendation) return;
    
    const debitAccount = accounts.find(acc => acc.code === currentRecommendation.debitAccount);
    const creditAccount = accounts.find(acc => acc.code === currentRecommendation.creditAccount);
    
    const entry = {
        id: currentJournalId++,
        date: new Date().toISOString().split('T')[0],
        description: currentRecommendation.description,
        debitAccount: currentRecommendation.debitAccount,
        creditAccount: currentRecommendation.creditAccount,
        amount: currentRecommendation.amount,
        entries: [
            {
                account: currentRecommendation.debitAccount,
                accountName: debitAccount.name,
                debit: currentRecommendation.amount,
                credit: 0
            },
            {
                account: currentRecommendation.creditAccount,
                accountName: creditAccount.name,
                debit: 0,
                credit: currentRecommendation.amount
            }
        ]
    };
    
    // Update balances
    if (['asset', 'expense'].includes(debitAccount.type)) {
        debitAccount.balance += currentRecommendation.amount;
    } else {
        debitAccount.balance -= currentRecommendation.amount;
    }
    
    if (['liability', 'equity', 'revenue'].includes(creditAccount.type)) {
        creditAccount.balance += currentRecommendation.amount;
    } else {
        creditAccount.balance -= currentRecommendation.amount;
    }
    
    journalEntries.push(entry);
    saveData();
    renderDashboard();
    renderJournalEntries();
    clearRecommendation();
    clearSmartInput();
    
    alert('Transaction added successfully!');
}

function editRecommendation() {
    alert('Edit feature not implemented yet. Please use manual journal entry.');
}

function clearRecommendation() {
    document.getElementById('aiRecommendation').style.display = 'none';
    currentRecommendation = null;
}

function clearSmartInput() {
    // Safe clearing
    const descEl = document.getElementById('smartDescription');
    const amountEl = document.getElementById('smartAmount');
    const typeEl = document.getElementById('smartType');
    
    if (descEl) descEl.value = '';
    if (amountEl) amountEl.value = '';
    if (typeEl) typeEl.value = '';
    
    clearRecommendation();
}

// Annual Report functions
function initAnnualReport() {
    const reportYearEl = document.getElementById('reportYear');
    if (reportYearEl) {
        reportYearEl.value = new Date().getFullYear();
    }
    
    // Initialize international standards
    initInternationalStandards();
}

// 🌍 International accounting standards functions  
function initInternationalStandards() {
    // Set default values
    const savedStandard = localStorage.getItem('zenithus_accounting_standard') || 'ifrs-sme';
    const savedCurrency = localStorage.getItem('zenithus_report_currency') || 'USD';
    
    const standardEl = document.getElementById('accountingStandard');
    const currencyEl = document.getElementById('reportCurrency');
    
    if (standardEl) standardEl.value = savedStandard;
    if (currencyEl) currencyEl.value = savedCurrency;
    
    updateAccountingStandardInfo();
    updateCurrencyFormat();
}

function updateAccountingStandardInfo() {
    const standardEl = document.getElementById('accountingStandard');
    if (!standardEl) {
        console.warn('⚠️ accountingStandard element not found');
        return;
    }
    
    const standard = standardEl.value;
    localStorage.setItem('zenithus_accounting_standard', standard);
    
    console.log(`🌍 Accounting standard changed: ${standard}`);
    
    // Show/hide ESG integrated report option
    const reportType = document.getElementById('reportType');
    if (reportType) {
        const esgOption = reportType.querySelector('option[value="esg-integrated"]');
        if (esgOption) {
            if (standard === 'ifrs-sme' || standard === 'us-gaap') {
                esgOption.style.display = 'block';
            } else {
                esgOption.style.display = 'none';
                if (reportType.value === 'esg-integrated') {
                    reportType.value = 'annual';
                }
            }
        }
    }
}

function updateCurrencyFormat() {
    const currencyEl = document.getElementById('reportCurrency');
    if (!currencyEl) {
        console.warn('⚠️ reportCurrency element not found');
        return;
    }
    
    const currency = currencyEl.value;
    localStorage.setItem('zenithus_report_currency', currency);
    
    console.log(`💱 Reporting currency changed: ${currency}`);
    
    // Update financial statements in real-time
    if (typeof generateReports === 'function') {
        generateReports();
    }
}

// International currency formatting
function formatInternationalCurrency(amount, currencyCode = null) {
    const currency = currencyCode || localStorage.getItem('zenithus_report_currency') || 'USD';
    
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

function generateAnnualReport() {
    // Safe value retrieval for annual report
    const orgNameEl = document.getElementById('organizationName') || document.getElementById('orgName');
    const reportYearEl = document.getElementById('reportYear');
    const reportTypeEl = document.getElementById('reportType') || document.getElementById('orgType');
    const presidentEl = document.getElementById('presidentName');
    const treasurerEl = document.getElementById('treasurerName');
    
    if (!orgNameEl || !reportYearEl) {
        alert('Required form elements not found! Please check if you are on the Annual Report tab.');
        return;
    }
    
    const orgName = orgNameEl.value;
    const reportYear = reportYearEl.value;
    const orgType = reportTypeEl ? reportTypeEl.value : 'organization';
    const presidentName = presidentEl ? presidentEl.value : '';
    const treasurerName = treasurerEl ? treasurerEl.value : '';
    
    if (!orgName || !presidentName || !treasurerName) {
        alert('Please fill in all required fields: Organization Name, President/Chair, and Treasurer');
        return;
    }
    
    // Generate comprehensive HTML report
    const reportHTML = createAnnualReportHTML(orgName, reportYear, orgType, presidentName, treasurerName);
    
    // Store for download
    window.generatedAnnualReport = reportHTML;
    
    // Show preview with enhanced content
    const previewContent = `
        <div class="annual-preview-header">
            <h4>✅ Annual Financial Report Generated Successfully!</h4>
            <p>Professional transparency report ready for publication</p>
        </div>
        <div class="preview-content">${reportHTML}</div>
    `;
    
    document.getElementById('annualReportContent').innerHTML = previewContent;
    document.getElementById('annualReportPreview').style.display = 'block';
    
    // Show action buttons
    document.querySelector('button[onclick="downloadAnnualHTML()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="copyAnnualHTML()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="showAnnualPreview()"]').style.display = 'inline-block';
    
    // Success message
    alert(`Annual financial report for ${orgName} (${reportYear}) has been generated successfully!`);
}

function createAnnualReportHTML(orgName, year, type, president, treasurer) {
    const totalRevenue = calculateTotal('revenue');
    const totalExpenses = calculateTotal('expense');
    const netIncome = totalRevenue - totalExpenses;
    const totalAssets = calculateTotal('asset');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${orgName} - ${year} Annual Financial Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f7fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-top: 30px; }
        .report-header { text-align: center; margin-bottom: 40px; padding: 20px; background: #ecf0f1; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #3498db; color: white; }
        .total-row { background-color: #e8f6f3; font-weight: bold; }
        .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
        .signature-box { text-align: center; width: 200px; }
        .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="report-header">
            <h1>${orgName}</h1>
            <h2>${year} Annual Financial Report</h2>
            <p><strong>Organization Type:</strong> ${type}</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary-box">
            <h2>Executive Summary</h2>
            <p>This comprehensive annual financial report presents the financial position and performance of <strong>${orgName}</strong> for the fiscal year ${year}. The report has been prepared in accordance with generally accepted accounting principles (GAAP) to ensure complete transparency and accountability to our members, stakeholders, and the public.</p>
            <p>This report demonstrates our organization's commitment to financial transparency and responsible stewardship of resources entrusted to us by our community.</p>
        </div>

        <h2>Financial Overview</h2>
        <table>
            <tr><th>Item</th><th>Amount (USD)</th></tr>
            <tr><td>Total Revenue</td><td>${formatCurrency(totalRevenue)}</td></tr>
            <tr><td>Total Expenses</td><td>${formatCurrency(totalExpenses)}</td></tr>
            <tr class="total-row"><td>Net Income</td><td>${formatCurrency(netIncome)}</td></tr>
            <tr><td>Total Assets</td><td>${formatCurrency(totalAssets)}</td></tr>
        </table>

        <h2>Revenue Breakdown</h2>
        <table>
            <tr><th>Revenue Source</th><th>Amount (USD)</th></tr>
            ${accounts.filter(acc => acc.type === 'revenue' && acc.balance > 0)
              .map(acc => `<tr><td>${acc.name}</td><td>${formatCurrency(acc.balance)}</td></tr>`).join('')}
            <tr class="total-row"><td><strong>Total Revenue</strong></td><td><strong>${formatCurrency(totalRevenue)}</strong></td></tr>
        </table>

        <h2>Expense Breakdown</h2>
        <table>
            <tr><th>Expense Category</th><th>Amount (USD)</th></tr>
            ${accounts.filter(acc => acc.type === 'expense' && acc.balance > 0)
              .map(acc => `<tr><td>${acc.name}</td><td>${formatCurrency(acc.balance)}</td></tr>`).join('')}
            <tr class="total-row"><td><strong>Total Expenses</strong></td><td><strong>${formatCurrency(totalExpenses)}</strong></td></tr>
        </table>

        <h2>Asset Summary</h2>
        <table>
            <tr><th>Asset Type</th><th>Amount (USD)</th></tr>
            ${accounts.filter(acc => acc.type === 'asset' && acc.balance > 0)
              .map(acc => `<tr><td>${acc.name}</td><td>${formatCurrency(acc.balance)}</td></tr>`).join('')}
            <tr class="total-row"><td><strong>Total Assets</strong></td><td><strong>${formatCurrency(totalAssets)}</strong></td></tr>
        </table>

        <div class="summary-box">
            <h2>Notes to Financial Statements</h2>
            <p>1. These financial statements have been prepared using standard accounting principles.</p>
            <p>2. All amounts are presented in US Dollars (USD).</p>
            <p>3. This report covers the period from January 1, ${year} to December 31, ${year}.</p>
            <p>4. Generated using NeoGen AI Accounting System by Zenithus Labs.</p>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line">
                    <strong>${president}</strong><br>
                    President/Chair
                </div>
            </div>
            <div class="signature-box">
                <div class="signature-line">
                    <strong>${treasurer}</strong><br>
                    Treasurer
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Generated by <strong>NeoGen AI Accounting System</strong></p>
            <p>© ${new Date().getFullYear()} Zenithus Labs | zenithus.co.kr | zenithuslabs.com</p>
            <p>This report demonstrates our commitment to financial transparency and responsible governance.</p>
        </div>
    </div>
</body>
</html>`;
}

function downloadAnnualHTML() {
    if (!window.generatedAnnualReport) {
        alert('Please generate an annual report first using the form above.');
        return;
    }
    
    const orgName = document.getElementById('orgName').value || 'Organization';
    const reportYear = document.getElementById('reportYear').value || new Date().getFullYear();
    const filename = `${orgName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_annual_report_${reportYear}.html`;
    
    const blob = new Blob([window.generatedAnnualReport], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    alert(`Annual report downloaded as: ${filename}\n\nYou can now upload this file to your organization's website!`);
}

function copyAnnualHTML() {
    if (!window.generatedAnnualReport) {
        alert('Please generate an annual report first using the form above.');
        return;
    }
    
    navigator.clipboard.writeText(window.generatedAnnualReport).then(() => {
        alert('✅ Complete HTML code copied to clipboard!\n\nYou can now paste this into your website editor or send it to your web developer.');
    }).catch(() => {
        alert('❌ Failed to copy to clipboard. Please try the Download option instead.');
    });
}

function showAnnualPreview() {
    if (!window.generatedAnnualReport) {
        alert('Please generate an annual report first using the form above.');
        return;
    }
    
    const previewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
    previewWindow.document.write(window.generatedAnnualReport);
    previewWindow.document.close();
    previewWindow.document.title = 'Annual Financial Report - Preview';
}

// Feedback functions
function scrollToFeedback() {
    document.getElementById('feedback-section').scrollIntoView({ behavior: 'smooth' });
}

function reportBug(error) {
    const subject = 'Bug Report from NeoGen';
    const body = `Error Details:\n${error.toString()}\n\nPage: ${window.location.href}\nUser Agent: ${navigator.userAgent}\nTimestamp: ${new Date().toISOString()}`;
    window.location.href = `mailto:support@zenithus.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Safe DOM utility function
function safeSetInnerHTML(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
        return true;
    } else {
        console.warn(`⚠️ Element '${elementId}' not found, skipping innerHTML update`);
        return false;
    }
}

function safeSetTextContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
        return true;
    } else {
        console.warn(`⚠️ Element '${elementId}' not found, skipping textContent update`);
        return false;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 DOM loaded, starting English version initialization...');
    setTimeout(init, 100); // Small delay to ensure DOM is fully ready
});

// Handle clicks outside modals
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}
