import React from "react";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Modal from "react-native-modal";
import { Colors } from "../../utils/colors";
import { CustomText } from "../CustomText";
import CustomTextInput from "../CustomInput";
import CustomButton from "../CustomButton";

export const WordleModal = ({ isVisible, onPress, onClose }) => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Modal
        isVisible={isVisible}
        style={{}}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        statusBarTranslucent
      >
        <View
          style={{
            padding: 15,
            minHeight: 250,
            borderRadius: 10,
            justifyContent: "space-evenly",
            backgroundColor: Colors.background,
          }}
        >
          <CustomText centerText type={"subTitle"}>
            Add Wordle Word
          </CustomText>
          <CustomTextInput
            maxLength={5}
            onChangeText={setWord}
            placeholder={"Enter Word"}
          />
          <CustomButton
            text={"Update"}
            right={
              loading && (
                <ActivityIndicator
                  color={"white"}
                  style={{ position: "absolute", right: 10 }}
                />
              )
            }
            onPress={() => {
              setLoading(true);
              if (word.length === 5) {
                onPress(word);
                setLoading(false);
              } else {
                alert("Word should be 5 characters long");
                setLoading(false);
              }
            }}
          />
        </View>
      </Modal>
    </View>
  );
};
