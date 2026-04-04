// === NeoGen: Neo Module ===

// 스마트 네오 시스템
let neoContext = {
    userActions: [],
    currentTab: 'dashboard',
    lastInteraction: Date.now(),
    helpLevel: 'beginner' // beginner, intermediate, advanced
};

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
