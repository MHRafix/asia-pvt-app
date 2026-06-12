export function SplitButtons({
	title,
	message,
}: {
	title: string;
	message?: string;
}) {
	return (
		<div className='w-full'>
			<div className='flex flex-col p-4'>
				<h3 className='text-zinc-800 text-xl font-medium'>{title}</h3>
				{message && <p className='text-lg'>{message}</p>}
			</div>
		</div>
	);
}
