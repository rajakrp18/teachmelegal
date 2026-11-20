import fs from 'fs';
import path from 'path';
import initialBlogs from '../data/blogs.json';

// In-memory + File store for Blog Posts and Analytics fallback
const INITIAL_POSTS = initialBlogs;

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'blogs.json');

function initStore() {
  if (global.__blogsStore && global.__blogsStore.length > 0) {
    return global.__blogsStore;
  }
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__blogsStore = parsed;
        return global.__blogsStore;
      }
    }
  } catch (e) {
    console.error('Error reading blogs.json, falling back to initial posts:', e);
  }
  global.__blogsStore = [...INITIAL_POSTS];
  saveToDisk();
  return global.__blogsStore;
}

function saveToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(global.__blogsStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing blogs.json:', e);
  }
}

// Global in-memory storage during dev runtime
initStore();

global.__analyticsStore = [
  { id: 'ev-1', path: '/', date: '2026-09-16', views: 420 },
  { id: 'ev-2', path: '/blog', date: '2026-09-16', views: 230 },
  { id: 'ev-3', path: '/blog/state-bank-of-india-act-1955', date: '2026-09-16', views: 145 },
  { id: 'ev-4', path: '/courses', date: '2026-09-16', views: 180 },
  { id: 'ev-5', path: '/books', date: '2026-09-16', views: 95 }
];

export function getAllPosts(includeDrafts = false) {
  const posts = initStore();
  if (includeDrafts) return posts;
  return posts.filter(p => p.published);
}

export function getPostBySlug(slug) {
  const posts = initStore();
  const post = posts.find(p => p.slug === slug);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
  return post;
}

export function getPostById(id) {
  const posts = initStore();
  return posts.find(p => p.id === id);
}

export function createPost(data) {
  initStore();
  const newPost = {
    id: `post-${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: data.category || 'Banking Law',
    categoryColor: data.categoryColor || '#3b82f6',
    title: data.title,
    author: data.author || 'Advocate Prashant Jha',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: data.readTime || '8 min read',
    comments: 0,
    views: 0,
    published: data.published !== false,
    excerpt: data.excerpt || data.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...',
    content: data.content
  };
  global.__blogsStore.unshift(newPost);
  saveToDisk();
  return newPost;
}

export function updatePost(id, data) {
  initStore();
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  global.__blogsStore[index] = {
    ...global.__blogsStore[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveToDisk();
  return global.__blogsStore[index];
}

export function deletePost(id) {
  initStore();
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return false;
  global.__blogsStore.splice(index, 1);
  saveToDisk();
  return true;
}

export function getAnalyticsStats() {
  const posts = initStore();
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0) + 1250;
  const totalBlogs = posts.length;
  const publishedBlogs = posts.filter(p => p.published).length;
  const draftBlogs = posts.filter(p => !p.published).length;

  const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  const categories = {};
  posts.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  return {
    totalViews,
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    topPosts,
    categories,
    recentTraffic: [
      { day: 'Mon', views: 320 },
      { day: 'Tue', views: 450 },
      { day: 'Wed', views: 510 },
      { day: 'Thu', views: 490 },
      { day: 'Fri', views: 680 },
      { day: 'Sat', views: 720 },
      { day: 'Sun', views: 890 }
    ]
  };
}
