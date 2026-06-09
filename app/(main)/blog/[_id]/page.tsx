'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost as IBlog } from '@/data/blog';
import { ArrowLeft, Calendar, Clock, Loader, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BlogPost = () => {
	const [post, setPost] = useState<IBlog>();
	const [loading, setLoading] = useState(true);

	const { _id } = useParams<{ _id: string }>();

	useEffect(() => {
		fetchPost();
	}, []);

	const fetchPost = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/blog/${_id}`);
			const data = await response.json();
			if (data.success) {
				setPost(data.data);
			}
		} catch (error) {
			console.error('Error fetching blog post:', error);
			toast.error('Failed to fetch blog post');
		} finally {
			setLoading(false);
		}
	};

	const [posts, setPosts] = useState<IBlog[]>([]);

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

	const relatedPosts = posts.filter((p) => p._id !== _id).slice(0, 2);

	if (loading) {
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader className='w-8 h-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!post) {
		return (
			<div className='min-h-screen'>
				<div className='pt-40 text-center'>
					<h1 className='font-display text-3xl font-bold text-foreground mb-4'>
						Post Not Found
					</h1>
					<Button variant='coral' asChild>
						<Link href='/blog'>Browse All Posts</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen'>
			{/* Hero Image */}
			<div className='relative h-[45vh] min-h-[350px]'>
				<img
					src={post.image}
					alt={post.title}
					className='w-full h-full object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent' />
				<div className='absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10'>
					<Button
						variant='ghost'
						className='text-primary-foreground mb-4'
						// onClick={() => navigate(-1)}
					>
						<ArrowLeft className='w-4 h-4' />
						Back
					</Button>
					<span className='inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground font-body text-xs font-medium mb-3'>
						{post.category}
					</span>
					<h1 className='font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 max-w-3xl'>
						{post.title}
					</h1>
					<div className='flex flex-wrap items-center gap-6 text-primary-foreground/80'>
						<div className='flex items-center gap-2'>
							<User className='w-4 h-4' />
							<span className='font-body text-sm'>{post.author?.name}</span>
						</div>
						<div className='flex items-center gap-2'>
							<Calendar className='w-4 h-4' />
							{/* <span className='font-body text-sm'>{post}</span> */}
						</div>
						<div className='flex items-center gap-2'>
							<Clock className='w-4 h-4' />
							<span className='font-body text-sm'>{post.readTime}</span>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-16'>
				<div className='grid lg:grid-cols-3 gap-12'>
					{/* Article Content */}
					<article className='lg:col-span-2'>
						<div className='prose prose-lg max-w-none font-body text-foreground'>
							{post.content.split('\n\n').map((paragraph, i) => {
								if (paragraph.startsWith('## ')) {
									return (
										<h2
											key={i}
											className='font-display text-2xl font-bold text-foreground mt-10 mb-4'
										>
											{paragraph.replace('## ', '')}
										</h2>
									);
								}
								if (paragraph.startsWith('### ')) {
									return (
										<h3
											key={i}
											className='font-display text-xl font-semibold text-foreground mt-8 mb-3'
										>
											{paragraph.replace('### ', '')}
										</h3>
									);
								}
								if (paragraph.startsWith('- ')) {
									return (
										<ul key={i} className='space-y-2 my-4'>
											{paragraph.split('\n').map((item, j) => (
												<li
													key={j}
													className='flex items-start gap-2 text-muted-foreground'
												>
													<span className='w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0' />
													{item.replace('- ', '')}
												</li>
											))}
										</ul>
									);
								}
								if (paragraph.startsWith('**')) {
									return (
										<p
											key={i}
											className='text-muted-foreground leading-relaxed mb-4 font-medium'
										>
											{paragraph.replace(/\*\*/g, '')}
										</p>
									);
								}
								return (
									<p
										key={i}
										className='text-muted-foreground leading-relaxed mb-4'
									>
										{paragraph}
									</p>
								);
							})}
						</div>

						{/* Tags */}
						<div className='mt-10 pt-8 border-t border-border'>
							<div className='flex items-center gap-2 flex-wrap'>
								<Tag className='w-4 h-4 text-muted-foreground' />
								{post.tags.map((tag) => (
									<span
										key={tag}
										className='px-3 py-1 rounded-full bg-muted font-body text-xs text-muted-foreground'
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</article>

					{/* Sidebar */}
					<div className='space-y-8'>
						{/* Author */}
						<Card className='border-0 shadow-card'>
							<CardContent className='p-6 text-center'>
								<div className='w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4'>
									<span className='font-body font-bold text-primary-foreground  text-lg'>
										{post.authorAvatar}
									</span>
								</div>
								<h4 className='font-display text-lg font-semibold text-foreground'>
									{post.author?.name}
								</h4>
								<p className='font-body text-sm text-muted-foreground'>
									Travel Writer
								</p>
							</CardContent>
						</Card>

						{/* Related Posts */}
						<div>
							<h3 className='font-display text-xl font-bold text-foreground mb-4'>
								Related Posts
							</h3>
							<div className='space-y-4'>
								{relatedPosts.map((rp) => (
									<Card
										key={rp._id}
										className='border-0 p-0 shadow-soft hover:shadow-card transition-all overflow-hidden'
									>
										<Link href={`/blog/${rp._id}`}>
											<div className='flex'>
												<img
													src={rp.image}
													alt={rp.title}
													className='w-24 h-24 object-cover flex-shrink-0'
												/>
												<CardContent className='p-3 flex flex-col justify-center'>
													<p className='font-body text-sm text-primary mb-1'>
														{rp.category}
													</p>
													<h4 className='font-display text-md font-semibold text-foreground line-clamp-2'>
														{rp.title}
													</h4>
												</CardContent>
											</div>
										</Link>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogPost;
