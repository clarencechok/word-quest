import { View, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";
import { CustomText } from "../../../src/components/CustomText";
import CustomButton from "../../../src/components/CustomButton";
import { Colors } from "../../../src/utils/colors";
import InstructionModal from "../../../src/components/InstructionModal";
import { SlideInDown } from "react-native-reanimated";

const Grammar = () => {
  const params = useLocalSearchParams();

  const pagerRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [userResponse, setUserResponse] = useState([]);
  const [showInstruction, setShowInstruction] = useState(false);

  const [showSubmit, setShowSubmit] = useState(false);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // get all data when screen mount
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

  /**
   * use to submit the user response at the end of the grammar session
   */
  const handleSubmit = useCallback(() => {
    router.replace({
      pathname: "/game/Result",
      params: {
        questions: JSON.stringify(questions),
        result: JSON.stringify(userResponse),
        totalCorrectAnswer: userResponse.filter((item) => item.isCorrect)
          .length,
        mode: "grammar",
        totalQuestions: questions.length,
      },
    });

    setSelectedOption(null);
  }, [questions, selectedIndex, userResponse]);

  /**
   * use to handle the user interaction upon answers click. and update the userResponse state
   */
  const handleAnswer = (question, correctAnswer, userAnswer, index) => {
    if (selectedOption) {
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

      if (index <= 2) {
        pagerRef.current?.setPage(index);
        setSelectedOption(null);
      } else {
        setShowSubmit(true);
      }
    } else {
      console.log("please select");
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <PagerView
        ref={pagerRef}
        initialPage={0}
        scrollEnabled={false}
        onPageSelected={(e) => {
          setSelectedIndex(e.nativeEvent.position);
        }}
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

              {!showSubmit && (
                <CustomButton
                  text={"Next"}
                  onPress={() => {
                    handleAnswer(
                      question.question,
                      question.answer,
                      selectedOption,
                      index + 1
                    );
                  }}
                />
              )}

              {selectedIndex === 2 && showSubmit && (
                <CustomButton
                  entering={SlideInDown}
                  text={"Submit Answer"}
                  onPress={() => {
                    handleSubmit();
                  }}
                />
              )}
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
