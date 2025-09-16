import { getDoc, doc, setDoc, onSnapshot, serverTimestamp, addDoc, updateDoc, getDocs, orderBy, query, where, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

export const getUser = (db, uid) => getDoc(doc(db, "users", uid));

export const createUser = (db, user, role = 'miembro', papers = []) => setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: role,
    papers: papers,
    createdAt: serverTimestamp()
});

export function listenForTasks(dependencies) {
    const { db, appState, calendarModule } = dependencies;
    const q = query(collection(db, "tasks"), where("creatorId", "!=", null));
    appState.unsubscribeTasks = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            const taskData = change.doc.data();
            const event = calendarModule.formatTaskToEvent(taskData, change.doc.id);

            if (change.type === "added") {
                appState.calendar.addEvent(event);
            }
            if (change.type === "modified") {
                const existingEvent = appState.calendar.getEventById(change.doc.id);
                if (existingEvent) existingEvent.remove();
                appState.calendar.addEvent(event);
            }
            if (change.type === "removed") {
                const existingEvent = appState.calendar.getEventById(change.doc.id);
                if (existingEvent) existingEvent.remove();
            }
        });
    }, (error) => {
        console.error("Error in snapshot listener:", error);
    });
}

export async function populateUsersDropdown(db, elementId, papers = null) {
    const userSelect = document.getElementById(elementId);
    userSelect.innerHTML = '<option value="">Seleccionar usuario</option>';
    
    if (!papers) {
        const usersQuery = query(collection(db, "users"), orderBy('displayName'));
        const snapshot = await getDocs(usersQuery);
        snapshot.forEach(doc => {
            const user = doc.data();
            const option = document.createElement('option');
            option.value = user.uid;
            option.textContent = user.displayName;
            userSelect.appendChild(option);
        });
        return;
    }

    if (typeof papers === 'string') {
        papers = [papers];
    }

    const users = new Map();
    for (const paper of papers) {
        const usersQuery = query(collection(db, "users"), where('papers', 'array-contains', paper), orderBy('displayName'));
        const snapshot = await getDocs(usersQuery);
        snapshot.forEach(doc => {
            const user = doc.data();
            if (!users.has(user.uid)) {
                users.set(user.uid, user);
            }
        });
    }

    const sortedUsers = Array.from(users.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));

    sortedUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user.uid;
        option.textContent = user.displayName;
        userSelect.appendChild(option);
    });
}

export async function getTasksForDashboard(db) {
    return await getDocs(collection(db, "tasks"));
}

export async function getUsersForAdmin(db) {
    const q = query(collection(db, "users"), orderBy("displayName"));
    return await getDocs(q);
}

export async function updateUserRoleInDb(db, uid, newRole) {
    await updateDoc(doc(db, "users", uid), { role: newRole });
}

export async function updateUserPapersInDb(db, uid, newPapers) {
    await updateDoc(doc(db, "users", uid), { papers: newPapers });
}

export async function getTaskDoc(db, taskId) {
    return await getDoc(doc(db, "tasks", taskId));
}

export async function updateTask(db, taskId, taskData) {
    await updateDoc(doc(db, "tasks", taskId), taskData);
}

export async function addTask(db, taskData) {
    await addDoc(collection(db, "tasks"), taskData);
}

export async function getTasksForUser(db, userId) {
    const tasksMap = new Map();

    const q1 = query(collection(db, "tasks"), where('creatorId', '==', userId));
    const q2 = query(collection(db, "tasks"), where('expertId', '==', userId));
    const q3 = query(collection(db, "tasks"), where('producerId', '==', userId));
    const q4 = query(collection(db, "tasks"), where('revisorId', '==', userId));
    const q5 = query(collection(db, "tasks"), where('publicadorId', '==', userId));

    const [creatorTasks, expertTasks, producerTasks, revisorTasks, publicadorTasks] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
        getDocs(q3),
        getDocs(q4),
        getDocs(q5)
    ]);

    creatorTasks.forEach(doc => tasksMap.set(doc.id, { id: doc.id, ...doc.data() }));
    expertTasks.forEach(doc => tasksMap.set(doc.id, { id: doc.id, ...doc.data() }));
    producerTasks.forEach(doc => tasksMap.set(doc.id, { id: doc.id, ...doc.data() }));
    revisorTasks.forEach(doc => tasksMap.set(doc.id, { id: doc.id, ...doc.data() }));
    publicadorTasks.forEach(doc => tasksMap.set(doc.id, { id: doc.id, ...doc.data() }));

    return Array.from(tasksMap.values());
}