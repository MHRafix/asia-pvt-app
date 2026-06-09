import { User } from '@/lib/types';

export interface BlogPost {
	_id: string;
	title: string;
	excerpt: string;
	content: string;
	image: string;
	author: User;
	authorAvatar: string;
	date: string;
	category: string;
	readTime: string;
	tags: string[];
}
