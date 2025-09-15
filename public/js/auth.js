import { GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { showView, updateUserInfo, resetAppView } from './ui.js';
import { getUser, createUser, listenForTasks } from './firestore.js';
import { initializeCalendar } from './calendar.js';
import { loadAdmin } from './admin.js';
import { renderMyTasks } from './panel.js';
import * as driveModule from './drive.js';

export async function handleAuthStateChange(dependencies, user) {
    const { appState } = dependencies;
    if (user) {
        const userDoc = await getUser(dependencies.db, user.uid);
        appState.currentUser = user;

        if (userDoc.exists()) {
            const userData = userDoc.data();
            appState.currentUserRole = userData.role;
            appState.currentUserPapers = userData.papers || [];
        } else {
            const isAdmin = user.email === 'erikguzman@hgio.co';
            const defaultRole = isAdmin ? 'administrador' : 'miembro';
            const defaultPapers = isAdmin ? ['coordinador', 'experto', 'revisor', 'productor'] : [];
            await createUser(dependencies.db, user, defaultRole, defaultPapers);
            appState.currentUserRole = defaultRole;
            appState.currentUserPapers = defaultPapers;
        }
        
        updateUserInfo(user, appState.currentUserRole);
        showView('app');
        
        loadAdmin(dependencies);
        renderMyTasks(dependencies);
        initializeCalendar(dependencies);
        listenForTasks(dependencies);

        // Initialize Google Drive client if access token is available
        if (appState.googleAccessToken) {
            await driveModule.initGoogleDriveClient(appState.googleAccessToken);
        }

    } else {
        appState.currentUser = null;
        appState.currentUserRole = null;
        appState.currentUserPapers = null;
        appState.googleAccessToken = null; // Clear Google Access Token on sign out
        resetAppView(appState);
        showView('login');
    }
}

export async function signOutFromApp(auth) {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión. Verifica la consola para más detalles.");
    }
}

export async function signOutFromApp(auth) {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión. Verifica la consola para más detalles.");
    }
}