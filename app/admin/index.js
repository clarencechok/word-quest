import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../src/utils/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { CustomText } from "../../src/components/CustomText";
import { Colors } from "../../src/utils/colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { GrammarModal } from "../../src/components/admin/GrammarModal";
import { TimedWordleModal } from "../../src/components/admin/TimedWordleModal";
import { WordleModal } from "../../src/components/admin/WordleModal";
import { useNavigation } from "expo-router";
import { Logout } from "../../src/auth/handleAuth";
import { RectButton } from "react-native-gesture-handler";

const Index = () => {
  const [wordleWordsLoading, setWordleWordsLoading] = useState(false);
  const [wordleWords, setWordleWords] = useState([]);
  const [showWordleModal, setShowWordleModal] = useState(false);

  const [timedWordleWordleLoading, setTimedWordleWordleLoading] =
    useState(false);
  const [timedWordleWords, setTimedWordleWords] = useState([]);
  const [showTimedWordleModal, setShowTimedWordleModal] = useState(false);

  const [grammarQuestionsLoading, setGrammarQuestionsLoading] = useState(false);
  const [grammarQuestions, setGrammarQuestions] = useState([]);
  const [showGrammarModal, setShowGrammarModal] = useState(false);

  const navigation = useNavigation();

  const updateWordleAdd = async (data, type) => {
    const userDoc = doc(db, "admin", type);
    await updateDoc(userDoc, {
      data: arrayUnion(data),
    });
    if (type === "timedWordle") {
      const tmp = [...timedWordleWords];
      tmp.unshift(data);
      setTimedWordleWords(tmp);
      setShowTimedWordleModal(false);
    } else if (type === "grammar") {
      const tmp = [...grammarQuestions];
      tmp.unshift(data);
      setGrammarQuestions(tmp);
      setShowGrammarModal(false);
    } else {
      const tmp = [...wordleWords];
      tmp.unshift(data);
      setWordleWords(tmp);
      setShowWordleModal(false);
    }
  };

  const getWordleData = async () => {
    try {
      setWordleWordsLoading(true);
      const userDoc = doc(db, "admin", "wordle");
      const getData = await getDoc(userDoc);
      if (getData.exists()) {
        setWordleWords(getData.data().data);
      }
      setWordleWordsLoading(false);
    } catch (error) {
      console.log({ error });
      setWordleWordsLoading(false);
    }
  };

  const getTimedWordleData = async () => {
    try {
      setTimedWordleWordleLoading(true);
      const userDoc = doc(db, "admin", "timedWordle");
      const getData = await getDoc(userDoc);
      if (getData.exists()) {
        setTimedWordleWords(getData.data().data);
      }
      setTimedWordleWordleLoading(false);
    } catch (error) {
      console.log({ error });
      setTimedWordleWordleLoading(false);
    }
  };

  const getGrammarData = async () => {
    try {
      setGrammarQuestionsLoading(true);
      const userDoc = doc(db, "admin", "grammar");
      const getData = await getDoc(userDoc);
      if (getData.exists()) {
        setGrammarQuestions(getData.data().data);
      }
      setGrammarQuestionsLoading(false);
    } catch (error) {
      setGrammarQuestionsLoading(false);
      console.log({ error });
    }
  };

  useEffect(() => {
    getWordleData();
    getTimedWordleData();
    getGrammarData();

    navigation.setOptions({
      headerRight: () => (
        <RectButton onPress={Logout}>
          <MaterialIcons name="logout" size={24} color="black" />
        </RectButton>
      ),
    });
  }, []);

  const Header = ({ name, onPress }) => (
    <View
      style={{
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CustomText type={"subTitle"}>{name}</CustomText>

      <TouchableOpacity onPress={onPress}>
        <AntDesign name="pluscircle" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const LoadingIndicator = ({ status }) => {
    return (
      status && (
        <View
          style={{
            flex: 1,
            height: 150,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 15 }}>
      <Header
        name={"Wordle Words"}
        onPress={() => {
          setShowWordleModal(true);
        }}
      />
      <View
        style={{
          gap: 5,
          flexWrap: "wrap",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        {wordleWords.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const userDoc = doc(db, "admin", "wordle");
                updateDoc(userDoc, {
                  data: arrayRemove(item),
                });
                const tmp = wordleWords.filter((_item) => _item !== item);
                setWordleWords(tmp);
              }}
              style={{
                borderRadius: 100,
                paddingVertical: 10,
                paddingHorizontal: "8%",
                backgroundColor: Colors.border,
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <LoadingIndicator status={wordleWordsLoading} />

      <Header
        name={"Timed Wordle Words"}
        onPress={() => {
          setShowTimedWordleModal(true);
        }}
      />
      <View
        style={{
          gap: 5,
          flexWrap: "wrap",
          flexDirection: "row",
          paddingHorizontal: 10,
        }}
      >
        {timedWordleWords.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const userDoc = doc(db, "admin", "timedWordle");
                updateDoc(userDoc, {
                  data: arrayRemove(item),
                });
                const tmp = timedWordleWords.filter((_item) => _item !== item);
                setTimedWordleWords(tmp);
              }}
              style={{
                borderRadius: 100,
                paddingVertical: 10,
                paddingHorizontal: "8%",
                backgroundColor: Colors.border,
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <LoadingIndicator status={timedWordleWordleLoading} />

      <Header
        name={"Grammar Mode"}
        onPress={() => {
          setShowGrammarModal(true);
        }}
      />
      <View style={{ gap: 10 }}>
        {grammarQuestions.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                const userDoc = doc(db, "admin", "grammar");
                updateDoc(userDoc, {
                  data: arrayRemove(item),
                });
                const tmp = grammarQuestions.filter(
                  (_item) => _item.question !== item.question
                );
                setGrammarQuestions(tmp);
              }}
              style={{
                gap: 10,
                padding: 10,
                borderRadius: 10,
                marginHorizontal: 10,
                backgroundColor: Colors.border,
              }}
            >
              <CustomText bold>{item.question}</CustomText>
              <CustomText>A: {item.optionA}</CustomText>
              <CustomText style={{opacity:0.7}}>({item?.optionA_explanation})</CustomText>
              <CustomText>B: {item.optionB}</CustomText>
              <CustomText style={{opacity:0.7}}>({item?.optionB_explanation})</CustomText>
              <CustomText>C: {item.optionC}</CustomText>
              <CustomText style={{opacity:0.7}}>({item?.optionC_explanation})</CustomText>
              <CustomText>D: {item.optionD}</CustomText>
              <CustomText style={{opacity:0.7}}>({item?.optionD_explanation})</CustomText>
              <CustomText bold>Answer: {item.answer}</CustomText>
            </TouchableOpacity>
          );
        })}
      </View>
      <LoadingIndicator status={grammarQuestionsLoading} />

      <WordleModal
        isVisible={showWordleModal}
        onPress={async (word) => {
          await updateWordleAdd(word, "wordle");
        }}
        onClose={() => setShowWordleModal(false)}
      />
      <TimedWordleModal
        isVisible={showTimedWordleModal}
        onPress={async (word) => {
          await updateWordleAdd(word, "timedWordle");
        }}
        onClose={() => setShowTimedWordleModal(false)}
      />
      <GrammarModal
        isVisible={showGrammarModal}
        onClose={() => setShowGrammarModal(false)}
        onPress={async (question) => {
          await updateWordleAdd(question, "grammar");
        }}
      />
    </ScrollView>
  );
};

export default Index;
