'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firebase, firebaseConfigured } from '@/lib/firebase';
import type { UserProfile } from '@/types';

/** Fields a student may edit on their own profile (role, status, enrolledCourses are admin-only). */
export type EditableProfile = Pick<
  UserProfile,
  'displayName' | 'phoneNumber' | 'targetGoal' | 'currentFrenchLevel' | 'preferredBatchTime' | 'bio' | 'crsScore'
>;

interface AuthState {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  /** 'approved' unless an admin has yet to approve (or has rejected) this account. */
  approval: 'pending' | 'approved' | 'rejected';
  signUp: (email: string, password: string, extra: Partial<EditableProfile>) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateMyProfile: (data: Partial<EditableProfile>) => Promise<void>;
  /** Fetch with the caller's ID token attached. */
  authFetch: (url: string, init?: RequestInit) => Promise<Response>;
}

const Ctx = createContext<AuthState | null>(null);

async function ensureProfile(u: User, extra: Partial<EditableProfile> = {}) {
  const fb = firebase()!;
  const ref = doc(fb.db, 'users', u.uid);
  const snap = await getDoc(ref);
  // The server may have created a partial doc first (role grant / payment unlock), so missing
  // profile fields are filled in rather than only checking existence
  if (!snap.exists() || !snap.data()?.createdAt) {
    const cur = snap.data() ?? {};
    await setDoc(
      ref,
      {
        uid: u.uid,
        email: u.email ?? '',
        displayName: cur.displayName || extra.displayName || u.displayName || (u.email ?? '').split('@')[0],
        photoURL: u.photoURL ?? '',
        phoneNumber: cur.phoneNumber ?? extra.phoneNumber ?? '',
        targetGoal: cur.targetGoal ?? extra.targetGoal ?? '',
        currentFrenchLevel: cur.currentFrenchLevel ?? extra.currentFrenchLevel ?? 'A0',
        status: cur.status ?? 'Active',
        authProvider: u.providerData[0]?.providerId ?? 'password',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        // Only set on a brand-new doc: rules forbid students touching these once they exist
        ...(snap.exists() ? {} : { role: 'student', enrolledCourses: [], approval: 'pending', locale: document.documentElement.lang === 'bn' ? 'bn' : 'en' }),
      },
      { merge: true },
    );
  } else {
    await updateDoc(ref, { lastLoginAt: serverTimestamp() });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<string>('student');
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    const fb = firebase();
    if (!fb) return;
    let unsubProfile: (() => void) | undefined;
    const unsub = onAuthStateChanged(fb.auth, async (u) => {
      unsubProfile?.();
      setUser(u);
      if (!u) {
        setProfile(null);
        setRole('student');
        setLoading(false);
        return;
      }
      // Let the server grant listed super-admins their claim, then refresh the token if it changed
      try {
        const r = await fetch('/api/session', { method: 'POST', headers: { Authorization: `Bearer ${await u.getIdToken()}` } });
        if (r.ok && (await r.json()).refresh) await u.getIdToken(true);
      } catch {}
      // The user may have signed out (or switched) while the request above was in flight
      if (fb.auth.currentUser?.uid !== u.uid) return;
      const token = await u.getIdTokenResult();
      setRole((token.claims.role as string) ?? 'student');
      unsubProfile = onSnapshot(
        doc(fb.db, 'users', u.uid),
        (s) => {
          setProfile(s.exists() ? (s.data() as UserProfile) : null);
          setLoading(false);
        },
        () => setLoading(false),
      );
    });
    return () => {
      unsub();
      unsubProfile?.();
    };
  }, []);

  // Errors carry a stable `code` (like Firebase errors) so AuthForm can show a bilingual message
  const need = () => {
    const fb = firebase();
    if (!fb) throw Object.assign(new Error('Accounts are not configured yet.'), { code: 'auth/not-configured' });
    return fb;
  };

  const value: AuthState = {
    configured: firebaseConfigured,
    loading,
    user,
    profile,
    isAdmin: role === 'admin' || role === 'superAdmin' || profile?.role === 'admin' || profile?.role === 'superAdmin',
    approval: role !== 'student' ? 'approved' : (profile?.approval ?? 'approved'),
    async signUp(email, password, extra) {
      const { auth } = need();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (extra.displayName) await updateProfile(cred.user, { displayName: extra.displayName });
      await ensureProfile(cred.user, extra);
    },
    async logIn(email, password) {
      const cred = await signInWithEmailAndPassword(need().auth, email, password);
      await ensureProfile(cred.user);
    },
    async logInWithGoogle() {
      const cred = await signInWithPopup(need().auth, new GoogleAuthProvider());
      await ensureProfile(cred.user);
    },
    async logOut() {
      await signOut(need().auth);
    },
    async resetPassword(email) {
      await sendPasswordResetEmail(need().auth, email);
    },
    async updateMyProfile(data) {
      const { db } = need();
      if (!user) throw Object.assign(new Error('Not signed in'), { code: 'auth/not-signed-in' });
      await updateDoc(doc(db, 'users', user.uid), { ...data, updatedAt: serverTimestamp() });
    },
    async authFetch(url, init = {}) {
      const token = await user?.getIdToken();
      return fetch(url, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used inside AuthProvider');
  return c;
}
