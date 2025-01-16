import { View, Text } from "react-native";
import React from "react";
import { Colors } from "../utils/colors";

const Container = ({ children, style }) => {
  return (
    <View style={[{ flex: 1, backgroundColor: Colors.background }, style]}>
      {children}
    </View>
  );
};

export default Container;
