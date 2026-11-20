import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let initialUsers = [];
try {
  const defaultUsersPath = path.join(process.cwd(), 'src', 'data', 'users.json');
  if (fs.existsSync(defaultUsersPath)) {
    initialUsers = JSON.parse(fs.readFileSync(defaultUsersPath, 'utf-8'));
  }
} catch (e) {}

function getUserFilePaths() {
  const currentDir = process.cwd();
  const candidates = [
    path.join(currentDir, 'src', 'data', 'users.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-frontend', 'src', 'data', 'users.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-admin-panel', 'src', 'data', 'users.json'),
    'c:/teachmelegal/TeachMeLegal-frontend/src/data/users.json',
    'c:/teachmelegal/TeachMeLegal-admin-panel/src/data/users.json'
  ];
  return [...new Set(candidates.map(p => path.resolve(p)))].filter(fp => {
    return fs.existsSync(path.dirname(fp)) && (fp.includes('TeachMeLegal-frontend') || fp.includes('TeachMeLegal-admin-panel'));
  });
}

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
    const filePaths = getUserFilePaths();
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
      global.__usersStore = bestData;
      return global.__usersStore;
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
    const filePaths = getUserFilePaths();
    const dataStr = JSON.stringify(global.__usersStore, null, 2);
    for (const fp of filePaths) {
      try {
        const dir = path.dirname(fp);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fp, dataStr, 'utf-8');
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    console.error('Error writing users.json:', e);
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  initUsersStore();
  return global.__usersStore.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function createUser({ name, email, password, phone, profession, targetExam, university, state, bio }) {
  initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();

  const existingIndex = global.__usersStore.findIndex(u => u.email.toLowerCase() === normalizedEmail);
  if (existingIndex !== -1) {
    global.__usersStore[existingIndex].name = name.trim();
    if (phone) global.__usersStore[existingIndex].phone = phone;
    global.__usersStore[existingIndex].passwordHash = hashPassword(password);
    saveUsersToDisk();
    return sanitizeUser(global.__usersStore[existingIndex]);
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

  global.__usersStore.push(newUser);
  saveUsersToDisk();
  return sanitizeUser(newUser);
}

export function updateUserProfile(email, updates) {
  initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();
  const index = global.__usersStore.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    throw new Error('User not found.');
  }

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
      global.__usersStore[index][field] = updates[field];
    }
  }

  saveUsersToDisk();
  return sanitizeUser(global.__usersStore[index]);
}

export function addOrderAndEnrollUser(email, order, items = []) {
  initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();
  let index = global.__usersStore.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    const user = {
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
    global.__usersStore.push(user);
    index = global.__usersStore.length - 1;
  }

  if (!Array.isArray(global.__usersStore[index].enrolledCourses)) global.__usersStore[index].enrolledCourses = [];
  if (!Array.isArray(global.__usersStore[index].orderHistory)) global.__usersStore[index].orderHistory = [];

  // Add order to history
  global.__usersStore[index].orderHistory.unshift(order);

  // Enroll in items
  for (const item of items) {
    const alreadyEnrolled = global.__usersStore[index].enrolledCourses.some(c => c.id === item.id || c.title === item.title);
    if (!alreadyEnrolled) {
      global.__usersStore[index].enrolledCourses.unshift({
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
    user: sanitizeUser(global.__usersStore[index]),
    enrolledCourses: global.__usersStore[index].enrolledCourses,
    orderHistory: global.__usersStore[index].orderHistory
  };
}

export function getAllUsers() {
  initUsersStore();
  return global.__usersStore.map(u => sanitizeUser(u));
}
