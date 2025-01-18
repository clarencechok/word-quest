import { View } from "react-native";
import React from "react";
import { router, useGlobalSearchParams } from "expo-router";
import CustomButton from "../../src/components/CustomButton";
import { Logout } from "../../src/auth/handleAuth";
import Container from "../../src/components/Container";
import { CustomText } from "../../src/components/CustomText";
import { BounceIn } from "react-native-reanimated";

const Home = () => {
  const params = useGlobalSearchParams();

  return (
    <Container style={{ justifyContent: "space-evenly", padding: 15 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CustomText fontSize={50} centerText bold>
          Word Quest
        </CustomText>
      </View>

      <View style={{ gap: 15 }}>
        <CustomText fontSize={30} centerText>
          Select Game Mode
        </CustomText>

        <CustomButton
          text="Wordle"
          entering={BounceIn}
          onPress={() =>
            router.navigate({
              pathname: "/game/(mode)/Wordle",
              params: {
                words: params?.initialData,
              },
            })
          }
        />
        <CustomButton
          text="Timed Wordle"
          entering={BounceIn.delay(100)}
          onPress={() =>
            router.navigate({
              pathname: "/game/(mode)/TimedWordle",
              params: {
                words: params?.initialData,
              },
            })
          }
        />
        <CustomButton
          text="Grammar"
          entering={BounceIn.delay(200)}
          onPress={() =>
            router.navigate({
              pathname: "/game/(mode)/Grammar",
              params: {
                questions: params?.initialData,
              },
            })
          }
        />
      </View>

      <CustomButton
        text={"Logout"}
        parentStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={Logout}
        textStyle={{ color: "black" }}
        viewStyle={{ backgroundColor: "transparent" }}
      />
    </Container>
  );
};

export default Home;
