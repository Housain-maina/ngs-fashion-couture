import { Text, Center, Heading, Divider, ScrollView, Button, ButtonText, ButtonSpinner, HStack, VStack } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore"


export default function Home() {

  const [worksCount, setWorksCount] = useState(0)
  const [customersCount, setCustomersCount] = useState(0)
  const [outstandingPayment, setOutstandingPayment] = useState(0)
  const [nonCollectedWorks, setNonCollectedWorks] = useState(0)

  useEffect(() => {
    firestore().collection('works').where("done", "!=", true).get().then(querySnapshot => {
      const totalDocs = querySnapshot.size;
      setWorksCount(totalDocs)
    });

    firestore().collection('works').where("done", "==", true).where("collected", "!=", true).get().then(querySnapshot => {
      const totalDocs = querySnapshot.size;
      setNonCollectedWorks(totalDocs)
    });

    firestore().collection('works').get().then(querySnapshot => {
      querySnapshot.forEach(work => {

        const data = work.data()
        if (Number(data?.amountPaid) < Number(data?.price)) {
          setOutstandingPayment(outstandingPayment + (Number(data?.price) - Number(data?.amountPaid)))
        }
      })

    });
    firestore().collection('customers').get().then(querySnapshot => {
      const totalDocs = querySnapshot.size;
      setCustomersCount(totalDocs)
    });

  }, [])




  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
      <Tabs.Screen options={{
        headerRight: () => <TouchableOpacity onPress={() => auth().signOut()}><AntDesign name="logout" color="red" size={20} /></TouchableOpacity>,
        headerRightContainerStyle: {
          paddingRight: 13
        }
      }} />
      <ScrollView>

        <VStack space="xl">
          <Center bgColor="green" py="$8" borderRadius="$md">
            <VStack alignItems="center">
              <Heading color="white">₦{outstandingPayment}</Heading>
              <Text color="white">Outstanding Payment</Text>
            </VStack>
          </Center>
          <Center bgColor="$lightBlue600" py="$8" borderRadius="$md">
            <VStack alignItems="center">
              <Heading color="white">{worksCount}</Heading>
              <Text color="white">Works Not Done</Text>
            </VStack>
          </Center>

          <Center bgColor="gray" py="$8" borderRadius="$md">
            <VStack alignItems="center">
              <Heading color="white">{customersCount}</Heading>
              <Text color="white">Customers</Text>
            </VStack>
          </Center>

          <Center bgColor="$amber600" py="$8" borderRadius="$md">
            <VStack alignItems="center">
              <Heading color="white">{nonCollectedWorks}</Heading>
              <Text color="white">Works Done but Not Collected</Text>
            </VStack>
          </Center>

        </VStack>


      </ScrollView>

    </SafeAreaView >
  );
}
