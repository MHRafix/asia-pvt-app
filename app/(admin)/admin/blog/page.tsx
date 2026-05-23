'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { BlogPost } from '@/lib/types';
import {
	Clock,
	Edit2,
	FileText,
	Loader,
	Plus,
	Search,
	Trash2,
	User,
	X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const initialFormData = {
	id: '',
	title: '',
	excerpt: '',
	content: '',
	image: '',
	author: '',
	authorAvatar: '',
	date: '',
	category: '',
	readTime: '5 min read',
	tags: [''],
};

export default function BlogAdminPage() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

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
			console.error('[v0] Error fetching posts:', error);
			toast.error('Failed to fetch blog posts');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!formData.id ||
			!formData.title ||
			!formData.excerpt ||
			!formData.content
		) {
			toast.error('Please fill in all required fields');
			return;
		}

		setSubmitting(true);
		try {
			const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
			const method = editingId ? 'PUT' : 'POST';

			const cleanedData = {
				...formData,
				tags: formData.tags.filter((t) => t.trim()),
			};

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();
			if (data.success) {
				toast.success(editingId ? 'Post updated!' : 'Post created!');
				setDrawerOpen(false);
				resetForm();
				fetchPosts();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to save post');
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this post?')) return;
		try {
			const response = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
			const data = await response.json();
			if (data.success) {
				toast.success('Post deleted!');
				fetchPosts();
			}
		} catch (error) {
			console.error('[v0] Error:', error);
			toast.error('Failed to delete post');
		}
	};

	const handleEdit = (post: BlogPost) => {
		setEditingId(post._id || null);
		setFormData({
			id: post.id,
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			image: post.image,
			author: post.author,
			authorAvatar: post.authorAvatar,
			date: post.date,
			category: post.category,
			readTime: post.readTime,
			tags: post.tags.length > 0 ? post.tags : [''],
		});
		setDrawerOpen(true);
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setEditingId(null);
	};

	const addTag = () => {
		setFormData({ ...formData, tags: [...formData.tags, ''] });
	};

	const updateTag = (index: number, value: string) => {
		const updated = [...formData.tags];
		updated[index] = value;
		setFormData({ ...formData, tags: updated });
	};

	const removeTag = (index: number) => {
		const updated = formData.tags.filter((_, i) => i !== index);
		setFormData({ ...formData, tags: updated.length > 0 ? updated : [''] });
	};

	const filteredPosts = posts.filter(
		(post) =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.category.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>Blog Posts</h1>
					<p className='text-muted-foreground mt-1'>Manage your blog content</p>
				</div>
				<Button
					onClick={() => {
						resetForm();
						setDrawerOpen(true);
					}}
					className='gap-2'
				>
					<Plus className='w-4 h-4' />
					Add Post
				</Button>
			</div>

			{/* Search */}
			<div className='relative mb-6'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
				<Input
					placeholder='Search posts...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10'
				/>
			</div>

			{/* Posts List */}
			{loading ? (
				<div className='flex items-center justify-center py-12'>
					<Loader className='w-8 h-8 animate-spin text-primary' />
				</div>
			) : filteredPosts.length === 0 ? (
				<Card className='border-0 shadow-soft'>
					<CardContent className='py-12 text-center'>
						<FileText className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
						<p className='text-muted-foreground'>
							{searchQuery ? 'No posts match your search' : 'No blog posts yet'}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4'>
					{filteredPosts.map((post) => (
						<Card
							key={post._id}
							className='border-0 shadow-soft hover:shadow-md transition-shadow'
						>
							<CardContent className='p-5'>
								<div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
									<div className='flex items-start gap-4 flex-1'>
										<div className='w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center shrink-0'>
											<FileText className='w-6 h-6 text-purple-500' />
										</div>
										<div className='flex-1 min-w-0'>
											<h3 className='font-semibold text-foreground text-lg truncate'>
												{post.title}
											</h3>
											<p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
												{post.excerpt}
											</p>
											<div className='flex flex-wrap items-center gap-3 mt-3'>
												<span className='flex items-center gap-1 text-sm text-muted-foreground'>
													<User className='w-3.5 h-3.5' />
													{post.author}
												</span>
												<span className='flex items-center gap-1 text-sm text-muted-foreground'>
													<Clock className='w-3.5 h-3.5' />
													{post.readTime}
												</span>
												<Badge variant='secondary'>{post.category}</Badge>
											</div>
											{post.tags.length > 0 && (
												<div className='flex flex-wrap gap-1 mt-2'>
													{post.tags.slice(0, 3).map((tag, i) => (
														<Badge
															key={i}
															variant='outline'
															className='text-xs'
														>
															{tag}
														</Badge>
													))}
													{post.tags.length > 3 && (
														<Badge variant='outline' className='text-xs'>
															+{post.tags.length - 3}
														</Badge>
													)}
												</div>
											)}
										</div>
									</div>
									<div className='flex gap-2 shrink-0'>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleEdit(post)}
										>
											<Edit2 className='w-4 h-4' />
										</Button>
										<Button
											size='sm'
											variant='ghost'
											onClick={() => handleDelete(post._id!)}
										>
											<Trash2 className='w-4 h-4 text-destructive' />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Drawer Form */}
			<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
				<SheetContent className='w-full sm:max-w-5xl px-4 overflow-auto'>
					<SheetHeader>
						<SheetTitle>{editingId ? 'Edit Post' : 'Add New Post'}</SheetTitle>
						<SheetDescription>
							{editingId
								? 'Update blog post details'
								: 'Create a new blog post'}
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className='flex-1 px-1 -mx-1'>
						<form onSubmit={handleSubmit} className='space-y-6 py-4 mx-2'>
							{/* Basic Info */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Basic Information
								</h4>
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Post ID *'
										value={formData.id}
										onChange={(e) =>
											setFormData({ ...formData, id: e.target.value })
										}
										required
									/>
									<Input
										placeholder='Category *'
										value={formData.category}
										onChange={(e) =>
											setFormData({ ...formData, category: e.target.value })
										}
										required
									/>
								</div>
								<Input
									placeholder='Title *'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									required
								/>
								<Textarea
									placeholder='Excerpt *'
									value={formData.excerpt}
									onChange={(e) =>
										setFormData({ ...formData, excerpt: e.target.value })
									}
									rows={2}
									required
								/>
								<Input
									placeholder='Image URL'
									value={formData.image}
									onChange={(e) =>
										setFormData({ ...formData, image: e.target.value })
									}
								/>
							</div>

							{/* Author Info */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Author Information
								</h4>
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Author Name'
										value={formData.author}
										onChange={(e) =>
											setFormData({ ...formData, author: e.target.value })
										}
									/>
									<Input
										placeholder='Author Avatar (initials)'
										value={formData.authorAvatar}
										onChange={(e) =>
											setFormData({ ...formData, authorAvatar: e.target.value })
										}
									/>
								</div>
								<div className='grid grid-cols-2 gap-3'>
									<Input
										placeholder='Date (e.g., Jan 15, 2025)'
										value={formData.date}
										onChange={(e) =>
											setFormData({ ...formData, date: e.target.value })
										}
									/>
									<Input
										placeholder='Read Time (e.g., 5 min read)'
										value={formData.readTime}
										onChange={(e) =>
											setFormData({ ...formData, readTime: e.target.value })
										}
									/>
								</div>
							</div>

							{/* Content */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Content
								</h4>
								<Textarea
									placeholder='Full content (supports markdown) *'
									value={formData.content}
									onChange={(e) =>
										setFormData({ ...formData, content: e.target.value })
									}
									rows={10}
									required
								/>
							</div>

							{/* Tags */}
							<div className='space-y-3'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Tags
									</h4>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={addTag}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>
								{formData.tags.map((tag, index) => (
									<div key={index} className='flex gap-2'>
										<Input
											placeholder='Tag'
											value={tag}
											onChange={(e) => updateTag(index, e.target.value)}
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => removeTag(index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>
						</form>
					</ScrollArea>

					<SheetFooter className='border-t border-border pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								setDrawerOpen(false);
								resetForm();
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSubmit} disabled={submitting}>
							{submitting && <Loader className='w-4 h-4 mr-2 animate-spin' />}
							{editingId ? 'Update Post' : 'Create Post'}
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
