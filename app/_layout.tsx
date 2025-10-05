import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    //Google fonts
    OswaldMedium: require("../assets/fonts/Oswald-Medium.ttf"),
    PacificoRegular: require("../assets/fonts/Pacifico-Regular.ttf"),
    SpaceMonoRegular: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SUSERegular: require("../assets/fonts/SUSE-Regular.ttf"),

    //Icon fonts
    ...AntDesign.font,
    ...FontAwesome5.font,
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading Taskmaker...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
