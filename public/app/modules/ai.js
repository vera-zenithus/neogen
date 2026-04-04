// === NeoGen: AI Performance Module ===

// AI 성능 모니터링 시스템
function initAIPerformanceMonitoring() {
    // AI 분류 정확도 추적
    window.aiPerformance = {
        totalClassifications: 0,
        correctClassifications: 0,
        userCorrections: 0,
        averageConfidence: 0,
        lastUpdated: Date.now()
    };

    // 저장된 성능 데이터 로드
    const savedPerformance = localStorage.getItem('neogen_ai_performance');
    if (savedPerformance) {
        window.aiPerformance = { ...window.aiPerformance, ...JSON.parse(savedPerformance) };
    }
}

// AI 성능 업데이트
function updateAIPerformance(wasCorrect, confidence, userCorrected = false) {
    window.aiPerformance.totalClassifications++;
    if (wasCorrect) window.aiPerformance.correctClassifications++;
    if (userCorrected) window.aiPerformance.userCorrections++;

    // 평균 신뢰도 계산
    const currentAvg = window.aiPerformance.averageConfidence;
    const total = window.aiPerformance.totalClassifications;
    window.aiPerformance.averageConfidence = ((currentAvg * (total - 1)) + confidence) / total;

    window.aiPerformance.lastUpdated = Date.now();

    // 성능 데이터 저장
    localStorage.setItem('neogen_ai_performance', JSON.stringify(window.aiPerformance));

    // 성능 기반 네오 메시지
    if (window.aiPerformance.totalClassifications % 10 === 0) {
        const accuracy = (window.aiPerformance.correctClassifications / window.aiPerformance.totalClassifications * 100).toFixed(1);
        showNeoBubble(`🎯 AI 정확도: ${accuracy}%<br>계속 학습하고 있어요!`, 3000);
    }
}

// AI 성능 리포트 생성
function generateAIPerformanceReport() {
    const perf = window.aiPerformance;
    const accuracy = perf.totalClassifications > 0 ?
        (perf.correctClassifications / perf.totalClassifications * 100).toFixed(1) : 0;

    return {
        totalClassifications: perf.totalClassifications,
        accuracy: accuracy,
        averageConfidence: perf.averageConfidence.toFixed(1),
        userCorrections: perf.userCorrections,
        improvementRate: perf.userCorrections > 0 ?
            ((perf.totalClassifications - perf.userCorrections) / perf.totalClassifications * 100).toFixed(1) : 100
    };
}
