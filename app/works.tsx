
import { Heading, Center, Divider, Text, Button, ButtonText, ButtonIcon, AddIcon, ScrollView, RefreshControl, VStack, HStack, Input, InputField, InputIcon, Select, SelectTrigger, SelectInput, SelectIcon, Icon, ChevronDownIcon, SelectContent, SelectDragIndicator, SelectItem } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"
import firestore from "@react-native-firebase/firestore"
import { CustomerType } from "@/types";

import { View } from "@gluestack-ui/themed";
import CustomerListItem from "@/components/CustomerListItem";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { createCustomer } from "@/utils/helpers";
import Toast from "react-native-toast-message";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import WorkListItem from "@/components/WorkListItem";




export default function Works() {

  const [data, setData] = useState<any>([]);
  const collectionName = 'works';


  // const getData = async () => {
  //   try {
  //     const querySnapshot = await firestore().collection(collectionName).get();
  //     const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  //     // setData(newData);
  //     setData(newData.sort((a, b) => (b?.intakeDate || "").localeCompare(a?.intakeDate || "")));

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  useEffect(() => {
    const unsubscribe = firestore().collection(collectionName).onSnapshot(querySnapshot => {
      const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(newData.sort((a: any, b: any) => (a?.names || "").localeCompare(b?.names || "")));
    }, error => {
      console.error(error);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when the component unmounts
  }, [collectionName]);

  const renderItem = ({ item }: { item: CustomerType }) => (
    <WorkListItem data={item} />

  );





  return (
    <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>

      <Input>
        <InputField placeholder="Search Works...." />
      </Input>

      <FlatList
        style={{ paddingVertical: 20 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={customer => customer.id}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "gray", margin: 6 }} />}
        ListFooterComponent={<View mb={100} />}
      />




    </SafeAreaView>
  );
}
