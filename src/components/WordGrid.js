import React from "react";
import { StyleSheet, View } from "react-native";
import WordBox from "./WordBox";

export const WordGrid = ({ rows, currentRow,boxNumbers }) => {
  return (
    <View style={styles.grid}>
      {rows.map((row, index) => (
        <WordBox
          key={index}
          guess={row.guess}
          boxNumbers={boxNumbers}
          feedback={row.feedback}
          isActive={index === currentRow} // Highlight the current row
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap:5,
    alignItems: "center",
    justifyContent: "center",
  },
});
