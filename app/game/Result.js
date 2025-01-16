import { View, StyleSheet, Share, ActivityIndicator } from "react-native";
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

  const onCloseWordInfo = () => {
    setShowWordInfo(false);
  };

  const shareMessage = () => {
    if (targetWord) {
      const { totalGamesPlayed, win, lost, streaks } = userData;
      return `WORD QUEST:
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
    if (targetWord) {
      UpdateUserData(params?.result === "win")
        .then((userData) => {
          setUserData(userData);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [targetWord]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 10 }}>
          <RectButton
            onPress={() =>
              Share.share({
                message: shareMessage(),
              })
            }
          >
            <Ionicons name="share-social-sharp" size={24} color="black" />
          </RectButton>

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
  }, [showWordInfo, targetWord, userData]);

  return (
    <View style={{ flex: 1, padding: 15, gap: 10 }}>
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
      <WordInfo
        word={targetWord}
        visible={showWordInfo}
        onClose={onCloseWordInfo}
      />
    </View>
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
