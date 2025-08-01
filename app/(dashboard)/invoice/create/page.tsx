import UserModel, { IUser } from '@/models/user.model';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/connectDB';
import CreateEditInvoice from '@/app/(dashboard)/_component/CreateEditInvoice';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function InvoiceCreate() {
  const session = await auth();
  if (!session) return null;

  await connectDB();

  const user = (await UserModel.findById(session.user.id)
    .select('streetAddress city postalCode')
    .lean()) as Pick<IUser, 'streetAddress' | 'city' | 'postalCode'> | null;

  if (!user) return null;

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <Link href="/invoice" className={buttonVariants({ size: 'icon' })}>
          <ArrowLeft />
        </Link>
        <h1 className="text-xl font-semibold">Create Invoice</h1>
      </div>

      <CreateEditInvoice
        firstName={session.user.firstName}
        lastName={session.user.lastName}
        email={session.user.email}
        currency={session.user.currency}
        address1={user.streetAddress || ''}
        address2={user.city || ''}
        address3={user.postalCode || ''}
      />
    </div>
  );
}
