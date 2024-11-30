import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    /* 

		// add this image in here!
			Error: Invalid src prop (https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732714677/avatar_ddv8a8.png) on `next/image`, hostname "res.cloudinary.com" is not configured under images in your `next.config.js`
See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
		
		*/
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dwhfpxrgz/image/upload/**',
      },
    ],
  },
}

export default nextConfig
