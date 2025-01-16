import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function UserLayout() {
  const isAndroid = Platform.OS === "android";
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerShadowVisible: false,
        statusBarStyle: isAndroid ? "dark" : undefined,
      }}
    >
      <Stack.Screen name="SignIn" options={{ title: "Sign In" }} />
      <Stack.Screen name="SignUp" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
