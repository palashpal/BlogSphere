import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
  password?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  github?: string;
  instagram?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  videoUrl?: string;
  published: boolean;
  createdAt: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  categorySlug: string;
  authorId: string;
  likesCount: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postSlug: string;
  userEmail: string;
  userName: string;
  userAvatar: string;
}

export interface Bookmark {
  id: string;
  userEmail: string;
  postSlug: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userEmail: string;
  postSlug: string;
  createdAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userEmail: string;
}

export interface Analytics {
  viewsByDate: { [date: string]: number };
  viewsByCategory: { [category: string]: number };
}

export interface DatabaseSchema {
  users: User[];
  authors: Author[];
  posts: Post[];
  comments: Comment[];
  bookmarks: Bookmark[];
  likes: Like[];
  newsletters: Newsletter[];
  notifications: Notification[];
  analytics: Analytics;
}

const INITIAL_AUTHORS: Author[] = [
  {
    id: "auth-1",
    name: "Raj Patel",
    role: "Senior Cricket Correspondent",
    bio: "Ex-first class cricketer turned analyst. Covering test tactics and white-ball evolution around the globe for over a decade.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    twitter: "@rajcricket",
    instagram: "@raj_patel_cricket"
  },
  {
    id: "auth-2",
    name: "Marco Rossi",
    role: "Lead Football Columnist",
    bio: "Obsessed with high-press systems, half-spaces, and the tactical nuances of European football. Based in Milan.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    twitter: "@marcorossi_tactics",
    github: "rossi-stats"
  },
  {
    id: "auth-3",
    name: "Elena Rostova",
    role: "Global Travel Photojournalist",
    bio: "Seeking remote mountain ridges and deep cultural traditions. Always traveling with two cameras and an open mind.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    instagram: "@elena_wanders"
  },
  {
    id: "auth-4",
    name: "Chef Kenji Sato",
    role: "Culinary Editor & Food Critic",
    bio: "Investigating the intersection of chemistry and flavor. Former Michelin-star sous chef exploring world street food.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    twitter: "@kenjieats"
  },
  {
    id: "auth-5",
    name: "Clara Vance",
    role: "Chief Investigative Reporter",
    bio: "Covering geopolitical events, tech integration, and environmental policy. Award-winning journalist based in London.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
    twitter: "@clara_vance_news"
  },
  {
    id: "auth-6",
    name: "Dr. Alex Chen",
    role: "Principal Systems Architect",
    bio: "Former compiler engineer and web standards advocate. Writing on React internals, databases, and microservice topologies.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
    twitter: "@alechen_dev",
    github: "alechen-systems"
  }
];

