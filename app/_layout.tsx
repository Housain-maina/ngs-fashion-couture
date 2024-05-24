import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useLayoutEffect, useState } from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { useColorScheme } from "@/components/useColorScheme";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo"
import { Redirect, Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Slot, Stack } from "expo-router"
import auth from '@react-native-firebase/auth';
import Toast from "react-native-toast-message";
import { store } from "@/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/slices/userSlice";


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "gluestack",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // useLayoutEffect(() => {
  //   setStyleLoaded(true);
  // }, [styleLoaded]);

  // if (!loaded || !styleLoaded) {
  //   return null;
  // }

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>

  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState<any>(null);
  const user = useSelector(selectUser)
  const disptach = useDispatch()

  SplashScreen.preventAutoHideAsync()

  // Handle user state changes
  function onAuthStateChanged(user: any) {

    disptach(setUser(user))


    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;



  SplashScreen.hideAsync()

  // if (!user?.email) return (
  //   <GluestackUIProvider config={config}>
  //     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
  //       <Stack
  //         screenOptions={{
  //           // Disable the static render of the header on web
  //           // to prevent a hydration error in React Navigation v6.
  //           // headerShown: useClientOnlyValue(false, true),

  //         }}
  //         initialRouteName="login"
  //       >
  //         <Stack.Screen
  //           name="login"
  //           options={{
  //             title: "Log In",
  //             headerShown: false,
  //           }}
  //         />

  //       </Stack>
  //     </ThemeProvider>
  //   </GluestackUIProvider>
  // )
  // if (!user?.email) return (<Redirect href="/login" />)


  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="login">
          <Stack.Screen
            name="login"
            options={{
              title: "Log In",
              headerShown: false,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="[customerId]" options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
