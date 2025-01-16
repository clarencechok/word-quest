import { View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomKeyboard from "../../../src/components/CustomKeyboard";
import { WordGrid } from "../../../src/components/WordGrid";
import InstructionModal from "../../../src/components/InstructionModal";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "../../../src/utils/colors";
import { fourLettersWords } from "../../../src/utils/CallbackWords";
import { CustomText } from "../../../src/components/CustomText";

var interval;

const TimedWordle = () => {
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, () => ({ guess: "", feedback: [] }))
  );

  const params = useLocalSearchParams();

  const [showInstruction, setShowInstruction] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90); // Start with 90 seconds

  const [currentRow, setCurrentRow] = React.useState(0); // Track the active row
  const [targetWord, setTargetWord] = React.useState(""); // Hardcoded for now

  useEffect(() => {
    const words = JSON.parse(params?.words)[1] ?? fourLettersWords;

    const randomWordNumber = Math.floor(Math.random() * words.length);
    const _targetWord = words[randomWordNumber].toUpperCase();
    setTargetWord(_targetWord);
    console.log(_targetWord, randomWordNumber);

    handleShowInstruction();

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleShowInstruction = () => {
    setShowInstruction(true);
  };

  const handleHideInstruction = () => {
    setShowInstruction(false);
    router.back();
  };

  const handleStartGame = () => {
    setShowInstruction(false);
    startTimer();
  };

  const startTimer = () => {
    interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          Alert.alert("Time's up!", "Your 1.5 minutes are over.", [
            {
              text: "Confirm",
              onPress() {
                router.replace({
                  pathname: "/game/Result",
                  params: {
                    result: "lost",
                    targetWord,
                  },
                });
              },
            },
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Run every second
  };

  const handleConfirm = () => {

    if (rows[currentRow].guess.length !== 4) {
      alert("Please enter a 4-letter word.");
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
            result: "win",
            targetWord,
          },
        });
        setCurrentRow(0);
        setRows(Array.from({ length: 5 }, () => ({ guess: "", feedback: [] })));
      }, 500);
      return;
    }

    if (currentRow === 5) {
      // alert("Game Over!");
      router.replace({
        pathname: "/game/Result",
        params: {
          result: "lost",
          targetWord,
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
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 15,
            paddingVertical: 5,
            alignSelf: "center",
            alignItems: "center",
            paddingHorizontal: 15,
            justifyContent: "center",
            borderColor: Colors.border,
            backgroundColor: Colors.card,
          }}
        >
          <CustomText centerText bold>
            {formatTime(timeLeft)}
          </CustomText>
        </View>

        <WordGrid rows={rows} currentRow={currentRow} boxNumbers={4} />
      </View>

      <CustomKeyboard
        onConfirm={handleConfirm}
        onDelete={handleDeleteWord}
        onPressWord={handlePressWord}
      />
      <InstructionModal
        mode={"timedWordle"}
        visible={showInstruction}
        onStartGame={handleStartGame}
        onClose={handleHideInstruction}
      />
    </SafeAreaView>
  );
};

export default TimedWordle;
