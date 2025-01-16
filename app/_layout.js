import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  async function scheduleDailyNotification() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily_reminder", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Can You Guess the Word of the Day!",
        body: "Solve today’s word puzzle and prove your skills!",
      },
      trigger: {
        hour: 9, // 9 AM
        minute: 0, // 0 minutes
        repeats: true, // Repeat daily
        channelId: "daily_reminder",
      },
    });

    console.log("Daily Notification Scheduled", notificationId);
  }

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    scheduleDailyNotification();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="user" />
        <Stack.Screen name="game" />
        <Stack.Screen name="admin" />
      </Stack>
    </GestureHandlerRootView>
  );
}
