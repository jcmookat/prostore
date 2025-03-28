import { type ReactElement } from 'react';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/shared/delete-dialog';

export const metadata: Metadata = {
  title: 'Admin - Orders',
};
export default async function AdminOrdersPage(props: {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
}): Promise<ReactElement> {
  await requireAdmin();
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || '';
  const orders = await getAllOrders({
    page,
    query: searchText,
  });
  const { data, totalPages } = orders;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <h1 className="h2-bold">Orders</h1>
        {searchText && (
          <div>
            {' '}
            Filtered by{' '}
            <i className="mr-4 font-bold">&quot;{searchText}&quot;</i>
            <Link href={`/admin/orders`}>
              <Button variant="outline" size="sm">
                Remove Filter
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAYMENT METHOD</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <>
                      <Badge variant="default" className="mr-1">
                        Paid
                      </Badge>{' '}
                      {formatDateTime(order.paidAt).dateTime}
                    </>
                  ) : (
                    <Badge variant="secondary">Not paid</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <>
                      <Badge variant="default" className="mr-1">
                        Delivered
                      </Badge>{' '}
                      {formatDateTime(order.deliveredAt).dateTime}
                    </>
                  ) : (
                    <Badge variant="secondary">Not delivered</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
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
