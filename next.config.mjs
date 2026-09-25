/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // jspdf's Node build pulls in fflate's `new Worker(<dynamic>)`, which Turbopack can't bundle for SSR.
  // Keep it external on the server; the browser build is used for client-side PDF export.
  serverExternalPackages: ["jspdf"],
}

export default nextConfig
