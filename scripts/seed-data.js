/**
 * Seed Script - Populates the database with initial data
 * Run: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-data.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

// Blog Posts Data
const blogPosts = [
	{
		slug: 'hidden-gems-greece',
		id: 'hidden-gems-greece',
		title: 'Top 10 Hidden Gems in Greece You Must Visit',
		excerpt:
			'Discover off-the-beaten-path destinations that will make your Greek adventure unforgettable.',
		content: `Greece is more than just Santorini and Mykonos. While these islands are undeniably stunning, the country is home to countless hidden treasures waiting to be discovered by adventurous travelers.

## 1. Milos Island
Known as the "Island of Colors," Milos boasts some of the most unique beaches in the Mediterranean. Sarakiniko Beach, with its lunar-like white volcanic rock formations, looks like it belongs on another planet.

## 2. Zagori Villages
Nestled in the mountains of Epirus, the 46 Zagori villages are connected by ancient stone bridges and hiking trails.

## 3. Monemvasia
This medieval fortress town on a small island connected to the mainland by a causeway feels like stepping back in time.

## 4. Nafplio
Often called the most beautiful city in Greece, Nafplio was the country's first capital.

## 5. Samothrace
This remote island in the northern Aegean is a paradise for nature lovers.`,
		image: '/destinations/destination-dubai.jpg',
		author: 'Sarah Mitchell',
		authorAvatar: 'SM',
		date: 'Jan 15, 2025',
		category: 'Destinations',
		readTime: '8 min read',
		tags: ['Greece', 'Hidden Gems', 'Islands', 'Europe'],
	},
	{
		id: 'cherry-blossom-japan',
		slug: 'cherry-blossom-japan',
		title: 'Ultimate Guide to Cherry Blossom Season in Japan',
		excerpt:
			'Everything you need to know about experiencing sakura season like a local.',
		content: `Cherry blossom season (sakura) is Japan's most magical time of year. The delicate pink flowers transform the landscape into a pastel wonderland.

## When to Visit
Cherry blossoms typically bloom from late March to mid-April, but timing varies by region.

## Best Viewing Spots
### Tokyo
- Shinjuku Gyoen: 1,100 cherry trees across 58 hectares
- Ueno Park: Over 800 trees along the main pathway

### Kyoto
- Philosopher's Path: 2km canal path lined with hundreds of cherry trees
- Maruyama Park: Kyoto's most popular hanami spot`,
		image: '/destinations/destination-greece.jpg',
		author: 'James Chen',
		authorAvatar: 'JC',
		date: 'Jan 12, 2025',
		category: 'Travel Tips',
		readTime: '10 min read',
		tags: ['Japan', 'Cherry Blossoms', 'Culture', 'Asia'],
	},
	{
		slug: 'machu-picchu-trek',
		id: 'machu-picchu-trek',
		title: 'Preparing for Your Machu Picchu Trek',
		excerpt:
			'Essential tips and packing list for conquering the Inca Trail adventure.',
		content: `The Inca Trail to Machu Picchu is one of the world's most iconic treks. This 4-day, 43-kilometer journey through the Andes culminates at the Sun Gate with a breathtaking view of the ancient citadel.

## Before You Go
### Permits
- Only 500 people per day are allowed on the Inca Trail
- Book at least 6 months in advance for peak season

### Physical Preparation
Start training at least 2-3 months before your trek.

## Packing Essentials
- Hiking boots (broken in!)
- Layered clothing for temperature changes
- Rain jacket and poncho`,
		image: '/destinations/destination-peru.jpg',
		author: 'Maria Torres',
		authorAvatar: 'MT',
		date: 'Jan 10, 2025',
		category: 'Adventure',
		readTime: '12 min read',
		tags: ['Peru', 'Trekking', 'Machu Picchu', 'South America'],
	},
	{
		slug: 'luxury-dubai-guide',
		id: 'luxury-dubai-guide',
		title: 'The Ultimate Dubai Luxury Travel Guide',
		excerpt:
			"Experience the height of opulence with our insider guide to Dubai's finest offerings.",
		content: `Dubai is a city that redefines luxury at every turn. From the world's tallest building to man-made islands, this desert metropolis offers experiences you won't find anywhere else.

## Where to Stay
- Burj Al Arab: The world's most luxurious hotel, shaped like a sail
- Atlantis The Royal: Ultra-luxury resort on Palm Jumeirah

## Must-Do Experiences
### Burj Khalifa At The Top
Standing at 828 meters, the Burj Khalifa offers views that stretch to the horizon.

### Desert Safari
Experience the golden dunes of the Arabian desert with dune bashing in a 4x4.`,
		image: '/destinations/destination-japan.jpg',
		author: 'Alex Foster',
		authorAvatar: 'AF',
		date: 'Jan 8, 2025',
		category: 'Luxury',
		readTime: '9 min read',
		tags: ['Dubai', 'Luxury', 'UAE', 'Middle East'],
	},
];

// Visa Countries Data
const visaCountries = [
	{
		slug: 'united-states',
		name: 'United States',
		flag: '🇺🇸',
		processing: '3-5 days',
		type: 'Tourist/Business',
		description:
			'The United States offers various visa categories for tourists, business travelers, students, and workers. Our experts ensure your DS-160 application is flawless.',
		requirements: [
			'Valid passport (6+ months validity)',
			'Completed DS-160 form',
			'Passport-size photograph (2x2 inches)',
			'Proof of financial stability',
			'Travel itinerary',
			'Employment/enrollment proof',
			'Previous travel history',
		],
		documents: [
			'Original passport',
			'Bank statements (last 6 months)',
			'Employment letter',
			'Hotel/accommodation booking',
			'Return flight tickets',
			'Invitation letter (if applicable)',
		],
		fees: [
			{ type: 'B1/B2 Tourist/Business', amount: '$185' },
			{ type: 'F1 Student Visa', amount: '$185' },
			{ type: 'H1B Work Visa', amount: '$205' },
		],
		tips: [
			'Schedule your embassy interview early',
			'Prepare concise answers for the interview',
			'Carry all original documents',
			'Show strong ties to your home country',
		],
	},
	{
		slug: 'united-kingdom',
		name: 'United Kingdom',
		flag: '🇬🇧',
		processing: '5-7 days',
		type: 'Visitor Visa',
		description:
			'The UK Standard Visitor visa lets you visit for tourism, business meetings, or short courses. We guide you through the online application and biometrics process.',
		requirements: [
			'Valid passport',
			'Completed online application',
			'Biometric appointment',
			'Financial proof',
			'Accommodation details',
			'Travel history',
		],
		documents: [
			'Current passport',
			'Bank statements (last 3 months)',
			'Employer letter with salary details',
			'Hotel bookings',
			'Flight itinerary',
			'TB test results (if applicable)',
		],
		fees: [
			{ type: 'Standard Visitor (6 months)', amount: '£115' },
			{ type: 'Student Visa', amount: '£490' },
			{ type: 'Skilled Worker', amount: '£719' },
		],
		tips: [
			'Apply at least 3 weeks before travel',
			'Ensure all documents are in English',
			'Book biometrics appointment early',
			'Provide a detailed travel itinerary',
		],
	},
	{
		slug: 'canada',
		name: 'Canada',
		flag: '🇨🇦',
		processing: '7-10 days',
		type: 'Tourist/Work',
		description:
			'Canada offers eTA for visa-exempt nationals and visitor visas for others. Our team handles your application from start to finish for smooth processing.',
		requirements: [
			'Valid passport',
			'Digital photograph',
			'Proof of funds',
			'Purpose of visit documentation',
			'Travel history',
			'Ties to home country proof',
		],
		documents: [
			'Passport with 6+ months validity',
			'Bank statements',
			'Employment verification',
			'Invitation letter (if visiting someone)',
			'Travel itinerary',
			'Previous visa copies',
		],
		fees: [
			{ type: 'Visitor Visa', amount: 'CAD $100' },
			{ type: 'eTA', amount: 'CAD $7' },
			{ type: 'Study Permit', amount: 'CAD $150' },
		],
		tips: [
			'Apply online for faster processing',
			'Submit biometrics within 30 days of application',
			'Provide comprehensive financial documents',
			'Include a travel plan with dates and activities',
		],
	},
	{
		slug: 'australia',
		name: 'Australia',
		flag: '🇦🇺',
		processing: '5-7 days',
		type: 'eVisitor',
		description:
			"Australia's eVisitor (subclass 651) and ETA make it easy for eligible nationals. For others, we streamline the visitor visa (subclass 600) process.",
		requirements: [
			'Valid passport',
			'Health declaration',
			'Character requirements',
			'Financial proof',
			'Purpose of travel',
			'Health insurance',
		],
		documents: [
			'Current passport',
			'Financial evidence',
			'Employment details',
			'Health examination (if required)',
			'Police clearance certificate',
			'Accommodation bookings',
		],
		fees: [
			{ type: 'eVisitor (subclass 651)', amount: 'Free' },
			{ type: 'ETA (subclass 601)', amount: 'AUD $20' },
			{ type: 'Visitor Visa (subclass 600)', amount: 'AUD $190' },
		],
		tips: [
			"Apply for eVisitor if eligible — it's free",
			'Ensure your passport is machine-readable',
			'Have travel insurance ready',
			'Declare any health conditions honestly',
		],
	},
	{
		slug: 'schengen',
		name: 'Schengen Area',
		flag: '🇪🇺',
		processing: '10-15 days',
		type: 'Short Stay',
		description:
			'The Schengen visa grants access to 27 European countries with a single visa. We help you apply through the correct embassy and prepare a strong application.',
		requirements: [
			'Valid passport (3+ months beyond stay)',
			'Completed application form',
			'Two passport photos',
			'Travel medical insurance (€30,000 minimum)',
			'Proof of accommodation',
			'Flight reservation',
			'Financial proof',
		],
		documents: [
			'Passport with 2 blank pages',
			'Travel insurance certificate',
			'Bank statements (last 3 months)',
			'Employer/sponsor letter',
			'Hotel bookings for entire stay',
			'Round-trip flight reservation',
			'Cover letter with travel purpose',
		],
		fees: [
			{ type: 'Adult Short Stay', amount: '€80' },
			{ type: 'Children (6-12)', amount: '€40' },
			{ type: 'Children (under 6)', amount: 'Free' },
		],
		tips: [
			'Apply at the embassy of your main destination',
			'Book refundable flights for the application',
			'Get insurance covering all Schengen states',
			'Apply 15 days to 6 months before travel',
		],
	},
	{
		slug: 'japan',
		name: 'Japan',
		flag: '🇯🇵',
		processing: '5-7 days',
		type: 'Tourist Visa',
		description:
			"Japan's tourist visa process is straightforward for most nationalities. We ensure your documentation meets the strict Japanese embassy standards.",
		requirements: [
			'Valid passport',
			'Visa application form',
			'Photo (4.5cm x 4.5cm)',
			'Schedule of stay',
			'Proof of financial means',
			'Flight reservation',
		],
		documents: [
			'Passport with 6+ months validity',
			'Daily schedule/itinerary',
			'Bank certificate and statements',
			'Employment certificate',
			'Hotel reservations',
			'Guarantee letter (if applicable)',
		],
		fees: [
			{ type: 'Single Entry', amount: 'Free*' },
			{ type: 'Multiple Entry', amount: 'Free*' },
			{ type: 'Transit Visa', amount: 'Free*' },
		],
		tips: [
			'Japan visa is free for many nationalities',
			'Submit a detailed daily itinerary',
			'Apply through accredited travel agency',
			'Processing times may vary by embassy',
		],
	},
	// Asia Countries
	{
		slug: 'thailand',
		name: 'Thailand',
		flag: '🇹🇭',
		processing: '5-7 days',
		type: 'Tourist Visa',
		description:
			'Explore the Land of Smiles with our hassle-free visa assistance.',
		requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
		documents: ['Passport', 'Bank statements', 'Accommodation proof'],
		fees: [{ type: 'Tourist Visa', amount: '1,000 THB' }],
		tips: ['Apply 3 weeks before travel', '60-day tourist visa available'],
	},
	{
		slug: 'vietnam',
		name: 'Vietnam',
		flag: '🇻🇳',
		processing: '3-5 days',
		type: 'Tourist Visa',
		description: 'Experience Vietnam with our streamlined visa processing.',
		requirements: ['Valid passport', 'Travel itinerary', 'Hotel booking'],
		documents: ['Passport', 'Visa application form', 'Photo'],
		fees: [{ type: 'Tourist Visa', amount: '25 USD' }],
		tips: ['eVisa available online', 'Apply at least 3 days before'],
	},
	{
		slug: 'south-korea',
		name: 'South Korea',
		flag: '🇰🇷',
		processing: '4-6 days',
		type: 'Tourist Visa',
		description: 'Visit the vibrant culture and technology hub of East Asia.',
		requirements: ['Valid passport', 'Accommodation', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Hotel reservations'],
		fees: [{ type: 'Tourist Visa', amount: '60 USD' }],
		tips: ['Multiple entry visas available', 'Visa exempt for 90 days'],
	},
	{
		slug: 'india',
		name: 'India',
		flag: '🇮🇳',
		processing: '5-7 days',
		type: 'Tourist Visa',
		description:
			'Discover the diversity and beauty of India with our expert guidance.',
		requirements: ['Valid passport', 'Travel itinerary', 'Hotel bookings'],
		documents: ['Passport', 'e-Visa application', 'Photo'],
		fees: [{ type: 'e-Visa', amount: '50 USD' }],
		tips: ['e-Visa is easiest option', '30 or 60-day options available'],
	},
	{
		slug: 'indonesia',
		name: 'Indonesia',
		flag: '🇮🇩',
		processing: '3-5 days',
		type: 'Tourist Visa',
		description: 'Explore tropical islands and ancient temples with ease.',
		requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
		documents: ['Passport', 'Visa application', 'Photo'],
		fees: [{ type: 'Visa on Arrival', amount: '35 USD' }],
		tips: ['Visa on Arrival at major airports', '30-day single entry'],
	},
	{
		slug: 'philippines',
		name: 'Philippines',
		flag: '🇵🇭',
		processing: '5-10 days',
		type: 'Tourist Visa',
		description:
			'Visit stunning beaches and friendly locals in the Philippines.',
		requirements: ['Valid passport', 'Return ticket', 'Hotel booking'],
		documents: ['Passport', 'Visa application', 'Financial proof'],
		fees: [{ type: 'Tourist Visa', amount: '30 USD' }],
		tips: [
			'Visa exempt for many nationalities up to 30 days',
			'Extend visa at BIR',
		],
	},
	{
		slug: 'malaysia',
		name: 'Malaysia',
		flag: '🇲🇾',
		processing: '5-7 days',
		type: 'Tourist Visa',
		description: 'Experience modern cities and natural wonders of Malaysia.',
		requirements: ['Valid passport', 'Travel itinerary', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Accommodation proof'],
		fees: [{ type: 'eVISA', amount: '100 MYR' }],
		tips: ['Visa free for many nationals up to 90 days', 'eVISA application'],
	},
	{
		slug: 'singapore',
		name: 'Singapore',
		flag: '🇸🇬',
		processing: '3-5 days',
		type: 'Tourist Visa',
		description: "Discover the Lion City's modernity and multicultural charm.",
		requirements: ['Valid passport', 'Return ticket', 'Proof of funds'],
		documents: ['Passport', 'Bank statements', 'Employment letter'],
		fees: [{ type: 'Tourist Visa', amount: '70 SGD' }],
		tips: ['Visa exempt for many nationalities', 'Multiple entry available'],
	},
	{
		slug: 'sri-lanka',
		name: 'Sri Lanka',
		flag: '🇱🇰',
		processing: '2-3 days',
		type: 'eVisa',
		description: 'Enjoy tea plantations and ancient temples in Sri Lanka.',
		requirements: ['Valid passport', 'Return ticket', 'Email address'],
		documents: ['Passport copy', 'Photo', 'eVisa application'],
		fees: [{ type: 'eVisa', amount: '35 USD' }],
		tips: ['Quick online eVisa process', '30 or 90-day options'],
	},
	{
		slug: 'hong-kong',
		name: 'Hong Kong',
		flag: '🇭🇰',
		processing: '5-7 days',
		type: 'Tourist Visa',
		description: 'Experience the vibrant blend of Eastern and Western culture.',
		requirements: ['Valid passport', 'Travel itinerary', 'Hotel booking'],
		documents: ['Passport', 'Bank statements', 'Employment proof'],
		fees: [{ type: 'Tourist Visa', amount: '190 HKD' }],
		tips: ['Visa exempt for many nationals', 'Multiple entry visas available'],
	},
	// Europe Countries
	{
		slug: 'france',
		name: 'France',
		flag: '🇫🇷',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Experience art, culture, and romance in the heart of Europe.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Visa application', 'Hotel bookings'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Apply at French embassy', 'Part of Schengen area'],
	},
	{
		slug: 'germany',
		name: 'Germany',
		flag: '🇩🇪',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Discover engineering, history, and beer culture in Germany.',
		requirements: ['Valid passport', 'Travel insurance', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Employment letter'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Major tech hub', 'Multiple entry available'],
	},
	{
		slug: 'italy',
		name: 'Italy',
		flag: '🇮🇹',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Explore ancient history, art, and cuisine in Italy.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Visa application', 'Hotel bookings'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Apply at Italian embassy', 'Renaissance art and Roman history'],
	},
	{
		slug: 'spain',
		name: 'Spain',
		flag: '🇪🇸',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description:
			'Enjoy sunny beaches, vibrant culture, and great food in Spain.',
		requirements: ['Valid passport', 'Travel insurance', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Accommodation proof'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Popular summer destination', 'Beach and mountain activities'],
	},
	{
		slug: 'netherlands',
		name: 'Netherlands',
		flag: '🇳🇱',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description:
			'Experience canals, cycling culture, and windmills in Netherlands.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Visa application', 'Hotel bookings'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Very bike-friendly', 'Part of Schengen area'],
	},
	{
		slug: 'switzerland',
		name: 'Switzerland',
		flag: '🇨🇭',
		processing: '10-15 days',
		type: 'Tourist Visa',
		description: 'Enjoy Alpine mountains, lakes, and Swiss hospitality.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Accommodation bookings', 'Financial proof'],
		fees: [{ type: 'Tourist Visa', amount: '200 CHF' }],
		tips: ['Not in EU but allows Schengen travel', 'High cost of living'],
	},
	{
		slug: 'sweden',
		name: 'Sweden',
		flag: '🇸🇪',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: "Experience Nordic design, nature, and Stockholm's beauty.",
		requirements: ['Valid passport', 'Travel insurance', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Employment letter'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Modern Nordic country', 'Northern Lights in winter'],
	},
	{
		slug: 'greece',
		name: 'Greece',
		flag: '🇬🇷',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Discover ancient ruins, islands, and Mediterranean beauty.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Visa application', 'Hotel bookings'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Island hopping opportunities', 'Great for summer vacations'],
	},
	{
		slug: 'portugal',
		name: 'Portugal',
		flag: '🇵🇹',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Experience coastal charm, wine regions, and historic tiles.',
		requirements: ['Valid passport', 'Travel insurance', 'Financial proof'],
		documents: ['Passport', 'Bank statements', 'Accommodation proof'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Affordable European destination', 'Golden Visa programs available'],
	},
	{
		slug: 'austria',
		name: 'Austria',
		flag: '🇦🇹',
		processing: '10-15 days',
		type: 'Schengen Visa',
		description: 'Enjoy classical music, Alpine scenery, and Viennese culture.',
		requirements: ['Valid passport', 'Travel insurance', 'Bank statements'],
		documents: ['Passport', 'Visa application', 'Hotel bookings'],
		fees: [{ type: 'Schengen Visa', amount: '80 EUR' }],
		tips: ['Music and culture capital', 'Gateway to Eastern Europe'],
	},
];

// Travel Packages Data
const travelPackages = [
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
			'Experience the breathtaking beauty of Santorini with its iconic blue-domed churches, stunning sunsets, and crystal-clear waters.',
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
			"Immerse yourself in Japanese culture during the magical sakura season. From Tokyo's bustling streets to Kyoto's serene temples.",
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
			'Trek through the Andes to the legendary Machu Picchu. This adventure combines ancient Incan heritage with stunning natural landscapes.',
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
			"Indulge in the ultimate luxury experience in Dubai. From the world's tallest building to desert safaris, experience opulence and adventure.",
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

// Services Data
const services = [
	{
		slug: 'travel-consultation',
		title: 'Travel Consultation',
		description: 'One-on-one session with our travel experts',
		duration: '30 min',
		longDescription:
			'Get personalized travel advice from our experienced consultants who have explored destinations worldwide.',
		features: [
			'Personalized destination recommendations',
			'Budget optimization strategies',
			'Best travel season advice',
			'Safety and health travel tips',
			'Customized itinerary suggestions',
		],
		process: [
			{
				step: 1,
				title: 'Book Appointment',
				description: 'Choose your preferred date and time slot.',
			},
			{
				step: 2,
				title: 'Share Preferences',
				description: 'Tell us about your dream vacation and budget.',
			},
			{
				step: 3,
				title: 'Get Expert Advice',
				description: 'Receive personalized recommendations from our expert.',
			},
			{
				step: 4,
				title: 'Plan Your Trip',
				description: 'We create a custom itinerary just for you.',
			},
		],
	},
	{
		slug: 'corporate-travel',
		title: 'Corporate Travel',
		description: 'Business travel planning and management',
		duration: '45 min',
		longDescription:
			"Streamline your company's travel with our comprehensive corporate travel management service.",
		features: [
			'Negotiated corporate rates',
			'Travel policy compliance',
			'24/7 emergency support',
			'Expense management integration',
			'Group booking coordination',
		],
		process: [
			{
				step: 1,
				title: 'Initial Consultation',
				description: "Understand your company's travel needs and policies.",
			},
			{
				step: 2,
				title: 'Custom Solutions',
				description: 'Design a tailored corporate travel program.',
			},
			{
				step: 3,
				title: 'Implementation',
				description: 'Set up booking systems and traveler profiles.',
			},
			{
				step: 4,
				title: 'Ongoing Support',
				description: 'Continuous management and optimization.',
			},
		],
	},
	{
		slug: 'flight-booking',
		title: 'Flight Booking',
		description: 'Find the best deals on flights',
		duration: '20 min',
		longDescription:
			'Our flight specialists search across hundreds of airlines to find you the best deals.',
		features: [
			'Best fare guarantee',
			'Multi-city routing options',
			'Flexible date search',
			'Seat selection assistance',
			'Loyalty program optimization',
		],
		process: [
			{
				step: 1,
				title: 'Share Requirements',
				description: 'Tell us your dates, destinations, and preferences.',
			},
			{
				step: 2,
				title: 'Compare Options',
				description: 'We present the best flight options for you.',
			},
			{
				step: 3,
				title: 'Book & Confirm',
				description: 'Secure your booking with instant confirmation.',
			},
			{
				step: 4,
				title: 'Pre-Flight Support',
				description: 'Check-in reminders and travel updates.',
			},
		],
	},
	{
		slug: 'travel-insurance',
		title: 'Travel Insurance',
		description: 'Comprehensive coverage for your trip',
		duration: '15 min',
		longDescription:
			'Protect your investment and travel with peace of mind with our comprehensive insurance plans.',
		features: [
			'Medical emergency coverage',
			'Trip cancellation protection',
			'Lost baggage reimbursement',
			'Flight delay compensation',
			'24/7 global assistance',
		],
		process: [
			{
				step: 1,
				title: 'Assess Needs',
				description: 'We evaluate your trip type and coverage needs.',
			},
			{
				step: 2,
				title: 'Compare Plans',
				description: 'Review multiple insurance options and pricing.',
			},
			{
				step: 3,
				title: 'Purchase Coverage',
				description: 'Secure your policy with instant documentation.',
			},
			{
				step: 4,
				title: 'Travel Protected',
				description: '24/7 support throughout your journey.',
			},
		],
	},
	{
		slug: 'visa-consultation',
		title: 'Visa Consultation',
		description: 'Document review and application guidance',
		duration: '30 min',
		longDescription:
			'Navigate complex visa processes with expert guidance from our visa specialists.',
		features: [
			'Document checklist preparation',
			'Application form assistance',
			'Interview preparation',
			'Status tracking',
			'Express processing available',
		],
		process: [
			{
				step: 1,
				title: 'Eligibility Check',
				description: 'Verify visa requirements for your destination.',
			},
			{
				step: 2,
				title: 'Document Review',
				description: 'Our experts review and prepare your documents.',
			},
			{
				step: 3,
				title: 'Application Submission',
				description: 'We submit your application with proper follow-up.',
			},
			{
				step: 4,
				title: 'Visa Received',
				description: 'Collect your approved visa and travel with confidence.',
			},
		],
	},
	{
		slug: 'itinerary-planning',
		title: 'Itinerary Planning',
		description: 'Custom trip planning and scheduling',
		duration: '45 min',
		longDescription:
			'Let our travel designers create a day-by-day itinerary tailored to your interests, pace, and budget.',
		features: [
			'Day-by-day detailed planning',
			'Local hidden gems included',
			'Restaurant reservations',
			'Activity pre-booking',
			'Flexible modification support',
		],
		process: [
			{
				step: 1,
				title: 'Discovery Call',
				description: 'Share your travel style, interests, and must-sees.',
			},
			{
				step: 2,
				title: 'Draft Itinerary',
				description: 'Receive a detailed day-by-day plan for review.',
			},
			{
				step: 3,
				title: 'Refine & Finalize',
				description: "Make adjustments until it's perfect.",
			},
			{
				step: 4,
				title: 'Travel Ready',
				description: 'Get your final itinerary with all confirmations.',
			},
		],
	},
];

// Define Mongoose Schemas inline for the script
const BlogPostSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		excerpt: { type: String, required: true },
		content: { type: String, required: true },
		image: { type: String, required: true },
		author: { type: String, required: true },
		slug: { type: String, unique: true, sparse: true },
		authorAvatar: { type: String, default: '' },
		date: { type: String, required: true },
		category: { type: String, required: true },
		readTime: { type: String, default: '5 min read' },
		tags: [{ type: String }],
	},
	{ timestamps: true },
);

const VisaCountrySchema = new mongoose.Schema(
	{
		slug: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		flag: { type: String, required: true },
		processing: { type: String, required: true },
		type: { type: String, required: true },
		description: { type: String, required: true },
		requirements: [{ type: String }],
		documents: [{ type: String }],
		fees: [{ type: { type: String }, amount: String }],
		tips: [{ type: String }],
	},
	{ timestamps: true },
);

const PackageSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		location: { type: String, required: true },
		image: { type: String, required: true },
		price: { type: Number, required: true },
		duration: { type: String, required: true },
		groupSize: { type: String, required: true },
		rating: { type: Number, default: 4.5 },
		reviews: { type: Number, default: 0 },
		description: { type: String, required: true },
		highlights: [{ type: String }],
		included: [{ type: String }],
		notIncluded: [{ type: String }],
		itinerary: [{ day: Number, title: String, description: String }],
	},
	{ timestamps: true },
);

const ServiceSchema = new mongoose.Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		duration: { type: String, required: true },
		longDescription: { type: String, required: true },
		features: [{ type: String }],
		process: [{ step: Number, title: String, description: String }],
	},
	{ timestamps: true },
);

async function seedDatabase() {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		console.error('Error: MONGODB_URI environment variable is not set');
		console.log(
			'Run with: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-data.js',
		);
		process.exit(1);
	}

	try {
		console.log('Connecting to MongoDB...');
		await mongoose.connect(mongoUri);
		console.log('Connected successfully!\n');

		// Get or create models
		const BlogPost =
			mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
		const VisaCountry =
			mongoose.models.VisaCountry ||
			mongoose.model('VisaCountry', VisaCountrySchema);
		const Package =
			mongoose.models.Package || mongoose.model('Package', PackageSchema);
		const Service =
			mongoose.models.Service || mongoose.model('Service', ServiceSchema);

		// Clear existing data
		console.log('Clearing existing data...');
		await Promise.all([
			BlogPost.deleteMany({}),
			VisaCountry.deleteMany({}),
			Package.deleteMany({}),
			Service.deleteMany({}),
		]);
		console.log('Existing data cleared.\n');

		// Seed Blog Posts
		console.log('Seeding blog posts...');
		await BlogPost.insertMany(blogPosts);
		console.log(`  - ${blogPosts.length} blog posts created`);

		// Seed Visa Countries
		console.log('Seeding visa countries...');
		await VisaCountry.insertMany(visaCountries);
		console.log(`  - ${visaCountries.length} visa countries created`);

		// Seed Packages
		console.log('Seeding travel packages...');
		await Package.insertMany(travelPackages);
		console.log(`  - ${travelPackages.length} packages created`);

		// Seed Services
		console.log('Seeding services...');
		await Service.insertMany(services);
		console.log(`  - ${services.length} services created`);

		console.log('\n========================================');
		console.log('Database seeded successfully!');
		console.log('========================================');
		console.log(`Total records created:`);
		console.log(`  - Blog Posts: ${blogPosts.length}`);
		console.log(`  - Visa Countries: ${visaCountries.length}`);
		console.log(`  - Travel Packages: ${travelPackages.length}`);
		console.log(`  - Services: ${services.length}`);
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log('\nDisconnected from MongoDB.');
		process.exit(0);
	}
}

seedDatabase();
