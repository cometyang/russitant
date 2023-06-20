/** @type {import('next').NextConfig} */
const nextConfig = {
    /// tauri only support setup Next.js to SSG/SPA mode
    output: 'export',
    /// if not set the unoptimized, the image loading will failed
    /// Read more: https://nextjs.org/docs/messages/export-image-ap
    images: { unoptimized: true } 
}

module.exports = nextConfig
