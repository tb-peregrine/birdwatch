/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sjc.microlink.io',
            },
        ],
    },
}

export default nextConfig;
