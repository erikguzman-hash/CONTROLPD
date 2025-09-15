import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { firebaseConfig } from './config.js';
import { elements } from './ui.js';
import * as authModule from './auth.js';
import * as tasksModule from './tasks.js';
import * as calendarModule from './calendar.js';
import * as adminModule from './admin.js';
import * as dashboardModule from './dashboard.js';
import * as firestoreModule from './firestore.js';
import * as panelModule from './panel.js';

// --- 1. INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 2. EMULATOR CONNECTION ---
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Entorno local detectado, conectando a los emuladores.');
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
}

// --- 3. SHARED STATE & DEPENDENCIES ---
const appState = {
    currentUser: null,
    currentUserRole: null,
    currentUserPapers: [],
    calendar: null,
    unsubscribeTasks: null,
};

const dependencies = {
    auth,
    db,
    appState,
    tasksModule,
    calendarModule,
    firestoreModule,
    panelModule
};

// --- 4. INITIALIZE APP ---
function init() {
    onAuthStateChanged(auth, (user) => authModule.handleAuthStateChange(dependencies, user));
    
    elements.googleSigninButton.addEventListener('click', () => authModule.signInWithGoogle(auth, dependencies));
    elements.logoutButton.addEventListener('click', () => authModule.signOutFromApp(auth));
    elements.createTaskBtn.addEventListener('click', () => tasksModule.openModal(dependencies));
    elements.taskForm.addEventListener('submit', (e) => {
        console.log('Form submit event detected in app.js!');
        tasksModule.handleSubmit(dependencies, e);
    });
    elements.closeModalBtns.forEach(btn => btn.addEventListener('click', tasksModule.closeModal));

    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            elements.tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-content`) {
                    content.classList.add('active');
                }
            });
            
            if (tabName === 'dashboard') dashboardModule.loadDashboard(db);
        });
    });
}

// --- 5. RUN APP ---
init();
