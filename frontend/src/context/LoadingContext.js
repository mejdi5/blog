import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../firebase";

export const LoadingContext = createContext()

export const LoadingContextProvider = ({children}) => {

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const load = onAuthStateChanged(auth, () => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1000)
        })
        return () => {
            load()
        }
    }, [])

    return (
        <LoadingContext.Provider value={loading}>
            {children}
        </LoadingContext.Provider>
    );
}