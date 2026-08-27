import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const q = query(collection(db, 'kullanicilar'), where('email', '==', currentUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setRol(querySnapshot.docs[0].data().rol);
          } else {
            setRol(null);
          }
        } catch (err) {
          console.error('Rol çekme hatası:', err);
          setRol(null);
        }
      } else {
        setRol(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, rol, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);