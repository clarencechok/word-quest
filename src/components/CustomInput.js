import { Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../utils/colors";
import Animated from "react-native-reanimated";

const CustomTextInput = ({
  name,
  textStyle,
  value,
  entering,
  style,
  multiline,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType,
  placeholder,
  onChangeText,
  maxLength,
}) => {
  return (
    <Animated.View entering={entering} style={{ gap: 10 }}>
      {name && <Text style={[styles.textStyle, textStyle]}>{name}</Text>}
      <TextInput
        value={value}
        multiline={multiline}
        placeholder={placeholder}
        maxLength={maxLength}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={"grey"}
        selectionColor={Colors.primary}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        style={[styles.input, style]}
      />
    </Animated.View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    color: "black",
  },
  input: {
    fontSize: 15,
    minHeight: 50,
    color: "black",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: Colors.card,
  },
});
