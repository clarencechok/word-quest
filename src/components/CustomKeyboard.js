import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import CustomButton from "./CustomButton";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const CustomKeyboard = ({ onPressWord, onDelete, onConfirm }) => {
  const buttons = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const scale = useSharedValue(1);
  const selectedIndex = useSharedValue(null);

  const { width } = useWindowDimensions();

  const GAP = 10;
  const PADDING = 10 * 2;
  const TOTAL_MAX_BUTTONS_ROW = 10;
  const TOTAL_GAP = GAP * (TOTAL_MAX_BUTTONS_ROW - 1);

  const buttonWidth = (width - TOTAL_GAP - PADDING) / TOTAL_MAX_BUTTONS_ROW;

  return (
    <View>
      {buttons.map((row, i) => (
        <View
          key={`${row}_${i}`}
          style={{
            gap: 10,
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
        >
          {row.map((button, index) => {
            const aniStyle = useAnimatedStyle(() => {
              return {
                transform: [
                  {
                    scale:
                      selectedIndex.value === `${i}_${index}` ? scale.value : 1,
                  },
                ],
              };
            });
            return (
              <Animated.View key={index} style={[{}, aniStyle]}>
                <TouchableOpacity
                  key={button}
                  activeOpacity={0.7}
                  onPress={() => {
                    onPressWord(button);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  onPressIn={() => {
                    scale.value = withTiming(0.75);
                    selectedIndex.value = `${i}_${index}`;
                  }}
                  onPressOut={() => {
                    scale.value = withTiming(1);
                  }}
                  style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    width: buttonWidth,
                    alignItems: "center",
                    justifyContent: "center",
                    borderColor: "#aaafb9",
                    height: buttonWidth * 1.5,
                    backgroundColor: "#d3d5d9",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      textTransform: "uppercase",
                      fontSize: 20,
                    }}
                    allowFontScaling
                  >
                    {button}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      ))}

      <View
        style={{
          // width: "100%",
          gap: 10,
          marginBottom: 10,
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        <CustomButton
          text={"Confirm"}
          onPress={onConfirm}
          parentStyle={{ flex: 1 }}
          viewStyle={{ flex: 1, backgroundColor: "#434c63" }}
        />
        <CustomButton
          onPress={() => {
            onDelete;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)

          }}
          parentStyle={{ flex: 1 }}
          viewStyle={{ backgroundColor: "#434c63" }}
          text={<Feather name="delete" size={24} color="white" />}
        />
      </View>
    </View>
  );
};

export default CustomKeyboard;
