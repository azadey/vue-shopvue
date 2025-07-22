import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { db, auth } from "@/utility/FirebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { USER_ROLES } from "@/constants/appConstants";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const role = ref(null); // Default role

  const initialized = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value && user.value.role === USER_ROLES.ADMIN);
  
  async function initializeAuth() {
    isLoading.value = true;
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
        initialized.value = true;
      } else {
        user.value = null;
        error.value = null;
      }
      initialized.value = true;
      isLoading.value = false;
    });
  }

  async function signUpUser(email, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.value.uid), {
          email: user.value.email,
          uid: user.value.uid,
          role: USER_ROLES.USER, // Default role for new users
          createdAt: new Date()
      });
      user.value = null; // Reset user after sign up
      user.role = null; // Default role for new users
    } catch (err) {
      error.value = err.message;
      throw err; // Re-throw the error for further handling if needed
    } finally {
      isLoading.value = false;
    }
  }

  async function signInUser(email, password) {
    isLoading.value = true;
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      user.role = USER_ROLES.USER; // Default role for signed-in users
    } catch (err) {
      error.value = err.message;
      throw err; // Re-throw the error for further handling if needed
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    error.value = null;
    try {
      await signOut(auth);
      user.value = null; // Reset user on logout
      role.value = null; // Reset role on logout
    } catch (err) {
      error.value = err.message;
      throw err; // Re-throw the error for further handling if needed
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUser(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        user.value = userDoc.data();
      } else {
        console.error("No such user!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  return { user, role, isLoading, error, isAuthenticated, isAuthenticated, isAdmin, fetchUser, signUpUser, signInUser, logout, initializeAuth };
});