import { useContext } from 'react'
import { FirebaseAuthContext } from '@/contexts/FirebaseAuthContext'

export const useUser = () => {
    const firebaseAuthContext = useContext(FirebaseAuthContext)

    if (!firebaseAuthContext) {
        throw new Error(
            'useUser must be used within a FirebaseAuthContextProvider'
        )
    }

    return firebaseAuthContext.user
}
