import { Text, Center, Heading, Divider, ScrollView, Button, ButtonText, ButtonSpinner } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import { useState } from "react";


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
      <ScrollView>


      </ScrollView>

    </SafeAreaView>
  );
}
