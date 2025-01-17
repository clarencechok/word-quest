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
  }

  useEffect(() => {
    Notifications.requestPermissionsAsync();
    scheduleDailyNotification();
    // Notifications.getAllScheduledNotificationsAsync().then((e) =>
    //   console.log(e)
    // );
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
