import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Colors } from "../../src/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GameLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Result" />
      <Stack.Screen
        name="(mode)/Grammar"
        options={{
          title: "Fill in the Blanks",
          header(props) {
            return <CustomHeader {...props} />;
          },
        }}
      />
      <Stack.Screen
        name="(mode)/TimedWordle"
        options={{
          title: "Timed Wordle",
          header(props) {
            return <CustomHeader {...props} />;
          },
        }}
      />
      <Stack.Screen
        name="(mode)/Wordle"
        options={{
          title: "Wordle",
          header(props) {
            return <CustomHeader title="Timed Wordle" {...props} />;
          },
        }}
      />
    </Stack>
  );
};

export default GameLayout;

const CustomHeader = (props) => {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        paddingTop: inset.top,
      }}
    >
      <View style={{ padding: 15, justifyContent: "center" }}>
        <TouchableOpacity
          hitSlop={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
          }}
          onPress={() => props.navigation.goBack()}
          style={{ position: "absolute", left: 15, zIndex: 999 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {props.options.title}
        </Text>

        {props.options?.headerRight && (
          <View style={{ position: "absolute", right: 15, zIndex: 999 }}>
            {props.options?.headerRight()}
          </View>
        )}
      </View>
    </View>
  );
};
