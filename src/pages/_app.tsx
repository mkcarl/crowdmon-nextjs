import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { crowdmonTheme } from '@/styles/crowdmon-styles'
import { ThemeProvider } from '@mui/material'
import Head from 'next/head'
import FirebaseAuthContextProvider from '@/contexts/FirebaseAuthContext'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <FirebaseAuthContextProvider>
                <Head>
                    <link href={'favicon.ico'} />
                    <title>Crowdmon</title>
                </Head>
                <ThemeProvider theme={crowdmonTheme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </FirebaseAuthContextProvider>
        </>
    )
}
