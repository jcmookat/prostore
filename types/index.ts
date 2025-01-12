import { z } from 'zod';
import { insertProductSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
	id: string; // not inserted but created automatically in the DB
	rating: string;
	createdAt: Date; // not inserted but created automatically in the DB
};
