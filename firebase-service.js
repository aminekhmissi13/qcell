// ===========================
// Firebase Service Module
// ===========================

import { auth, db } from './firebase-config.js';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===========================
// Authentication Functions
// ===========================

/**
 * Sign in user with username and passcode using Firestore query
 * No longer uses Firebase Auth email/password
 */
export async function login(username, passcode) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('username', '==', username.toLowerCase()),
            where('passcode', '==', passcode)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error('Identifiants invalides');
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        if (!userData.isActive) {
            throw new Error('Compte désactivé');
        }

        // Update last login
        await updateDoc(doc(db, 'users', userDoc.id), {
            lastLogin: serverTimestamp()
        });

        return {
            id: userDoc.id,
            ...userData
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Sign out (Clear local session handled in app.js)
 */
export async function signOut() {
    // No Firebase Auth signout needed
    return Promise.resolve();
}

/**
 * Get current authenticated user
 * Now returns null as we manage session locally
 */
export function getCurrentUser() {
    return null; // State managed in app.js
}

// ===========================
// Passcode Utilities
// ===========================

/**
 * Generate a random 6-digit passcode
 */
export function generatePasscode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===========================
// User Management Functions
// ===========================

/**
 * Create a new user account (Firestore document only)
 */
/**
 * Create a new user account (Firestore document only)
 */
export async function createUserWithPasscode(username, passcode, role, isActive = true, createdBy = null) {
    try {
        // Create a new document ID
        const newUserRef = doc(collection(db, 'users'));
        const userId = newUserRef.id;

        // Create user document directly
        await setDoc(newUserRef, {
            username: username.toLowerCase(),
            role: role,
            passcode: passcode,
            isActive: isActive,
            createdAt: serverTimestamp(),
            createdBy: createdBy || userId, // Self-created if no creator (dev/initial)
            updatedAt: serverTimestamp()
        });

        return {
            id: userId,
            username: username.toLowerCase(),
            role,
            passcode,
            isActive
        };
    } catch (error) {
        console.error('Create user error:', error);
        throw error;
    }
}

/**
 * Get all users (admin only)
 */
export async function getUsers() {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get users error:', error);
        throw error;
    }
}

/**
 * Get user by ID
 */
export async function getUser(userId) {
    try {
        const userDoc = doc(db, 'users', userId);
        const snapshot = await getDoc(userDoc);

        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                ...snapshot.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}

/**
 * Update user information
 */
export async function updateUser(userId, userData) {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            ...userData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
}

/**
 * Delete user account
 */
export async function deleteUser(userId) {
    try {
        // Note: This only deletes the Firestore document
        // Firebase Auth user deletion requires Admin SDK on backend
        const userDoc = doc(db, 'users', userId);
        await deleteDoc(userDoc);
    } catch (error) {
        console.error('Delete user error:', error);
        throw error;
    }
}

/**
 * Toggle user active status
 */
export async function toggleUserStatus(userId, isActive) {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            isActive: isActive,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        throw error;
    }
}

/**
 * Listen for real-time user updates
 */
export function onUsersChanged(callback) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(users);
    }, (error) => {
        console.error('Users listener error:', error);
    });
}


// ===========================
// Patient Management Functions
// ===========================

/**
 * Add a new patient
 */
export async function addPatient(patientData, userId) {
    try {
        if (!userId) throw new Error('User ID required for audit trail');

        const patientsRef = collection(db, 'patients');
        const docRef = await addDoc(patientsRef, {
            ...patientData,
            createdAt: serverTimestamp(),
            createdBy: userId,
            updatedAt: serverTimestamp()
        });

        return {
            id: docRef.id,
            ...patientData
        };
    } catch (error) {
        console.error('Add patient error:', error);
        throw error;
    }
}

/**
 * Update patient information
 */
export async function updatePatient(patientId, patientData) {
    try {
        const patientDoc = doc(db, 'patients', patientId);
        await updateDoc(patientDoc, {
            ...patientData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update patient error:', error);
        throw error;
    }
}

/**
 * Delete a patient
 */
export async function deletePatient(patientId) {
    try {
        const patientDoc = doc(db, 'patients', patientId);
        await deleteDoc(patientDoc);
    } catch (error) {
        console.error('Delete patient error:', error);
        throw error;
    }
}

/**
 * Get all patients
 */
export async function getPatients() {
    try {
        const patientsRef = collection(db, 'patients');
        const q = query(patientsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get patients error:', error);
        throw error;
    }
}

/**
 * Get a single patient
 */
export async function getPatient(patientId) {
    try {
        const patientDoc = doc(db, 'patients', patientId);
        const snapshot = await getDoc(patientDoc);

        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                ...snapshot.data()
            };
        }
        return null;
    } catch (error) {
        console.error('Get patient error:', error);
        throw error;
    }
}

/**
 * Listen for real-time patient updates
 */
export function onPatientsChanged(callback) {
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const patients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(patients);
    }, (error) => {
        console.error('Patients listener error:', error);
    });
}

// ===========================
// Activity Management Functions
// ===========================

/**
 * Add a new activity
 */
export async function addActivity(activityData, userId) {
    try {
        if (!userId) throw new Error('User ID required');

        const activitiesRef = collection(db, 'activities');
        const docRef = await addDoc(activitiesRef, {
            ...activityData,
            createdAt: serverTimestamp(),
            createdBy: userId,
            updatedAt: serverTimestamp()
        });

        return {
            id: docRef.id,
            ...activityData
        };
    } catch (error) {
        console.error('Add activity error:', error);
        throw error;
    }
}

/**
 * Update activity information
 */
