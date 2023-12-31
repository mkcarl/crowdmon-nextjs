import Navbar from '@/components/Navbar'
import { Box, Typography } from '@mui/material'
import { AnnotationOption } from '@/types/home'
import AnnotationCard from '@/components/home/AnnotationCard'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseAuth } from '@/lib/firebase'
import { useEffect } from 'react'
import Loading from '@/components/Loading'

const annotationOptions: AnnotationOption[] = [
    {
        name: 'Bounding Box',
        description: 'Draw a box around Paimon',
        href: '/crop',
        image: 'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1689608817/crowdmon-website-assets/New_Project_a4ffpx.png',
    },
    {
        name: 'Presence Verification',
        description: 'Verify if Paimon is present in the image',
        href: '/presence',
        image: 'https://res.cloudinary.com/dmqxgg2mj/image/upload/v1689609875/crowdmon-website-assets/VS_lpnfa5.png',
    },
]

export default function Home() {
    const [user, loading, error] = useAuthState(firebaseAuth)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (loading || !user) {
        return <Loading />
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            <Navbar />
            <Box
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        margin: 'auto',
                        p: 4,
                        width: { xs: '100%', md: '60%' },
                    }}
                >
                    <Typography variant={'h1'}>
                        World&apos;s first Paimon dataset collection
                    </Typography>
                    <Typography variant={'h5'} color={'text.secondary'}>
                        Crowdmon leads the charge in curating the world&apos;s
                        most comprehensive Paimon dataset collection, and we
                        need your expertise to make it happen! Join our dynamic
                        community, where you can contribute through various
                        types of annotation, empowering the AI and data industry
                        in unprecedented ways!
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: 'auto',
                    }}
                >
                    {annotationOptions.map((option, index) => (
                        <AnnotationCard {...option} key={index} />
                    ))}
                </Box>
            </Box>
        </Box>
    )
}
