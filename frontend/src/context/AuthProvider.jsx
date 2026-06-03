import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { AuthContext } from './authContext.js';
import { auth, db } from '../firebase.js';

const defaultUserRole = 'user';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserProfile(null);
        setIsAuthLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          setUserProfile({ id: user.uid, ...userSnapshot.data() });
        } else {
          const fallbackProfile = {
            displayName: user.displayName || '',
            email: user.email,
            role: defaultUserRole,
            createdAt: serverTimestamp(),
          };

          await setDoc(userRef, fallbackProfile);
          setUserProfile({ id: user.uid, ...fallbackProfile });
        }
      } catch {
        setUserProfile({
          displayName: user.displayName || '',
          email: user.email,
          id: user.uid,
          role: defaultUserRole,
        });
      }

      setIsAuthLoading(false);
    });

    return unsubscribe;
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
