import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/dbSim.js"; // In Node modules, we import using standard or relative paths. Note: tsx will resolve this beautifully.

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());

  // Log requests to terminal for visibility
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // ==================== SEO & STATIC XML/TXT GENERATORS ====================

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: ${req.protocol}://${req.get("host")}/sitemap.xml
`);
  });

  // Dynamic XML Sitemap
  app.get("/sitemap.xml", (req, res) => {
    const posts = db.getPosts().filter((p) => p.published);
    const host = `${req.protocol}://${req.get("host")}`;
    const categories = ["cricket", "football", "travel", "food", "news", "technology"];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages
    const staticPages = ["", "/cricket", "/football", "/travel", "/food", "/news", "/technology", "/search", "/profile", "/admin"];
    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${host}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
    }

    // Dynamic Posts
    for (const post of posts) {
      xml += `  <url>\n    <loc>${host}/blog/${post.slug}</loc>\n    <lastmod>${post.publishedAt ? post.publishedAt.substring(0, 10) : new Date().toISOString().substring(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.type("application/xml");
    res.send(xml);
  });

  // Dynamic RSS XML Feed
  app.get("/rss.xml", (req, res) => {
    const posts = db.getPosts().filter((p) => p.published).slice(0, 20);
    const host = `${req.protocol}://${req.get("host")}`;

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>BlogSphere | Premium Digital Magazine</title>
  <link>${host}</link>
  <description>The ultimate destination for Cricket, Football, Travel, Food, and Breaking News.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${host}/rss.xml" rel="self" type="application/rss+xml" />
`;

    for (const post of posts) {
      xml += `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${host}/blog/${post.slug}</link>
    <guid isPermaLink="true">${host}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
    <description><![CDATA[${post.summary}]]></description>
    <category>${post.categorySlug}</category>
  </item>\n`;
    }

    xml += `</channel>\n</rss>`;
    res.type("application/xml");
    res.send(xml);
  });


  // ==================== BLOG POSTS & CATEGORIES API ====================

  // Get posts (supports query params: category, search, tag, author, limit, offset, includeDrafts)
  app.get("/api/posts", (req, res) => {
    const { category, search, tag, authorId, includeDrafts } = req.query;

    let posts = db.getPosts();

    // Filter published status
    if (includeDrafts !== "true") {
      posts = posts.filter((p) => p.published);
    }

    // Category Filter
    if (category) {
      posts = posts.filter((p) => p.categorySlug.toLowerCase() === String(category).toLowerCase());
    }

    // Author Filter
    if (authorId) {
      posts = posts.filter((p) => p.authorId === String(authorId));
    }

    // Tag Filter
    if (tag) {
      posts = posts.filter((p) => p.tags.some((t) => t.toLowerCase() === String(tag).toLowerCase()));
    }

    // Search Filter
    if (search) {
      const q = String(search).toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    res.json(posts);
  });

  // Get breaking news / top stories banner
  app.get("/api/posts/breaking", (req, res) => {
    const breakingNews = db.getPosts().filter((p) => p.published && p.categorySlug === "news").slice(0, 3);
    res.json(breakingNews);
  });

  // Get trending posts
  app.get("/api/posts/trending", (req, res) => {
    const trending = [...db.getPosts().filter((p) => p.published)]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    res.json(trending);
  });

  // Get single post by slug (and record view)
  app.get("/api/posts/slug/:slug", (req, res) => {
    const { slug } = req.params;
    const post = db.viewPost(slug);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  });

  // ==================== AUTH & USER PROFILE API ====================
  
  // Sign Up Endpoint
  app.post("/api/auth/signup", (req, res) => {
    const { email, name, avatar, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Display name is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const existingUser = db.findUser(email);
    if (existingUser) {
      return res.status(400).json({ error: "A user with this email address already exists. Please sign in instead." });
    }

    const user = db.createUser(email, name, avatar, password);
    res.json(user);
  });

  // Sign In Endpoint
  app.post("/api/auth/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = db.findUser(email);
    if (!user) {
      return res.status(404).json({ error: "No account found with this email. Please sign up first." });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    // If the user did not have a password (e.g. initial demo user), assign it now
    if (!user.password) {
      db.updateUserPassword(email, password);
    }

    res.json(user);
  });

  // Login / Registration Simulation (Legacy compatibility fallback)
  app.post("/api/auth/login", (req, res) => {
    const { email, name, avatar, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const displayName = name || email.split("@")[0];
    const user = db.createUser(email, displayName, avatar, password);
    res.json(user);
  });

  // Fetch bookmarks & likes for user
  app.get("/api/user/activity", (req, res) => {
    const email = String(req.query.email);
    if (!email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const bookmarks = db.getBookmarks().filter((b) => b.userEmail === email);
    const likes = db.getLikes().filter((l) => l.userEmail === email);
    
    const allPosts = db.getPosts();
    const bookmarkedPosts = allPosts.filter((p) => bookmarks.some((b) => b.postSlug === p.slug));
    const likedPosts = allPosts.filter((p) => likes.some((l) => l.postSlug === p.slug));

    res.json({
      bookmarks: bookmarkedPosts,
      likes: likedPosts,
    });
  });

  // Toggle Like
  app.post("/api/posts/slug/:slug/like", (req, res) => {
    const { slug } = req.params;
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized. User email required." });
    }
    const result = db.toggleLike(email, slug);
    res.json(result);
  });

  // Toggle Bookmark
  app.post("/api/posts/slug/:slug/bookmark", (req, res) => {
    const { slug } = req.params;
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized. User email required." });
    }
    const result = db.toggleBookmark(email, slug);
    res.json(result);
  });

  // Check like/bookmark status for a post
  app.post("/api/posts/slug/:slug/check-status", (req, res) => {
    const { slug } = req.params;
    const { email } = req.body;
    if (!email) {
      return res.json({ liked: false, bookmarked: false });
    }
    const liked = db.getLikes().some((l) => l.userEmail === email && l.postSlug === slug);
    const bookmarked = db.getBookmarks().some((b) => b.userEmail === email && b.postSlug === slug);
    res.json({ liked, bookmarked });
  });

  // ==================== COMMENTS API ====================

  // Get comments for a post
  app.get("/api/posts/slug/:slug/comments", (req, res) => {
    const { slug } = req.params;
    const comments = db.getComments()
      .filter((c) => c.postSlug === slug)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(comments);
  });

  // Add comment
  app.post("/api/posts/slug/:slug/comments", (req, res) => {
    const { slug } = req.params;
    const { email, name, avatar, content } = req.body;
    if (!email || !content) {
      return res.status(400).json({ error: "Email and comment content required" });
    }
    const comment = db.addComment(slug, email, name || email.split("@")[0], avatar || "", content);
    res.status(201).json(comment);
  });

  // Delete comment
  app.delete("/api/comments/:id", (req, res) => {
    const { id } = req.params;
    const success = db.deleteComment(id);
    if (!success) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json({ success: true });
  });

  // ==================== NOTIFICATIONS API ====================

  app.get("/api/user/notifications", (req, res) => {
    const email = String(req.query.email);
    if (!email) {
      return res.status(400).json({ error: "Email parameter required" });
    }
    const list = db.getNotificationsForUser(email);
    res.json(list);
  });

  app.post("/api/user/notifications/read", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }
    db.markNotificationsRead(email);
    res.json({ success: true });
  });

  // ==================== AUTHORS API ====================

  app.get("/api/authors", (req, res) => {
    res.json(db.getAuthors());
  });

  // ==================== NEWSLETTER API ====================

  app.post("/api/newsletter/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    db.addNewsletter(email);
    res.json({ success: true, message: "Successfully subscribed to our digital magazine!" });
  });

  // ==================== SEARCH SUGGESTIONS API ====================

  app.get("/api/search/suggest", (req, res) => {
    const q = String(req.query.q || "").toLowerCase();
    if (!q) {
      return res.json([]);
    }
    const titles = db.getPosts()
      .filter((p) => p.published && p.title.toLowerCase().includes(q))
      .map((p) => p.title)
      .slice(0, 5);
    res.json(titles);
  });

  // ==================== ADMIN DASHBOARD API ====================

  // Admin stats
  app.get("/api/admin/stats", (req, res) => {
    const posts = db.getPosts();
    const comments = db.getComments();
    const newsletters = db.getNewsletters();
    const users = db.getUsers();

    const totalViews = posts.reduce((acc, p) => acc + p.views, 0);
    const totalLikes = posts.reduce((acc, p) => acc + p.likesCount, 0);

    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => p.published).length,
      draftPosts: posts.filter((p) => !p.published).length,
      totalViews,
      totalLikes,
      totalComments: comments.length,
      subscribersCount: newsletters.length,
      usersCount: users.length,
      analytics: db.getAnalytics(),
    };

    res.json(stats);
  });

  // Create post
  app.post("/api/admin/posts", (req, res) => {
    const { title, summary, content, featuredImage, categorySlug, authorId, published, tags, seoTitle, seoDescription } = req.body;
    if (!title || !content || !categorySlug || !authorId) {
      return res.status(400).json({ error: "Title, content, category, and author are required." });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check slug collision
    const existing = db.getPosts().find((p) => p.slug === slug);
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const readingTime = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    const newPost = db.createPost({
      title,
      slug: finalSlug,
      summary: summary || title.substring(0, 150) + "...",
      content,
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=675&fit=crop&q=80",
      categorySlug,
      authorId,
      published: published === true,
      tags: Array.isArray(tags) ? tags : ["General"],
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || summary,
      readingTime,
    });

    res.status(201).json(newPost);
  });

  // Update post
  app.put("/api/admin/posts/slug/:slug", (req, res) => {
    const { slug } = req.params;
    const updates = req.body;
    const updated = db.updatePost(slug, updates);
    if (!updated) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(updated);
  });

  // Delete post
  app.delete("/api/admin/posts/slug/:slug", (req, res) => {
    const { slug } = req.params;
    const success = db.deletePost(slug);
    if (!success) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ success: true });
  });

  // ==================== DEV SERVER VS PRODUCTION STATIC SERVING ====================

  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Server middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built assets from 'dist'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BlogSphere Server] Running full-stack on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical: Failed to launch BlogSphere server:", error);
});
