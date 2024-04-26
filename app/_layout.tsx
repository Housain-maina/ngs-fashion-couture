import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { useColorScheme } from "@/components/useColorScheme";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo"
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Slot, Stack } from "expo-router"
import auth from '@react-native-firebase/auth';
import Toast from "react-native-toast-message";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} {...props} />;
}

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Handle user state changes
  function onAuthStateChanged(user: any) {

    setUser(user);

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;



  if (!user?.email) {
    return (
      <GluestackUIProvider config={config}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              // Disable the static render of the header on web
              // to prevent a hydration error in React Navigation v6.
              headerShown: useClientOnlyValue(false, true),
            }}
          >
            <Stack.Screen
              name="login"
              options={{
                title: "Log In",
                headerShown: false,

              }}

            />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    )
  }

  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Tabs
          screenOptions={{
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, true),


          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "NGS Fashion Couture",
              tabBarLabel: "Home",

              tabBarIcon: ({ color }) => <Entypo name="home" size={22} color={color} />,
            }}

          />

          <Tabs.Screen
            name="works"
            options={{
              title: "Works",

              tabBarIcon: ({ color }) => <FontAwesome5 name="tshirt" size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="measurements"
            options={{
              title: "Measurements",

              tabBarIcon: ({ color }) => <Entypo name="ruler" size={22} color={color} />,

              href: null
            }}
          />

          <Tabs.Screen
            name="scan"
            options={{
              title: "Scan",
              tabBarIcon: ({ color }) => <TabBarIcon name="camera" size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="customers"
            options={{
              title: "Customers",
              tabBarIcon: ({ color }) => <TabBarIcon name="users" size={22} color={color} />,
            }}
          />
          <Tabs.Screen
            name="login"
            options={{
              headerShown: false,
              title: "Log In",
              tabBarShowLabel: false,
              tabBarIcon: ({ color }) => <FontAwesome5 name="tshirt" size={22} color={color} />,
              href: null
            }}
          />

          <Tabs.Screen
            name="addMeasurement"
            options={{
              title: "Add Measurement",
              tabBarIcon: ({ color }) => <FontAwesome5 name="tshirt" size={22} color={color} />,
              href: null,

            }}
          />
          <Tabs.Screen
            name="addWork"
            options={{
              title: "Add Measurement",
              tabBarIcon: ({ color }) => <FontAwesome5 name="tshirt" size={22} color={color} />,
              href: null,

            }}
          />

        </Tabs>
        <Toast />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
