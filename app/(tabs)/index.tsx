import { Text, Center, Heading, Divider, ScrollView, Button, ButtonText, ButtonSpinner, HStack, VStack } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import { useCallback, useEffect, useState } from "react";
import { Tabs, useFocusEffect } from "expo-router";
import { TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore"
import client from "@/sanityClient";


export default function Home() {

  const [worksCount, setWorksCount] = useState(0)
  const [customersCount, setCustomersCount] = useState(0)
  const [outstandingPayment, setOutstandingPayment] = useState(0)
  const [nonCollectedWorks, setNonCollectedWorks] = useState(0)

  const fetchCustomers = async () => {

    const result = await client.fetch('*[_type == "customer"]');
    setCustomersCount(result.length)



  }

  const fetchWorks = async () => {

    await client.fetch('*[_type == "work"]').then(data => {
      setWorksCount(data.filter((item: any) => item?.done !== "true").length)
      setNonCollectedWorks(data.filter((item: any) => (item?.done === "true") && (item?.collected === false)).length)
      setOutstandingPayment(data.filter((item: any) => item?.amountPaid < item?.price).reduce((acc: any, curr: any) => acc + (curr.price - (curr.amountPaid || 0)), 0))
    })


  }

  useFocusEffect(
    useCallback(() => {

      fetchCustomers()
      fetchWorks()

      return () => { }
    }, [])
  );



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
              <Heading color="white">CFA {outstandingPayment.toLocaleString()}</Heading>
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
