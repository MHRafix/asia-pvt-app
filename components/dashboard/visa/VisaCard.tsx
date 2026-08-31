import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Edit2, Trash2 } from 'lucide-react';

export function VisaCard({ country, onEdit, onDelete }: any) {
	return (
		<Card className='border-0 shadow-soft hover:shadow-md transition-shadow'>
			<CardContent className='p-5'>
				<div className='flex items-start justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl'>
							{country.flag}
						</div>

						<div>
							<h3 className='font-semibold'>{country.name}</h3>

							<p className='text-sm text-muted-foreground'>{country.type}</p>
						</div>
					</div>

					<div className='flex gap-1'>
						<Button size='sm' variant='ghost' onClick={() => onEdit(country)}>
							<Edit2 className='w-4 h-4' />
						</Button>

						<Button
							size='sm'
							variant='ghost'
							onClick={() => onDelete(country._id)}
						>
							<Trash2 className='w-4 h-4 text-destructive' />
						</Button>
					</div>
				</div>

				<div className='mt-4 flex gap-2'>
					<Badge variant='secondary'>
						<Clock className='w-3 h-3 mr-1' />
						{country.processing}
					</Badge>

					<Badge variant='outline'>
						{country.requirements.length} requirements
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
