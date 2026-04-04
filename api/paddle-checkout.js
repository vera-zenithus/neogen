// === NeoGen: Paddle Checkout 세션 생성 ===

export default async function handler(req, res) {
    // CORS 설정
    const ALLOWED_ORIGINS = [
        'https://neogenworld.com',
        'https://www.neogenworld.com',
        'https://app.neogenworld.com',
        'http://localhost:3000',
        'http://localhost:5173'
    ];
    const origin = req.headers.origin || 'https://neogenworld.com';
    if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') return res.status(405).end();

    const { plan, uid, email } = req.body;
    if (!plan || !uid) return res.status(400).json({ error: 'Missing fields' });

    // Paddle Price IDs (Dashboard에서 생성 후 환경변수에 저장)
    const PRICE_IDS = {
        pro_monthly: process.env.PADDLE_PRICE_PRO_MONTHLY,
        pro_yearly:  process.env.PADDLE_PRICE_PRO_YEARLY
    };

    const priceId = PRICE_IDS[plan];
    if (!priceId) return res.status(400).json({ error: 'Invalid plan' });

    try {
        const paddleRes = await fetch('https://api.paddle.com/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
                'Content-Type':  'application/json'
            },
            body: JSON.stringify({
                items: [{ price_id: priceId, quantity: 1 }],
                customer: { email: email || undefined },
                custom_data: { uid, plan },
                checkout: {
                    url: 'https://neogenworld.com/app/payment-success.html'
                }
            })
        });

        const data = await paddleRes.json();

        if (!paddleRes.ok) {
            console.error('Paddle API 오류:', JSON.stringify(data));
            throw new Error(data.error?.detail || data.message || JSON.stringify(data));
        }

        const checkoutUrl = data.data?.checkout?.url;
        if (!checkoutUrl) {
            console.error('Paddle checkout URL 없음:', JSON.stringify(data));
            throw new Error('Checkout URL을 받지 못했어요');
        }

        res.status(200).json({ url: checkoutUrl });
    } catch (err) {
        console.error('Paddle checkout 오류:', err);
        res.status(500).json({ error: err.message });
    }
}
