import { type ReactElement } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
  title: 'Update User',
};
export default async function AdminUserUpdatePage(props: {
  params: Promise<{
    id: string;
  }>;
}): Promise<ReactElement> {
  const { id } = await props.params;

  const user = await getUserById(id);

  if (!user) notFound();

  console.log(user);
  return <>Update</>;
}
