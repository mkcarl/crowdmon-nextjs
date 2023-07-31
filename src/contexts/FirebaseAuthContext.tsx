import { createContext, useState, ReactNode, PropsWithChildren } from 'react'

interface FirebaseAuthContextType {
    user: any
}

export const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
    user: null,
})

export default function FirebaseAuthContextProvider(props: PropsWithChildren) {
    const [user, setUser] = useState()

    return (
        <FirebaseAuthContext.Provider value={{ user }}>
            {props.children}
        </FirebaseAuthContext.Provider>
    )
}
