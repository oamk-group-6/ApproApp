import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

export const useUserRole = () => {
  const [role, setRole] = useState<"basic" | "admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    loading,
  };
};