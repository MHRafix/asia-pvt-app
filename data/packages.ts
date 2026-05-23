export interface TravelPackage {
	id: string;
	title: string;
	location: string;
	image: any;
	price: number;
	duration: string;
	groupSize: string;
	rating: number;
	reviews: number;
	description: string;
	highlights: string[];
	included: string[];
	notIncluded: string[];
	itinerary: { day: number; title: string; description: string }[];
}

export const packages: TravelPackage[] = [
	{
		id: 'santorini-dreams',
		title: 'Santorini Dreams',
		location: 'Greece',
		image: '/destinations/destination-dubai.jpg',
		price: 2499,
		duration: '7 Days',
		groupSize: '2-8',
		rating: 4.9,
		reviews: 234,
		description:
			'Experience the breathtaking beauty of Santorini with its iconic blue-domed churches, stunning sunsets, and crystal-clear waters. This curated package takes you through the best of this Greek paradise.',
		highlights: [
			'Oia sunset viewpoint tour',
			'Private catamaran cruise',
			'Wine tasting at local vineyards',
			'Ancient Akrotiri archaeological site',
			'Beach hopping - Red, Black & White beaches',
		],
		included: [
			'6 nights luxury accommodation',
			'Daily breakfast & 3 dinners',
			'Airport transfers',
			'Guided tours with local experts',
			'Catamaran sunset cruise',
			'Travel insurance',
		],
		notIncluded: [
			'International flights',
			'Personal expenses',
			'Optional activities',
			'Visa fees (if applicable)',
		],
		itinerary: [
			{
				day: 1,
				title: 'Arrival in Santorini',
				description:
					'Airport transfer, hotel check-in, welcome dinner with sea view.',
			},
			{
				day: 2,
				title: 'Oia Village Tour',
				description:
					'Explore the iconic blue domes, local artisan shops, and sunset viewpoint.',
			},
			{
				day: 3,
				title: 'Catamaran Cruise',
				description:
					'Full-day sailing around the caldera with snorkeling and BBQ lunch.',
			},
			{
				day: 4,
				title: 'Wine & Culture',
				description:
					'Visit ancient Akrotiri ruins and local vineyard wine tasting.',
			},
			{
				day: 5,
				title: 'Beach Day',
				description:
					'Explore Red Beach, Black Beach, and Perissa with beachside lunch.',
			},
			{
				day: 6,
				title: 'Fira & Free Time',
				description:
					'Morning guided tour of Fira, afternoon free for shopping or spa.',
			},
			{
				day: 7,
				title: 'Departure',
				description: 'Breakfast and airport transfer.',
			},
		],
	},
	{
		id: 'cherry-blossom-tour',
		title: 'Cherry Blossom Tour',
		location: 'Japan',
		image: '/destinations/destination-greece.jpg',
		price: 3299,
		duration: '10 Days',
		groupSize: '4-12',
		rating: 4.8,
		reviews: 189,
		description:
			"Immerse yourself in Japanese culture during the magical sakura season. From Tokyo's bustling streets to Kyoto's serene temples, experience the perfect blend of tradition and modernity.",
		highlights: [
			'Sakura viewing at top spots',
			'Traditional tea ceremony',
			'Bullet train experience',
			'Mount Fuji day trip',
			'Geisha district walking tour',
		],
		included: [
			'9 nights accommodation',
			'Daily breakfast',
			'Japan Rail Pass (7 days)',
			'Guided tours in English',
			'Tea ceremony experience',
			'Travel insurance',
		],
		notIncluded: [
			'International flights',
			'Lunches & dinners',
			'Personal shopping',
			'Optional activities',
		],
		itinerary: [
			{
				day: 1,
				title: 'Arrive in Tokyo',
				description: 'Airport pickup, hotel check-in, Shinjuku evening walk.',
			},
			{
				day: 2,
				title: 'Tokyo Highlights',
				description:
					'Shibuya crossing, Meiji Shrine, Harajuku, and Ueno Park sakura.',
			},
			{
				day: 3,
				title: 'Asakusa & Akihabara',
				description:
					'Senso-ji temple, Nakamise street, and anime culture district.',
			},
			{
				day: 4,
				title: 'Mount Fuji Day Trip',
				description: '5th station visit, Hakone ropeway, and lake cruise.',
			},
			{
				day: 5,
				title: 'Bullet Train to Kyoto',
				description:
					'Shinkansen experience, arrive in Kyoto, Gion evening walk.',
			},
			{
				day: 6,
				title: 'Kyoto Temples',
				description: 'Fushimi Inari, Kinkaku-ji, and bamboo grove.',
			},
			{
				day: 7,
				title: 'Tea & Culture',
				description:
					'Traditional tea ceremony, Nishiki Market, kimono rental experience.',
			},
			{
				day: 8,
				title: 'Nara Day Trip',
				description: 'Deer park, Todai-ji temple, and historic streets.',
			},
			{
				day: 9,
				title: 'Osaka Food Tour',
				description:
					'Dotonbori street food, Osaka Castle, and farewell dinner.',
			},
			{
				day: 10,
				title: 'Departure',
				description: 'Breakfast and airport transfer from Osaka.',
			},
		],
	},
	{
		id: 'machu-picchu-adventure',
		title: 'Machu Picchu Adventure',
		location: 'Peru',
		image: '/destinations/destination-japan.jpg',
		price: 2799,
		duration: '8 Days',
		groupSize: '6-16',
		rating: 4.9,
		reviews: 312,
		description:
			'Trek through the Andes to the legendary Machu Picchu. This adventure combines ancient Incan heritage with stunning natural landscapes for an unforgettable South American experience.',
		highlights: [
			'Inca Trail trek',
			'Machu Picchu sunrise',
			'Sacred Valley exploration',
			'Cusco historic center',
			'Local community visit',
		],
		included: [
			'7 nights accommodation',
			'All meals during trek',
			'Professional trekking guide',
			'Porter service',
			'Train tickets',
			'Entrance fees',
		],
		notIncluded: [
			'International flights',
			'Travel insurance',
			'Tips for guides',
			'Personal gear',
		],
		itinerary: [
			{
				day: 1,
				title: 'Arrive in Cusco',
				description: 'Acclimatize to altitude, walking tour of Plaza de Armas.',
			},
			{
				day: 2,
				title: 'Sacred Valley',
				description:
					'Pisac ruins, Ollantaytambo fortress, and local market visit.',
			},
			{
				day: 3,
				title: 'Inca Trail Day 1',
				description: 'Begin trek from KM 82, camp at Wayllabamba.',
			},
			{
				day: 4,
				title: 'Inca Trail Day 2',
				description: "Dead Woman's Pass (4,215m), descend to Pacaymayo.",
			},
			{
				day: 5,
				title: 'Inca Trail Day 3',
				description: 'Runkurakay Pass, Sayacmarca ruins, cloud forest camp.',
			},
			{
				day: 6,
				title: 'Machu Picchu',
				description: 'Sunrise at Sun Gate, guided tour of the citadel.',
			},
			{
				day: 7,
				title: 'Cusco Free Day',
				description: 'Explore San Pedro Market, Sacsayhuaman, or spa day.',
			},
			{
				day: 8,
				title: 'Departure',
				description: 'Airport transfer and farewell.',
			},
		],
	},
	{
		id: 'dubai-luxury-escape',
		title: 'Dubai Luxury Escape',
		location: 'UAE',
		image: '/destinations/destination-peru.jpg',
		price: 3999,
		duration: '5 Days',
		groupSize: '2-6',
		rating: 4.7,
		reviews: 156,
		description:
			"Indulge in the ultimate luxury experience in Dubai. From the world's tallest building to desert safaris, experience opulence and adventure in this futuristic city.",
		highlights: [
			'Burj Khalifa At The Top',
			'Desert safari with dinner',
			'Dubai Marina yacht cruise',
			'Gold Souk shopping',
			'Atlantis Aquaventure',
		],
		included: [
			'4 nights 5-star hotel',
			'Daily breakfast & 2 dinners',
			'Airport transfers in luxury car',
			'Desert safari experience',
			'Burj Khalifa tickets',
			'Yacht cruise',
		],
		notIncluded: [
			'International flights',
			'Personal shopping',
			'Spa treatments',
			'Optional activities',
		],
		itinerary: [
			{
				day: 1,
				title: 'Arrival in Dubai',
				description:
					'Luxury car transfer, hotel check-in, Dubai Marina dinner.',
			},
			{
				day: 2,
				title: 'City Highlights',
				description: 'Burj Khalifa, Dubai Mall, fountains show, Gold Souk.',
			},
			{
				day: 3,
				title: 'Desert Adventure',
				description:
					'Morning at leisure, afternoon desert safari with BBQ dinner.',
			},
			{
				day: 4,
				title: 'Sea & Leisure',
				description: 'Morning yacht cruise, afternoon at Atlantis Aquaventure.',
			},
			{
				day: 5,
				title: 'Departure',
				description:
					'Last-minute shopping at Mall of Emirates, airport transfer.',
			},
		],
	},
];

export const destinations = packages.map((p) => ({
	id: p.id,
	label: `${p.title} — ${p.location}`,
	location: p.location,
}));
