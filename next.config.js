/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/*/**',
            },
            {
                protocol: 'https',
                hostname: 'images.crowdmon.mkcarl.com',
                port: '',
                pathname: '/*/**',
            },
        ],
    },
}

const withTM = require('next-transpile-modules')(['echarts', 'zrender'])

module.exports = withTM(nextConfig)
