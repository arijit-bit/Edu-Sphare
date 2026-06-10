/**
 * School-scoped layout.
 * This is a thin Server Component wrapper. It renders children directly so that
 * each role (student / teacher / finance / admin) can supply its own full-page
 * shell layout via a nested layout.js.
 *
 * In production you would validate `params.schoolSlug` here and call notFound()
 * for unknown slugs.  For the demo we accept any slug.
 */
export default function SchoolLayout({ children }) {
  return children;
}
