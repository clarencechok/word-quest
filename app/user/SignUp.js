import React, { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../../src/components/CustomButton";
import CustomTextInput from "../../src/components/CustomInput";
import Container from "../../src/components/Container";
import { Register } from "../../src/auth/handleAuth";
import { Bold, CustomText } from "../../src/components/CustomText";
import { FadeInDown } from "react-native-reanimated";

const SignUp = () => {
  // store user input from input fields
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  return (
    <Container style={{ gap: 30, padding: 10, paddingTop: "10%" }}>
      <CustomTextInput
        name={"Email Address"}
        keyboardType={"email-address"}
        placeholder={"Email address"}
        entering={FadeInDown.delay(100)}
        onChangeText={(email) => setUserData((pre) => ({ ...pre, email }))}
      />
      <CustomTextInput
        name={"Password"}
        placeholder={"Password"}
        entering={FadeInDown.delay(300)}
        onChangeText={(password) =>
          setUserData((pre) => ({ ...pre, password }))
        }
      />
      <CustomButton
        entering={FadeInDown.delay(600)}
        text={"Create Account"}
        onPress={async () => {
          const res = await Register(userData.email, userData.password);
          if (res) console.log(res.user.email);
        }}
      />

      <CustomText centerText>
        Already have an account? {Bold("Sign In", () => router.back())}
      </CustomText>
    </Container>
  );
};

export default SignUp;
