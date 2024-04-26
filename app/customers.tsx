
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




export default function Customers() {

  const [data, setData] = useState<CustomerType[] | any>([]);
  const collectionName = 'customers';


  useEffect(() => {
    const unsubscribe = firestore().collection(collectionName).onSnapshot(querySnapshot => {
      const newData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(newData.sort((a: any, b: any) => (a.names || "").localeCompare(b.names || "")));

    }, error => {
      console.error(error);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when the component unmounts
  }, [collectionName]);

  const renderItem = ({ item }: { item: CustomerType }) => (
    <CustomerListItem data={item} />

  );

  const [isCreating, setIsCreating] = useState(false)

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const [names, setNames] = useState("")
  const [gender, setGender] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")


  const handleCreateModalClose = () => {
    return setCreateModalVisible(!isCreateModalVisible)
  }



  const handleCreateCustomer = async () => {
    setIsCreating(true)

    await createCustomer({ names: names, gender: gender, phoneNumber })
    setNames("")
    setPhoneNumber("")
    setGender("")

    setIsCreating(false)
    Toast.show({
      type: "success",
      text1: "New Customer Saved!"
    })
    return handleCreateModalClose()
  }


  const genderButtons: RadioButtonProps[] = useMemo(() => ([
    {
      id: 'male',
      label: 'Male',
      value: 'male'
    },
    {
      id: 'female',
      label: 'Female',
      value: 'female'
    }
  ]), []);




  return (
    <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>

      <FlatList
        style={{ paddingVertical: 20 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={customer => customer.id}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "gray", margin: 6 }} />}
        ListFooterComponent={<View mb={100} />}
      />
      <TouchableOpacity style={{
        backgroundColor: "green",
        padding: 12,
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 360
      }}
        onPress={() => setCreateModalVisible(!isCreateModalVisible)}
      >
        <Entypo name="plus" color="white" size={30} />
      </TouchableOpacity>

      <Modal isVisible={isCreateModalVisible} backdropOpacity={0.8} onBackdropPress={handleCreateModalClose}>
        <View style={{ backgroundColor: "white", padding: "10%", borderRadius: 10 }}>
          <TouchableOpacity onPress={handleCreateModalClose} style={{
            position: "absolute",
            right: 15,
            top: 15
          }}>
            <Ionicons name='close' size={22} />
          </TouchableOpacity>

          <VStack space="md">
            <Heading fontWeight='$semibold'>Add New Customer</Heading>
            <Input>
              <InputField placeholder='Full Name' value={names} onChangeText={setNames} />
            </Input>
            <Input>
              <InputField placeholder='Phone Number' keyboardType='phone-pad' type='text' value={phoneNumber} onChangeText={setPhoneNumber} />
            </Input>

            <VStack>
              <Text>Gender</Text>
              <RadioGroup
                radioButtons={genderButtons}
                onPress={setGender}
                selectedId={gender}
                layout="row"
              />
            </VStack>


            <Button bgColor={!names || !phoneNumber || !gender ? "gray" : "$primary500"} onPress={handleCreateCustomer} mt="$5">
              {isCreating ? <ActivityIndicator color="white" /> :
                <ButtonText>
                  Add Customer
                </ButtonText>
              }
            </Button>

          </VStack>
        </View>
      </Modal >

    </SafeAreaView>
  );
}
