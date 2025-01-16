import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../utils/colors";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Bold } from "./CustomText";

const WordInfo = ({ visible, word, onClose }) => {
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      const data = await res.json();
      console.log(data);

      if (data?.message) {
        setError("Definition not found");
        setLoading(false);
        return;
      }

      setDetails(data[0]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (word) {
      getData();
    }
  }, [word]);
  console.log(loading, !error);
  return (
    <View>
      <Modal
        coverScreen
        isVisible={visible}
        onDismiss={onClose}
        statusBarTranslucent
        style={{ margin: 0 }}
        hideModalContentWhileAnimating
      >
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <TouchableOpacity
              hitSlop={{
                top: 10,
                left: 10,
                right: 10,
                bottom: 10,
              }}
              onPress={onClose}
              style={{ position: "absolute", right: 20, top: 20, zIndex: 999 }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={[styles.title, { marginBottom: 10 }]}>{word}</Text>

            {error && (
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
              </View>
            )}

            {loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator />
              </View>
            )}

            {!loading && !error && (
              <ScrollView
                contentContainerStyle={{ backgroundColor: Colors.background }}
              >
                <View
                  style={{
                    gap: 15,
                    paddingBottom: 15,
                  }}
                >
                  <Text style={styles.body}>
                    {Bold("Pronunciation (Phonetics)")}
                  </Text>

                  {details?.phonetic && (
                    <Text style={styles.body}>
                      {"‣     "} {details?.phonetic}
                    </Text>
                  )}

                  {details?.phonetics &&
                    [...details?.phonetics].map((item, index) => {
                      return (
                        <View key={index}>
                          <Text style={styles.body}>
                            {"‣     "}
                            {item?.text}
                          </Text>
                        </View>
                      );
                    })}

                  <Text style={styles.body}>{Bold("Part of Speech")}</Text>
                  {details?.meanings &&
                    [...details?.meanings].map((item, index) => {
                      return (
                        <View key={index}>
                          <Text
                            style={[
                              styles.body,
                              { textTransform: "capitalize" },
                            ]}
                          >
                            {"‣     "}
                            {Bold(item?.partOfSpeech)}
                          </Text>
                          <View style={{ gap: 5 }}>
                            <Text style={[styles.body, { marginTop: 10 }]}>
                              {Bold("Definition")}
                            </Text>
                            <View>
                              {item?.definitions.map((def, i) => (
                                <View style={{ flexDirection: "row" }}>
                                  <Text key={i} style={styles.body}>
                                    {"    •     "}
                                  </Text>
                                  <Text
                                    key={`text_${i}`}
                                    style={[styles.body, { marginTop: 5 }]}
                                  >
                                    {def?.definition}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WordInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  subContainer: {
    padding: 20,
    minHeight: "50%",
    maxHeight: "80%",
    marginBottom: 20,
    borderRadius: 30,
    marginHorizontal: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#444",
    fontWeight: "500",
    textAlign: "center",
  },
  body: {
    color: "#444",
  },
});
