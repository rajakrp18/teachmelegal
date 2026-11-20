import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import initialUsers from '../data/users.json';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPasswordHash) {
  if (!storedPasswordHash || !storedPasswordHash.includes(':')) return false;
  try {
    const [salt, originalHash] = storedPasswordHash.split(':');
    const hash = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function initUsersStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__usersStore = parsed;
        return global.__usersStore;
      }
    }
  } catch (e) {
    console.error('Error reading users.json, falling back to initialUsers:', e);
  }
  if (!global.__usersStore || global.__usersStore.length === 0) {
    global.__usersStore = Array.isArray(initialUsers) ? [...initialUsers] : [];
    saveUsersToDisk();
  }
  return global.__usersStore;
}

function saveUsersToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(global.__usersStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing users.json:', e);
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const users = initUsersStore();
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function createUser({ name, email, password, phone, profession, targetExam, university, state, bio }) {
  const users = initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();

  if (findUserByEmail(normalizedEmail)) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: phone || '',
    profession: profession || 'Law Student',
    targetExam: targetExam || 'Judicial Services Examination',
    university: university || '',
    yearOfStudy: 'Final Year',
    state: state || 'Delhi NCR',
    bio: bio || '',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    role: 'ENROLLED SCHOLAR',
    passwordHash: hashPassword(password),
    enrolledCourses: [],
    orderHistory: []
  };

  users.push(newUser);
  saveUsersToDisk();
  return sanitizeUser(newUser);
}

export function updateUserProfile(email, updates) {
  const users = initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();
  const index = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    throw new Error('User not found.');
  }

  const user = users[index];
  const allowedUpdates = [
    'name',
    'phone',
    'profession',
    'targetExam',
    'university',
    'yearOfStudy',
    'state',
    'bio'
  ];

  for (const field of allowedUpdates) {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  }

  saveUsersToDisk();
  return sanitizeUser(user);
}

export function addOrderAndEnrollUser(email, order, items = []) {
  const users = initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();
  let user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      phone: '',
      profession: 'Law Student',
      targetExam: 'Judicial Services Examination',
      university: '',
      yearOfStudy: 'Final Year',
      state: 'Delhi NCR',
      bio: '',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      role: 'ENROLLED SCHOLAR',
      passwordHash: hashPassword('password123'),
      enrolledCourses: [],
      orderHistory: []
    };
    users.push(user);
  }

  if (!Array.isArray(user.enrolledCourses)) user.enrolledCourses = [];
  if (!Array.isArray(user.orderHistory)) user.orderHistory = [];

  // Add order to history
  user.orderHistory.unshift(order);

  // Enroll in items
  for (const item of items) {
    const alreadyEnrolled = user.enrolledCourses.some(c => c.id === item.id || c.title === item.title);
    if (!alreadyEnrolled) {
      user.enrolledCourses.unshift({
        id: item.id || `item-${Date.now()}`,
        title: item.title,
        category: item.category || 'Study Material',
        pdfUrl: item.pdfUrl || '/books/sample.pdf',
        enrolledDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
  }

  saveUsersToDisk();
  return {
    user: sanitizeUser(user),
    enrolledCourses: user.enrolledCourses,
    orderHistory: user.orderHistory
  };
}
