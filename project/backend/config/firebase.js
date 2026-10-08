const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let db = null;
let isMockFirestore = false;

// Path to local data fallback file
const LOCAL_DB_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, 'predictions.json');

// Ensure local fallback directory exists
if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

// Seed local fallback if empty
if (!fs.existsSync(LOCAL_DB_FILE)) {
  const initialRecords = [
    {
      id: "demo-pred-001",
      year: 2023,
      state: "Punjab",
      crop: "Wheat",
      season: "Rabi",
      area: 2500,
      production: 10600,
      annualRainfall: 645.0,
      fertilizer: 288000,
      pesticide: 21600,
      predictedYield: 4.24,
      modelUsed: "XGBoost",
      createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
      id: "demo-pred-002",
      year: 2023,
      state: "West Bengal",
      crop: "Rice",
      season: "Kharif",
      area: 3200,
      production: 12100,
      annualRainfall: 1650.0,
      fertilizer: 345000,
      pesticide: 25600,
      predictedYield: 3.78,
      modelUsed: "Random Forest",
      createdAt: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString()
    },
    {
      id: "demo-pred-003",
      year: 2023,
      state: "Maharashtra",
      crop: "Cotton",
      season: "Kharif",
      area: 1800,
      production: 3780,
      annualRainfall: 1080.0,
      fertilizer: 162000,
      pesticide: 14400,
      predictedYield: 2.10,
      modelUsed: "SVR",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(initialRecords, null, 2), 'utf8');
}

// Helper functions for Local Mock Firestore Store
function readLocalStore() {
  try {
    const raw = fs.readFileSync(LOCAL_DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeLocalStore(records) {
  fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(records, null, 2), 'utf8');
}

// Local mock adapter implementing Firestore collection API
const mockFirestore = {
  collection: (collectionName) => ({
    add: async (docData) => {
      const records = readLocalStore();
      const id = 'pred_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const newDoc = { id, ...docData };
      records.unshift(newDoc);
      writeLocalStore(records);
      return { id };
    },
    get: async () => {
      const records = readLocalStore();
      return {
        empty: records.length === 0,
        size: records.length,
        docs: records.map(item => ({
          id: item.id,
          data: () => item
        }))
      };
    },
    doc: (docId) => ({
      get: async () => {
        const records = readLocalStore();
        const found = records.find(r => r.id === docId);
        return {
          exists: !!found,
          id: docId,
          data: () => found
        };
      },
      delete: async () => {
        let records = readLocalStore();
        records = records.filter(r => r.id !== docId);
        writeLocalStore(records);
        return { success: true };
      }
    })
  })
};

// Initialize Firebase
try {
  const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
    || path.join(__dirname, 'serviceAccountKey.json');

  if (fs.existsSync(serviceAccountKeyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('Firebase Firestore initialized successfully with serviceAccountKey.json');
  } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    db = admin.firestore();
    console.log('Firebase Firestore initialized with environment variables');
  } else {
    isMockFirestore = true;
    db = mockFirestore;
    console.log('NOTICE: Firebase credentials not found in .env or config/serviceAccountKey.json.');
    console.log('Defaulting to zero-config persistent local store (data/predictions.json).');
    console.log('To connect live Firestore: add FIREBASE_PRIVATE_KEY or place serviceAccountKey.json in backend/config/');
  }
} catch (error) {
  console.warn('Firebase initialization error:', error.message);
  console.log('Falling back to local persistent store.');
  isMockFirestore = true;
  db = mockFirestore;
}

module.exports = {
  db,
  isMockFirestore
};
