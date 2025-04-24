import {db} from "../firebase"
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@vueuse/core";
import { collection,getDoc, getDocs,addDoc,updateDoc,doc,arrayRemove, arrayUnion,deleteDoc,onSnapshot } from "firebase/firestore";
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut } from "firebase/auth";
import type { Column, Task,Registration } from "../types"
const auth = getAuth();
let KEY = "KANBAN-STORE";
export type Board = {
  boardId: string;
  name: string;
  columns: Column[];
};

export const STORE = useLocalStorage<Board[]>(KEY, []);
export async function register(email:Registration["email"],password:Registration["password"]) {

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User Registered Successfully:", userCredential.user);
  
  } catch (error) {
    console.error("Error registering user:", error);
   
  }

}

export async function login(email: Registration['email'], password: Registration['password']) {
  try {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
    return userCredential;
  } catch (error) {
    console.error('Login failed:', error)
    throw error;
  }
}

    export async function getColumns() {

        const querySnapshot = await getDocs(collection(db, "columns"));
        const columns: Column[] = [];
        querySnapshot.forEach((doc) => {
      
          columns.push({ ...doc.data(), columnId: doc.id });
        });
        return columns;
      }
      export function subscribeToColumns(callback: (columns: Column[]) => void) {
        return onSnapshot(collection(db, "columns"), (snapshot) => {
          const columns: Column[] = [];
          snapshot.forEach((doc) => {
            columns.push({ ...doc.data(), columnId: doc.id });
          });
          callback(columns); // Pass updated columns to the callback
        });
      }
      export async function addColumn(name: Column["name"]) {
        try {
          const docRef = await addDoc(collection(db, "columns"), {
            name,
            tasks: [],
          });
          console.log("Column added with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding column: ", e);
        }
      }
      export async function logout() {
        try {
          await signOut(auth);
          
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }

      export async function updateColumn(payload: Pick<Column, "name" | "columnId">) {
        const columnRef = doc(db, "columns", payload.columnId);
        await updateDoc(columnRef, {
          name: payload.name,
        });
      }
      export async function deleteColumn(columnId: Column["columnId"]) {
        try {
          await deleteDoc(doc(db, "columns", columnId));
        } catch (e) {
          console.error("Error deleting column: ", e);
        }
      }

export async function addTaskToColumn(
  columnId: Column["columnId"],
  payload: Pick<Task, "name" | "description">
) {
  const columnRef = doc(db, "columns", columnId);
  const newTask = {
    taskId: uuidv4(),
    name: payload.name,
    description: payload.description,
  };

  try {
    await updateDoc(columnRef, {
      tasks: arrayUnion(newTask),
    });
  } catch (e) {
    console.error("Error adding task: ", e);
  }
}

export async function updateTask(columnId: Column["columnId"], updatedTask: Task) {
  const columnRef = doc(db, "columns", columnId);

  try {
    const columnSnap = await getDoc(columnRef);
    if (!columnSnap.exists()) {
      throw new Error("Column not found");
    }

    const columnData = columnSnap.data();
    const currentTasks: Task[] = columnData.tasks || [];

    // Replace the task with the same taskId
    const updatedTasks = currentTasks.map(task =>
      task.taskId === updatedTask.taskId ? updatedTask : task
    );

    await updateDoc(columnRef, {
      tasks: updatedTasks,
    });

   
  } catch (error) {
    console.error("Error updating task:", error);
  }
}



export async function deleteTask(
  columnId: Column["columnId"],
  taskId: Task["taskId"]
) {
  const columnRef = doc(db, "columns", columnId);

  try {
    // Get the current column
    const columnSnap = await getDoc(columnRef);

    if (!columnSnap.exists()) {
      throw new Error("Column not found");
    }

    const columnData = columnSnap.data();
    const updatedTasks = columnData.tasks.filter(
      (task: Task) => task.taskId !== taskId
    );

    // Update with filtered tasks
    await updateDoc(columnRef, {
      tasks: updatedTasks,
    });

 
  } catch (e) {
    console.error("Error deleting task: ", e);
  }
}

export async function moveTask(
  taskId: Task["taskId"],
  targetColumnId: Column["columnId"]
) {
  try {
    // Step 1: Find the current column containing the task
    const columnsSnap = await getDocs(collection(db, "columns"));
    let currentTask: Task | null = null;
    let currentColumnId: string | null = null;

    for (const docSnap of columnsSnap.docs) {
      const column = docSnap.data() as Column;
      const task = column.tasks.find((t) => t.taskId === taskId);
      if (task) {
        currentTask = task;
        currentColumnId = docSnap.id;
        break;
      }
    }

    if (!currentTask || !currentColumnId) {
      console.error("Task not found in any column");
      return;
    }

    // Step 2: Remove the task from the current column
    await updateDoc(doc(db, "columns", currentColumnId), {
      tasks: arrayRemove(currentTask),
    });

    // Step 3: Add the task to the end of the target column
    await updateDoc(doc(db, "columns", targetColumnId), {
      tasks: arrayUnion(currentTask),
    });

   
  } catch (error) {
    console.error("Error moving task:", error);
  }
}


export default {
  
    login,
    getColumns,
    subscribeToColumns,
    STORE,
    addColumn,
    logout,
    deleteColumn,
    updateColumn,
    addTaskToColumn,
    updateTask,
    deleteTask,
    moveTask,
    register
  };