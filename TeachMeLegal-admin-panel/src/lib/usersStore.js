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
  const paths = [
    path.join(currentDir, 'src', 'data', 'users.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-frontend', 'src', 'data', 'users.json'),
    path.resolve(currentDir, '..', 'TeachMeLegal-admin-panel', 'src', 'data', 'users.json'),
    path.resolve('c:/teachmelegal/TeachMeLegal-frontend/src/data/users.json'),
    path.resolve('c:/teachmelegal/TeachMeLegal-admin-panel/src/data/users.json')
  ];
  return [...new Set(paths)];
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
  const users = initUsersStore();
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function createUser({ name, email, password, phone, profession, targetExam, university, state, bio }) {
  const users = initUsersStore();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = findUserByEmail(normalizedEmail);
  if (existingUser) {
    existingUser.name = name.trim();
    if (phone) existingUser.phone = phone;
    existingUser.passwordHash = hashPassword(password);
    saveUsersToDisk();
    return sanitizeUser(existingUser);
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

export function getAllUsers() {
  const users = initUsersStore();
  return users.map(u => sanitizeUser(u));
}
