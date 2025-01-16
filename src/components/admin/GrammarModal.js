import React from "react";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import Modal from "react-native-modal";
import { Colors } from "../../utils/colors";
import { CustomText } from "../CustomText";
import CustomTextInput from "../CustomInput";
import CustomButton from "../CustomButton";

export const GrammarModal = ({ isVisible, onPress, onClose }) => {
  const [question, setQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
  });
  const [loading, setLoading] = useState(false);

  return (
    <View>
      <Modal
        style={{}}
        statusBarTranslucent
        isVisible={isVisible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
      >
        <View
          style={{
            gap: 10,
            padding: 15,
            minHeight: 250,
            borderRadius: 10,
            justifyContent: "space-evenly",
            backgroundColor: Colors.background,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
            automaticallyAdjustKeyboardInsets
          >
            <CustomText centerText type={"subTitle"}>
              Add Grammar Question
            </CustomText>
            <CustomTextInput
              onChangeText={(question) =>
                setQuestion((pre) => ({ ...pre, question }))
              }
              placeholder={"Enter Question"}
            />
            <CustomTextInput
              name={"Option A"}
              onChangeText={(optionA) =>
                setQuestion((pre) => ({ ...pre, optionA }))
              }
              placeholder={"Enter Option A"}
            />
            <CustomTextInput
              name={"Option B"}
              onChangeText={(optionB) =>
                setQuestion((pre) => ({ ...pre, optionB }))
              }
              placeholder={"Enter Option B"}
            />
            <CustomTextInput
              name={"Option C"}
              onChangeText={(optionC) =>
                setQuestion((pre) => ({ ...pre, optionC }))
              }
              placeholder={"Enter Option C"}
            />
            <CustomTextInput
              name={"Option D"}
              onChangeText={(optionD) =>
                setQuestion((pre) => ({ ...pre, optionD }))
              }
              placeholder={"Enter Option D"}
            />
            <CustomTextInput
              name={"Answer"}
              maxLength={1}
              onChangeText={(answer) =>
                setQuestion((pre) => ({ ...pre, answer }))
              }
              placeholder={"Enter Answer"}
            />
          </ScrollView>
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
              if (
                Object.values(question).filter((item) => item.length > 0)
                  .length >= 6
              ) {
                onPress(question);
                setLoading(false);

                setTimeout(() => {
                  setQuestion({
                    question: "",
                    optionA: "",
                    optionB: "",
                    optionC: "",
                    optionD: "",
                    answer: "",
                  });
                }, 500);
                return;
              }

              alert("Please enter the question and all options!");
              setLoading(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};
