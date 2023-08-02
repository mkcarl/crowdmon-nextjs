// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { crowdmonTheme } from '@/styles/crowdmon-styles'
import { CssBaseline, ThemeProvider } from '@mui/material'
import Head from 'next/head'
import FirebaseAuthContextProvider from '@/contexts/FirebaseAuthContext'
import { CookiesProvider } from 'react-cookie'

export default function App({ Component, pageProps }: AppProps) {
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
                        <Component {...pageProps} />
                    </ThemeProvider>
                </FirebaseAuthContextProvider>
            </CookiesProvider>
        </>
    )
}
