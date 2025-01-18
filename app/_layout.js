import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  /**
   * set daily schedule notification at 9:00 am & create notification channel for android to work seamlessly.
   */
  const scheduleDailyNotification = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily_reminder", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: "review",
      content: {
        title: "Can You Guess the Word of the Day!",
        body: "Solve today’s word puzzle and prove your skills!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
        channelId: "daily_reminder",
      },
    });

    console.log("Daily Notification Scheduled", notificationId);
  };

  useEffect(() => {
    // request a notification permission on app mount.
    Notifications.requestPermissionsAsync();
    scheduleDailyNotification();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="user" />
        <Stack.Screen name="game" />
        <Stack.Screen name="admin" />
      </Stack>
    </GestureHandlerRootView>
  );
}
