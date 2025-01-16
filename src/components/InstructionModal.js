import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { Colors } from "../utils/colors";
import { AntDesign } from "@expo/vector-icons";
import { IMAGES } from "../../assets/images";
import Modal from "react-native-modal";
import { Bold } from "./CustomText";
import { StretchInX } from "react-native-reanimated";

const InstructionModal = ({ visible, onStartGame, onClose, mode }) => {
  return (
    <View>
      <Modal
        statusBarTranslucent
        isVisible={visible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={{ margin: 0 }}
      >
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <ScrollView
              contentContainerStyle={{
                backgroundColor: Colors.background,
                paddingBottom: 70,
              }}
            >
              <TouchableOpacity
                hitSlop={{
                  top: 10,
                  left: 10,
                  right: 10,
                  bottom: 10,
                }}
                onPress={onClose}
                style={{ position: "absolute", right: 5, top: 5, zIndex: 999 }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <View
                style={{
                  gap: 15,
                  paddingBottom: 15,
                }}
              >
                <Text style={styles.title}>How To Play</Text>
                <Text style={styles.subTitle}>
                  {mode === "timedWordle"
                    ? "Guess the word within time limit."
                    : mode === "grammar"
                    ? "Test your grammar skills by answering multiple-choice questions!"
                    : "Guess the Wordle in 6 tries."}
                </Text>

                <Text style={styles.body}>
                  {"‣     "}
                  {mode === "grammar"
                    ? "Each question presents a sentence with 3 blanks."
                    : `Each guess must be a valid ${
                        mode === "timedWordle" ? "4" : "5"
                      }-letter word.`}
                </Text>
                <Text style={styles.body}>
                  {"‣     "}
                  {mode === "grammar"
                    ? "Choose the correct word(s) from the four options provided for each blank."
                    : "The color of the tiles will change to show how close your guess to the word."}
                </Text>

                {mode !== "grammar" && (
                  <>
                    <Text style={[styles.subTitle, { textAlign: "left" }]}>
                      Examples
                    </Text>

                    <Image
                      source={IMAGES.correct_position}
                      style={{ width: 200, height: 40, resizeMode: "cover" }}
                    />
                    <Text style={styles.body}>
                      {Bold("A")} is in the word and in the correct spot.
                    </Text>
                    <Image
                      source={IMAGES.wrong}
                      style={{ width: 200, height: 40, resizeMode: "cover" }}
                    />
                    <Text style={styles.body}>
                      {Bold("P")} is in the word and in the wrong spot.
                    </Text>
                    <Image
                      source={IMAGES.wrong}
                      style={{ width: 200, height: 40, resizeMode: "cover" }}
                    />
                    <Text style={styles.body}>
                      {Bold("O")} is not in the word in any spot.
                    </Text>
                  </>
                )}
              </View>
            </ScrollView>
            <CustomButton
              entering={StretchInX.delay(300)}
              text={"Start Game"}
              parentStyle={{
                position: "absolute",
                bottom: 15,
                left: 15,
                right: 15,
              }}
              onPress={onStartGame}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InstructionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  subContainer: {
    padding: 20,
    minHeight: "50%",
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
