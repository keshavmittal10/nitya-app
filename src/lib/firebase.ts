import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Auth ──
export async function sendOTP(phone: string): Promise<ConfirmationResult> {
  const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  return signInWithPhoneNumber(auth, `+91${phone}`, verifier);
}

// ── User profile ──
export async function createOrUpdateUser(uid: string, data: Record<string, unknown>) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { uid, karma: 0, tapasyaDays: 0, shlokaCount: 0, mantaDays: 0, bhaktDays: 0, createdAt: Date.now(), ...data });
  } else {
    await updateDoc(ref, data);
  }
}

export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function addKarma(uid: string, amount: number) {
  await updateDoc(doc(db, "users", uid), { karma: increment(amount) });
}

export async function incrementField(uid: string, field: string, amount = 1) {
  await updateDoc(doc(db, "users", uid), { [field]: increment(amount) });
}
