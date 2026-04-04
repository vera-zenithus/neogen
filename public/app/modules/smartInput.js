// === NeoGen: Smart Input Module ===

// 파일 업로드용 전역 변수
let uploadedFileData = null;

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
