// In-memory + File store for Blog Posts and Analytics fallback

const INITIAL_POSTS = [
  {
    id: "post-1",
    slug: "state-bank-of-india-act-1955",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "State Bank of India Act, 1955",
    author: "Prashant Jha",
    date: "November 1, 2025",
    readTime: "8 min read",
    comments: 0,
    views: 1420,
    published: true,
    excerpt: "Objective of the Act to establish the State Bank of India (SBI) as a public sector banking institution by taking over the business of the Imperial Bank of India...",
    content: `
      <h2>STATE BANK OF INDIA ACT, 1955</h2>
      <h3>INTRODUCTION</h3>
      <p><strong>Objective of the Act:</strong> To establish the State Bank of India (SBI) as a public sector banking institution by taking over the business of the Imperial Bank of India, in order to extend banking facilities to rural and semi-urban areas and serve as an agent of the Reserve Bank of India (RBI) for government business.</p>
      
      <h3>Imperial Bank to SBI Timeline</h3>
      <div className="table-responsive">
        <table className="blog-table">
          <thead>
            <tr><th>Year</th><th>Event</th></tr>
          </thead>
          <tbody>
            <tr><td>1806</td><td>Bank of Calcutta established</td></tr>
            <tr><td>1921</td><td>Imperial Bank of India formed (merger of 3 Presidency Banks)</td></tr>
            <tr><td>1935</td><td>RBI established</td></tr>
            <tr><td>1947</td><td>India gained Independence</td></tr>
            <tr><td>1951</td><td>Rural Credit Survey Committee recommended nationalization</td></tr>
            <tr><td>1955</td><td>State Bank of India Act passed</td></tr>
            <tr><td>1 July 1955</td><td>SBI formally started functioning</td></tr>
          </tbody>
        </table>
      </div>

      <h3>HISTORICAL BACKGROUND</h3>
      <div className="table-responsive">
        <table className="blog-table">
          <thead>
            <tr><th>Period</th><th>Development</th><th>Explanation</th></tr>
          </thead>
          <tbody>
            <tr><td>Pre–1921</td><td>Presidency Banks</td><td>Three major banks: Bank of Bengal (1806), Bank of Bombay (1840), and Bank of Madras (1843).</td></tr>
            <tr><td>1921</td><td>Formation of Imperial Bank of India</td><td>Merged under Imperial Bank of India Act, 1920. Imperial Bank functioned as commercial & quasi-central bank.</td></tr>
            <tr><td>Post–1947</td><td>National Need</td><td>Imperial Bank largely served urban customers, neglecting rural credit.</td></tr>
            <tr><td>1955</td><td>Nationalization & Establishment of SBI</td><td>Government nationalized Imperial Bank under State Bank of India Act, 1955, creating SBI on 1 July 1955.</td></tr>
          </tbody>
        </table>
      </div>

      <h3>PREAMBLE (Essence)</h3>
      <p><em>“An Act to constitute the State Bank of India and to transfer to it the undertaking of the Imperial Bank of India, and to provide for other matters connected therewith or incidental thereto.”</em></p>

      <h3>AIMS AND OBJECTIVES</h3>
      <ul>
        <li><strong>Nationalization of Imperial Bank:</strong> Bring banking under government control and align with national interests.</li>
        <li><strong>Rural Expansion:</strong> Extend credit facilities to rural and semi-urban areas.</li>
        <li><strong>Financial Inclusion:</strong> Make banking accessible to farmers, small businesses, and weaker sections.</li>
        <li><strong>Public Welfare Banking:</strong> Operate for national economic development.</li>
        <li><strong>Agency Role for RBI:</strong> Manage government accounts, currency, and public debt.</li>
      </ul>

      <h3>CHAPTER STRUCTURE & HIGHLIGHTS</h3>
      <ul>
        <li><strong>Chapter I (Sec 1–2):</strong> Short title, commencement (1 July 1955), and key definitions.</li>
        <li><strong>Chapter II (Sec 3–5):</strong> Establishment of SBI as body corporate (Head office at Mumbai), authorized capital ₹5,000 Cr, minimum 51% Govt holding.</li>
        <li><strong>Chapter III (Sec 6–9):</strong> Automatic transfer of assets, liabilities, and employee terms from Imperial Bank to SBI.</li>
        <li><strong>Chapter IV (Sec 10–15):</strong> Share transferability, voting cap (max 10% for non-Govt), nomination rights, register of beneficial owners.</li>
        <li><strong>Chapter V (Sec 16–31A):</strong> Management by Central Board (Chairman, MDs, Directors) and Local Boards for regional advice.</li>
        <li><strong>Chapter VI (Sec 32–35):</strong> RBI agency duties, ordinary banking powers, prohibited trading, acquisition of other banks.</li>
        <li><strong>Chapter VII (Sec 36–42):</strong> Reserve funds, annual audit, profit distribution, and annual general meeting of shareholders.</li>
        <li><strong>Chapter VIII (Sec 43–57):</strong> Service rules, obligation of fidelity and secrecy, prohibition of voluntary liquidation, dissolution of Imperial Bank.</li>
      </ul>
    `
  },
  {
    id: "post-2",
    slug: "right-of-set-off-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "RIGHT OF SET-OFF IN BANKING",
    author: "Prashant Jha",
    date: "October 25, 2025",
    readTime: "6 min read",
    comments: 0,
    views: 1120,
    published: true,
    excerpt: "In simple terms, Set-off means adjusting one debt against another when two parties owe money to each other...",
    content: `
      <h2>RIGHT OF SET-OFF IN BANKING LAW</h2>
      <h3>1. Meaning of Set-off</h3>
      <p>In simple terms, Set-off means adjusting one debt against another.</p>
      <p>👉 When two parties owe money to each other, the right of set-off allows one party to adjust their debt against the amount receivable from the other party.</p>
      <h3>2. Essential Conditions for Banker's Right of Set-Off</h3>
      <ul>
        <li><strong>Mutuality of Debts:</strong> The debts must be between the same parties in the same capacity.</li>
        <li><strong>Debt Due and Certain:</strong> The debt must be legally enforceable and determined in amount.</li>
        <li><strong>Notice to Customer:</strong> Prior notice must generally be served to the customer before exercising set-off unless agreed otherwise.</li>
        <li><strong>Same Capacity:</strong> A personal deposit cannot be set-off against a partner's joint account debt unless specified.</li>
      </ul>
      <h3>3. Exceptions & Limitations</h3>
      <p>The right of set-off cannot be exercised against trust accounts, specific purpose deposits, or unadjusted future debts.</p>
    `
  },
  {
    id: "post-3",
    slug: "garnishee-orders-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "Garnishee Orders in Banking",
    author: "Prashant Jha",
    date: "October 23, 2025",
    readTime: "5 min read",
    comments: 0,
    views: 1540,
    published: true,
    excerpt: "A Garnishee Order is an order of a court directing a third person (the Garnishee) who owes money to the judgment debtor to pay...",
    content: `
      <h2>Garnishee Orders in Banking</h2>
      <h3>1. What is a Garnishee Order?</h3>
      <p>A Garnishee Order is an order of a court directing a third person (the Garnishee), who owes money to the Judgment Debtor, not to pay money to the debtor but to pay it to the Judgment Creditor instead.</p>
      <h3>2. Two Stages of Garnishee Order</h3>
      <ul>
        <li><strong>Garnishee Order Nisi:</strong> A temporary order served on the bank directing it to freeze the debtor's account and explain why the money should not be attached.</li>
        <li><strong>Garnishee Order Absolute:</strong> A final court order directing the bank to pay the specified amount directly to the court or judgment creditor.</li>
      </ul>
      <h3>3. Bank's Duty and Account Exceptions</h3>
      <p>Upon receipt of Garnishee Order Nisi, the bank must immediately attach the account up to the specified amount and notify the account holder.</p>
    `
  },
  {
    id: "post-4",
    slug: "mareva-injunction",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "MAREVA INJUNCTION",
    author: "Prashant Jha",
    date: "October 22, 2025",
    readTime: "7 min read",
    comments: 0,
    views: 940,
    published: true,
    excerpt: "A Mareva Injunction is a court order restraining a party from disposing of or removing assets out of the jurisdiction prior to judgment...",
    content: `
      <h2>MAREVA INJUNCTION</h2>
      <h3>1. What is a Mareva Injunction?</h3>
      <p>A Mareva Injunction (also known as a Freezing Order) is an interim court order that restrains a defendant from removing assets from the jurisdiction or disposing of them in order to avoid paying a judgment debt.</p>
      <h3>2. Why it was needed</h3>
      <p>To prevent dishonest defendants from draining their bank accounts or transferring assets abroad before trial concludes.</p>
      <h3>3. Origin & Legal Principles</h3>
      <p>Originating in the English court case <em>Mareva Compania Naviera SA v International Bulkcarriers SA (1975)</em>, it has been recognized by courts worldwide including Indian courts under Order 38 Rule 5 of CPC.</p>
    `
  },
  {
    id: "post-5",
    slug: "introduction-to-banking-law",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "INTRODUCTION TO BANKING LAW",
    author: "Prashant Jha",
    date: "September 21, 2025",
    readTime: "9 min read",
    comments: 0,
    views: 2450,
    published: true,
    excerpt: "Nature, Scope, and Functions of Banking Law — Banking law is a set of legal rules and regulations that control how banks operate...",
    content: `
      <h2>INTRODUCTION TO BANKING LAW</h2>
      <h3>1. Nature, Scope, and Functions of Banking Law</h3>
      <p>Banking law is a set of legal rules and regulations that control how banks and financial institutions operate, accept deposits, grant credit, and facilitate national monetary stability.</p>
      <h3>2. Essential Statutory Framework in India</h3>
      <ul>
        <li>Banking Regulation Act, 1949</li>
        <li>Reserve Bank of India Act, 1934</li>
        <li>State Bank of India Act, 1955</li>
        <li>Negotiable Instruments Act, 1881</li>
      </ul>
      <h3>3. Relationship Between Banker and Customer</h3>
      <p>Primary relationship is Debtor and Creditor, alongside secondary agency and trustee relationships.</p>
    `
  },
  {
    id: "post-6",
    slug: "why-teachmelegal-journey-making-law-simple",
    category: "Teachmelegal",
    categoryColor: "#c5a059",
    title: "Why Teachmelegal? – The Journey of Making Law Simple",
    author: "Prashant Jha",
    date: "September 21, 2025",
    readTime: "5 min read",
    comments: 0,
    views: 1980,
    published: true,
    excerpt: "When I started my legal career, one thing became very clear to me—law is often taught in a way that feels complicated and disconnected...",
    content: `
      <h2>Why Teachmelegal? – The Journey of Making Law Simple</h2>
      <p>When I started my legal career, one thing became very clear to me—law is often taught in a way that feels complicated and disconnected from real life. Students memorize sections, but miss out on practical legal application.</p>
      <h3>Our Vision</h3>
      <p>To bridge the gap between classroom theory and real Supreme Court advocacy. We break down complex statutes into structured tables, flowcharts, and clear explanations that make learning law engaging and memorable.</p>
      <h3>What Makes Teach Me Legal Unique?</h3>
      <ul>
        <li>Direct insights from practicing Supreme Court advocates</li>
        <li>Comprehensive subject-wise notes and revision charts</li>
        <li>Dedicated video lectures and question bank materials</li>
      </ul>
    `
  }
];

