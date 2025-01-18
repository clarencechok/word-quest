import React from "react";
import { StyleSheet, Text } from "react-native";

import { Dimensions, PixelRatio } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Base dimensions for a standard screen (adjust as per design reference)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Responsive font function
export const responsiveFont = (fontSize) => {
  // Scale based on the screen's width
  const scale = screenWidth / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(fontSize * scale));
};

export const CustomText = ({
  children,
  bold,
  type,
  centerText,
  fontSize,
  style,
  onPress,
  ...props
}) => {
  return (
    <Text
      onPress={onPress}
      style={[
        {
          fontSize: fontSize ? responsiveFont(fontSize) : undefined,
          fontWeight: bold ? "bold" : "normal",
          textAlign: centerText ? "center" : "auto",
        },
        type === "title" && styles.title,
        type === "subTitle" && styles.subTitle,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Bold = (value, onPress) => {
  return (
    <Text onPress={onPress} style={{ fontWeight: "bold" }}>
      {value}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: responsiveFont(24),
  },
  subTitle: {
    fontWeight: "500",
    fontSize: responsiveFont(20),
  },
});
