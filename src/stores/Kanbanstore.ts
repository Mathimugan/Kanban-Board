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
export default {
  
    login,
    getColumns,
    subscribeToColumns,
    STORE
  };