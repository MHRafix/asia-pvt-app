'use client';
import { AppointmentSection } from '@/components/home/AppointmentSection';
import { BlogSection } from '@/components/home/BlogSection';
import { CTASection } from '@/components/home/CTASection';
import { HeroSection } from '@/components/home/HeroSection';
import { PackagesSection } from '@/components/home/PackagesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { VisaSection } from '@/components/home/VisaSection';
import { VisaCountry } from '@/data/countries';
import { TravelPackage } from '@/data/packages';
import { BlogPost, Service } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Index = () => {
	const [packages, setPackages] = useState<TravelPackage[]>([]);
	const [loadingPackages, setLoadingPackages] = useState(false);
	const [loadingCountries, setLoadingCountries] = useState(false);

	const [loadingBlog, setLoadingBlog] = useState(false);

	const [loadingServices, setLoadingServices] = useState(false);

	const [posts, setPosts] = useState<BlogPost[]>([]);

	const [services, setServices] = useState<Service[]>([]);

	const [countries, setCountries] = useState<VisaCountry[]>([]);

	useEffect(() => {
		fetchPackages();
		fetchCountries();
		fetchServices();
		fetchPosts();
	}, []);

	const fetchCountries = async () => {
		try {
			setLoadingCountries(true);
			const response = await fetch('/api/visa');
			const data = await response.json();
			if (data.success) {
				setCountries(data.data);
			}
		} catch (error) {
			console.error('Error fetching countries:', error);
			toast.error('Failed to fetch visa countries');
		} finally {
			setLoadingCountries(false);
		}
	};

	const fetchPackages = async () => {
		try {
			setLoadingPackages(true);
			const response = await fetch('/api/packages');
			const data = await response.json();
			if (data.success) {
				setPackages(data.data);
			}
		} catch (error) {
			console.error('[v0] Error fetching packages:', error);
			toast.error('Failed to fetch packages');
		} finally {
			setLoadingPackages(false);
		}
	};

	const fetchPosts = async () => {
		try {
			setLoadingBlog(true);
			const response = await fetch('/api/blog');
			const data = await response.json();
			if (data.success) {
				setPosts(data.data);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
			toast.error('Failed to fetch blog posts');
		} finally {
			setLoadingBlog(false);
		}
	};

	const fetchServices = async () => {
		try {
			setLoadingServices(true);
			const response = await fetch('/api/services');
			const data = await response.json();
			if (data.success) {
				setServices(data.data);
			}
		} catch (error) {
			console.error('Error fetching services:', error);
			toast.error('Failed to fetch services');
		} finally {
			setLoadingServices(false);
		}
	};

	return (
		<div className='min-h-screen'>
			<HeroSection />
			<PackagesSection packages={packages} loading={loadingPackages} />
			<VisaSection
				countries={countries?.slice(0, 6)}
				loading={loadingCountries}
			/>
			<AppointmentSection services={services} loading={loadingServices} />
			<TestimonialsSection />
			<BlogSection blogPosts={posts.slice(0, 3)} loading={loadingBlog} />
			<CTASection />
		</div>
	);
};

export default Index;
