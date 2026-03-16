/**
 * Firebase Analytics initialisation — GA4 web SDK only.
 *
 * Rules:
 * - Never import firebase-admin here (server SDK is out of scope).
 * - Never import Firestore, Auth, or any Firebase service other than Analytics.
 * - SSR guard: only initialise when window is defined (client-side only).
 *
 * All NEXT_PUBLIC_FIREBASE_* vars are safe to expose to the browser.
 * See .env.local.example for the full list.
 */
import { FirebaseApp, getApps, initializeApp } from 'firebase/app'
import type { Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

/**
 * Initialises Firebase and Analytics. Safe to call multiple times — idempotent.
 * Must only be called from client-side code (window must exist).
 */
export function initFirebase(): void {
  // SSR guard — Firebase Analytics requires the browser environment.
  if (typeof window === 'undefined') return

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  if (!analytics) {
    // Dynamic import keeps firebase/analytics out of the server bundle.
    import('firebase/analytics')
      .then(({ getAnalytics, isSupported }) => {
        isSupported().then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app)
          }
        })
      })
      .catch((err) => {
        console.warn('[Firebase] Analytics failed to load:', err)
      })
  }
}

/** Returns the Analytics instance, or undefined if not yet initialised. */
export function getFirebaseAnalytics(): Analytics | undefined {
  return analytics
}
