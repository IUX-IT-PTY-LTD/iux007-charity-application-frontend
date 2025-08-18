// components/admin/menus/list/MenusHeader.jsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MenusHeader = () => {
  const router = useRouter();

  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>All Menus</CardTitle>
        <CardDescription>Manage your website navigation menus</CardDescription>
      </div>

      <Button
        onClick={() => router.push('/admin/menus/create')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Menu
      </Button>
    </CardHeader>
  );
};

export default MenusHeader;
