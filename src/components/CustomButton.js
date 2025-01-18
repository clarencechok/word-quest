import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../utils/colors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CustomButton = ({
  text,
  right,
  left,
  loading,
  onPress,
  entering,
  disabled,
  viewStyle,
  textStyle,
  parentStyle,
  containerStyle
}) => {
  const scale = useSharedValue(1);
  const radius = useSharedValue(5);

  const aniStyle = useAnimatedStyle(() => {
    return {
      borderRadius: radius.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View entering={entering} style={parentStyle}>
      <Animated.View style={[styles.buttonView, viewStyle, aniStyle]}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          onPressIn={() => {
            scale.value = withTiming(0.95);
            radius.value = withTiming(100);
          }}
          onPressOut={() => {
            scale.value = withTiming(1);
            radius.value = withTiming(5);
          }}
          style={[styles.container, containerStyle]}
        >
          {left && left}
          <Text style={[styles.buttonText, textStyle]}>{text}</Text>
          {(right || loading) && right}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonView: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
});
