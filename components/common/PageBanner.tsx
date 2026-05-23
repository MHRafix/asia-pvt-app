interface PageBannerProps {
	title: string;
	subtitle: string;
	gradient?: 'hero' | 'ocean' | 'forest';
	backgroundImage?: string;
}

export function PageBanner({
	title,
	subtitle,
	gradient = 'hero',
	backgroundImage = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
}: PageBannerProps) {
	return (
		<div 
			className='relative py-32 md:py-40 overflow-hidden'
			style={{
				backgroundImage: backgroundImage,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			{/* Overlay */}
			<div className='absolute inset-0 bg-black/30' />
			
			{/* Pattern overlay */}
			<div className='absolute inset-0 opacity-10'>
				<div className='absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl' />
				<div className='absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl' />
			</div>

			<div className='container mx-auto px-4 text-center relative z-10'>
				<h1 className='font-display text-5xl md:text-6xl font-bold text-primary-foreground mb-4 text-balance'>
					{title}
				</h1>
				<p className='font-body text-xl text-primary-foreground/90 max-w-3xl mx-auto text-balance'>
					{subtitle}
				</p>
			</div>
		</div>
	);
}
