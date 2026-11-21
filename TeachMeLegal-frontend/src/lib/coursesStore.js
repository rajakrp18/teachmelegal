const INITIAL_COURSES = [
  {
    id: "course-1",
    title: 'Criminal Law Fundamentals',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: '₹499',
    numericPrice: 499,
    rating: '4.9',
    students: '2.5k',
    description: 'Comprehensive guide to criminal jurisprudence, IPC sections, procedure, and courtroom application by Advocate Prashant Jha.',
    date: 'Nov 2026',
    active: true
  },
  {
    id: "course-2",
    title: 'The Constitution Explained',
    category: 'Book',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    price: '₹249',
    numericPrice: 249,
    rating: '4.8',
    students: '5k+',
    description: 'Simplified breakdown of Fundamental Rights, Directive Principles, and Landmark Supreme Court Judgments.',
    date: 'Nov 2026',
    active: true
  },
  {
    id: "course-3",
    title: 'Corporate Law Masterclass',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    price: '₹899',
    numericPrice: 899,
    rating: '5.0',
    students: '1.2k',
    description: 'Master Company Law, NCLT proceedings, M&A basics, and Corporate Governance.',
    date: 'Oct 2026',
    active: true
  },
  {
    id: "course-4",
    title: 'Legal Drafting 101',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800',
    price: '₹599',
    numericPrice: 599,
    rating: '4.7',
    students: '3.1k',
    description: 'Learn practical drafting of Petitions, Writs, Plaints, Written Statements, and Legal Notices.',
    date: 'Oct 2026',
    active: true
  },
  {
    id: "course-5",
    title: 'Rights & Remedies',
    category: 'Book',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    price: '₹199',
    numericPrice: 199,
    rating: '4.9',
    students: '8k+',
    description: 'A handbook on Writ Jurisdiction under Article 32 & Article 226 of the Indian Constitution.',
    date: 'Sep 2026',
    active: true
  },
  {
    id: "course-6",
    title: 'Evidence Act Simplified',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=800',
    price: '₹699',
    numericPrice: 699,
    rating: '4.8',
    students: '1.8k',
    description: 'In-depth coverage of Indian Evidence Act, admissibility, confessions, and examination of witnesses.',
    date: 'Sep 2026',
    active: true
  }
];

import fs from 'fs';
import path from 'path';
import os from 'os';

const TMP_COURSES = path.join(os.tmpdir(), 'teachmelegal-courses.json');

function initCoursesStore() {
  if (global.__adminCoursesStore && global.__adminCoursesStore.length > 0) {
    return global.__adminCoursesStore;
  }
  try {
    if (fs.existsSync(TMP_COURSES)) {
      const raw = fs.readFileSync(TMP_COURSES, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__adminCoursesStore = parsed;
        return global.__adminCoursesStore;
      }
    }
  } catch (e) {}
  global.__adminCoursesStore = [...INITIAL_COURSES];
  return global.__adminCoursesStore;
}

function saveCoursesToDisk() {
  try {
    fs.writeFileSync(TMP_COURSES, JSON.stringify(global.__adminCoursesStore, null, 2), 'utf-8');
  } catch (e) {}
}

initCoursesStore();

export function getAllCourses() {
  return initCoursesStore();
}

export function getCourseById(id) {
  return initCoursesStore().find(c => c.id === id);
}

export function createCourse(data) {
  initCoursesStore();
  const newCourse = {
    id: `course-${Date.now()}`,
    title: data.title,
    category: data.category || 'Course',
    image: data.image || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: data.price ? (data.price.startsWith('$') || data.price.startsWith('₹') ? data.price : `₹${data.price}`) : '₹499',
    numericPrice: parseFloat(data.numericPrice || data.price?.replace(/[^0-9.]/g, '') || 499),
    rating: data.rating || '5.0',
    students: data.students || '100+',
    description: data.description || '',
    driveUrl: data.driveUrl || '',
    date: data.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    active: data.active !== false
  };
  global.__adminCoursesStore.unshift(newCourse);
  saveCoursesToDisk();
  return newCourse;
}

export function updateCourse(id, data) {
  initCoursesStore();
  const index = global.__adminCoursesStore.findIndex(c => c.id === id);
  if (index === -1) return null;
  global.__adminCoursesStore[index] = {
    ...global.__adminCoursesStore[index],
    ...data
  };
  saveCoursesToDisk();
  return global.__adminCoursesStore[index];
}

export function deleteCourse(id) {
  initCoursesStore();
  const index = global.__adminCoursesStore.findIndex(c => c.id === id);
  if (index === -1) return false;
  global.__adminCoursesStore.splice(index, 1);
  saveCoursesToDisk();
  return true;
}
