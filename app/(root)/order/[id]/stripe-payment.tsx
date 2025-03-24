const StripePayment = ({
	priceInCents,
	orderId,
	clientSecret,
}: {
	priceInCents: number;
	orderId: string;
	clientSecret: string;
}) => {
	return <div>StripePayment</div>;
};

export default StripePayment;
