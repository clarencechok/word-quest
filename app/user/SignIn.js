import React, { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../../src/components/CustomButton";
import CustomTextInput from "../../src/components/CustomInput";
import Container from "../../src/components/Container";
import { Login } from "../../src/auth/handleAuth";
import { Bold, CustomText } from "../../src/components/CustomText";
import { FadeInDown } from "react-native-reanimated";

const SignIn = () => {
  // store user input from input fields
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  return (
    <Container style={{ gap: 30, padding: 10, paddingTop: "10%" }}>
      <CustomTextInput
        name={"Email Address"}
        placeholder={"Email address"}
        keyboardType={"email-address"}
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
        text={"Sign In"}
        entering={FadeInDown.delay(600)}
        onPress={async () => {
          const res = await Login(userData.email, userData.password);
          if (res) console.log(res.user.email);
        }}
      />

      <CustomText centerText>
        Don't have an account?{" "}
        {Bold("Sign Up", () => router.navigate("/user/SignUp"))}
      </CustomText>
    </Container>
  );
};

export default SignIn;
