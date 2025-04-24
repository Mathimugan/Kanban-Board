import {db} from "../firebase"
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@vueuse/core";
import { collection,getDoc, getDocs,addDoc,updateDoc,doc,arrayRemove, arrayUnion,deleteDoc,onSnapshot } from "firebase/firestore";
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,onAuthStateChanged,signOut } from "firebase/auth";
import type { Column, Task,Registration } from "@/types";
const auth = getAuth();
let KEY = "KANBAN-STORE";
export type Board = {
  boardId: string;
  name: string;
  columns: Column[];
};

export const STORE = useLocalStorage<Board[]>(KEY, []);
export async function login(email: Registration["email"], password: Registration["password"]) {
 
    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
      console.log("User logged in successfully", userCredential);
      return userCredential; // Can return userCredential.user if you just need the user
    } catch (error) {
      throw error
      }
     // Rethrow so caller can handle it too
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
          console.log("User logged out successfully");
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
export default {
  
    login,
    getColumns,
    subscribeToColumns,
    STORE,
    addColumn,
    logout,
    deleteColumn,
    updateColumn
  };