
import { Heading, Center, Divider, Text, Button, ButtonText, ButtonIcon, AddIcon, ScrollView, RefreshControl, VStack, HStack, Input, InputField, InputIcon, Select, SelectTrigger, SelectInput, SelectIcon, Icon, ChevronDownIcon, SelectContent, SelectDragIndicator, SelectItem } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"
import firestore from "@react-native-firebase/firestore"
import { CustomerType } from "@/types";

import { View } from "@gluestack-ui/themed";
import CustomerListItem from "@/components/CustomerListItem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { createCustomer } from "@/utils/helpers";
import Toast from "react-native-toast-message";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import WorkListItem from "@/components/WorkListItem";
import { useFocusEffect } from "expo-router";
import client from "@/sanityClient";




export default function Works() {

  const [data, setData] = useState<any>([]);

  const fetchWorks = async () => {

    const result = await client.fetch('*[_type == "work"] {..., customer -> {names, gender, phoneNumber, _id}} | order(_createdAt desc)');
    setData(result)

  }


  useFocusEffect(
    useCallback(() => {

      fetchWorks()

      return () => { }
    }, [])
  );




  const renderItem = ({ item }: { item: any }) => (
    <WorkListItem data={item} />

  );





  return (
    <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>

      {/* <Input>
        <InputField placeholder="Search Works...." />
      </Input> */}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={customer => customer._id}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "gray", margin: 6 }} />}
        ListFooterComponent={<View mb={100} />}
      />




    </SafeAreaView>
  );
}
