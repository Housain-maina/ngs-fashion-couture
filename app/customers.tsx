
import { Heading, Center, Divider, Text, Button, ButtonText, ButtonIcon, AddIcon, ScrollView, RefreshControl, VStack, HStack, Input, InputField, InputIcon } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"
import firestore from "@react-native-firebase/firestore"
import { CustomerType } from "@/types";

import { View } from "@gluestack-ui/themed";
import CustomerListItem from "@/components/CustomerListItem";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";



export default function Customers() {

  const [data, setData] = useState<CustomerType[]>([]); // Array to store fetched data
  const collectionName = 'customers'; // Replace with your collection name


  const getData = async () => {
    try {
      const querySnapshot = await firestore().collection(collectionName).get();
      const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      // setData(newData);
      setData(newData.sort((a, b) => (a.names || "").localeCompare(b.names || "")));

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore().collection(collectionName).onSnapshot(querySnapshot => {
      const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      // setData(newData);
      setData(newData.sort((a, b) => (a.names || "").localeCompare(b.names || "")));

    }, error => {
      console.error(error);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when the component unmounts
  }, [collectionName]);

  const renderItem = ({ item }: { item: CustomerType }) => (
    <CustomerListItem data={item} />

  );




  return (
    <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>
      <Input>
        <InputField placeholder="Search Customers...." />
      </Input>

      <FlatList
        style={{ marginTop: 25 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={customer => customer.id}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "gray", marginVertical: 6 }} />}
      />
      <TouchableOpacity style={{
        backgroundColor: "green",
        padding: 12,
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 360
      }}>
        <Entypo name="plus" color="white" size={20} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}
