export interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	content: string;
	image: string;
	author: string;
	authorAvatar: string;
	date: string;
	category: string;
	readTime: string;
	tags: string[];
}

export const blogPosts: BlogPost[] = [
	{
		id: 'hidden-gems-greece',
		title: 'Top 10 Hidden Gems in Greece You Must Visit',
		excerpt:
			'Discover off-the-beaten-path destinations that will make your Greek adventure unforgettable.',
		content: `Greece is more than just Santorini and Mykonos. While these islands are undeniably stunning, the country is home to countless hidden treasures waiting to be discovered by adventurous travelers.

## 1. Milos Island
Known as the "Island of Colors," Milos boasts some of the most unique beaches in the Mediterranean. Sarakiniko Beach, with its lunar-like white volcanic rock formations, looks like it belongs on another planet. The turquoise waters against the white rocks create a surreal landscape perfect for photography.

## 2. Zagori Villages
Nestled in the mountains of Epirus, the 46 Zagori villages are connected by ancient stone bridges and hiking trails. The Vikos Gorge, one of the deepest in the world, offers breathtaking views and challenging treks through pristine wilderness.

## 3. Monemvasia
This medieval fortress town on a small island connected to the mainland by a causeway feels like stepping back in time. Its narrow cobblestone streets, Byzantine churches, and panoramic sea views make it one of Greece's most atmospheric destinations.

## 4. Nafplio
Often called the most beautiful city in Greece, Nafplio was the country's first capital. Its Venetian architecture, Palamidi Fortress (999 steps to the top!), and charming old town make it a perfect base for exploring the Peloponnese.

## 5. Samothrace
This remote island in the northern Aegean is a paradise for nature lovers. Home to the famous Winged Victory of Samothrace statue (now in the Louvre), the island features dramatic waterfalls, thermal springs, and ancient sanctuaries.

## Planning Your Visit
The best time to visit these hidden gems is during shoulder season (May-June or September-October) when crowds are thinner and temperatures are pleasant. Many of these destinations are accessible by ferry or short domestic flights from Athens.

## Travel Tips
- Rent a car for maximum flexibility in mainland destinations
- Book accommodation early for island visits during summer
- Learn a few Greek phrases — locals appreciate the effort
- Try local specialties at family-run tavernas for authentic cuisine`,
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
		title: 'Ultimate Guide to Cherry Blossom Season in Japan',
		excerpt:
			'Everything you need to know about experiencing sakura season like a local.',
		content: `Cherry blossom season (sakura) is Japan's most magical time of year. The delicate pink flowers transform the landscape into a pastel wonderland, and the entire country celebrates with hanami (flower viewing) parties.

## When to Visit
Cherry blossoms typically bloom from late March to mid-April, but timing varies by region:
- **Kyushu (Fukuoka)**: Late March
- **Kansai (Kyoto, Osaka)**: Early April
- **Kanto (Tokyo)**: Late March to Early April
- **Tohoku (Sendai)**: Mid to Late April
- **Hokkaido**: Early May

## Best Viewing Spots

### Tokyo
- **Shinjuku Gyoen**: 1,100 cherry trees across 58 hectares
- **Ueno Park**: Over 800 trees along the main pathway
- **Chidorigafuchi**: Stunning canal views with illuminated trees at night

### Kyoto
- **Philosopher's Path**: 2km canal path lined with hundreds of cherry trees
- **Maruyama Park**: Kyoto's most popular hanami spot
- **Kiyomizu-dera**: Temple views framed by pink blossoms

## Hanami Etiquette
- Arrive early to secure a good spot under the trees
- Bring a blue tarp or mat to sit on
- Pack bento boxes, snacks, and drinks
- Clean up everything when you leave
- Be respectful of others' space and noise levels

## Photography Tips
- Golden hour provides the warmest light on blossoms
- Use a shallow depth of field for dreamy bokeh effects
- Include traditional architecture for cultural context
- Visit illuminated spots at night for a different perspective`,
		image: '/destinations/destination-greece.jpg',
		author: 'James Chen',
		authorAvatar: 'JC',
		date: 'Jan 12, 2025',
		category: 'Travel Tips',
		readTime: '10 min read',
		tags: ['Japan', 'Cherry Blossoms', 'Culture', 'Asia'],
	},
	{
		id: 'machu-picchu-trek',
		title: 'Preparing for Your Machu Picchu Trek',
		excerpt:
			'Essential tips and packing list for conquering the Inca Trail adventure.',
		content: `The Inca Trail to Machu Picchu is one of the world's most iconic treks. This 4-day, 43-kilometer journey through the Andes culminates at the Sun Gate with a breathtaking view of the ancient citadel.

## Before You Go

### Permits
- Only 500 people per day are allowed on the Inca Trail (including guides and porters)
- Book at least 6 months in advance for peak season (May-September)
- Permits are non-transferable — name must match your passport

### Physical Preparation
Start training at least 2-3 months before your trek:
- Cardiovascular exercises (running, cycling, swimming)
- Stair climbing and hill walking
- Strength training for legs and core
- Practice with a loaded backpack

### Altitude Acclimatization
Cusco sits at 3,400m, and the trek reaches 4,215m at Dead Woman's Pass:
- Arrive in Cusco 2-3 days early to acclimatize
- Stay hydrated — drink 3-4 liters of water daily
- Try coca tea (mate de coca) for altitude sickness
- Avoid alcohol for the first few days

## Packing Essentials
- Hiking boots (broken in!)
- Layered clothing for temperature changes
- Rain jacket and poncho
- Sleeping bag rated for -10°C
- Headlamp with extra batteries
- Sunscreen SPF 50+ and sunglasses
- Water purification tablets
- Blister kit and personal medications
- Camera with extra memory cards

## Day-by-Day Overview
**Day 1**: Moderate — 13km through eucalyptus forests
**Day 2**: The hardest day — Dead Woman's Pass at 4,215m
**Day 3**: Stunning cloud forest, Incan ruins along the way
**Day 4**: Early start for sunrise at the Sun Gate overlooking Machu Picchu`,
		image: '/destinations/destination-peru.jpg',
		author: 'Maria Torres',
		authorAvatar: 'MT',
		date: 'Jan 10, 2025',
		category: 'Adventure',
		readTime: '12 min read',
		tags: ['Peru', 'Trekking', 'Machu Picchu', 'South America'],
	},
	{
		id: 'luxury-dubai-guide',
		title: 'The Ultimate Dubai Luxury Travel Guide',
		excerpt:
			"Experience the height of opulence with our insider guide to Dubai's finest offerings.",
		content: `Dubai is a city that redefines luxury at every turn. From the world's tallest building to man-made islands, this desert metropolis offers experiences you won't find anywhere else.

## Where to Stay
- **Burj Al Arab**: The world's most luxurious hotel, shaped like a sail
- **Atlantis The Royal**: Ultra-luxury resort on Palm Jumeirah
- **One&Only The Palm**: Boutique elegance with private beach

## Must-Do Experiences

### Burj Khalifa At The Top
Standing at 828 meters, the Burj Khalifa offers views that stretch to the horizon. Book the "At the Top SKY" experience (148th floor) for champagne and exclusive access.

### Desert Safari
Experience the golden dunes of the Arabian desert:
- Dune bashing in a 4x4
- Camel riding at sunset
- Traditional BBQ dinner under the stars
- Belly dancing and fire shows

### Dubai Mall & Fountain Show
The world's largest mall features an indoor aquarium, ice rink, and over 1,200 shops. The Dubai Fountain show (every 30 minutes after sunset) is free and spectacular.

## Dining
- **Zuma**: Japanese izakaya dining at its finest
- **Nobu**: Celebrity chef restaurant at Atlantis
- **At.mosphere**: World's highest restaurant in Burj Khalifa

## Shopping
- **Gold Souk**: Dazzling displays of gold jewelry
- **Mall of the Emirates**: Ski slope inside a shopping mall
- **Dubai Design District (d3)**: Boutique and artisan finds`,
		image: '/destinations/destination-japan.jpg',
		author: 'Alex Foster',
		authorAvatar: 'AF',
		date: 'Jan 8, 2025',
		category: 'Luxury',
		readTime: '9 min read',
		tags: ['Dubai', 'Luxury', 'UAE', 'Middle East'],
	},
];
