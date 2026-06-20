import { LoginForm } from '@/components/auth/LoginForm';
import { PageBanner } from '@/components/common/PageBanner';
import { User } from 'lucide-react';

const Login = () => {
	return (
		<div className='min-h-screen'>
			<PageBanner
				title='Login'
				subtitle='Sign in to your account and start exploring'
				backgroundImage='https://images.unsplash.com/photo-1662197179812-a02407622d37?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
			/>

			<section className='py-24 bg-background'>
				<div className='container mx-auto px-4 max-w-md'>
					<div className='bg-card rounded-2xl shadow-elevated p-8'>
						<div className='text-center mb-8'>
							<div className='w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto mb-4'>
								<User className='w-8 h-8 text-primary-foreground' />
							</div>
							<h2 className='font-display text-2xl font-bold text-foreground'>
								Welcome Back
							</h2>
							<p className='font-body text-sm text-muted-foreground mt-2'>
								Sign in to your account
							</p>
						</div>

						<LoginForm />
					</div>
				</div>
			</section>
		</div>
	);
};

export default Login;
