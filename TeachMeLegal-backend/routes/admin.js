const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Analytics Stats
router.get('/analytics', async (req, res) => {
  try {
    const totalBlogs = await prisma.blogPost.count({ where: { published: true } });
    const totalCourses = await prisma.course.count({ where: { active: true } });
    
    const allBlogs = await prisma.blogPost.findMany({ 
      select: { id: true, title: true, category: true, views: true },
      orderBy: { views: 'desc' }
    });
    
    const totalViews = allBlogs.reduce((acc, blog) => acc + blog.views, 0);
    const popularBlogs = allBlogs.slice(0, 5); // Top 5

    // Traffic sources calculation
    const events = await prisma.analyticsEvent.findMany({
      select: { referrer: true }
    });
    
    let sources = { Google: 0, Direct: 0, YouTube: 0, Social: 0 };
    let totalEvents = events.length || 1;
    
    events.forEach(event => {
      const ref = (event.referrer || '').toLowerCase();
      if (!ref || ref.includes('localhost') || ref.includes('teachmelegal')) sources.Direct++;
      else if (ref.includes('google')) sources.Google++;
      else if (ref.includes('youtube')) sources.YouTube++;
      else sources.Social++;
    });

    const trafficSources = [
      { name: 'Google Search / Organic', percentage: Math.round((sources.Google / totalEvents) * 100), color: '#3b82f6' },
      { name: 'Direct / Bookmarks', percentage: Math.round((sources.Direct / totalEvents) * 100), color: '#10b981' },
      { name: 'YouTube Channel', percentage: Math.round((sources.YouTube / totalEvents) * 100), color: '#ef4444' },
      { name: 'Social & Telegram', percentage: Math.round((sources.Social / totalEvents) * 100), color: '#f59e0b' }
    ];

    res.json({
      success: true,
      stats: {
        totalBlogs,
        totalCourses,
        totalViews,
      },
      popularBlogs,
      trafficSources
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Blogs CRUD
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, posts: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const { title, slug, category, content, excerpt, published, author, readTime, categoryColor, coverImage } = req.body;
    
    // Auto-generate slug if not provided
    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const blog = await prisma.blogPost.create({
      data: {
        title, 
        slug: generatedSlug, 
        category: category || 'Banking Law', 
        content, 
        excerpt, 
        published: published !== undefined ? published : true, 
        author: author || 'Advocate Prashant Jha', 
        readTime: readTime || '5 min read', 
        categoryColor: categoryColor || '#3b82f6',
        coverImage
      }
    });
    res.json({ success: true, post: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({ where: { id: req.params.id } });
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    res.json({ success: true, post: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const { title, slug, category, content, excerpt, published, author, readTime, categoryColor, coverImage } = req.body;
    const blog = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title, slug, category, content, excerpt, published, author, readTime, categoryColor, coverImage
      }
    });
    res.json({ success: true, post: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
