import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
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
