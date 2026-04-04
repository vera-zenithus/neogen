// === NeoGen: Paddle Webhook ===
import crypto from 'crypto';
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        )
    });
}
const db = admin.firestore();

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end',  () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

function verifyPaddleSignature(rawBody, signature, secret) {
    const [tsPart, h1Part] = signature.split(';');
    const ts = tsPart.replace('ts=', '');
    const h1 = h1Part.replace('h1=', '');
    const signed = `${ts}:${rawBody.toString()}`;
    const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const rawBody   = await getRawBody(req);
    const signature = req.headers['paddle-signature'];

    if (!verifyPaddleSignature(rawBody, signature, process.env.PADDLE_WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());
    const { event_type, data } = event;

    console.log('Paddle webhook:', event_type);

    const uid  = data?.custom_data?.uid;
    const plan = data?.custom_data?.plan;

    if (!uid) return res.status(200).end();

    if (event_type === 'subscription.created' || event_type === 'subscription.activated') {
        await db.collection('users').doc(uid).update({
            plan,
            status:                 'active',
            payment_provider:       'paddle',
            paddle_subscription_id: data.id,
            next_billing_date:      admin.firestore.Timestamp.fromDate(new Date(data.next_billed_at)),
            plan_updated_at:        admin.firestore.FieldValue.serverTimestamp()
        });
    } else if (event_type === 'subscription.updated') {
        await db.collection('users').doc(uid).update({
            status:           data.status === 'active' ? 'active' : 'past_due',
            next_billing_date: admin.firestore.Timestamp.fromDate(new Date(data.next_billed_at))
        });
    } else if (event_type === 'subscription.canceled') {
        await db.collection('users').doc(uid).update({
            plan:                   'free',
            status:                 'cancelled',
            paddle_subscription_id: null,
            plan_updated_at:        admin.firestore.FieldValue.serverTimestamp()
        });
    }

    res.status(200).json({ received: true });
}
