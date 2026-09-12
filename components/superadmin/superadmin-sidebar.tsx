'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';
import { SuperAdminNavigation } from './superadmin-navigation';

interface SuperAdminSidebarProps {
  pathname: string;
  mobile?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function SuperAdminSidebar({
  pathname,
  mobile = false,
  setSidebarOpen,
}: SuperAdminSidebarProps) {
  const NavItems = () => (
    <>
      {SuperAdminNavigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            className={`flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            href={item.href}
            key={item.name}
            onClick={() => mobile && setSidebarOpen && setSidebarOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );
  if (mobile) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">SuperAdmin</h2>
            <p className="text-muted-foreground text-xs">ChurchHub Global</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItems />
        </nav>
      </div>
    );
  }
  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">SuperAdmin</h2>
          <p className="text-muted-foreground text-xs">ChurchHub Global</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              <NavItems />
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}
