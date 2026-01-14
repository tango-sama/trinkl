// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP_qj-4hpHN6Vjn8ZbcnqRfzB5SvOmgmM",
    authDomain: "desert-shop-24af9.firebaseapp.com",
    projectId: "desert-shop-24af9",
    storageBucket: "desert-shop-24af9.firebasestorage.app",
    messagingSenderId: "791427566190",
    appId: "1:791427566190:web:9b6f2a8f90dbb8f8b6f47f",
    measurementId: "G-LYPS3KBY0W"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    // Initialize Analytics
    if (firebase.analytics) {
        firebase.analytics();
    }
    console.log("Firebase Initialized");
} else {
    console.error("Firebase SDK not loaded");
}

/**
 * Uploads a file to Firebase Storage and returns the download URL
 * @param {File} file - The file object from input
 * @param {string} folder - The folder to upload to (e.g., 'products', 'categories')
 * @returns {Promise<string>} - The download URL
 */
window.uploadImageToFirebase = async (file, folder = 'uploads') => {
    if (!file) throw new Error("No file provided");
    if (typeof firebase === 'undefined') throw new Error("Firebase not initialized");

    const storageRef = firebase.storage().ref();
    const fileName = `${Date.now()}_${file.name}`; // Unique filename
    const fileRef = storageRef.child(`${folder}/${fileName}`);

    try {
        const snapshot = await fileRef.put(file);
        const url = await snapshot.ref.getDownloadURL();
        return url;
    } catch (error) {
        console.error("Error uploading to Firebase:", error);
        throw error;
    }
};

// Firestore Database Helpers
window.db = {
    // Get all documents from a collection
    getCollection: async (collectionName) => {
        if (typeof firebase === 'undefined') return [];
        try {
            const snapshot = await firebase.firestore().collection(collectionName).get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Error getting collection ${collectionName}:`, error);
            return [];
        }
    },

    // Add a document to a collection (auto-assign ID if not provided in data, but usually we let Firestore generate ID, or use specific ID)
    addDocument: async (collectionName, data) => {
        if (typeof firebase === 'undefined') return null;
        try {
            // If data has an ID (like our manual IDs), use .doc(id).set()
            // Otherwise use .add()
            if (data.id) {
                // Ensure ID is string
                await firebase.firestore().collection(collectionName).doc(String(data.id)).set(data);
                return data;
            } else {
                const docRef = await firebase.firestore().collection(collectionName).add(data);
                return { id: docRef.id, ...data };
            }
        } catch (error) {
            console.error(`Error adding document to ${collectionName}:`, error);
            throw error;
        }
    },

    // Update a document
    updateDocument: async (collectionName, id, data) => {
        if (typeof firebase === 'undefined') return;
        try {
            await firebase.firestore().collection(collectionName).doc(String(id)).update(data);
        } catch (error) {
            console.error(`Error updating document ${id} in ${collectionName}:`, error);
            throw error;
        }
    },

    // Delete a document
    deleteDocument: async (collectionName, id) => {
        if (typeof firebase === 'undefined') return;
        try {
            await firebase.firestore().collection(collectionName).doc(String(id)).delete();
        } catch (error) {
            console.error(`Error deleting document ${id} from ${collectionName}:`, error);
            throw error;
        }
    }
};
