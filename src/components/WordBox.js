import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { responsiveFont } from "./CustomText";

const WordBox = ({ guess, feedback = [], boxNumbers = 5, isActive }) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: boxNumbers }).map((_, i) => {
        let backgroundColor = "#f1f1f1"; // Default color
        if (feedback[i] === "correct") backgroundColor = "#4CAF50"; // Green
        if (feedback[i] === "misplaced") backgroundColor = "#FFC107"; // Yellow
        if (feedback[i] === "wrong") backgroundColor = "#D6D6D6"; // Gray

        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                backgroundColor,
                borderColor: isActive ? "#92959d" : "#ddd",
              },
            ]}
          >
            <Text style={styles.letter}>{guess[i] || ""}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default WordBox;

const styles = StyleSheet.create({
  row: {
    gap: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  box: {
    width: responsiveFont(40),
    height: responsiveFont(40),
    borderWidth: 2,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
});
