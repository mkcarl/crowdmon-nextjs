import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import React from "react";
import {crowdmonTheme} from "@/styles/crowdmon-styles";
import {ThemeProvider} from "@mui/material";
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <link href={'favicon.ico'}/>
                <title>Crowdmon</title>
            </Head>
            <ThemeProvider theme={crowdmonTheme}>
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    )

}
