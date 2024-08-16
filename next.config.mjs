/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/Issues',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;