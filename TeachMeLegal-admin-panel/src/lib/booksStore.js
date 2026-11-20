const INITIAL_BOOKS = [
  {
    id: "book-1",
    title: 'Prevention of Money Laundering Act, 2002',
    category: 'Exam Materials',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/money-laundering-act-2002.png',
    author: 'Adv. Prashant Jha',
    date: 'Nov 2026',
    active: true
  },
  {
    id: "book-2",
    title: 'Question Bank of Indian Legal and Constitutional History',
    category: 'Question Bank',
    originalPrice: '₹199.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-constitutional-history.png',
    author: 'Adv. Prashant Jha',
    date: 'Nov 2026',
    active: true
  },
  {
    id: "book-3",
    title: 'Question Bank of Environmental Law',
    category: 'Question Bank',
    originalPrice: '₹199.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-environmental-law.png',
    author: 'Adv. Prashant Jha',
    date: 'Oct 2026',
    active: true
  },
  {
    id: "book-4",
    title: 'Question Bank of Jurisprudence',
    category: 'Question Bank',
    originalPrice: '₹149.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-jurisprudence.png',
    author: 'Adv. Prashant Jha',
    date: 'Oct 2026',
    active: true
  },
  {
    id: "book-5",
    title: 'Revision Book of Jurisprudence',
    category: 'Revision Chart',
    originalPrice: '₹350.00',
    salePrice: '₹45.00',
    numericPrice: 45,
    badge: 'Sale!',
    image: '/books/revision-jurisprudence.jpeg',
    author: 'Adv. Prashant Jha',
    date: 'Oct 2026',
    active: true
  },
  {
    id: "book-6",
    title: 'Jurisprudence Notes',
    category: 'Subject wise Notes',
    originalPrice: '₹600.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/jurisprudence-notes.jpg',
    author: 'Adv. Prashant Jha',
    date: 'Sep 2026',
    active: true
  },
  {
    id: "book-7",
    title: 'Banking Law Notes',
    category: 'Subject wise Notes',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/banking-law-notes.jpg',
    author: 'Adv. Prashant Jha',
    date: 'Sep 2026',
    active: true
  },
  {
    id: "book-8",
    title: 'Environmental Law in India',
    category: 'Exam Materials',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/environmental-law-in-india.png',
    author: 'Adv. Prashant Jha',
    date: 'Sep 2026',
    active: true
  },
  {
    id: "book-9",
    title: 'Revision Book of Environmental Law',
    category: 'Revision Chart',
    originalPrice: '₹249.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/revision-environmental-law.jpeg',
    author: 'Adv. Prashant Jha',
    date: 'Aug 2026',
    active: true
  },
  {
    id: "book-10",
    title: 'Indian Legal & Constitutional History',
    category: 'Subject wise Notes',
    originalPrice: '₹399.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/indian-legal-constitutional-history.png',
    author: 'Adv. Prashant Jha',
    date: 'Aug 2026',
    active: true
  }
];

if (!global.__adminBooksStore) {
  global.__adminBooksStore = [...INITIAL_BOOKS];
}

export function getAllBooks() {
  return global.__adminBooksStore;
}

export function getBookById(id) {
  return global.__adminBooksStore.find(b => b.id === id);
}

export function createBook(data) {
  const newBook = {
    id: `book-${Date.now()}`,
    title: data.title,
    category: data.category || 'Exam Materials',
    originalPrice: data.originalPrice ? (data.originalPrice.startsWith('₹') ? data.originalPrice : `₹${data.originalPrice}`) : '₹299.00',
    salePrice: data.salePrice ? (data.salePrice.startsWith('₹') ? data.salePrice : `₹${data.salePrice}`) : '₹99.00',
    numericPrice: parseFloat(data.numericPrice || data.salePrice?.replace(/[^0-9.]/g, '') || 99),
    badge: data.badge || 'Sale!',
    image: data.image || '/books/money-laundering-act-2002.png',
    author: data.author || 'Adv. Prashant Jha',
    icon: data.icon || '📘',
    driveUrl: data.driveUrl || '',
    date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    active: data.active !== false
  };
  global.__adminBooksStore.unshift(newBook);
  return newBook;
}

export function updateBook(id, data) {
  const index = global.__adminBooksStore.findIndex(b => b.id === id);
  if (index === -1) return null;
  global.__adminBooksStore[index] = {
    ...global.__adminBooksStore[index],
    ...data
  };
  return global.__adminBooksStore[index];
}

export function deleteBook(id) {
  const index = global.__adminBooksStore.findIndex(b => b.id === id);
  if (index === -1) return false;
  global.__adminBooksStore.splice(index, 1);
  return true;
}
