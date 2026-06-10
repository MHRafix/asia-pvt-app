import { VisaCard } from './VisaCard';

export function VisaList({ countries, onEdit, onDelete }: any) {
	return (
		<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
			{countries.map((country: any) => (
				<VisaCard
					key={country._id}
					country={country}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
