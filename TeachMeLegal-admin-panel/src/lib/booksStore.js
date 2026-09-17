const INITIAL_BOOKS = [
  {
    id: "book-1",
    title: 'Prevention of Money Laundering Act, 2002',
    category: 'Exam Material',
    originalPrice: '₹299',
    salePrice: '₹99',
    numericPrice: 99,
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#1e3a5f',
    icon: '📘',
    active: true
  },
  {
    id: "book-2",
    title: 'Question Bank of Indian Legal and Constitutional History',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹49',
    numericPrice: 49,
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#3b82f6',
    icon: '📙',
    active: true
  },
  {
    id: "book-3",
    title: 'Question Bank of Environmental Law',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹49',
    numericPrice: 49,
    badge: 'Off',
    badgeColor: '#f59e0b',
    coverColor: '#16a34a',
    icon: '📗',
    active: true
  },
  {
    id: "book-4",
    title: 'Question Bank of Jurisprudence',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹99',
    numericPrice: 99,
    badge: 'Off',
    badgeColor: '#f59e0b',
    coverColor: '#7c3aed',
    icon: '📕',
    active: true
  },
  {
    id: "book-5",
    title: 'Revision Book of Jurisprudence',
    category: 'Revision Chart',
    originalPrice: '₹350',
    salePrice: '₹45',
    numericPrice: 45,
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#92400e',
    icon: '📔',
    active: true
  },
  {
    id: "book-6",
    title: 'Jurisprudence Notes',
    category: 'Exam Material',
    originalPrice: '₹600',
    salePrice: '₹99',
    numericPrice: 99,
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#1e3a5f',
    icon: '⚖️',
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
    category: data.category || 'Exam Material',
    originalPrice: data.originalPrice ? (data.originalPrice.startsWith('₹') ? data.originalPrice : `₹${data.originalPrice}`) : '₹299',
    salePrice: data.salePrice ? (data.salePrice.startsWith('₹') ? data.salePrice : `₹${data.salePrice}`) : '₹99',
    numericPrice: parseFloat(data.numericPrice || data.salePrice?.replace(/[^0-9.]/g, '') || 99),
    badge: data.badge || 'Sale',
    badgeColor: data.badgeColor || '#22c55e',
    coverColor: data.coverColor || '#1e3a5f',
    icon: data.icon || '📘',
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
