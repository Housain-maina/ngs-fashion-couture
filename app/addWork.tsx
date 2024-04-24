import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useLocalSearchParams } from 'expo-router';
import { AddIcon, Box, Button, ButtonText, Center, Checkbox, CheckboxLabel, Heading, HStack, Input, InputField, VStack } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { ActivityIndicator, ScrollView } from 'react-native';
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






const AddWork = () => {
    const { id: customerId, names } = useLocalSearchParams();




    const [work, setWork] = useState<any>({
        intakeDate: (new Date().toJSON().slice(0, 10)).toString(),
        collectionDate: (new Date().toJSON().slice(0, 10)).toString(),
        customerId: customerId,
        names: names
    })
    const [measurement, setMeasurement] = useState<any>(null)
    const [customer, setCustomer] = useState<CustomerType | any>(null)
    const [workId, setWorkId] = useState<any>(null)

    const [isLoading, setIsLoading] = useState(true)



    useEffect(() => {
        firestore()
            .collection("works")
            .where("customerId", "==", customerId).get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    setWork({ ...work, ...querySnapshot.docs[0].data() })
                    setWorkId(querySnapshot.docs[0].id)
                } else {

                    return null
                }
            })
            .catch(error => {
                console.error("Error getting documents:", error);
            });

        firestore()
            .collection("measurements")
            .where("customerId", "==", customerId)
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    setMeasurement(querySnapshot.docs[0].data())
                    setWork({ ...work, measurementId: querySnapshot.docs[0].id })
                } else {

                    return null
                }
            })
            .catch(error => {
                console.error("Error getting documents:", error);
            });
        firestore()
            .collection("customers")
            .doc(customerId.toString())
            .get()
            .then(querySnapshot => {
                if (querySnapshot) {
                    setCustomer(querySnapshot.data())

                } else {

                    return null
                }
            })
            .catch(error => {
                console.error("Error getting documents:", error);
            });

        setIsLoading(false)
    }, [])



    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        if (workId) {
            try {
                const docRef = firestore().collection("works").doc(workId);
                await docRef.update(work);
                Toast.show({
                    type: "success",
                    text1: "Work Updated!",
                    text1Style: { color: "green" }
                })
            } catch (error) {
                console.error("Error updating work:", error);
            }
        } else {
            try {

                const newWork = await firestore().collection("works").add(work);
                setWorkId(newWork.id)
                Toast.show({
                    type: "success",
                    text1: "Work Created!",
                    text1Style: { color: "green" }
                })
            } catch (error) {
                console.error("Error creating work:", error);
            }

        }

        setIsSaving(false)
    }





    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
            {isLoading || !customer || !customerId ? <Center minHeight="$full">
                <ActivityIndicator size={50} />
            </Center> : (
                <>
                    <Tabs.Screen options={{ headerTitle: `Work - ${names}` }} />
                    <ScrollView showsVerticalScrollIndicator={false} overScrollMode='never'>

                        <VStack space='4xl' mb={20}>
                            <HStack space="xl">
                                {workId && (
                                    <QRCode
                                        value={`workId=${workId},customerId=${customerId},names=${names}`}
                                        logoBackgroundColor='transparent'
                                        size={140}
                                    />
                                )}
                                <VStack space="lg">

                                    <VStack>
                                        <Heading size="sm">Full Name</Heading>
                                        <Text style={{ textTransform: "capitalize" }}>{names}</Text>
                                    </VStack>
                                    <VStack>
                                        <Heading size="sm">Gender</Heading>
                                        <Text style={{ textTransform: "capitalize" }}>{customer?.gender}</Text>
                                    </VStack>
                                    <VStack>
                                        <Heading size="sm">Phone Number</Heading>
                                        <Text style={{ textTransform: "capitalize" }}>{customer?.phoneNumber}</Text>
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
                            <HStack space="4xl">



                                <Checkbox size="md" isInvalid={false} isDisabled={false} aria-label='Mark as Done' value={work?.done} onChange={value => setWork({ ...work, done: value })}>
                                    <CheckboxIndicator mr="$2">
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                    <CheckboxLabel>Mark as Done</CheckboxLabel>
                                </Checkbox>
                                <Checkbox size="md" isInvalid={false} isDisabled={false} aria-label='Collected' value={work?.collected} onChange={value => setWork({ ...work, collected: value })}>
                                    <CheckboxIndicator mr="$2">
                                        <CheckboxIcon as={CheckIcon} />
                                    </CheckboxIndicator>
                                    <CheckboxLabel>Collected</CheckboxLabel>
                                </Checkbox>

                            </HStack>

                            <VStack space="md">

                                <Heading>Measurement</Heading>
                                {measurement ? (

                                    <VStack space="xl">
                                        {customer?.gender === "male" ? (
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
                </>
            )}
        </SafeAreaView>
    )
}

export default AddWork