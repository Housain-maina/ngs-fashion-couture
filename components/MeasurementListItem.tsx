import React, { useMemo, useState } from 'react'
import { Center, Heading, HStack, Input, InputField, Select, SelectItem, View, VStack } from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { ActivityIndicator, Touchable, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import { Entypo, Ionicons } from '@expo/vector-icons'
import Modal from "react-native-modal";
import { Button } from '@gluestack-ui/themed'
import { ButtonText } from '@gluestack-ui/themed'
import { deleteCustomer, updateCustomer } from '@/utils/helpers'
import Toast from "react-native-toast-message";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { FemaleMeasurementType, MaleMeasurementType } from '@/types'



const MeasurementListItem = ({ data }: { data: MaleMeasurementType | FemaleMeasurementType }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    // const [selectedCustomer, setSelectedCustomer] = useState<MeasurementType | null>(null)
    const [names, setNames] = useState(data?.names)
    const [gender, setGender] = useState(data?.gender)
    const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeletingCustomer, setIsDeletingCustomer] = useState(false)


    const handleModalClose = () => {
        return setModalVisible(!isModalVisible)
    }


    const handleCustomerSave = async () => {
        setIsSaving(true)
        const updates = { names, gender, phoneNumber };
        await updateCustomer(data?.id, updates)
        setIsSaving(false)
        Toast.show({
            type: "success",
            text1: "Customer Saved!"
        })
        return handleModalClose()
    }

    const handleCustomerDelete = async () => {
        setIsDeletingCustomer(true)

        await deleteCustomer(data?.id)
        setIsDeletingCustomer(false)
        Toast.show({
            type: "success",
            text1: "Customer Deleted!"
        })
        return handleModalClose()
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
        <>
            <TouchableOpacity onPress={() => {
                setModalVisible(!isModalVisible);
                // setSelectedCustomer({ ...data })
            }}>

                <HStack alignItems="center" space='md'>
                    <Ionicons name="person-circle" size={40} color="gray" />
                    <VStack>
                        <Heading size="sm" fontWeight="$normal">{data.names}</Heading>
                        <Text size='xs'>{data.phoneNumber}</Text>
                    </VStack>
                </HStack>
            </TouchableOpacity>
            <Modal isVisible={isModalVisible} backdropOpacity={0.8} onBackdropPress={handleModalClose}>
                <View style={{ backgroundColor: "white", padding: "10%", borderRadius: 10 }}>
                    <TouchableOpacity onPress={handleModalClose} style={{
                        position: "absolute",
                        right: 15,
                        top: 15
                    }}>
                        <Ionicons name='close' size={22} />
                    </TouchableOpacity>

                    <VStack space="md">
                        <Heading fontWeight='$semibold'>Customer Information</Heading>
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

                        <VStack space="xs" mt={20}>
                            <Button bgColor="green" onPress={handleCustomerSave}>
                                {isSaving ? <ActivityIndicator color="white" /> :
                                    <ButtonText>
                                        Save
                                    </ButtonText>
                                }
                            </Button>
                            <Button bgColor="red" onPress={handleCustomerDelete}>
                                {isDeletingCustomer ? <ActivityIndicator color="white" /> :
                                    <ButtonText>
                                        Delete
                                    </ButtonText>
                                }
                            </Button>
                        </VStack>
                    </VStack>
                </View>
            </Modal >

        </>
    )
}

export default MeasurementListItem