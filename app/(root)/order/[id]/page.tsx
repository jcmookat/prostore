import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  // Get order ID
  const { id } = await props.params;
  const order = await getOrderById(id);

  // Get session
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  if (!userId) throw new Error('No User ID');

  // Redirect the user if they don't own the order
  if (order.userId !== userId && userRole !== 'admin') {
    return redirect('/unauthorized');
  }

  let client_secret = null;

  // Check if using Stripe and not paid
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: {
        orderId: order.id,
      },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={userRole === 'admin' || false}
      />
    </>
  );
};

export default OrderDetailsPage;
