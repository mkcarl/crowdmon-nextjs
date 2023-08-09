// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React, { useEffect, useRef, useState } from 'react'
import { crowdmonTheme } from '@/styles/crowdmon-styles'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Head from 'next/head'
import FirebaseAuthContextProvider from '@/contexts/FirebaseAuthContext'
import { CookiesProvider } from 'react-cookie'
import { Router } from 'next/router'
import Loading from '@/components/Loading'
import usePageLoad from '@/hooks/usePageLoad'

export default function App({ Component, pageProps }: AppProps) {
    const loading = usePageLoad()

    return (
        <>
            <CookiesProvider>
                <FirebaseAuthContextProvider>
                    <Head>
                        <link href={'favicon.ico'} />
                        <title>Crowdmon</title>
                    </Head>
                    <ThemeProvider theme={crowdmonTheme}>
                        <CssBaseline />
                        {loading ? <Loading /> : <Component {...pageProps} />}
                    </ThemeProvider>
                </FirebaseAuthContextProvider>
            </CookiesProvider>
        </>
    )
}
