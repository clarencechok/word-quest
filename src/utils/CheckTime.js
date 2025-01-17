import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Alert } from "react-native";
import { router } from "expo-router";

export const CheckTime = async (mode) => {
  try {
    const { currentUser } = auth;
    const userDoc = doc(db, "users", currentUser.uid); // Reference to the user's document

    let userData = (await getDoc(userDoc)).data()[mode];

    const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeSinceLastPlayed = Date.now() - (userData?.lastPlayedTime ?? 0);

    if (timeSinceLastPlayed < oneDayInMs) {
      const remainingTimeMs = oneDayInMs - timeSinceLastPlayed;

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(remainingTimeMs / (60 * 60 * 1000));
      const minutes = Math.floor(
        (remainingTimeMs % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((remainingTimeMs % (60 * 1000)) / 1000);

      // Display the remaining time
      Alert.alert(
        "Already played!",
        `You can only play once in 24 hours.\nRemaining time: ${hours}h ${minutes}m ${seconds}s`,
        [
          {
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    console.log("User can play the game.");
    // Proceed with allowing the user to play the game
  } catch (error) {
    console.error("Error checking time:", error);
    Alert.alert("Error", "An error occurred while checking play time.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  }
};
