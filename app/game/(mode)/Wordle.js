import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomKeyboard from "../../../src/components/CustomKeyboard";
import { WordGrid } from "../../../src/components/WordGrid";
import InstructionModal from "../../../src/components/InstructionModal";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../../../src/utils/colors";
import { fiveLettersWords } from "../../../src/utils/CallbackWords";
import { CheckTime } from "../../../src/utils/CheckTime";

const Wordle = () => {
  const [rows, setRows] = useState(
    Array.from({ length: 6 }, () => ({ guess: "", feedback: [] }))
  );

  const params = useLocalSearchParams();

  const [showInstruction, setShowInstruction] = useState(false);

  const [currentRow, setCurrentRow] = React.useState(0); // Track the active row
  const [targetWord, setTargetWord] = React.useState(""); // Hardcoded for now

  useEffect(() => {
    const words = JSON.parse(params?.words)[2] ?? fiveLettersWords;

    const randomWordNumber = Math.floor(Math.random() * words.length);
    const _targetWord = words[randomWordNumber].toUpperCase();
    setTargetWord(_targetWord);
    console.log(_targetWord, randomWordNumber);

    CheckTime('wordle');

    handleShowInstruction();
  }, []);

  const handleShowInstruction = () => {
    setShowInstruction(true);
  };

  const handleHideInstruction = () => {
    setShowInstruction(false);
    router.back();
  };

  const handleStartGame = () => {
    setShowInstruction(false);
  };

  const handleConfirm = () => {
    if (rows[currentRow].guess.length !== 5) {
      alert("Please enter a 5-letter word.");
      return;
    }

    // Validate the guess
    const updatedRows = [...rows];
    const feedback = validateGuess(rows[currentRow].guess, targetWord); // Add feedback logic here
    updatedRows[currentRow].feedback = feedback;

    setRows(updatedRows);

    console.log(rows[currentRow].guess, targetWord);

    if (rows[currentRow].guess === targetWord) {
      // alert("You Win!");
      setTimeout(() => {
        router.replace({
          pathname: "/game/Result",
          params: {
            targetWord,
            result: "win",
            mode: "wordle",
          },
        });
        setCurrentRow(0);
        setRows(Array.from({ length: 6 }, () => ({ guess: "", feedback: [] })));
      }, 500);
      return;
    }

    if (currentRow === 5) {
      // alert("Game Over!");
      router.replace({
        pathname: "/game/Result",
        params: {
          targetWord,
          result: "lost",
          mode: "wordle",
        },
      });

      setCurrentRow(0);
      setRows(Array.from({ length: 6 }, () => ({ guess: "", feedback: [] })));
      return;
    }

    setCurrentRow((prev) => prev + 1); // Move to the next row
  };

  const validateGuess = (guess, targetWord) => {
    const feedback = Array(5).fill("wrong");
    const targetLetters = String(targetWord).toUpperCase().split("");

    // Mark correct letters
    guess.split("").forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        feedback[i] = "correct";
        targetLetters[i] = null; // Prevent duplicate matches
      }
    });

    // Mark misplaced letters
    guess.split("").forEach((letter, i) => {
      if (feedback[i] !== "correct" && targetLetters.includes(letter)) {
        feedback[i] = "misplaced";
        targetLetters[targetLetters.indexOf(letter)] = null; // Prevent duplicate matches
      }
    });

    return feedback;
  };

  const handlePressWord = (letter) => {
    if (rows[currentRow].guess.length >= 5) {
      return;
    }

    const updatedRows = [...rows];

    updatedRows[currentRow].guess += letter;

    setRows(updatedRows);
  };

  const handleDeleteWord = () => {
    const updatedRows = [...rows];
    updatedRows[currentRow].guess = updatedRows[currentRow].guess.slice(0, -1);
    setRows(updatedRows);
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, paddingTop: 15, backgroundColor: Colors.background }}
    >
      <View style={{ flex: 1 }}>
        <WordGrid rows={rows} currentRow={currentRow} />
      </View>

      <CustomKeyboard
        onConfirm={handleConfirm}
        onDelete={handleDeleteWord}
        onPressWord={handlePressWord}
      />
      <InstructionModal
        visible={showInstruction}
        onStartGame={handleStartGame}
        onClose={handleHideInstruction}
      />
    </SafeAreaView>
  );
};

export default Wordle;
