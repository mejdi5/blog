import { createContext, useEffect, useState } from "react";
import { Axios } from "../Axios";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebase";


export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    

    useEffect(() => {
        const getAuth = onAuthStateChanged(auth, async currentUser => {
            if (currentUser) {
                setUser({
                    id: currentUser.uid,
                    username: currentUser.displayName,
                    email: currentUser.email,
                    image: currentUser.photoURL
                })
            } else {
                setUser(null)
            }
        })
        return () => {
            getAuth()
        }
    }, [])

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}