'use client';

import { useToast } from '@/hooks/use-toast';
import { useState, useTransition, type ReactElement } from 'react';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export default function DeleteDialog({
	id,
	action,
}: {
	id: string;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
}): ReactElement {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const { toast } = useToast();

	// Handle delete order button click
	const handleDeleteClick = () => {
		startTransition(async () => {
			try {
				const res = await action(id);
				if (!res.success) {
					toast({
						variant: 'destructive',
						description: res.message,
					});
				} else {
					setOpen(false);
					toast({
						description: res.message,
					});
				}
			} catch (error) {
				console.error('Failed to delete:', error);
				toast({
					variant: 'destructive',
					description: 'Something went wrong. Please try again later.',
				});
			}
		});
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size='sm' variant='destructive' className='ml-2'>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						variant='destructive'
						size='sm'
						disabled={isPending}
						onClick={handleDeleteClick}>
						{isPending ? 'Deleting' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
