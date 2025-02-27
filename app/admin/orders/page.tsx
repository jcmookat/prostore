import { type ReactElement } from 'react';
import { getAllOrders } from '@/lib/actions/order.actions';
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

export const metadata: Metadata = {
  title: 'Admin Orders',
};
export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string }>;
}): Promise<ReactElement> {
  await requireAdmin();
  const { page = '1' } = await props.searchParams;
  const orders = await getAllOrders({
    page: Number(page),
  });

  console.log(orders);
  return (
    <>
      {' '}
      <div className="space-y-2">
        <h2 className="h2-bold">Orders</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt ? (
                      <>
                        <Badge variant="default" className="mr-1">
                          Paid
                        </Badge>{' '}
                        {formatDateTime(order.paidAt).dateTime}
                      </>
                    ) : (
                      <Badge variant="destructive">Not paid</Badge>
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
                      <Badge variant="destructive">Not delivered</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders.totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}
