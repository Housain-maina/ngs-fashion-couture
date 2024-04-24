import { Text, Center, Heading, Divider, ScrollView, Button, ButtonText, ButtonSpinner } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import { useState } from "react";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";


export default function Home() {
  const user = firebase.auth().currentUser;
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await auth().signOut()
    setIsLoading(false)
  }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
      <Tabs.Screen options={{
        headerRight: () => <TouchableOpacity onPress={() => auth().signOut()}><AntDesign name="logout" color="red" size={20} /></TouchableOpacity>,
        headerRightContainerStyle: {
          paddingRight: 13
        }
      }} />
      <ScrollView>


      </ScrollView>

    </SafeAreaView >
  );
}
