import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
 const [fontsLoaded, error] = useFonts({ 
  "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
  "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
  "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
  "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
   });


  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
      throw error;
    }
    
    if (fontsLoaded) {
      console.log('Fonts loaded successfully!');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

    // ⭐️ ВАЖНО: Добавьте эту проверку!
  if (!fontsLoaded) {
    return null; // или <LoadingComponent />
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
