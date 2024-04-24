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



const WorkListItem = ({ data }: { data: any }) => {

    const router = useRouter()

    return (
        <>
            <TouchableOpacity onPress={() => router.navigate({
                pathname: "/addWork", params: {
                    id: data.customerId,
                    names: data.names
                }
            })}>

                <HStack alignItems="center" space='md'>
                    <FontAwesome5 name="tshirt" color="gray" size={22} />
                    <View>
                        <Heading size="sm" fontWeight="$normal">{data.names}</Heading>
                        <Text size="xs">Done: {data?.done ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />} {" "} Collected: {data?.collected ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />} {" "} Paid: {data?.price === data?.amountPaid ? <Ionicons name='checkbox' color="green" /> : <Ionicons name='close' color="red" />}</Text>
                    </View>

                </HStack>
            </TouchableOpacity>


        </>
    )
}

export default WorkListItem