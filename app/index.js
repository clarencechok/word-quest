import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../src/utils/firebase";
import { getInitialData } from "../src/auth/handleAuth";

export default function Index() {
  const [isUserAvailable, setIsUserAvailable] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState([]);

  useEffect(() => {
    // A listener that listen the auth changes like on signin, signup, etc
    auth.onAuthStateChanged((user) => {
      console.log("user email => ", user?.email);
      setTimeout(async () => {
        if (user?.email?.includes("@admin.com")) {
          setIsAdmin(true);
          console.log("admin logged in");
        }
        setIsUserAvailable(!!user);
        const data = await getInitialData(setLoading);
        setInitialData(data);
      }, 1000);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Redirect
      href={{
        pathname: isAdmin ? "/admin" : isUserAvailable ? "/game" : "/user",
        params: {
          initialData: JSON.stringify(initialData),
        },
      }}
    />
  );
}
