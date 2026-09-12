'use client';

import { useAuthStatus } from '@/lib/hooks/auth/use-auth-queries';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback,
}: ProtectedRouteProps) {
  const { data, isLoading } = useAuthStatus();
  const user = data?.user;
  const isAuthenticated = !!user;
  const isInitialized = !isLoading;
  const router = useRouter();
  useEffect(() => {
    // Only redirect after auth is initialized
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push('/auth/member');
    }
  }, [isInitialized, isLoading, isAuthenticated, router]);
  // Show loading while checking auth
  if (!isInitialized || isLoading) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-blue-600 border-b-2" />
        </div>
      )
    );
  }
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }
  // Check role requirements
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-bold text-2xl text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

// # 1. Basic Usage - Protect any authenticated route
// # app/dashboard/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//         <p>This content is only visible to authenticated users.</p>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 2. Role-based Protection - Admin only
// # app/admin/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export default function AdminPage() {
//   return (
//     <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
//         <p>Only admins and superadmins can see this.</p>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 3. Super Admin Only
// # app/superadmin/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export default function SuperAdminPage() {
//   return (
//     <ProtectedRoute requiredRoles={['superadmin']}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Super Admin</h1>
//         <p>Only superadmins can access this area.</p>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 4. Custom Loading Fallback
// # app/profile/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export default function ProfilePage() {
//   return (
//     <ProtectedRoute
//       fallback={
//         <div className="min-h-screen flex items-center justify-center bg-blue-50">
//           <div className="text-center">
//             <div className="animate-pulse rounded-full h-16 w-16 bg-blue-200 mx-auto mb-4"></div>
//             <p className="text-blue-600">Loading your profile...</p>
//           </div>
//         </div>
//       }
//     >
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">My Profile</h1>
//         <p>Your profile information here.</p>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 5. Protecting Layout Components
// # app/dashboard/layout.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { Sidebar } from '@/components/Sidebar';
// import { Header } from '@/components/Header';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute requiredRoles={['member', 'admin', 'superadmin']}>
//       <div className="min-h-screen bg-muted">
//         <Header />
//         <div className="flex">
//           <Sidebar />
//           <main className="flex-1 p-6">
//             {children}
//           </main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 6. Protecting Components (not full pages)
// # components/AdminPanel.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export function AdminPanel() {
//   return (
//     <ProtectedRoute
//       requiredRoles={['admin', 'superadmin']}
//       fallback={
//         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-yellow-800">Admin access required to view this section.</p>
//         </div>
//       }
//     >
//       <div className="p-4 bg-background border rounded-lg">
//         <h3 className="font-bold mb-2">Admin Controls</h3>
//         <button className="bg-red-500 text-white px-4 py-2 rounded">
//           Delete User
//         </button>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 7. Multiple Role Requirements
// # app/manager/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';

// export default function ManagerPage() {
//   return (
//     <ProtectedRoute requiredRoles={['manager', 'admin', 'superadmin']}>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
//         <p>Content for managers and above.</p>
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 8. Using with Dynamic Routes
// # app/church/[churchId]/page.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { useAuthContext } from '@/contexts/AuthContext';

// export default function ChurchPage({ params }: { params: { churchId: string } }) {
//   const { user } = useAuthContext();

//   return (
//     <ProtectedRoute>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Church Details</h1>
//         {/* Only show if user belongs to this church */}
//         {user?.churchId === params.churchId ? (
//           <div>
//             <p>Welcome to your church dashboard!</p>
//             <p>Church ID: {params.churchId}</p>
//           </div>
//         ) : (
//           <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-800">You don't have access to this church.</p>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 9. Conditional Protection Based on User Data
// # components/ConditionalProtection.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { useAuthContext } from '@/contexts/AuthContext';

// interface ConditionalProtectionProps {
//   children: React.ReactNode;
//   churchId?: string;
//   branchId?: string;
// }

// export function ConditionalProtection({
//   children,
//   churchId,
//   branchId
// }: ConditionalProtectionProps) {
//   const { user } = useAuthContext();

//   return (
//     <ProtectedRoute>
//       {/* Additional checks based on user's church/branch */}
//       {(!churchId || user?.churchId === churchId) &&
//        (!branchId || user?.branchId === branchId) ? (
//         <>{children}</>
//       ) : (
//         <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-yellow-800">
//             You don't have access to this church/branch content.
//           </p>
//         </div>
//       )}
//     </ProtectedRoute>
//   );
// }

// # 10. Using in API Route Protection (for client-side calls)
// # components/ApiProtectedComponent.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { useAuthContext } from '@/contexts/AuthContext';
// import { useState } from 'react';

// export function ApiProtectedComponent() {
//   const { user } = useAuthContext();
//   const [data, setData] = useState(null);

//   const fetchProtectedData = async () => {
//     try {
//       const response = await fetch('/api/protected-data', {
//         credentials: 'include', // Include cookies
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setData(result);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   return (
//     <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
//       <div className="p-6">
//         <h2 className="text-xl font-bold mb-4">Protected Data</h2>
//         <button
//           onClick={fetchProtectedData}
//           className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//         >
//           Fetch Protected Data
//         </button>
//         {data && (
//           <pre className="bg-muted p-4 rounded">
//             {JSON.stringify(data, null, 2)}
//           </pre>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }

// # 11. Advanced Usage - Custom Hook for Role Checking
// # hooks/useRoleCheck.ts
// 'use client';

// import { useAuthContext } from '@/contexts/AuthContext';

// export function useRoleCheck() {
//   const { user, isAuthenticated } = useAuthContext();

//   const hasRole = (requiredRoles: string[]) => {
//     if (!isAuthenticated || !user) return false;
//     return requiredRoles.includes(user.role);
//   };

//   const hasAnyRole = (roles: string[]) => {
//     if (!isAuthenticated || !user) return false;
//     return roles.some(role => user.role === role);
//   };

//   const isSuperAdmin = () => hasRole(['superadmin']);
//   const isAdmin = () => hasRole(['admin', 'superadmin']);
//   const isMember = () => hasRole(['member', 'admin', 'superadmin']);

//   return {
//     hasRole,
//     hasAnyRole,
//     isSuperAdmin,
//     isAdmin,
//     isMember,
//     userRole: user?.role,
//   };
// }

// # 12. Using the Role Check Hook
// # components/RoleBasedContent.tsx
// 'use client';

// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { useRoleCheck } from '@/hooks/useRoleCheck';

// export function RoleBasedContent() {
//   const { isAdmin, isSuperAdmin, hasRole } = useRoleCheck();

//   return (
//     <ProtectedRoute>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Role-Based Content</h1>

//         {/* Content for all authenticated users */}
//         <div className="mb-4">
//           <p>This content is visible to all authenticated users.</p>
//         </div>

//         {/* Admin content */}
//         {isAdmin() && (
//           <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
//             <h3 className="font-bold">Admin Content</h3>
//             <p>This is only visible to admins and superadmins.</p>
//           </div>
//         )}

//         {/* SuperAdmin content */}
//         {isSuperAdmin() && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
//             <h3 className="font-bold">SuperAdmin Content</h3>
//             <p>This is only visible to superadmins.</p>
//           </div>
//         )}

//         {/* Custom role check */}
//         {hasRole(['manager', 'admin', 'superadmin']) && (
//           <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
//             <h3 className="font-bold">Manager+ Content</h3>
//             <p>This is visible to managers and above.</p>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }
