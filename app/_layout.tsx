// /app/_layout.tsx
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack />;
}
