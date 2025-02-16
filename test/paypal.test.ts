import { generateAccessToken } from '../lib/paypal';

// Generate a Paypal access token
test('generate a Paypal access token', async () => {
	const tokenResponse = await generateAccessToken();
	console.log(tokenResponse);

	// Should be a string that is not empty
	expect(typeof tokenResponse).toBe('string');
	expect(tokenResponse.length).toBeGreaterThan(0);
});
