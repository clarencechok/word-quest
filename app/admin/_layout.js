import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function AdminLayout() {
  const isAndroid = Platform.OS === "android";

  return (
    <Stack
      screenOptions={{
        statusBarStyle: isAndroid ? "dark" : undefined,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Admin Panel", headerShadowVisible: false }}
      />
    </Stack>
  );
}
