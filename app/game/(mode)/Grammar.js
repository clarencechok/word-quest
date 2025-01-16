import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";
import { CustomText } from "../../../src/components/CustomText";
import CustomButton from "../../../src/components/CustomButton";
import { Colors } from "../../../src/utils/colors";
import InstructionModal from "../../../src/components/InstructionModal";

const Grammar = () => {
  const params = useLocalSearchParams();

  const pagerRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [userResponse, setUserResponse] = useState([]);
  const [showInstruction, setShowInstruction] = useState(false);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const questions = JSON.parse(params?.questions)[0];
    setQuestions(shuffleArray(questions).slice(0, 3));
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

  const handleAnswer = (question, correctAnswer, userAnswer, index) => {
    if (selectedOption) {
      if (index === 2) {
        router.replace({
          pathname: "/game/Result",
          params: {
            result: userResponse,
            totalCorrectAnswer: userResponse.filter((item) => item.isCorrect)
              .length,
            totalQuestions: questions.length,
          },
        });
        console.log("navigating to /Home");
        setSelectedOption(null);

        return;
      }
      setUserResponse((prev) => [
        ...prev,
        {
          question,
          correctAnswer,
          userAnswer,
          isCorrect:
            String(userAnswer).toLowerCase() ===
            String(correctAnswer).toLowerCase(),
        },
      ]);
      pagerRef.current?.setPage(index + 1);
      setSelectedOption(null);
    } else {
      console.log("please select");
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: "10%" }}>
      <PagerView
        ref={pagerRef}
        initialPage={0}
        scrollEnabled={false}
        style={styles.container}
      >
        {questions.map((question, index) => {
          const isSelected = (value) =>
            String(selectedOption ?? "").toLowerCase() === value;
          return (
            <View
              key={index}
              style={{ flex: 1, gap: 20, paddingHorizontal: 10 }}
            >
              <CustomText bold type={"subTitle"} style={{ marginBottom: 15 }}>
                {index + 1}: {question?.question}
              </CustomText>

              <CustomButton
                text={`a) ${question?.optionA}`}
                onPress={() => setSelectedOption("a")}
                viewStyle={{
                  backgroundColor: isSelected("a")
                    ? Colors.primary
                    : Colors.border,
                }}
                textStyle={{
                  color: isSelected("a") ? "white" : "black",
                }}
              />

              <CustomButton
                text={`b) ${question?.optionB}`}
                onPress={() => setSelectedOption("b")}
                viewStyle={{
                  backgroundColor: isSelected("b")
                    ? Colors.primary
                    : Colors.border,
                }}
                textStyle={{
                  color: isSelected("b") ? "white" : "black",
                }}
              />
              <CustomButton
                text={`c) ${question?.optionC}`}
                onPress={() => setSelectedOption("c")}
                viewStyle={{
                  backgroundColor: isSelected("c")
                    ? Colors.primary
                    : Colors.border,
                }}
                textStyle={{
                  color: isSelected("c") ? "white" : "black",
                }}
              />
              <CustomButton
                text={`d) ${question?.optionD}`}
                onPress={() => setSelectedOption("d")}
                viewStyle={{
                  backgroundColor: isSelected("d")
                    ? Colors.primary
                    : Colors.border,
                }}
                textStyle={{
                  color: isSelected("d") ? "white" : "black",
                }}
              />

              <CustomButton
                text={"Submit Answer"}
                viewStyle={{ marginTop: "30%" }}
                onPress={() =>
                  handleAnswer(
                    question.question,
                    question.answer,
                    selectedOption,
                    index
                  )
                }
              />
            </View>
          );
        })}
      </PagerView>
      <InstructionModal
        mode={"grammar"}
        visible={showInstruction}
        onStartGame={handleStartGame}
        onClose={handleHideInstruction}
      />
    </View>
  );
};

export default Grammar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
  },
});
