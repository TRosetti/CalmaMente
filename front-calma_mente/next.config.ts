/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jsgxzgxxiquwllivbnyp.supabase.co',
        port: '', // Deixe vazio
        pathname: '/storage/v1/object/public/**', // Adicione o caminho base do storage
      },
    ],
  },
}

module.exports = nextConfig