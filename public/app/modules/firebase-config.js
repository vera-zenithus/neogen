// === NeoGen: Firebase Config ===
// Firebase Console에서 프로젝트 생성 후 아래 값을 교체하세요
// https://console.firebase.google.com

const firebaseConfig = {
    apiKey:            "AIzaSyATrH_tiqBLr0jp52ZSUqDpLh-iJHwUjHQ",
    authDomain:        "neogen-bb343.firebaseapp.com",
    projectId:         "neogen-bb343",
    storageBucket:     "neogen-bb343.firebasestorage.app",
    messagingSenderId: "1022712186971",
    appId:             "1:1022712186971:web:3aa9982d9591180300177e"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();

// Google 로그인 프로바이더
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
