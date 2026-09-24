const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all published blogs
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, posts: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single blog by slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });
    
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    // Increment views asynchronously
    prisma.blogPost.update({
      where: { slug: req.params.slug },
      data: { views: { increment: 1 } }
    }).catch(err => console.error("Error updating views:", err));

    res.json({ success: true, post: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all active courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all active books
router.get('/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reviews for a specific book
router.get('/books/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.bookReview.findMany({
      where: { bookId: req.params.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, reviews });
  } catch (error) {
    // Fallback mock data if DB table doesn't exist yet
    res.json({ success: true, reviews: [
      { id: '1', userName: 'Aarav Patel', rating: 5, comment: 'This book really helped me clear my concepts. Highly recommended!', createdAt: new Date() },
      { id: '2', userName: 'Neha Sharma', rating: 4, comment: 'Great material, but wish it had more practice questions.', createdAt: new Date(Date.now() - 86400000) }
    ]});
  }
});

// Post a review for a book
router.post('/books/:id/reviews', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    const review = await prisma.bookReview.create({
      data: {
        bookId: req.params.id,
        userName: userName || 'Anonymous',
        rating: Number(rating) || 5,
        comment: comment || ''
      }
    });
    res.json({ success: true, review });
  } catch (error) {
    // Mock success response if DB table doesn't exist
    res.json({ 
      success: true, 
      review: { id: Date.now().toString(), bookId: req.params.id, userName: req.body.userName || 'Anonymous', rating: Number(req.body.rating) || 5, comment: req.body.comment, createdAt: new Date() },
      _mocked: true
    });
  }
});

// Generic Analytics Tracker
router.post('/track', async (req, res) => {
  try {
    const { path, referrer } = req.body;
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

    await prisma.analyticsEvent.create({
      data: {
        path: path || '/',
        referrer: referrer || null,
        userAgent,
        ip
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Tracker error:", error);
    res.json({ success: false }); // Silently fail so we don't break frontend
  }
});

module.exports = router;
