'use client';

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';

import { VisaForm, VisaFormValues } from './VisaForm';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editingId: string | null;
	defaultValues: VisaFormValues;
	submitting: boolean;
	onSubmit: (data: VisaFormValues) => Promise<void>;
};

export function VisaDrawer({
	open,
	onOpenChange,
	editingId,
	defaultValues,
	submitting,
	onSubmit,
}: Props) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='sm:max-w-4xl  overflow-auto'>
				<SheetHeader>
					<SheetTitle>{editingId ? 'Edit Country' : 'Add Country'}</SheetTitle>

					<SheetDescription>Manage visa country</SheetDescription>
				</SheetHeader>

				<VisaForm
					defaultValues={defaultValues}
					onSubmit={onSubmit}
					submitting={submitting}
				/>
			</SheetContent>
		</Sheet>
	);
}
