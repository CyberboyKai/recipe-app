import { useContext, useMemo } from "react";
import { AuthContext } from "../context/authContext";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

export function useSavedRecipes() {
  const { currentUser, userProfile } = useContext(AuthContext);

  const savedIds = useMemo(() => {
    return new Set(userProfile?.savedRecipes || []);
  }, [userProfile]);

  async function toggleSave(recipeId) {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const isSaved = savedIds.has(recipeId);

    await updateDoc(userRef, {
      savedRecipes: isSaved
        ? arrayRemove(recipeId)
        : arrayUnion(recipeId),
    });
  }

  function isSaved(recipeId) {
    return savedIds.has(recipeId);
  }

  return {
    savedIds,
    toggleSave,
    isSaved,
  };
}