export async function updateActivity(activityId, activityData) {
    try {
        const activityDoc = doc(db, 'activities', activityId);
        await updateDoc(activityDoc, {
            ...activityData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update activity error:', error);
        throw error;
    }
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId) {
    try {
        const activityDoc = doc(db, 'activities', activityId);
        await deleteDoc(activityDoc);
    } catch (error) {
        console.error('Delete activity error:', error);
        throw error;
    }
}

/**
 * Get all activities
 */
export async function getActivities() {
    try {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get activities error:', error);
        throw error;
    }
}

/**
 * Get activities for a specific date
 */
export async function getActivitiesByDate(date) {
    try {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('date', '==', date), orderBy('time', 'asc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get activities by date error:', error);
        throw error;
    }
}

/**
 * Get activities for a specific patient
 */
export async function getActivitiesByPatient(patientId) {
    try {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('patientId', '==', patientId), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Get activities by patient error:', error);
        throw error;
    }
}

/**
 * Listen for real-time activity updates
 */
export function onActivitiesChanged(callback) {
    const activitiesRef = collection(db, 'activities');
    const q = query(activitiesRef, orderBy('date', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(activities);
    }, (error) => {
        console.error('Activities listener error:', error);
    });
}

// ===========================
// Assessment Management Functions
// ===========================

/**
 * Add a new clinical assessment
 */
export async function addAssessment(patientId, assessmentData, userId) {
    try {
        if (!userId) throw new Error('User ID required');

        const assessmentsRef = collection(db, 'assessments');
        const docRef = await addDoc(assessmentsRef, {
            patientId: patientId,
            ...assessmentData,
            createdAt: serverTimestamp(),
            createdBy: userId,
            updatedAt: serverTimestamp()
        });

        return {
            id: docRef.id,
            patientId: patientId,
            ...assessmentData
        };
    } catch (error) {
        console.error('Add assessment error:', error);
        throw error;
    }
}

/**
 * Update assessment information
 */
export async function updateAssessment(assessmentId, assessmentData) {
    try {
        const assessmentDoc = doc(db, 'assessments', assessmentId);
        await updateDoc(assessmentDoc, {
            ...assessmentData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update assessment error:', error);
        throw error;
    }
}

/**
 * Get assessments for a specific patient
 */
export async function getAssessments(patientId) {
    try {
        const assessmentsRef = collection(db, 'assessments');
        const q = query(assessmentsRef, where('patientId', '==', patientId));
        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort client-side to avoid index requirement
        docs.sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate));
        return docs;
    } catch (error) {
        console.error('Get assessments error:', error);
        throw error;
    }
}

/**
 * Listen for real-time assessment updates for a patient
 */
export function onAssessmentsChanged(patientId, callback) {
    const assessmentsRef = collection(db, 'assessments');
    const q = query(assessmentsRef, where('patientId', '==', patientId), orderBy('assessmentDate', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const assessments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(assessments);
    }, (error) => {
        console.error('Assessments listener error:', error);
    });
}

// ===========================
// Vital Signs Functions
// ===========================

/**
 * Add a new vital sign record
 */
export async function addVitalSign(patientId, vitalData, userId) {
    try {
        if (!userId) throw new Error('User ID required');

        const vitalsRef = collection(db, 'vital_signs');
        const docRef = await addDoc(vitalsRef, {
            patientId: patientId,
            ...vitalData,
            createdAt: serverTimestamp(),
            createdBy: userId
        });

        return {
            id: docRef.id,
            patientId: patientId,
            ...vitalData
        };
    } catch (error) {
        console.error('Add vital sign error:', error);
        throw error;
    }
}

/**
 * Get vital signs for a specific patient
 */
export async function getVitalSigns(patientId) {
    try {
        const vitalsRef = collection(db, 'vital_signs');
        const q = query(vitalsRef, where('patientId', '==', patientId));
        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort client-side
        docs.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
            const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
            return dateB - dateA;
        });
        return docs;
    } catch (error) {
        console.error('Get vital signs error:', error);
        throw error;
    }
}

/**
 * Update a vital sign record
 */
export async function updateVitalSign(vitalId, vitalData) {
    try {
        const vitalDoc = doc(db, 'vital_signs', vitalId);
        await updateDoc(vitalDoc, {
            ...vitalData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update vital sign error:', error);
        throw error;
    }
}

/**
 * Add a new wound assessment record
 */
export async function addWoundAssessment(patientId, assessmentData, userId) {
    try {
        if (!userId) throw new Error('User ID required');

        const woundsRef = collection(db, 'wound_assessments');
        const docRef = await addDoc(woundsRef, {
            patientId: patientId,
            ...assessmentData,
            createdAt: serverTimestamp(),
            createdBy: userId
        });

        return {
            id: docRef.id,
            patientId: patientId,
            ...assessmentData
        };
    } catch (error) {
        console.error('Add wound assessment error:', error);
        throw error;
    }
}

/**
 * Get wound assessments for a specific patient
 */
export async function getWoundAssessments(patientId) {
    try {
        const woundsRef = collection(db, 'wound_assessments');
        const q = query(woundsRef, where('patientId', '==', patientId));
        const snapshot = await getDocs(q);

        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort client-side
        docs.sort((a, b) => new Date(b.date) - new Date(a.date));
        return docs;
    } catch (error) {
        console.error('Get wound assessments error:', error);
        throw error;
    }
}

/**
 * Update a wound assessment record
 */
export async function updateWoundAssessment(woundId, assessmentData) {
    try {
        const woundDoc = doc(db, 'wound_assessments', woundId);
        await updateDoc(woundDoc, {
            ...assessmentData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Update wound assessment error:', error);
        throw error;
    }
}
