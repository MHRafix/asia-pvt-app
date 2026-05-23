import { SignupForm } from '@/components/auth/SignupForm';
import { PageBanner } from '@/components/common/PageBanner';
import { UserPlus } from 'lucide-react';

const Signup = ({ searchParams }: any) => {
	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				<PageBanner
					title='Create Account'
					subtitle='Join us and start your adventure'
				/>

				<section className='py-24 bg-background'>
					<div className='container mx-auto px-4 max-w-md'>
						<div className='bg-card rounded-2xl shadow-elevated p-8'>
							<div className='text-center mb-8'>
								<div className='w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4'>
									<UserPlus className='w-8 h-8 text-primary-foreground' />
								</div>
								<h2 className='font-display text-2xl font-bold text-foreground'>
									Join TravelHub
								</h2>
								<p className='font-body text-sm text-muted-foreground mt-2'>
									Create an account to get started
								</p>
							</div>

							<SignupForm searchParams={searchParams} />
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Signup;
