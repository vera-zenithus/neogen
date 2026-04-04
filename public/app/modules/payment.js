// === NeoGen: Payment Module (Paddle) ===

window._upgradePlan = 'pro_monthly';

// ── 월간/연간 토글 ──────────────────────────────
function setUpgradePeriod(period) {
    const isMonthly = period === 'monthly';
    window._upgradePlan = isMonthly ? 'pro_monthly' : 'pro_yearly';

    const priceEl      = document.getElementById('upgradePrice');
    const labelEl      = document.getElementById('upgradePeriodLabel');
    const savingEl     = document.getElementById('upgradeSaving');
    const strikeEl     = document.getElementById('strikePrice');
    const savingTextEl = document.getElementById('savingText');
    const glowEl       = document.getElementById('amberGlow');
    const monthlyBtn   = document.getElementById('toggleMonthly');
    const yearlyBtn    = document.getElementById('toggleYearly');

    if (priceEl)  priceEl.textContent  = isMonthly ? '$14' : '$99';
    if (labelEl)  labelEl.textContent  = isMonthly ? '/월' : '/년';
    
    // 연간 선택 시에만 보이는 요소들
    if (savingEl)     savingEl.style.display     = isMonthly ? 'none' : 'inline-block';
    if (strikeEl)     strikeEl.style.display     = isMonthly ? 'none' : 'inline-block';
    if (savingTextEl) savingTextEl.style.display = isMonthly ? 'none' : 'block';
    if (glowEl)       glowEl.style.display       = isMonthly ? 'none' : 'block';

    const activeStyle   = { background: 'var(--neo-cyan)', color: 'var(--neo-navy)', fontWeight: '800', boxShadow: '0 4px 12px rgba(6,182,212,0.3)' };
    const inactiveStyle = { background: 'transparent',     color: 'rgba(255,255,255,0.4)', fontWeight: '600', boxShadow: 'none' };
    
    const yearlyActiveStyle = { background: '#f59e0b', color: '#000', fontWeight: '800', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' };

    if (isMonthly) {
        Object.assign(monthlyBtn.style, activeStyle);
        Object.assign(yearlyBtn.style, inactiveStyle);
    } else {
        Object.assign(monthlyBtn.style, inactiveStyle);
        Object.assign(yearlyBtn.style, yearlyActiveStyle);
    }
}

// ── 결제 시작 ──────────────────────────────
async function startCheckout(plan) {
    if (!currentUser) {
        closeUpgradeModal();
        openLoginModal();
        return;
    }

    const btn = document.getElementById('checkoutProBtn');
    const originalText = btn?.innerHTML;

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span style="opacity:0.7">처리 중...</span>';
        }

        const res = await fetch('https://accounting-psi-pearl.vercel.app/api/paddle-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan,
                uid:   currentUser.uid,
                email: currentUser.email
            })
        });

        const data = await res.json();

        if (!res.ok || !data.url) {
            const errorMsg = data.error || '결제 URL을 받지 못했어요';
            alert('결제 오류: ' + errorMsg);
            throw new Error(errorMsg);
        }

        location.href = data.url;

    } catch (err) {
        console.error('결제 오류:', err);
        if (typeof showNeoBubble === 'function') {
            showNeoBubble('결제 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.', 4000);
        }
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}
