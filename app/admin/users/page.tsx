import { type ReactElement } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Metadata } from 'next';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { formatId } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { requireAdmin } from '@/lib/auth-guard';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function AdminUserPage(props: {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
}): Promise<ReactElement> {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || '';

  const users = await getAllUsers({
    page,
    query: searchText,
  });
  const { data, totalPages } = users;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <h1 className="h2-bold">Orders</h1>
        {searchText && (
          <div>
            {' '}
            Filtered by{' '}
            <i className="mr-4 font-bold">&quot;{searchText}&quot;</i>
            <Link href={`/admin/users`}>
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'user' ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge variant="default">Admin</Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </div>
  );
}
