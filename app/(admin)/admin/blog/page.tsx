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
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth/AuthContext';
import type { BlogPost } from '@/lib/types';
import { yupResolver } from '@hookform/resolvers/yup';
import {
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
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const defaultValues = {
	title: '',
	excerpt: '',
	content: '',
	image: '',
	category: '',
	tags: [''],
};

export default function BlogAdminPage() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const { user } = useAuth();

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<BlogFormValues>({
		resolver: yupResolver(blogSchema),
		defaultValues,
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'tags',
	});

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

	const onSubmit = async (values: BlogFormValues) => {
		try {
			const url = editingId ? `/api/blog/${editingId}` : '/api/blog';

			const method = editingId ? 'PUT' : 'POST';

			const cleanedData = {
				...values,
				tags: values?.tags?.filter((tag) => tag.trim()),
				author: user?.id,
			};

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cleanedData),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(
					editingId
						? 'Post updated successfully!'
						: 'Post created successfully!',
				);

				setDrawerOpen(false);

				reset();

				fetchPosts();
			} else {
				toast.error(data.message || 'Operation failed');
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to save post');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this post?')) return;

		try {
			const response = await fetch(`/api/blog/${id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (data.success) {
				toast.success('Post deleted!');
				fetchPosts();
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to delete post');
		}
	};

	const handleEdit = (post: BlogPost) => {
		setEditingId(post._id || null);

		reset({
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			image: post.image || '',
			category: post.category,
			tags: post.tags?.length ? post.tags : [''],
		});

		setDrawerOpen(true);
	};

	const resetForm = () => {
		reset(defaultValues);
		setEditingId(null);
	};

	const filteredPosts = posts.filter(
		(post) =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
													{post.author?.name}
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
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-6 py-4 mx-2'
						>
							{/* Basic Info */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Basic Information
								</h4>

								<div className='grid grid-cols-2 gap-3'>
									<div>
										<Input placeholder='Title *' {...register('title')} />
										{errors.title && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.title.message}
											</p>
										)}
									</div>

									<div>
										<Input placeholder='Category *' {...register('category')} />
										{errors.category && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.category.message}
											</p>
										)}
									</div>
								</div>

								<div>
									<Textarea
										placeholder='Short description *'
										rows={2}
										{...register('excerpt')}
									/>
									{errors.excerpt && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.excerpt.message}
										</p>
									)}
								</div>

								<div>
									<Input placeholder='Image URL' {...register('image')} />
									{errors.image && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.image.message}
										</p>
									)}
								</div>
							</div>

							{/* Content */}
							<div className='space-y-4'>
								<h4 className='font-medium text-sm text-muted-foreground'>
									Content
								</h4>

								<div>
									<Textarea
										rows={10}
										placeholder='Full content (supports markdown) *'
										{...register('content')}
									/>

									{errors.content && (
										<p className='text-red-500 text-xs mt-1'>
											{errors.content.message}
										</p>
									)}
								</div>
							</div>

							{/* Tags */}
							<div className='space-y-3 bg-white p-4 rounded-md'>
								<div className='flex items-center justify-between'>
									<h4 className='font-medium text-sm text-muted-foreground'>
										Tags
									</h4>

									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => append('')}
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>

								{fields.map((field, index) => (
									<div key={field.id} className='flex gap-2'>
										<div className='flex-1'>
											<Input placeholder='Tag' {...register(`tags.${index}`)} />

											{errors.tags?.[index] && (
												<p className='text-red-500 text-xs mt-1'>
													{errors.tags[index]?.message}
												</p>
											)}
										</div>

										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => remove(index)}
										>
											<X className='w-4 h-4' />
										</Button>
									</div>
								))}

								{typeof errors.tags?.message === 'string' && (
									<p className='text-red-500 text-xs'>{errors.tags.message}</p>
								)}
							</div>

							<Button type='submit' disabled={isSubmitting} className='w-full'>
								{isSubmitting
									? 'Saving...'
									: editingId
										? 'Update Post'
										: 'Create Post'}
							</Button>
						</form>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);
}

import * as yup from 'yup';

export const blogSchema = yup.object({
	title: yup
		.string()
		.required('Title is required')
		.min(3, 'Title must be at least 3 characters'),

	category: yup.string().required('Category is required'),

	excerpt: yup
		.string()
		.required('Excerpt is required')
		.min(10, 'Excerpt must be at least 10 characters'),

	content: yup
		.string()
		.required('Content is required')
		.min(50, 'Content must be at least 50 characters'),

	image: yup
		.string()
		// .url('Please enter a valid URL')
		.notRequired()
		.transform((value) => (value === '' ? undefined : value)),

	tags: yup
		.array()
		.of(yup.string().required('Tag cannot be empty'))
		.min(1, 'At least one tag is required'),
});

export type BlogFormValues = yup.InferType<typeof blogSchema>;
