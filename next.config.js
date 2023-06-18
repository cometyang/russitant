/** @type {import('next').NextConfig} */
const nextConfig = {
    /// tauri only support setup Next.js to SSG/SPA mode
    output: 'export',
}

module.exports = nextConfig
