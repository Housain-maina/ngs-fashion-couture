
import { Heading, Center, Divider, Text, Button, ButtonText, ButtonIcon, AddIcon, ScrollView, RefreshControl, VStack, HStack, Input, InputField, InputIcon, Select, SelectTrigger, SelectInput, SelectIcon, Icon, ChevronDownIcon, SelectContent, SelectDragIndicator, SelectItem } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons"
import firestore from "@react-native-firebase/firestore"
import { CustomerType, FemaleMeasurementType, MaleMeasurementType } from "@/types";

import { View } from "@gluestack-ui/themed";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { createCustomer } from "@/utils/helpers";
import Toast from "react-native-toast-message";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import MeasurementListItem from "@/components/MeasurementListItem";




export default function Measurements() {

  const [data, setData] = useState<MaleMeasurementType[] | FemaleMeasurementType[]>([]);
  const collectionName = 'measurements';


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

  const renderItem = ({ item }: { item: MaleMeasurementType | FemaleMeasurementType }) => (
    <MeasurementListItem data={item} />

  );

  const [isCreating, setIsCreating] = useState(false)

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  const [names, setNames] = useState("")
  const [gender, setGender] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")


  const handleCreateModalClose = () => {
    return setCreateModalVisible(!isCreateModalVisible)
  }


  return (
    <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>
      <Input>
        <InputField placeholder="Search Measurements...." />
      </Input>

      <FlatList
        style={{ marginTop: 25 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={customer => customer.id}
        ItemSeparatorComponent={() => <View style={{ height: 0.5, backgroundColor: "gray", margin: 6 }} />}
      />

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
            {/* <Heading fontWeight='$semibold'>Add New Customer</Heading>
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
            </Button> */}

          </VStack>
        </View>
      </Modal >

    </SafeAreaView>
  );
}
