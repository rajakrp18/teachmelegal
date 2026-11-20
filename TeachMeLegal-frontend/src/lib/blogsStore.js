import fs from 'fs';
import path from 'path';

let INITIAL_POSTS = [];
try {
  const defaultPath = path.join(process.cwd(), 'src', 'data', 'blogs.json');
  if (fs.existsSync(defaultPath)) {
    INITIAL_POSTS = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
  }
} catch (e) {}

function getBlogFilePaths() {
  const currentDir = process.cwd();
  const candidates = [
    path.join(currentDir, 'src', 'data', 'blogs.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-frontend', 'src', 'data', 'blogs.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-admin-panel', 'src', 'data', 'blogs.json'),
    'c:/teachmelegal/TeachMeLegal-frontend/src/data/blogs.json',
    'c:/teachmelegal/TeachMeLegal-admin-panel/src/data/blogs.json'
  ];
  return [...new Set(candidates.map(p => path.resolve(p)))].filter(fp => {
    return fs.existsSync(path.dirname(fp)) && (fp.includes('TeachMeLegal-frontend') || fp.includes('TeachMeLegal-admin-panel'));
  });
}

function initStore() {
  try {
    const filePaths = getBlogFilePaths();
    let bestData = null;
    let latestMtime = -1;

    for (const fp of filePaths) {
      if (fs.existsSync(fp)) {
        try {
          const stats = fs.statSync(fp);
          const raw = fs.readFileSync(fp, 'utf-8');
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (!bestData || stats.mtimeMs > latestMtime || (parsed.length > bestData.length && Math.abs(stats.mtimeMs - latestMtime) < 10000)) {
              bestData = parsed;
              latestMtime = stats.mtimeMs;
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }

    if (bestData && Array.isArray(bestData) && bestData.length > 0) {
      global.__blogsStore = bestData;
      return global.__blogsStore;
    }
  } catch (e) {
    console.error('Error reading blogs.json, falling back to initial posts:', e);
  }

  if (!global.__blogsStore || global.__blogsStore.length === 0) {
    global.__blogsStore = Array.isArray(INITIAL_POSTS) ? [...INITIAL_POSTS] : [];
    saveToDisk();
  }
  return global.__blogsStore;
}

function saveToDisk() {
  try {
    const filePaths = getBlogFilePaths();
    const dataStr = JSON.stringify(global.__blogsStore, null, 2);
    for (const fp of filePaths) {
      try {
        const dir = path.dirname(fp);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fp, dataStr, 'utf-8');
      } catch (e) {
        // ignore write error for individual non-existent dir
      }
    }
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
  let post = posts.find(p => p.slug === slug);
  if (!post) {
    // Fallback for slug variations of why-teachmelegal
    if (slug === 'why-teachmelegal-journey-making-law-simple' || slug === 'why-teachmelegal-the-journey-of-making-law-simple') {
      post = posts.find(p => p.id === 'post-6' || p.slug.includes('why-teachmelegal'));
    }
  }
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
    excerpt: data.excerpt || (data.content ? data.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : ''),
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
