import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';

import { AuthContext } from './authContext.js';
import { auth, db } from '../firebase.js';

const defaultUserRole = 'user';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserProfile(null);
        setIsAuthLoading(false);
        return;
      }

      const userRef = doc(db, 'users', user.uid);

      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const fallbackProfile = {
          displayName: user.displayName || '',
          email: user.email,
          role: defaultUserRole,
          createdAt: serverTimestamp(),
          savedRecipes: [],
          createdRecipes: [],
        };

        await setDoc(userRef, fallbackProfile);
      }

      unsubscribeUser = onSnapshot(userRef, (userSnapshot) => {
        if (userSnapshot.exists()) {
          setUserProfile({ id: user.uid, ...userSnapshot.data() });
        }
      });

      setIsAuthLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const signUp = async ({ name, email, password }) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(credential.user, {
      displayName: name,
    });

    const userProfileData = {
      displayName: name,
      email: credential.user.email,
      role: defaultUserRole,
      createdAt: serverTimestamp(),
      savedRecipes: [],
      createdRecipes: [],
    };

    await setDoc(doc(db, 'users', credential.user.uid), userProfileData, {
      merge: true,
    });

    setUserProfile({ id: credential.user.uid, ...userProfileData });

    return credential.user;
  };

  const login = ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAdmin: userProfile?.role === 'admin',
      isAuthLoading,
      login,
      logout,
      signUp,
      userProfile,
    }),
    [currentUser, isAuthLoading, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
