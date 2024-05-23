import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, Tabs, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { AddIcon, Box, Button, ButtonText, Center, Checkbox, CheckboxLabel, Heading, HStack, Input, InputField, VStack } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getMeasurement } from '@/utils/helpers';
import { CustomerType, FemaleMeasurementCreateType, FemaleMeasurementType, MaleMeasurementCreateType, MaleMeasurementType } from '@/types';
import firestore from "@react-native-firebase/firestore";
import Toast from 'react-native-toast-message';
import { CheckboxIndicator } from '@gluestack-ui/themed';
import { CheckboxIcon } from '@gluestack-ui/themed';
import { CheckIcon } from '@gluestack-ui/themed';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import { Ionicons } from '@expo/vector-icons';
import { ButtonIcon } from '@gluestack-ui/themed';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from 'expo-sharing';
import { Checkbox as ExpoCheckbox } from "expo-checkbox"
import client from '@/sanityClient';




const AddWork = () => {
    const { workId, intakeDate, collectionDate, amountPaid, price, collected, done, customerId, customerNames, customerGender, customerPhoneNumber } = useLocalSearchParams();



    const navigation = useNavigation();



    const [work, setWork] = useState<any>({
        intakeDate: intakeDate,
        collectionDate: collectionDate,
        amountPaid: amountPaid,
        collected: collected,
        done: done,
        price: price
    })

    const [measurement, setMeasurement] = useState<any>(null)

    const [hasPermissions, setHasPermissions] = useState(false);
    const [isLoading, setIsLoading] = useState(false)



    const fetchData = async () => {
        setIsLoading(true)
        try {
            await client.fetch(`*[_type == "measurement" && references("${customerId}")]`)
                .then(data => setMeasurement({ ...data[0] }))
                .catch(error => {
                    console.error("Error getting data:", error);
                });



        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false)
    };


    useFocusEffect(
        useCallback(() => {
            (async () => { setHasPermissions((await MediaLibrary.requestPermissionsAsync()).granted) })()

            fetchData()

            return () => { }
        }, [])
    );


    const [isSaving, setIsSaving] = useState(false)
    const [QRref, setQRref] = useState<any>();


    const saveQRCode = () => {
        if (!hasPermissions || !QRref) return

        QRref?.toDataURL(async (data: any) => {
            const QRCodeImg = FileSystem.documentDirectory + "QRCode.png";
            await FileSystem.writeAsStringAsync(QRCodeImg, data, { encoding: FileSystem.EncodingType.Base64 })
            MediaLibrary.saveToLibraryAsync(QRCodeImg)
            // .then(() => Toast.show({
            //     text1: "QR Code saved to gallery",
            //     text1Style: { color: "green" },
            //     type: "success"
            // }))
            // .catch(console.error)
            await Sharing.shareAsync(QRCodeImg, {
                dialogTitle: "Shar QR Code"
            })
        })
    }


    const handleSave = async () => {

        setIsSaving(true)


        await client
            .patch(workId)
            .set({ ...work })
            .commit()

        setIsSaving(false)
    }


    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>

            <Stack.Screen options={{
                headerTitle: `Work - ${customerNames}`
            }} />

            <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'>

                <VStack space='4xl' my={20}>
                    <HStack space="xl">
                        {workId && (
                            <VStack alignItems='center' space='md'>

                                <QRCode
                                    value={JSON.stringify({
                                        workId,
                                    })}
                                    logoBackgroundColor='transparent'
                                    size={140}
                                    getRef={setQRref}
                                />
                                <TouchableOpacity onPress={saveQRCode}>
                                    <HStack alignItems='center' space='xs'>
                                        <Ionicons name='share' color="green" size={20} />
                                        <Text>Share</Text>
                                    </HStack>
                                </TouchableOpacity>
                            </VStack>
                        )}
                        <VStack space="lg">

                            <VStack>
                                <Heading size="sm">Full Name</Heading>
                                <Text style={{ textTransform: "capitalize" }}>{customerNames}</Text>
                            </VStack>
                            <VStack>
                                <Heading size="sm">Gender</Heading>
                                <Text style={{ textTransform: "capitalize" }}>{customerGender}</Text>
                            </VStack>
                            <VStack>
                                <Heading size="sm">Phone Number</Heading>
                                <Text style={{ textTransform: "capitalize" }}>{customerPhoneNumber}</Text>
                            </VStack>
                        </VStack>
                    </HStack>

                    <HStack space='lg'>
                        <VStack>
                            <Heading size="sm">Price</Heading>
                            <Input width="$32">
                                <InputField keyboardType='decimal-pad' value={work?.price} onChangeText={text => setWork({ ...work, price: text })} />
                            </Input>
                        </VStack>
                        <VStack>
                            <Heading size="sm">Amount Paid</Heading>
                            <Input width="$32">
                                <InputField keyboardType='decimal-pad' value={work?.amountPaid} onChangeText={text => setWork({ ...work, amountPaid: text })} />
                            </Input>
                        </VStack>

                    </HStack>
                    <HStack space="lg">

                        <VStack>
                            <Heading size="sm">Intake Date</Heading>
                            <Input width="$32">
                                <InputField value={work?.intakeDate} onChangeText={text => setWork({ ...work, intakeDate: text })} />
                            </Input>
                        </VStack>
                        <VStack>
                            <Heading size="sm">Collection Date</Heading>
                            <Input width="$32">
                                <InputField value={work?.collectionDate} onChangeText={text => setWork({ ...work, collectionDate: text })} />

                            </Input>
                        </VStack>

                    </HStack>
                    <HStack space="2xl">
                        <HStack space="sm" alignItems='center'>
                            <ExpoCheckbox value={work?.done} onValueChange={value => setWork({ ...work, done: value })} />
                            <Text>Mark as Done</Text>
                        </HStack>
                        <HStack space="sm" alignItems='center'>
                            <ExpoCheckbox value={work?.collected} onValueChange={value => setWork({ ...work, collected: value })} />
                            <Text>Mark as Collected</Text>
                        </HStack>
                    </HStack>

                    <VStack space="md">

                        <Text color='$green600'>Measurement Information</Text>
                        {measurement ? (

                            <VStack space="xl">
                                {customerGender === "male" ? (
                                    <>
                                        <HStack space="4xl">
                                            <VStack>
                                                <Heading>S</Heading>
                                                <Text>{measurement?.S}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>H</Heading>
                                                <Text>{measurement?.H}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>N</Heading>
                                                <Text>{measurement?.N}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>SL</Heading>
                                                <Text>{measurement?.SL}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>FR</Heading>
                                                <Text>{measurement?.FR}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>TL</Heading>
                                                <Text>{measurement?.TL}</Text>
                                            </VStack>

                                        </HStack>
                                        <HStack space="4xl">
                                            <VStack>
                                                <Heading>Lap</Heading>
                                                <Text>{measurement?.Lap}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>FW</Heading>
                                                <Text>{measurement?.FW}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>Links</Heading>
                                                <Text>{measurement?.Links}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>HK</Heading>
                                                <Text>{measurement?.HK}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>BBR</Heading>
                                                <Text>{measurement?.BBR}</Text>
                                            </VStack>
                                        </HStack>
                                    </>
                                ) : (
                                    <>
                                        <HStack space="4xl">
                                            <VStack>
                                                <Heading>B</Heading>
                                                <Text>{measurement?.B}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>W</Heading>
                                                <Text>{measurement?.W}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>L</Heading>
                                                <Text>{measurement?.L}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>H</Heading>
                                                <Text>{measurement?.H}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>N</Heading>
                                                <Text>{measurement?.N}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>HL</Heading>
                                                <Text>{measurement?.HL}</Text>
                                            </VStack>

                                        </HStack>
                                        <HStack space="4xl">
                                            <VStack>
                                                <Heading>SH</Heading>
                                                <Text>{measurement?.SH}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>UB</Heading>
                                                <Text>{measurement?.UB}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>WL</Heading>
                                                <Text>{measurement?.WL}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>HP</Heading>
                                                <Text>{measurement?.HP}</Text>
                                            </VStack>
                                            <VStack>
                                                <Heading>E</Heading>
                                                <Text>{measurement?.E}</Text>
                                            </VStack>
                                        </HStack>
                                    </>
                                )}
                            </VStack>
                        ) : <Text>This customer does not have measurement.</Text>}
                    </VStack>
                </VStack>

                <Button bgColor='green' style={{ marginTop: 10, marginBottom: 20 }} onPress={() => handleSave()}>
                    {isSaving ? <ActivityIndicator color="white" /> : <ButtonText>Save Work</ButtonText>}
                </Button>
            </ScrollView>


        </SafeAreaView>
    )
}

export default AddWork