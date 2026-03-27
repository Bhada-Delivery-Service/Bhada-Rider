import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, PhoneAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const isNative = Capacitor.isNativePlatform();

let savedVerificationId = null;

const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (_) {}
    window.recaptchaVerifier = null;
  }
};

export const sendOTP = async (phoneNumber, containerId = 'recaptcha-container') => {
  if (isNative) {
    // ── ANDROID ──
    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');
    await FirebaseAuthentication.removeAllListeners();

    const verificationIdPromise = new Promise((resolve, reject) => {
      FirebaseAuthentication.addListener('phoneCodeSent', (event) => {
        savedVerificationId = event.verificationId;
        resolve(event.verificationId);
      });
      setTimeout(() => reject(new Error('OTP timeout')), 30000);
    });

    await FirebaseAuthentication.signInWithPhoneNumber({ phoneNumber });
    await verificationIdPromise;
    return true;

  } else {
    // ── WEB ──
    clearRecaptcha();
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container #${containerId} not found`);

    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': clearRecaptcha,
    });

    await window.recaptchaVerifier.render();
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    return confirmationResult;
  }
};

export const verifyOTP = async (confirmationResultOrOtp, otp) => {
  if (isNative) {
    // ── ANDROID ── ✅ Yeh part badlo
    const otpStr = String(otp).trim();

    if (!savedVerificationId) {
      throw new Error('VerificationId nahi mila — pehle OTP bhejo');
    }

    const { FirebaseAuthentication } = await import('@capacitor-firebase/authentication');

    // ✅ Sirf plugin se verify karo
    const result = await FirebaseAuthentication.confirmVerificationCode({
      verificationId: savedVerificationId,
      verificationCode: otpStr,
    });

    // ✅ Plugin se idToken lo
    const idToken = result?.user?.idToken 
      || (await FirebaseAuthentication.getIdToken())?.token;

    savedVerificationId = null;
    return idToken;

  } else {
    // ── WEB ── ❌ Yeh mat badlo — same rahega
    const otpStr = String(otp).trim();
    const result = await confirmationResultOrOtp.confirm(otpStr);
    return result.user.getIdToken();
  }
};

export { clearRecaptcha };
export default app;