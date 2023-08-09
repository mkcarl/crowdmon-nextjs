import Router from 'next/router'
import { useEffect, useRef, useState } from 'react'

const usePageLoad = (delay = 200) => {
    const timeoutRef = useRef<number>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const start = () => {
            timeoutRef.current = window.setTimeout(() => {
                setLoading(true)
            }, delay)
        }
        const end = () => {
            window.clearTimeout(timeoutRef.current)
            setLoading(false)
        }
        Router.events.on('routeChangeStart', start)
        Router.events.on('routeChangeComplete', end)
        Router.events.on('routeChangeError', end)
        return () => {
            Router.events.off('routeChangeStart', start)
            Router.events.off('routeChangeComplete', end)
            Router.events.off('routeChangeError', end)
        }
    }, [delay])

    return loading
}

export default usePageLoad
