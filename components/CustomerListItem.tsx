import React, { useState } from 'react'
import { CustomerType } from '@/types'
import { Center, Heading, HStack, Input, InputField, Select, SelectItem, View, VStack } from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { ActivityIndicator, Touchable, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import { Entypo, Ionicons } from '@expo/vector-icons'
import Modal from "react-native-modal";
import { Button } from '@gluestack-ui/themed'
import { ButtonText } from '@gluestack-ui/themed'
import { addCustomer, updateCustomer } from '@/utils/helpers'


const CustomerListItem = ({ data }: { data: CustomerType }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    // const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null)
    const [names, setNames] = useState(data?.names)
    const [gender, setGender] = useState(data?.gender)
    const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber)
    const [isSaving, setIsSaving] = useState(false)

    const handleModalClose = () => {
        return setModalVisible(!isModalVisible)
    }

    const handleCustomerSave = async () => {
        setIsSaving(true)
        const updates = { names, gender, phoneNumber };
        await updateCustomer(data?.id, updates)
        setIsSaving(false)
        return handleModalClose()
    }
    const handleCustomerDelete = () => { }

    return (
        <>
            <TouchableOpacity onPress={() => {
                setModalVisible(!isModalVisible);
                // setSelectedCustomer({ ...data })
            }}>
                <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                        <Heading size="sm" fontWeight="$normal">{data.names}</Heading>
                        <Text size='xs'>+{data.phoneNumber}</Text>
                    </VStack>
                    <Entypo name="chevron-thin-right" size={20} color="gray" />
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

                        {/* <Select onValueChange={setGender}>
                            <SelectItem label='Male' value='male' />
                            <SelectItem label='Female' value='female' />
                        </Select> */}

                        <HStack space="md">
                            <Button bgColor="red" onPress={handleCustomerDelete}>
                                <ButtonText>
                                    Delete
                                </ButtonText>
                            </Button>
                            <Button bgColor="green" onPress={handleCustomerSave}>
                                {isSaving ? <ActivityIndicator color="white" /> :
                                    <ButtonText>
                                        Save
                                    </ButtonText>
                                }
                            </Button>
                        </HStack>
                    </VStack>
                </View>
            </Modal >
        </>
    )
}

export default CustomerListItem