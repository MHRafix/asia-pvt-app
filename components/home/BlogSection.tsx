import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/lib/types';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export function BlogSection({ blogPosts }: { blogPosts: BlogPost[] }) {
	return (
		<section className='py-24 bg-muted'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row md:items-end justify-between mb-12'>
					<div className='max-w-xl mb-6 md:mb-0'>
						<span className='inline-block px-4 py-2 rounded-full bg-forest/10 text-forest font-body text-sm font-medium mb-4'>
							Travel Blog
						</span>
						<h2 className='font-display text-4xl md:text-5xl font-bold text-foreground mb-4'>
							Travel Stories & Tips
						</h2>
						<p className='font-body text-muted-foreground text-lg'>
							Get inspired by our latest travel guides, tips, and destination
							highlights
						</p>
					</div>
					<Button variant='outline' size='lg' asChild>
						<Link href='/blog'>
							View All Posts
							<ArrowRight className='w-4 h-4' />
						</Link>
					</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{blogPosts.slice(0, 3).map((post, index) => (
						<article key={post.id}>
							<Card className='border-0 shadow-card hover:shadow-elevated transition-all p-0 duration-300 overflow-hidden group'>
								<Link href={`/blog/${post.id}`}>
									<div className='relative h-56 overflow-hidden'>
										<img
											src={post.image}
											alt={post.title}
											className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
										/>
										<div className='absolute top-4 left-4'>
											<span className='px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm font-body text-xs font-medium text-foreground'>
												{post.category}
											</span>
										</div>
									</div>
								</Link>
								<CardContent className='p-6'>
									<div className='flex items-center gap-4 text-muted-foreground mb-4'>
										<div className='flex items-center gap-1'>
											<User className='w-4 h-4' />
											<span className='font-body text-sm'>{post.author}</span>
										</div>
										<div className='flex items-center gap-1'>
											<Calendar className='w-4 h-4' />
											<span className='font-body text-sm'>{post.date}</span>
										</div>
									</div>
									<Link href={`/blog/${post.id}`}>
										<h3 className='font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors'>
											{post.title}
										</h3>
									</Link>
									<p className='font-body text-muted-foreground line-clamp-2 mb-4'>
										{post.excerpt}
									</p>
									<Link
										href={`/blog/${post.id}`}
										className='inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:gap-3 transition-all'
									>
										Read More
										<ArrowRight className='w-4 h-4' />
									</Link>
								</CardContent>
							</Card>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
