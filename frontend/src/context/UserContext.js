import { createContext, useEffect, useState } from "react";
import { Axios } from "../Axios";


export const UserContext = createContext()

export const UserContextProvider = ({children}) => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        const getAllUsers = async () => {
            const res = await Axios.get(`/users`)
            setUsers(res.data)
        }
        return () => {
            getAllUsers()
        }
    }, [])


    return (
        <UserContext.Provider value={users}>
            {children}
        </UserContext.Provider>
    );
}