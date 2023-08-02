import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
} from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import Navbar from '@/components/Navbar'
import CroppingInterface from '@/components/crop/CroppingInterface'

export default function cropv2() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Navbar />
            <Box
                sx={{
                    display: 'flex',
                    p: 4,
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Typography variant={'h1'}>Bouding Box</Typography>
                <Typography paragraph>
                    Crop Paimon out by drawing a bounding box around her! Simply
                    drag and release on the image, then click &quot;Send&quot;
                </Typography>
                <CroppingInterface />
            </Box>
        </Box>
    )
}
