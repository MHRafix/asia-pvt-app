'use client';

import { BlogSection } from '@/components/blog/BlogSection';
import { PageBanner } from '@/components/common/PageBanner';
import { BlogPost } from '@/lib/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Blog = () => {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/blog');
			const data = await response.json();
			if (data.success) {
				setPosts(data.data);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
			toast.error('Failed to fetch blog posts');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen'>
			<div className='pt-20'>
				<PageBanner
					title='Travel Blog'
					subtitle='Stories, tips, and inspiration for your next adventure'
					gradient='forest'
				/>
				<BlogSection blogPosts={posts} loading={loading} />
			</div>
		</div>
	);
};

export default Blog;
