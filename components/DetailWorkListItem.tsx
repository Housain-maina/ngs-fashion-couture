import React, { useMemo, useState } from 'react'
import { CustomerType } from '@/types'
import { Center, Heading, HStack, Input, InputField, Select, SelectItem, View, VStack } from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { ActivityIndicator, Touchable, TouchableOpacity, TouchableOpacityBase } from 'react-native'
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons'
import Modal from "react-native-modal";
import { Button } from '@gluestack-ui/themed'
import { ButtonText } from '@gluestack-ui/themed'
import { deleteCustomer, updateCustomer } from '@/utils/helpers'
import Toast from "react-native-toast-message";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { Link, useRouter } from 'expo-router'



const DetailWorkListItem = ({ data }: { data: any }) => {
    const router = useRouter()



    return (
        <>
            <TouchableOpacity onPress={() => router.navigate({
                pathname: `/works/${data?._id}`,
                params: { customerId: data?.customer?._id, customerNames: data?.customer?.names, customerPhoneNumber: data?.customer?.phoneNumber, customerGender: data?.customer?.gender, ...data }
            })}
            // style={{ backgroundColor: "#cbd5e1", borderRadius: 7, paddingVertical: 5, paddingHorizontal: 15 }}
            >

                <HStack alignItems="center" space='md'>

                    <View>
                        <Text size="xs">Done: {data?.done ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />} {" "} Collected: {data?.collected ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />} {" "} Paid: {data?.price === data?.amountPaid ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />}</Text>
                        <Text size="md">{data?.intakeDate}   -   {data?.collectionDate}</Text>
                    </View>

                </HStack>
            </TouchableOpacity>


        </>
    )
}

export default DetailWorkListItem