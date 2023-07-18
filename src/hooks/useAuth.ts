import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getAuth } from '@firebase/auth'
import { firebaseApp } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

export default function useAuth() {
    const router = useRouter()
    const auth = getAuth(firebaseApp)
    const [user, loading, error] = useAuthState(auth)

    useEffect(() => {
        if (!user && !loading && !error) {
            router.push('/')
        }
    }, [router])

    return user
}
