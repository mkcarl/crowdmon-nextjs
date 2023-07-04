import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import React from "react";
import {crowdmonTheme} from "@/styles/crowdmon-styles";
import {ThemeProvider} from "@mui/material";

export default function App({Component, pageProps}: AppProps) {
    return (
        <ThemeProvider theme={crowdmonTheme}>
            <Component {...pageProps} />
        </ThemeProvider>
    )

}
