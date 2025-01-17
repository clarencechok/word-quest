import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { Alert } from "react-native";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = async (email, password) => {
  if (!emailRegex.test(email)) {
    Alert.alert("Alert", "Please enter a valid email!");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Alert", "Please enter a valid password!");
    return;
  }
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res?.user?.email.includes("@admin.com")) router.replace("/admin");
    else {
      const data = await getInitialData();

      router.replace({
        pathname: "/game/Home",
        params: {
          initialData: JSON.stringify(data),
        },
      });
    }

    return res;
  } catch (e) {
    const res = handleAuthError(e);
    Alert.alert("Alert", res);
    console.log(e.code);
    return null;
  }
};

const Register = async (email, password) => {
  if (!emailRegex.test(email)) {
    Alert.alert("Alert", "Please enter a valid email!");
    return;
  }

  if (password.length < 6) {
    Alert.alert("Alert", "Please enter a valid password!");
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    if (res.user && !res.user.email.includes("@admin.com")) {
      const userRef = doc(db, "users", res.user.uid);
      await setDoc(userRef, {
        totalGamesPlayed: 0,
        win: 0,
        lost: 0,
        streaks: 0,
      });
    }

    if (res?.user?.email.includes("@admin.com")) router.replace("/admin");
    else {
      const data = await getInitialData();
      router.replace({
        pathname: "/game/Home",
        params: {
          initialData: JSON.stringify(data),
        },
      });
    }
    return res;
  } catch (e) {
    const res = handleAuthError(e);
    Alert.alert("Alert", res);
    console.log(e.code);
    return null;
  }
};

const Logout = () => {
  auth
    .signOut()
    .then(() => {
      console.log("User signed out");
      router.replace("/user/SignIn");
    })
    .catch((error) => {
      console.log("Error signing out:", error);
    });
};

const handleAuthError = (error) => {
  let errorMessage = "An unexpected error occurred. Please try again.";

  switch (error.code) {
    case "auth/invalid-credential":
      errorMessage = "The provided credentials are invalid.";
      break;
    case "auth/invalid-email":
      errorMessage =
        "The email address is not valid. Please check and try again.";
      break;
    case "auth/user-disabled":
      errorMessage = "This account has been disabled. Please contact support.";
      break;
    case "auth/user-not-found":
      errorMessage = "No account found with this email. Please sign up.";
      break;
    case "auth/wrong-password":
      errorMessage = "Incorrect password. Please try again.";
      break;
    case "auth/email-already-in-use":
      errorMessage =
        "This email is already in use. Please use a different email or login.";
      break;
    case "auth/weak-password":
      errorMessage =
        "The password is too weak. Please choose a stronger password.";
      break;
    case "auth/too-many-requests":
      errorMessage = "Too many login attempts. Please try again later.";
      break;
    case "auth/network-request-failed":
      errorMessage = "Network error. Please check your internet connection.";
      break;
    default:
      console.error("Unhandled Firebase Auth Error:", error); // Log unexpected errors
      break;
  }

  return errorMessage;
};

const UpdateUserData = async (isWin, mode) => {
  try {
    const { currentUser } = auth;
    const userDoc = doc(db, "users", currentUser.uid); // Reference to the user's document

    let userData = await getDoc(userDoc);
    if (userData.exists()) {
      const _userData = userData.data();

      const modeData = _userData[mode];

      const updatedUserData =
        mode === "grammar"
          ? {
              ..._userData,
              [mode]: {
                totalGamesPlayed: (modeData?.totalGamesPlayed ?? 0) + 1, // increment(1), // Increment total games played
                // win: isWin ? (modeData?.win ?? 0) + 1 : modeData?.win ?? 0, // Increment win if true
                // lost: isWin ? modeData?.lost ?? 0 : (modeData?.lost ?? 0) + 1, // Increment lost if false
                // streaks: isWin ? (modeData?.streaks ?? 0) + 1 : 0, // Reset streaks on loss
                lastPlayedTime: Date.now(),
              },
            }
          : {
              ..._userData,
              [mode]: {
                totalGamesPlayed: (modeData?.totalGamesPlayed ?? 0) + 1, // increment(1), // Increment total games played
                win: isWin ? (modeData?.win ?? 0) + 1 : modeData?.win ?? 0, // Increment win if true
                lost: isWin ? modeData?.lost ?? 0 : (modeData?.lost ?? 0) + 1, // Increment lost if false
                streaks: isWin ? (modeData?.streaks ?? 0) + 1 : 0, // Reset streaks on loss
                lastPlayedTime: Date.now(),
              },
            };

      await updateDoc(userDoc, updatedUserData);

      return updatedUserData[mode];
    }
  } catch (error) {
    console.error("Error updating stats: ", error);
  }
};

const getInitialData = async (setLoading) => {
  try {
    setLoading && setLoading(true);
    const collectDoc = collection(db, "admin");
    const getData = await getDocs(collectDoc);
    const tmp = [];
    getData.docs.map((doc) => {
      if (doc.exists()) {
        tmp.push(doc.data().data);
      }
    });
    setLoading && setLoading(false);
    return tmp;
  } catch (error) {
    setLoading(false);
    console.log({ error });
    return [];
  }
};

export { Login, Register, Logout, getInitialData, UpdateUserData };
