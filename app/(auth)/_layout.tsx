import { images } from "@/constants";
import { Slot } from "expo-router";
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function _layout() {
const screenHeight = Dimensions.get("screen").height;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: screenHeight / 2.3, position: "relative" }}>
          <ImageBackground
            source={images.loginGraphic}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: -60,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Image
              source={images.logo}
              style={{ width: 160, height: 160, resizeMode: "contain" }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            marginTop: 80,
            paddingBottom: 40,
          }}
        >
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}