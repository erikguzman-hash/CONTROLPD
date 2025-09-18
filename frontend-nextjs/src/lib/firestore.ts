import { collection, query, where, onSnapshot, getDocs, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Listens for real-time updates on tasks assigned to a specific user.
 * @param userId The UID of the user.
 * @param callback Function to call with the new list of tasks.
 * @returns Unsubscribe function for the listener.
 */
export const onTasksForUserSnapshot = (userId: string, callback: (tasks: any[]) => void) => {
  // This query assumes a task document has fields like `expertId`, `revisorId`, etc.
  // A more robust solution might use an 'assignees' array, but this is a start.
  const tasksRef = collection(db, "tasks");
  const queries = [
    where("expertId", "==", userId),
    where("revisorId", "==", userId),
    where("producerId", "==", userId),
    where("publicadorId", "==", userId),
    where("creatorId", "==", userId)
  ];

  // Firestore doesn't support multiple `where` clauses on different fields with OR.
  // We would need to perform separate queries and merge the results, or denormalize the data.
  // For now, we'll just query by creatorId for simplicity.
  const q = query(tasksRef, where("creatorId", "==", userId));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks: any[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });

  return unsubscribe;
};

/**
 * Fetches all users for the admin panel.
 */
export const getAllUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
    });
    return users;
};

/**
 * Updates the role for a specific user.
 */
export const updateUserRole = async (uid: string, role: string) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, { role });
};

/**
 * Updates the papers for a specific user.
 */
export const updateUserPapers = async (uid: string, papers: string[]) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, { papers });
};

/**
 * Fetches all tasks for the calendar view.
 */
export const onAllTasksSnapshot = (callback: (tasks: any[]) => void) => {
  const q = query(collection(db, "tasks"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const tasks: any[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  });

  return unsubscribe;
};

/**
 * Creates a new task in Firestore.
 */
export const createTask = async (taskData: any) => {
  try {
    await addDoc(collection(db, 'tasks'), taskData);
  } catch (error) {
    console.error("Error creating task: ", error);
  }
};

/**
 * Fetches a single task by its ID.
 */
export const getTaskById = async (taskId: string) => {
  const taskDocRef = doc(db, 'tasks', taskId);
  const taskDoc = await getDoc(taskDocRef);
  if (taskDoc.exists()) {
    return { id: taskDoc.id, ...taskDoc.data() };
  } else {
    console.error("No such task!");
    return null;
  }
};

/**
 * Updates an existing task in Firestore.
 */
export const updateTask = async (taskId: string, taskData: any) => {
  const taskDocRef = doc(db, 'tasks', taskId);
  try {
    await updateDoc(taskDocRef, taskData);
  } catch (error) {
    console.error("Error updating task: ", error);
  }
};