const INITIAL_POSTS: Post[] = [
  // CRICKET
  {
    id: "post-1",
    title: "The Rise of a Legend: Dynamic Evolution in Modern T20 Cricket",
    slug: "rise-of-legend-modern-t20-cricket",
    summary: "How statistical analytics, biomechanics, and fearlessness revolutionized batting parameters and redefined what makes a T20 match-winner.",
    content: `Cricket was once a game of absolute orthodoxy, defined by high elbows, perfect forward defenses, and a deep reverence for five-day matches. Today, the game has undergone a seismic shift, propelled by the relentless evolution of Twenty20 cricket.

### The Power-Hitter's Biomechanics
In modern T20, batsmen are no longer just hitters; they are finely tuned athletic power generators. Biomechanical analysis has revealed that the power in a cricket swing originates not from the arms, but from ground force reaction. By anchoring the back foot and rotating the hips at speeds exceeding 700 degrees per second, players like Heinrich Klaasen and Glenn Maxwell launch deliveries over boundaries with effortless ferocity.

### Analytics: The Secret Playbook
Behind every boundary is a supercomputer. Analysts slice pitches into grid zones, mapping exactly which delivery line a batsman struggles to access. Bowlers counter with "tactical wide lines" and "staggered-pace off-spin." But batting orders have evolved, too:
1. **The Boundary Percentage Anchors**: Keeping strike rate above 145% without risking wickets.
2. **The Matchup Specialists**: Power hitters deployed specifically when left-arm spin is in play.
3. **The Death Overs Finisher**: Executing 360-degree sweep shots against high-speed yorkers.

The T20 revolution is not just about entertainment; it is an incredible synthesis of sport science and tactical warfare that has altered cricket permanently.`,
    featuredImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-01T10:00:00Z",
    publishedAt: "2026-07-01T10:00:00Z",
    readingTime: 4,
    views: 1240,
    categorySlug: "cricket",
    authorId: "auth-1",
    likesCount: 85,
    tags: ["T20", "Cricket", "Tactics", "IPL"],
    seoTitle: "The Evolution of T20 Cricket Dynamics & Analytics",
    seoDescription: "An in-depth tactical and biomechanical breakdown of how analytics and athletic power generation have completely transformed Twenty20 cricket."
  },
  {
    id: "post-2",
    title: "World Test Championship: Tactical Breakdown of the Finalists",
    slug: "world-test-championship-tactical-breakdown",
    summary: "An analytical preview of the upcoming Lord's final, detailing key bowler matchups, opening pair struggles, and pitch dynamics.",
    content: `The ultimate prize in red-ball cricket is on the line. At the historic Lord's cricket ground, the two finest test nations clash in the World Test Championship Final. This is a game of supreme endurance, mental resilience, and fine tactical adjustments.

### Lord's Slope and Seam Movement
Unlike any other ground, Lord's features a 2.5-meter slope running across the playing area. This creates a natural variance:
- Deliveries bowled from the Pavilion End tend to slope in towards the right-hander.
- Deliveries bowled from the Nursery End naturally move away.
Fast bowlers who can extract late seam movement on this surface are bound to dictate the terms.

### Key Matchups to Watch
The battle will be won in the first session. The opening batsmen must survive the new duke ball under overcast conditions against world-class swing. Watch out for the duel between the world's premier off-spinner and the opposing middle order. He will look to exploit any dry patches of the wicket on Day 4 and 5.

This Test match will test the limits of Captaincy. Setting aggressive fields while maintaining control of the run-rate requires a rare tactical balance.`,
    featuredImage: "https://images.unsplash.com/photo-1540747737956-378724044602?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-05T14:30:00Z",
    publishedAt: "2026-07-05T14:30:00Z",
    readingTime: 5,
    views: 890,
    categorySlug: "cricket",
    authorId: "auth-1",
    likesCount: 42,
    tags: ["Test Cricket", "Lords", "Tactics", "WTC"],
    seoTitle: "WTC Lord's Final Matchup Preview & Pitch Analytics",
    seoDescription: "An expert tactical analysis of the upcoming World Test Championship Final, highlighting bowler angles, slope effects, and team selections."
  },

  // FOOTBALL
  {
    id: "post-3",
    title: "Tactical Masterclass: How Midfield Overloads Dominate Modern Football",
    slug: "tactical-masterclass-midfield-overloads-modern-football",
    summary: "Deconstructing Pep Guardiola's inverted fullback systems and the tactical blueprints utilized to conquer compact low-block defenses.",
    content: `Football tactics evolve in waves. From the physical 4-4-2 of the 90s to the hypnotic Spanish Tiki-Taka of the 2010s, managers constantly seek spatial supremacy. In the current era, the absolute golden standard of tactical innovation is the "Midfield Overload."

### The Inverted Fullback Phenomenon
To understand overloads, we must examine the role of the fullback. In traditional systems, fullbacks hug the touchline, providing width. Today, tactical giants invert their fullbacks into central midfield when in possession. 

This creates a temporary 3-2-4-1 or 3-2-2-3 shape. By shifting a defender into midfield, the team gains a numerical superiority:
- It creates a 4vs3 or 5vs3 scenario in central channels.
- It forces the opposing wingers to tuck inside, opening up isolated 1v1 situations for the attacking wingers out wide.
- It provides a dense counter-pressing block, preventing the opponent from breaking away easily on transition.

### Breaking the Low-Block
Against highly compact defensive units (low-blocks), traditional passing routes are choked. Midfield overloads solve this by using "box midfields" to occupy the half-spaces. By attracting defenders to central zones, a simple switch of play unleashes a rapid winger down the flank, tearing the defense apart.

Modern football is a chess match played at 100 miles per hour, and midfield dominance is the kingpiece.`,
    featuredImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-03T11:00:00Z",
    publishedAt: "2026-07-03T11:00:00Z",
    readingTime: 6,
    views: 1420,
    categorySlug: "football",
    authorId: "auth-2",
    likesCount: 110,
    tags: ["Tactics", "Pep Guardiola", "Premier League", "Analysis"],
    seoTitle: "How Midfield Overloads and Inverted Fullbacks Dominate Football",
    seoDescription: "Understand the tactical intricacies of inverted fullbacks and midfield overloads used by top European clubs to break low blocks."
  },
  {
    id: "post-4",
    title: "Underdog Dreams: The Historic European Cup Runs of This Decade",
    slug: "underdog-dreams-historic-european-cup-runs",
    summary: "Relive the incredible stories of low-budget football clubs that defied financial gravity to shake up European tournaments.",
    content: `In an era dominated by multi-billion-dollar state-backed super clubs, the soul of football resides in the improbable. Every now and then, a group of tight-knit players, led by a tactical idealist, embarks on a European journey that captures our hearts.

### The Anatomy of a Giant-Killing
What does it take to defeat a club with ten times your wage bill?
1. **Aggressive Counter-Pressing**: Disrupting the elite team's build-up play before they establish rhythm.
2. **Psychological Fearlessness**: Refusing to sit deep and accept defeat.
3. **Collective Synergy**: Moving as a single unit, covering every inch of grass.

We dissect how recent dark horses managed to reach the semi-finals and finals, proving that with enough coordination, courage, and tactical discipline, financial giants can indeed bleed on the pitch.`,
    featuredImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-08T09:15:00Z",
    publishedAt: "2026-07-08T09:15:00Z",
    readingTime: 4,
    views: 950,
    categorySlug: "football",
    authorId: "auth-2",
    likesCount: 68,
    tags: ["Champions League", "Underdogs", "Football Culture"],
    seoTitle: "Historic Football Underdog Cup Runs in Europe",
    seoDescription: "A deep dive into the legendary underdog runs in modern European football, exploring the tactics and mentalities that beat the billionaires."
  },

  // TRAVEL
  {
    id: "post-5",
    title: "Salar de Uyuni: Walking on the Largest Mirror in the World",
    slug: "salar-de-uyuni-largest-mirror-world",
    summary: "A journey across the surreal Bolivian salt flats during the wet season, where the horizon dissolves and heaven meets earth.",
    content: `There are places on Earth that challenge your perception of reality. Salar de Uyuni, stretching across 10,000 square kilometers in southwest Bolivia, is top of that list. During the dry season, it is a blindingly white expanse of hexagonal salt tiles. But during the wet season, it transforms into something divine: the largest mirror on Earth.

### The Mirror Effect (El Espejo)
Between December and March, rainwater accumulates on the salt crust. With no drainage and perfectly flat geometry, a thin layer of pristine, still water sits on top of the salt. On a clear day, the reflection is 100% perfect. Clouds drift below your feet, and stars twinkle in the abyss beneath your steps. It feels like walking through space.

### Preparing for the Salt Wilderness
At 3,656 meters above sea level, the air is thin and freezing. A successful expedition requires:
- **A Experienced Driver & 4x4 Vehicle**: The saltwater is highly corrosive to electronics and engines. Getting stuck can be extremely dangerous.
- **Acclimatization**: Spending a couple of days in La Paz or Uyuni town beforehand to avoid severe altitude sickness.
- **Polarized Sunglasses**: The glare from the white salt and water can cause temporary blindness without proper protection.

Salar de Uyuni is a testament to the raw, unfiltered, breathtaking beauty of our planet.`,
    featuredImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-04T08:00:00Z",
    publishedAt: "2026-07-04T08:00:00Z",
    readingTime: 5,
    views: 2150,
    categorySlug: "travel",
    authorId: "auth-3",
    likesCount: 195,
    tags: ["Bolivia", "South America", "Adventure", "Landscape Photography"],
    seoTitle: "Salar de Uyuni Travel Guide: Walking on the Bolivian Mirror",
    seoDescription: "Step-by-step travel guide to visiting Salar de Uyuni in Bolivia during the wet mirror season, including photography tips and packing advice."
  },
  {
    id: "post-6",
    title: "Hidden Kyōto: A Journey Beyond the Golden Pavilion",
    slug: "hidden-kyoto-beyond-golden-pavilion",
    summary: "Discovering secret moss temples, quiet bamboo groves, and centuries-old wooden tea houses away from the bustling tourist crowds.",
    content: `Kyōto is Japan’s cultural heart, famous for its magnificent shrines and historic streets. But popular destinations like Kinkaku-ji (The Golden Pavilion) and Fushimi Inari-taisha are often overwhelmed by tourists. To truly feel the soul of ancient Japan, you must venture off the beaten path.

### The Silent Sanctuary of Gio-ji
Tucked away in the hills of Arashiyama is Gio-ji, a tiny temple famous for its moss garden. Under a dense canopy of maple trees, over 40 species of vibrant green moss coat the earth like a plush, velvet carpet. On a quiet afternoon, the only sound is the dripping of mountain water and the rustle of leaves. It is the physical embodiment of *wabi-sabi*—the beauty of imperfection and transience.

### Tea Ceremony in a Forgotten Valley
We journeyed to the tea-farming village of Wazuka, just south of the city, where terraced emerald hills cultivate the finest Uji matcha. Here, local farmers host traditional tea ceremonies inside authentic 100-year-old wooden huts, showing you how to correctly whisk the matcha to create a velvety jade foam.

Kyōto is not just a list of monuments to check off; it is a meditative experience, waiting to be discovered in its quietest corners.`,
    featuredImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-07T16:20:00Z",
    publishedAt: "2026-07-07T16:20:00Z",
    readingTime: 5,
    views: 1350,
    categorySlug: "travel",
    authorId: "auth-3",
    likesCount: 128,
    tags: ["Japan", "Kyoto", "Cultural Travel", "Slow Travel"],
    seoTitle: "Hidden Kyoto Travel Guide: Off the Beaten Path Shrines",
    seoDescription: "Escape the crowds in Kyoto. Explore secret moss gardens, bamboo trails, and Wazuka tea farms in this curated slow-travel guide."
  },

  // FOOD
  {
    id: "post-7",
    title: "The Art of Slow Smoking: A Culinary Tour of Texas BBQ",
    slug: "art-of-slow-smoking-texas-bbq",
    summary: "Unlocking the secrets of post oak wood, salt-and-pepper bark, and 16-hour cooks that turn tough beef brisket into buttery culinary gold.",
    content: `Texas barbecue is not a cooking method; it is a religion. In central Texas, pitmasters spend their lives mastering a simple, unforgiving craft: cooking tough cuts of meat over low indirect heat using nothing but wood, fire, smoke, and patience.

### The Holy Trinity: Brisket, Post Oak, and Smoke
A central Texas brisket is seasoned minimally—usually just coarse kosher salt and 16-mesh black pepper. The magic happens inside the offset smoker.
- **The Wood**: Post Oak is the wood of choice. It burns clean, provides a mild sweet smoke profile, and does not overpower the natural beef flavor.
- **The Bark**: As the smoke rolls over the seasoned meat, a chemical reaction occurs. The salt, pepper, and fat bind with the smoke compounds to create an obsidian, glossy, crunchy exterior called the "bark."
- **The Collagen Breakdown**: Brisket is packed with tough collagen fibers. By maintaining a steady heat of 225°F (107°C) for up to 16 hours, the collagen slowly melts into rich, luxurious gelatin, giving the brisket its famous, melt-in-your-mouth texture.

### Testing the Perfect Slice
When you hold a slice of Texas brisket over your finger, it should bend perfectly without breaking, and pull apart with the gentlest tug. If it crumbles, it’s overcooked; if it's tough, it's underdone. Achieving that razor-thin sweet spot is what separates backyard amateurs from culinary gods.`,
    featuredImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-02T12:00:00Z",
    publishedAt: "2026-07-02T12:00:00Z",
    readingTime: 5,
    views: 1560,
    categorySlug: "food",
    authorId: "auth-4",
    likesCount: 145,
    tags: ["BBQ", "Texas", "Meat Science", "Food Travel"],
    seoTitle: "The Science & Art of Texas BBQ Beef Brisket",
    seoDescription: "An in-depth culinary look at how Texas pitmasters smoke beef brisket to absolute perfection using post oak wood and steady temperature control."
  },
  {
    id: "post-8",
    title: "Sourdough Alchemy: The Science Behind the Perfect Golden Crust",
    slug: "sourdough-alchemy-science-perfect-crust",
    summary: "How wild yeasts, lactic acid bacteria, hydration percentages, and steam cooperate to bake the ultimate rustic boule.",
    content: `Flour, water, salt. These three humble ingredients, combined with wild microbes floating in the air, create one of humanity's greatest culinary triumphs: sourdough bread. Baking a great loaf is a masterclass in organic chemistry and microbiology.

### The Microscopic Metropolis
Commercial bread relies on isolated baker's yeast (*Saccharomyces cerevisiae*) for rapid rise. Sourdough, however, is a symbiotic colony of wild yeasts and lactic acid bacteria (LAB):
- **Wild Yeast**: Captures natural starches, fermenting them to release carbon dioxide bubbles that cause the dough to rise.
- **Lactic Acid Bacteria**: Ferments starches into lactic and acetic acid, which gives sourdough its signature tangy flavor and strengthens the gluten structure.

### Hydration and Oven Spring
A high hydration level (75% to 80% water to flour weight) creates an open, airy crumb structure. When the dough hits a scorching hot Dutch oven, the water evaporates instantly, creating pockets of steam. This steam inflates the loaf (the "oven spring") and gelatinizes the exterior starches, yielding a beautifully blistered, mahogany-colored, crispy crust.

Sourdough is a slow, rewarding dialogue with nature—one that yields the most delicious results.`,
    featuredImage: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-06T09:00:00Z",
    publishedAt: "2026-07-06T09:00:00Z",
    readingTime: 4,
    views: 1100,
    categorySlug: "food",
    authorId: "auth-4",
    likesCount: 74,
    tags: ["Baking", "Sourdough", "Food Chemistry", "Bread"],
    seoTitle: "The Chemistry and Science of Sourdough Bread Baking",
    seoDescription: "Explore the microbiology of sourdough starters, hydration ratios, and steam techniques to bake a bakery-quality sourdough loaf at home."
  },

  // NEWS
  {
    id: "post-9",
    title: "Tech Frontier: How Generative AI is Reshaping Creative Industries",
    slug: "tech-frontier-generative-ai-reshaping-creative-industries",
    summary: "An analytical deep dive into the legal, creative, and technological shifts occurring as multi-modal AI agents merge into film, music, and design.",
    content: `The boundary between human creativity and algorithmic execution is dissolving. Over the past twelve months, Generative AI models have progressed from producing quirky, distorted images to generating broadcast-quality video, multi-track orchestral scores, and sophisticated prose. This is not a slow evolution; it is a disruptive revolution.

### The Rise of Multi-Modal Co-Pilots
In design and film production, AI is no longer a gimmick—it is a production pipeline standard. Directors use text-to-video generators to instantly pitch storyboards, saving weeks of pre-visual mockups. Concept artists feed rough charcoal sketches into rendering models to instantly generate high-fidelity textures.

### The Copyright Battleground
With great power comes unprecedented legal friction. Who owns the copyright to an image generated by an algorithm trained on millions of copyrighted works? Global court cases are currently debating:
- **Fair Use Doctrine**: Does training a model on public data constitute transformative use?
- **Style Ownership**: Can an artist sue if an AI model is fine-tuned to perfectly replicate their unique visual brushstrokes?

As the technology surges forward, we must build frameworks that protect human creators while embracing the hyper-efficiency of the digital frontier.`,
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-09T08:00:00Z",
    publishedAt: "2026-07-09T08:00:00Z",
    readingTime: 5,
    views: 1980,
    categorySlug: "news",
    authorId: "auth-5",
    likesCount: 164,
    tags: ["Artificial Intelligence", "Tech Policy", "Creative Industry", "Future of Work"],
    seoTitle: "The Creative Impact and Legal Debates of Generative AI",
    seoDescription: "Analyze the rapid adoption of AI co-pilots in movies, music, and gaming, and the legal battles reshaping global intellectual property."
  },
  {
    id: "post-10",
    title: "The Green Transition: Cities leading the Climate Change Grid Upgrade",
    slug: "green-transition-cities-leading-climate-grid-upgrade",
    summary: "How leading municipal centers are deploying decentralized battery walls and smart microgrids to absorb surging clean energy loads.",
    content: `As coal and gas plants are phased out, the world's cities face a daunting structural bottleneck: the electrical grid. Designed a century ago for centralized, one-way power distribution, our energy grids are struggling to cope with the volatile, multi-directional flow of clean, renewable energy.

### Smart Microgrids to the Rescue
From Copenhagen to Tokyo, progressive cities are decentralizing their power infrastructure. By dividing the urban grid into localized "microgrids," municipalities can:
- **Balance Local Load**: If a sudden storm darkens solar arrays, microgrids instantly toggle to localized battery reserves.
- **Incorporate EV Batteries**: Electric vehicles parked in garages are plugged into bi-directional chargers, acting as a massive, distributed battery reserve to buffer peak-hour surges.
- **AI-Driven Load Forecasting**: Machine learning algorithms predict cloud coverage and wind drop-offs, preemptively rerouting hydro or geothermal power to keep the city fully powered.

The climate battle will not just be won with solar panels; it will be won through the brilliant, automated wiring of our future cities.`,
    featuredImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-11T13:00:00Z",
    publishedAt: "2026-07-11T13:00:00Z",
    readingTime: 5,
    views: 1250,
    categorySlug: "news",
    authorId: "auth-5",
    likesCount: 92,
    tags: ["Climate Change", "Urban Infrastructure", "Green Energy", "Engineering"],
    seoTitle: "How Smart Microgrids are Powering the Green Energy Transition",
    seoDescription: "Examine how global metropolises are redesigning electrical grids with smart microgrids, AI, and bi-directional battery power."
  },

  // TECHNICAL
  {
    id: "post-tech-1",
    title: "React 19 Internals: Under the Hood of Server Actions and Transitions",
    slug: "react-19-internals-server-actions-transitions",
    summary: "A deep dive into how React 19 coordinates concurrent rendering, async transitions, and server action serialization to streamline client-server architecture.",
    content: `React 19 marks one of the most substantial architectural shifts in the library's history. By formalizing data mutations and asynchronous transitions, it shifts the developer paradigm from managing state transitions manually to declaring them as natural side effects of user interactions.

### The Mechanics of Transitions
At the core of the state update lifecycle is the new Concurrent scheduler coordinate. When you wrap an asynchronous operation inside \`startTransition\`, React:
1. **Enters Transition Mode**: It sets an internal context flag that marks all state updates scheduled during the callback as interruptible.
2. **Forks the Fiber Tree**: React performs speculative updates on a secondary, offscreen fiber tree. If a higher-priority update (like typing in an input field) occurs, React pauses the speculative render and handles the input first.
3. **Optimistic Updates**: Using the new \`useOptimistic\` hook, developers can immediately commit a visual state to the screen while the network request is still in flight, reverting it automatically if the request fails.

### Server Actions Serialization
React Server Actions are not just fancy API endpoints; they are RPC (Remote Procedure Call) boundaries. When you invoke a Server Action:
- The compiler generates a secure cryptographic token representing the action handler.
- React serializes the arguments using a custom streaming protocol. This handles complex data structures, including promises, file uploads, and nested React element trees.
- The browser sends a POST request with the serialized payload, and the server returns a stream of UI instructions (RSC payload) that the client merges back into the virtual DOM.

By merging server execution directly into the component tree, React 19 bridges the gap between client interactivity and server-side performance.`,
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-12T14:00:00Z",
    publishedAt: "2026-07-12T14:00:00Z",
    readingTime: 6,
    views: 2450,
    categorySlug: "technology",
    authorId: "auth-6",
    likesCount: 195,
    tags: ["React", "TypeScript", "Performance", "Web Development"],
    seoTitle: "Deep Dive into React 19 Server Actions & Transitions Internals",
    seoDescription: "An in-depth technical analysis of React 19, detailing the concurrent rendering scheduler, transition lifecycles, and Server Action serialization protocols."
  },
  {
    id: "post-tech-2",
    title: "Modern Database Scaling: Choosing Between SQL Sharding and NoSQL Document Engines",
    slug: "modern-database-scaling-sql-sharding-vs-nosql",
    summary: "We deconstruct the consistency guarantees, query capabilities, and operating costs of horizontally scaled relational databases vs globally distributed document systems.",
    content: `In the era of hyper-scale web applications, the database is almost always the ultimate bottleneck. Scaling a database horizontally is notoriously difficult because of the trade-offs inherent in distributed computing.

### The CAP Theorem and Consistency
When designing a distributed data store, you must navigate Brewer's CAP Theorem: you can only guarantee two out of Consistency, Availability, and Partition Tolerance simultaneously.
- **Relational Sharding (ACID)**: Traditional SQL databases like PostgreSQL achieve scale by partitioning tables across multiple database nodes based on a "shard key." However, executing cross-shard joins or transactions requires two-phase commit (2PC) protocols, which introduce heavy network latency.
- **NoSQL Document Stores (BASE)**: Document databases like MongoDB or Firestore trade strict immediate consistency for high availability and partition tolerance. They rely on "eventual consistency," where data is asynchronously replicated across regions.

### Query Latency vs. Development Velocity
NoSQL databases offer unmatched write throughput because they are highly denormalized; document writes are atomic, self-contained operations. However, if your application requires complex analytical queries or multi-table aggregations, NoSQL forces you to perform those computations on the application layer, which can be extremely slow and error-prone.

Relational databases with automated scaling layers, such as Spanner or CockroachDB, solve this by implementing consensus protocols (like Paxos or Raft) to coordinate global transactions. While more expensive to run, they provide a clean relational model with horizontal scalability.`,
    featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=675&fit=crop&q=80",
    published: true,
    createdAt: "2026-07-10T09:30:00Z",
    publishedAt: "2026-07-10T09:30:00Z",
    readingTime: 7,
    views: 1890,
    categorySlug: "technology",
    authorId: "auth-6",
    likesCount: 134,
    tags: ["System Design", "Databases", "Scaling", "SQL", "NoSQL"],
    seoTitle: "SQL Sharding vs NoSQL Document Engines: Scaling Trade-offs",
    seoDescription: "Examine the technical trade-offs between distributed relational database sharding and globally replicated NoSQL document engines."
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "comm-1",
    content: "Absolutely phenomenal breakdown of batting mechanics. The point about hip-rotation speeds explains why Klaasen's power looks so effortless!",
    createdAt: "2026-07-02T11:20:00Z",
    postSlug: "rise-of-legend-modern-t20-cricket",
    userEmail: "cricketfan99@gmail.com",
    userName: "Alex Mercer",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "comm-2",
    content: "We need more articles on the biomechanics of modern bowling, too. The strain on fast-bowler shoulders is insane.",
    createdAt: "2026-07-02T14:45:00Z",
    postSlug: "rise-of-legend-modern-t20-cricket",
    userEmail: "bowlingcoach@gmail.com",
    userName: "Coach Dave",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "comm-3",
    content: "This is pure art! The reflection in the water looks unreal. Adding Bolivia to my immediate bucket list for next year.",
    createdAt: "2026-07-04T12:00:00Z",
    postSlug: "salar-de-uyuni-largest-mirror-world",
    userEmail: "wanderlust_jen@yahoo.com",
    userName: "Jenny Styles",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "comm-4",
    content: "As someone who tried smoking brisket last weekend and ended up with a dry piece of leather, this guide explains exactly what I did wrong. Collagen breakdown takes time!",
    createdAt: "2026-07-03T10:15:00Z",
    postSlug: "art-of-slow-smoking-texas-bbq",
    userEmail: "backyard_bbq_guy@outlook.com",
    userName: "Dave Miller",
    userAvatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop&q=80"
  }
];

