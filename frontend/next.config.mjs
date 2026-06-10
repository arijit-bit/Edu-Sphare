/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/student/:path*',
        destination: '/dummy-school/student/:path*',
        permanent: false,
      },
      {
        source: '/teacher/:path*',
        destination: '/dummy-school/teacher/:path*',
        permanent: false,
      },
      {
        source: '/finance/:path*',
        destination: '/dummy-school/finance/:path*',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/dummy-school/admin/:path*',
        permanent: false,
      },
      {
        source: '/:schoolSlug/student',
        destination: '/:schoolSlug/student/dashboard',
        permanent: false,
      },
      {
        source: '/:schoolSlug/teacher',
        destination: '/:schoolSlug/teacher/dashboard',
        permanent: false,
      },
      {
        source: '/:schoolSlug/finance',
        destination: '/:schoolSlug/finance/dashboard',
        permanent: false,
      },
      {
        source: '/:schoolSlug/admin',
        destination: '/:schoolSlug/admin/dashboard',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
