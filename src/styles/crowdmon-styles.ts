import { createTheme, responsiveFontSizes } from '@mui/material'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#df988d',
        },
        secondary: {
            main: '#d9c5c5',
        },
        background: {
            default: '#0e0706',
        },
        text: {
            primary: '#fcf8f8',
        },
    },
})

export const crowdmonTheme = responsiveFontSizes(theme)