// Global in-memory storage during dev runtime
global.__blogsStore = [...INITIAL_POSTS];
global.__analyticsStore = [
  { id: 'ev-1', path: '/', date: '2026-09-16', views: 420 },
  { id: 'ev-2', path: '/blog', date: '2026-09-16', views: 230 },
  { id: 'ev-3', path: '/blog/state-bank-of-india-act-1955', date: '2026-09-16', views: 145 },
  { id: 'ev-4', path: '/courses', date: '2026-09-16', views: 180 },
  { id: 'ev-5', path: '/books', date: '2026-09-16', views: 95 }
];

export function getAllPosts(includeDrafts = false) {
  if (includeDrafts) return global.__blogsStore;
  return global.__blogsStore.filter(p => p.published);
}

export function getPostBySlug(slug) {
  const post = global.__blogsStore.find(p => p.slug === slug);
  if (post) {
    post.views = (post.views || 0) + 1;
  }
  return post;
}

export function getPostById(id) {
  return global.__blogsStore.find(p => p.id === id);
}

export function createPost(data) {
  const newPost = {
    id: `post-${Date.now()}`,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: data.category || 'Banking Law',
    categoryColor: data.categoryColor || '#3b82f6',
    title: data.title,
    author: data.author || 'Prashant Jha',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: data.readTime || '5 min read',
    comments: 0,
    views: 0,
    published: data.published !== false,
    excerpt: data.excerpt || data.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...',
    content: data.content
  };
  global.__blogsStore.unshift(newPost);
  return newPost;
}

export function updatePost(id, data) {
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  global.__blogsStore[index] = {
    ...global.__blogsStore[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  return global.__blogsStore[index];
}

export function deletePost(id) {
  const index = global.__blogsStore.findIndex(p => p.id === id);
  if (index === -1) return false;
  global.__blogsStore.splice(index, 1);
  return true;
}

export function getAnalyticsStats() {
  const posts = global.__blogsStore;
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
