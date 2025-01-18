import {
  View,
  StyleSheet,
  Share,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import WordInfo from "../../src/components/WordInfo";
import { CustomText } from "../../src/components/CustomText";
import { UpdateUserData } from "../../src/auth/handleAuth";
import { Colors } from "../../src/utils/colors";
import { RectButton } from "react-native-gesture-handler";

const Result = () => {
  const params = useGlobalSearchParams();

  const navigation = useNavigation();

  const [showWordInfo, setShowWordInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetWord = params?.targetWord;
  const questions = params?.questions ? JSON.parse(params?.questions) : null;
  const userResponse =
    params?.result.length > 10 ? JSON.parse(params?.result) : null;

  const onCloseWordInfo = () => {
    setShowWordInfo(false);
  };

  /**
   * prepare the share message when data change {targetwords} or {game mode}
   */
  const shareMessage = () => {
    if (targetWord) {
      const { totalGamesPlayed, win, lost, streaks } = userData;
      const mode = params?.mode;

      return `WORD QUEST:
>> ${mode === "wordle" ? "Wordle" : "Timed Wordle"} <<
🎮 Game Results:
- Total Games Played: ${totalGamesPlayed}
- Wins: ${win}
- Losses: ${lost}
- Current Streak: ${streaks}

Can you beat my streak? 💪
`;
    } else {
      return `WORD QUEST: 
>> Grammar Mode <<
🎮 Game Results: 
 - Total Questions: ${params?.totalQuestions ?? 3}
 - Correct Answers: ${params?.totalCorrectAnswer ?? 0}
 - Incorrect Answers: ${
   params?.totalQuestions - params?.totalCorrectAnswer ?? 0
 }
`;
    }
  };

  useEffect(() => {
    UpdateUserData(params?.result === "win", params?.mode)
      .then((userData) => {
        setUserData(userData);
        setLoading(false);
      })
      .catch((e) => {
        console.log({ e });
        setLoading(false);
      });
  }, [targetWord, params?.mode]);

  // update header right side icons and buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        (!loading || !targetWord) && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(!loading || !targetWord) && (
              <RectButton
                onPress={() =>
                  Share.share({
                    message: shareMessage(),
                  })
                }
              >
                <Ionicons name="share-social-sharp" size={24} color="black" />
              </RectButton>
            )}

            {targetWord && (
              <RectButton onPress={() => setShowWordInfo(true)}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color="black"
                />
              </RectButton>
            )}
          </View>
        ),
    });
  }, [showWordInfo, loading, targetWord, userData]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 15, gap: 15, paddingBottom: 150 }}
    >
      {targetWord ? (
        <CustomText centerText type={"title"} style={styles.title}>
          YOU {params?.result}!
        </CustomText>
      ) : (
        <CustomText centerText type={"title"} style={styles.title}>
          YOU {params?.totalCorrectAnswer} / {params?.totalQuestions}
        </CustomText>
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View
          style={[
            styles.cardContainer,
            {
              flex: 1,
            },
          ]}
        >
          <CustomText adjustsFontSizeToFit centerText bold fontSize={15}>
            {targetWord ? "Win %" : "Correct Answers %"}
          </CustomText>
          {loading && targetWord ? (
            <ActivityIndicator color={"black"} />
          ) : (
            <CustomText centerText fontSize={15}>
              {targetWord
                ? userData?.win ?? 0
                : (params?.totalCorrectAnswer / params?.totalQuestions).toFixed(
                    1
                  ) *
                    100 +
                  " %"}
            </CustomText>
          )}
        </View>
        {targetWord && (
          <View
            style={[
              styles.cardContainer,
              {
                flex: 1,
              },
            ]}
          >
            <CustomText adjustsFontSizeToFit centerText bold fontSize={15}>
              Lost %
            </CustomText>
            {loading && targetWord ? (
              <ActivityIndicator color={"black"} />
            ) : (
              <CustomText centerText fontSize={15}>
                {userData?.lost ?? 0}
              </CustomText>
            )}
          </View>
        )}
        <View
          style={[
            styles.cardContainer,
            {
              flex: 1,
            },
          ]}
        >
          <CustomText adjustsFontSizeToFit centerText bold fontSize={15}>
            {targetWord ? "Streaks" : "Wrong Answers %"}
          </CustomText>
          {loading && targetWord ? (
            <ActivityIndicator color={"black"} />
          ) : (
            <CustomText centerText fontSize={15}>
              {targetWord
                ? userData?.streaks ?? 0
                : Math.abs(
                    (
                      params?.totalCorrectAnswer / params?.totalQuestions
                    ).toFixed(1) - 1
                  ).toFixed(1) *
                    100 +
                  " %"}
            </CustomText>
          )}
        </View>
      </View>

      {targetWord && (
        <View style={styles.cardContainer}>
          <CustomText centerText type={"subTitle"}>
            Total Games Played
          </CustomText>
          {loading ? (
            <ActivityIndicator color={"black"} />
          ) : (
            <CustomText centerText>
              {userData?.totalGamesPlayed ?? 0}
            </CustomText>
          )}
        </View>
      )}

      {questions && userResponse && (
        <>
          <CustomText bold centerText type={"title"}>
            Explanation
          </CustomText>
          {userResponse.map((question, index) => {
            const getExplanation = questions.filter(
              (item) => item.question === question?.question
            )[0];

            return (
              <View key={index}>
                <CustomText bold style={{ marginTop: 10 }}>
                  {index + 1}. {question?.question}
                </CustomText>

                <CustomText
                  style={{
                    marginTop: 10,
                    color: question?.isCorrect ? "green" : "red",
                  }}
                >
                  {question?.userAnswer}){"  "}
                  {
                    getExplanation[
                      `option${String(question?.userAnswer).toUpperCase()}`
                    ]
                  }
                </CustomText>
                <CustomText
                  style={{
                    marginTop: 10,
                    color: question?.isCorrect ? "green" : "red",
                  }}
                >
                  {
                    getExplanation[
                      `option${String(
                        question?.userAnswer
                      ).toUpperCase()}_explanation`
                    ]
                  }
                </CustomText>

                {!question?.isCorrect && (
                  <View
                    style={{
                      gap: 10,
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderColor: "grey",
                    }}
                  >
                    <CustomText style={{ color: "green" }}>
                      {String(question?.correctAnswer).toLowerCase()}){"  "}
                      {
                        getExplanation[
                          `option${String(
                            question?.correctAnswer
                          ).toUpperCase()}`
                        ]
                      }
                    </CustomText>
                    <CustomText style={{ color: "green" }}>
                      {
                        getExplanation[
                          `option${String(
                            question?.correctAnswer
                          ).toUpperCase()}_explanation`
                        ]
                      }
                    </CustomText>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      <WordInfo
        word={targetWord}
        visible={showWordInfo}
        onClose={onCloseWordInfo}
      />
    </ScrollView>
  );
};

export default Result;

const styles = StyleSheet.create({
  title: {
    marginTop: "15%",
    marginBottom: "15%",
    textTransform: "uppercase",
  },
  cardContainer: {
    height: 100,
    padding: 10,
    width: "100%",
    borderRadius: 10,
    justifyContent: "space-evenly",
    backgroundColor: Colors.border,
  },
});