export class Database {
  private schema: DatabaseSchema;

  constructor() {
    this.schema = {
      users: [
        {
          id: "u-1",
          email: "palash.pal9732@gmail.com",
          name: "Palash Pal",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
          createdAt: "2026-01-01T00:00:00Z"
        }
      ],
      authors: INITIAL_AUTHORS,
      posts: INITIAL_POSTS,
      comments: INITIAL_COMMENTS,
      bookmarks: [],
      likes: [],
      newsletters: [],
      notifications: [
        {
          id: "not-1",
          title: "Welcome to BlogSphere!",
          message: "Thank you for joining our premium digital magazine. Explore breaking stories, sports insights, travel logs, culinary reviews, and deep news dives.",
          read: false,
          createdAt: new Date().toISOString(),
          userEmail: "palash.pal9732@gmail.com"
        }
      ],
      analytics: {
        viewsByDate: {
          "2026-07-06": 420,
          "2026-07-07": 680,
          "2026-07-08": 540,
          "2026-07-09": 980,
          "2026-07-10": 1120,
          "2026-07-11": 1340,
          "2026-07-12": 1560
        },
        viewsByCategory: {
          "cricket": 2130,
          "football": 2370,
          "travel": 3500,
          "food": 2660,
          "news": 3230
        }
      }
    };
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Merge structures carefully
        this.schema = {
          users: parsed.users || this.schema.users,
          authors: parsed.authors || this.schema.authors,
          posts: parsed.posts || this.schema.posts,
          comments: parsed.comments || this.schema.comments,
          bookmarks: parsed.bookmarks || this.schema.bookmarks,
          likes: parsed.likes || this.schema.likes,
          newsletters: parsed.newsletters || this.schema.newsletters,
          notifications: parsed.notifications || this.schema.notifications,
          analytics: parsed.analytics || this.schema.analytics,
        };

        let mutated = false;
        // Verify author auth-6 is present
        if (!this.schema.authors.some(a => a.id === "auth-6")) {
          const auth6 = INITIAL_AUTHORS.find(a => a.id === "auth-6");
          if (auth6) {
            this.schema.authors.push(auth6);
            mutated = true;
          }
        }

        // Migrate any legacy "technical" posts to "technology" categorySlug
        this.schema.posts.forEach((p) => {
          if (p.categorySlug === ("technical" as any)) {
            p.categorySlug = "technology";
            mutated = true;
          }
        });

        // Migrate any legacy "technical" analytics view counts
        if (this.schema.analytics && this.schema.analytics.viewsByCategory) {
          if (this.schema.analytics.viewsByCategory["technical"] !== undefined) {
            const views = this.schema.analytics.viewsByCategory["technical"];
            delete this.schema.analytics.viewsByCategory["technical"];
            this.schema.analytics.viewsByCategory["technology"] = (this.schema.analytics.viewsByCategory["technology"] || 0) + views;
            mutated = true;
          }
        }

        // Verify technology posts are present
        if (!this.schema.posts.some(p => p.categorySlug === "technology")) {
          const techPosts = INITIAL_POSTS.filter(p => p.categorySlug === "technology");
          this.schema.posts.unshift(...techPosts);
          mutated = true;
        }

        // Verify viewsByCategory has technology
        if (this.schema.analytics && this.schema.analytics.viewsByCategory && this.schema.analytics.viewsByCategory["technology"] === undefined) {
          this.schema.analytics.viewsByCategory["technology"] = 450;
          mutated = true;
        }

        if (mutated) {
          this.save();
        }
      } else {
        this.save();
      }
    } catch (err) {
      console.error("Error loading database file, using fallback in-memory state:", err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error writing database to disk:", err);
    }
  }

  getUsers() { return this.schema.users; }
  getAuthors() { return this.schema.authors; }
  getPosts() { return this.schema.posts; }
  getComments() { return this.schema.comments; }
  getBookmarks() { return this.schema.bookmarks; }
  getLikes() { return this.schema.likes; }
  getNewsletters() { return this.schema.newsletters; }
  getNotifications() { return this.schema.notifications; }
  getAnalytics() { return this.schema.analytics; }

  findUser(email: string) {
    return this.schema.users.find(u => u.email === email);
  }

  createUser(email: string, name: string, avatar?: string, password?: string) {
    let user = this.findUser(email);
    if (!user) {
      user = {
        id: "u-" + Math.random().toString(36).substr(2, 9),
        email,
        name,
        avatar: avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80`,
        createdAt: new Date().toISOString(),
        password: password
      };
      this.schema.users.push(user);
      this.save();
    } else if (password && !user.password) {
      // Backfill password if user existed without one initially
      user.password = password;
      this.save();
    }
    return user;
  }

  updateUserPassword(email: string, password_val: string) {
    const user = this.findUser(email);
    if (user) {
      user.password = password_val;
      this.save();
    }
  }

  addNewsletter(email: string) {
    const exists = this.schema.newsletters.find(n => n.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;
    const item = {
      id: "nl-" + Math.random().toString(36).substr(2, 9),
      email,
      createdAt: new Date().toISOString()
    };
    this.schema.newsletters.push(item);
    this.save();
    return item;
  }

  createPost(postData: Omit<Post, 'id' | 'views' | 'likesCount' | 'createdAt' | 'publishedAt'>) {
    const id = "post-" + Math.random().toString(36).substr(2, 9);
    const date = new Date().toISOString();
    const newPost: Post = {
      ...postData,
      id,
      views: 0,
      likesCount: 0,
      createdAt: date,
      publishedAt: postData.published ? date : ""
    };
    this.schema.posts.unshift(newPost);
    this.save();
    return newPost;
  }

  updatePost(slug: string, updates: Partial<Post>) {
    const idx = this.schema.posts.findIndex(p => p.slug === slug);
    if (idx === -1) return null;
    const existing = this.schema.posts[idx];
    const updated = { ...existing, ...updates };
    this.schema.posts[idx] = updated;
    this.save();
    return updated;
  }

  deletePost(slug: string) {
    const idx = this.schema.posts.findIndex(p => p.slug === slug);
    if (idx === -1) return false;
    this.schema.posts.splice(idx, 1);
    this.save();
    return true;
  }

  viewPost(slug: string) {
    const post = this.schema.posts.find(p => p.slug === slug);
    if (post) {
      post.views += 1;
      // Record in analytics
      const today = new Date().toISOString().split('T')[0];
      this.schema.analytics.viewsByDate[today] = (this.schema.analytics.viewsByDate[today] || 0) + 1;
      this.schema.analytics.viewsByCategory[post.categorySlug] = (this.schema.analytics.viewsByCategory[post.categorySlug] || 0) + 1;
      this.save();
    }
    return post;
  }

  toggleLike(email: string, postSlug: string) {
    const existingIdx = this.schema.likes.findIndex(l => l.userEmail === email && l.postSlug === postSlug);
    const post = this.schema.posts.find(p => p.slug === postSlug);
    
    if (existingIdx !== -1) {
      this.schema.likes.splice(existingIdx, 1);
      if (post) post.likesCount = Math.max(0, post.likesCount - 1);
      this.save();
      return { liked: false, count: post?.likesCount || 0 };
    } else {
      const item = {
        id: "like-" + Math.random().toString(36).substr(2, 9),
        userEmail: email,
        postSlug,
        createdAt: new Date().toISOString()
      };
      this.schema.likes.push(item);
      if (post) post.likesCount += 1;
      this.save();
      return { liked: true, count: post?.likesCount || 0 };
    }
  }

  toggleBookmark(email: string, postSlug: string) {
    const existingIdx = this.schema.bookmarks.findIndex(b => b.userEmail === email && b.postSlug === postSlug);
    if (existingIdx !== -1) {
      this.schema.bookmarks.splice(existingIdx, 1);
      this.save();
      return { bookmarked: false };
    } else {
      const item = {
        id: "bm-" + Math.random().toString(36).substr(2, 9),
        userEmail: email,
        postSlug,
        createdAt: new Date().toISOString()
      };
      this.schema.bookmarks.push(item);
      this.save();
      return { bookmarked: true };
    }
  }

  addComment(postSlug: string, email: string, name: string, avatar: string, content: string) {
    const comment: Comment = {
      id: "comm-" + Math.random().toString(36).substr(2, 9),
      content,
      createdAt: new Date().toISOString(),
      postSlug,
      userEmail: email,
      userName: name,
      userAvatar: avatar
    };
    this.schema.comments.push(comment);
    this.save();
    return comment;
  }

  deleteComment(id: string) {
    const idx = this.schema.comments.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.schema.comments.splice(idx, 1);
    this.save();
    return true;
  }

  getNotificationsForUser(email: string) {
    return this.schema.notifications.filter(n => n.userEmail === email);
  }

  markNotificationsRead(email: string) {
    this.schema.notifications.forEach(n => {
      if (n.userEmail === email) n.read = true;
    });
    this.save();
    return true;
  }

  addNotification(email: string, title: string, message: string) {
    const notification: Notification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      userEmail: email
    };
    this.schema.notifications.push(notification);
    this.save();
    return notification;
  }
}

export const db = new Database();
