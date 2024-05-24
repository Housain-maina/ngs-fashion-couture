import { ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { Stack, Tabs, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CustomerType, FemaleMeasurementType, MaleMeasurementCreateType, MaleMeasurementType } from '@/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText, HStack, Input, ScrollView, View, VStack } from '@gluestack-ui/themed';
import { InputField } from '@gluestack-ui/themed';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import { updateCustomer } from '@/utils/helpers';
import Toast from 'react-native-toast-message';
import { Text } from '@gluestack-ui/themed';
import client from '@/sanityClient';
import WorkListItem from '@/components/WorkListItem';
import DetailWorkListItem from '@/components/DetailWorkListItem';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Heading } from '@gluestack-ui/themed';
import ExpoCheckbox from 'expo-checkbox/build/ExpoCheckbox';
import Modal from "react-native-modal";


const CustomerId = () => {
    const { customerId, gender: sourceGender, names: sourceNames, phoneNumber: sourcePhoneNumber } = useLocalSearchParams<CustomerType | any>();
    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)


    const [names, setNames] = useState<string>(sourceNames)
    const [gender, setGender] = useState<string>(sourceGender)
    const [phoneNumber, setPhoneNumber] = useState<string>(sourcePhoneNumber)

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

    const [isSaving, setIsSaving] = useState<boolean>(false)

    const [customerWorks, setCustomerWorks] = useState<any>(null)

    const handleCustomerSave = async () => {
        setIsSaving(true)
        const updates = { names, gender, phoneNumber };
        await updateCustomer(customerId, updates)
        await updateCreateMeasurement()
        setIsSaving(false)
        Toast.show({
            type: "success",
            text1: "Customer Saved!",

        })

    }

    const [maleState, setMaleState] = useState<any>({
        _type: "measurement", customer: {
            _type: "reference",
            _ref: customerId,
        }
    })
    const [femaleState, setFemaleState] = useState<any>({
        _type: "measurement", customer: {
            _type: "reference",
            _ref: customerId,
        }
    })
    const [measurementId, setMeasurementId] = useState<any>(null)



    const fetchMeasurement = async () => {
        await client.fetch(`*[_type == "measurement" && references("${customerId}")]`)
            .then((data: any) => {
                if (data[0]) {
                    setMeasurementId(data[0]._id)
                }


                if (gender === "male" && data[0]) {

                    return setMaleState({
                        S: data[0]?.S,
                        H: data[0]?.H,
                        N: data[0]?.N,
                        SL: data[0]?.SL,
                        FR: data[0]?.FR,
                        TL: data[0]?.TL,
                        Lap: data[0]?.Lap,
                        FW: data[0]?.FW,
                        Links: data[0]?.Links,
                        HK: data[0]?.HK,
                        BBR: data[0]?.BBR,
                    })


                }
                if (sourceGender === "female" && data[0]) {


                    return setFemaleState({
                        Armhole: data[0]?.Armhole,
                        Shoulder: data[0]?.Shoulder,
                        Bost: data[0]?.Bost,
                        UnderBost: data[0]?.UnderBost,
                        BostPoint: data[0]?.BostPoint,
                        HaveCut: data[0]?.HaveCut,
                        Neeple: data[0]?.Neeple,
                        BlauseLength: data[0]?.BlauseLength,
                        SkirtHips: data[0]?.SkirtHips,
                        SkirtLength: data[0]?.SkirtLength,
                        GwonLength: data[0]?.GwonLength,
                        SlipLength: data[0]?.SlipLength,
                        RoundSlip: data[0]?.RoundSlip,
                    })
                }
            })
            .catch((error) => {
                console.error("Error fetching measurement:", error);
            });

    }

    const fetchCustomerWorks = async () => {
        await client.fetch(`*[_type == "work" && references("${customerId}")]{..., customer -> {names, gender, phoneNumber, _id}} | order(_createdAt desc)`).then((data) => setCustomerWorks(data)).catch(err => console.error("error fetching customer works"))

    }

    const updateCreateMeasurement = async () => {
        if (measurementId) {

            try {
                return await client
                    .patch(measurementId)
                    .set(gender === "male" ? { ...maleState } : { ...femaleState })
                    .commit();
            } catch (error) {
                return console.error("Error updating measurement:", error);
            }
        }

        try {
            setMaleState({ ...maleState })
            setFemaleState({ ...femaleState })

            return await client.create(gender === "male" ? { ...maleState } : { ...femaleState }).then((res) => setMeasurementId(res._id))


        } catch (error) {
            console.error("Error creating measurement:", error);
        }

    }



    useFocusEffect(
        useCallback(() => {
            setIsFetchingData(true)
            fetchMeasurement()
            fetchCustomerWorks()
            setIsFetchingData(false)

            return () => { }
        }, [])
    );
    const [isCreating, setIsCreating] = useState(false)

    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

    const [price, setPrice] = useState("")
    const [amountPaid, setAmountPaid] = useState("0")
    const [intakeDate, setIntakeDate] = useState((new Date().toJSON().slice(0, 10)).toString())
    const [collectionDate, setCollectionDate] = useState((new Date().toJSON().slice(0, 10)).toString())
    const [done, setDone] = useState(false)
    const [collected, setCollected] = useState(false)


    const handleCreateModalClose = () => {
        return setCreateModalVisible(!isCreateModalVisible)
    }

    const handleAddWork = async () => {
        setIsCreating(true)

        await client.create({
            _type: "work", price: price, intakeDate: intakeDate, collected: collected, done: done, amountPaid: amountPaid, collectionDate: collectionDate, customer: {
                _type: "reference",
                _ref: customerId
            }
        })
        await fetchCustomerWorks()
        setIsCreating(false)
        setCreateModalVisible(false)
    }

    return (
        <SafeAreaView style={{ paddingHorizontal: 20, flex: 1 }}>
            <TouchableOpacity style={{
                backgroundColor: "green",
                position: "absolute",
                bottom: 20,
                right: 20,
                borderRadius: 360,
                zIndex: 99,
                borderColor: "white",
                borderWidth: 1,
                padding: 14

            }}
                onPress={() => setCreateModalVisible(!isCreateModalVisible)}
            >
                <HStack alignItems='center' space='xs'>
                    <Entypo name="plus" color="white" size={20} />
                    <Text color="white" size='md'>Add Work</Text>
                </HStack>
            </TouchableOpacity>
            <Stack.Screen options={{ headerTitle: `Customer - ${names}` }} />
            {isFetchingData ? (
                <View>
                    <ActivityIndicator size={50} />
                </View>

            ) : (

                <ScrollView overScrollMode='never' showsVerticalScrollIndicator={false}>

                    <Modal isVisible={isCreateModalVisible} backdropOpacity={0.8} onBackdropPress={handleCreateModalClose} style={{ zIndex: 99 }}>
                        <View style={{ backgroundColor: "white", padding: "10%", borderRadius: 10 }}>
                            <TouchableOpacity onPress={handleCreateModalClose} style={{
                                position: "absolute",
                                right: 15,
                                top: 15
                            }}>
                                <Ionicons name='close' size={22} />
                            </TouchableOpacity>
                            <VStack space="md">
                                <Text textAlign='center' fontWeight="$bold" size="md" my="$5">Add Work for {names}</Text>
                                <HStack space='lg'>
                                    <VStack>
                                        <Text fontWeight="$bold" size="sm">Price</Text>
                                        <Input width="$32">
                                            <InputField fontSize={14} keyboardType='decimal-pad' value={price} onChangeText={setPrice} />
                                        </Input>
                                    </VStack>
                                    <VStack>
                                        <Text fontWeight="$bold" size="sm">Amount Paid</Text>
                                        <Input width="$32">
                                            <InputField fontSize={14} keyboardType='decimal-pad' value={amountPaid} onChangeText={setAmountPaid} />
                                        </Input>
                                    </VStack>

                                </HStack>
                                <HStack space="lg">

                                    <VStack>
                                        <Text fontWeight="$bold" size="sm">Intake Date</Text>
                                        <Input width="$32">
                                            <InputField value={intakeDate} onChangeText={setIntakeDate} />
                                        </Input>
                                    </VStack>
                                    <VStack>
                                        <Text fontWeight="$bold" size="sm">Collection Date</Text>
                                        <Input width="$32">
                                            <InputField value={collectionDate} onChangeText={setCollectionDate} />

                                        </Input>
                                    </VStack>

                                </HStack>
                                <VStack space="md">
                                    <HStack space="sm" alignItems='center'>
                                        <ExpoCheckbox value={done} onValueChange={setDone} />
                                        <Text>Mark as Done</Text>
                                    </HStack>
                                    <HStack space="sm" alignItems='center'>
                                        <ExpoCheckbox value={collected} onValueChange={setCollected} />
                                        <Text>Mark as Collected</Text>
                                    </HStack>
                                </VStack>
                                <Button bgColor="green" onPress={handleAddWork}>
                                    {isCreating ? <ActivityIndicator color="white" /> :
                                        <ButtonText>
                                            Save Work
                                        </ButtonText>
                                    }
                                </Button>
                            </VStack>
                        </View>


                    </Modal>


                    <VStack space="4xl">

                        <VStack space="md">
                            <Text color='$green600'>Customer Information</Text>
                            <Input>
                                <InputField placeholder='Full Name' value={names} onChangeText={setNames} />
                            </Input>
                            <Input>
                                <InputField placeholder='Phone Number' value={phoneNumber} onChangeText={setPhoneNumber} />
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


                            {/* <Button bgColor="green" onPress={handleCustomerSave}>
                            {isSaving ? <ActivityIndicator color="white" /> :
                                <ButtonText>
                                    Save
                                </ButtonText>
                            }
                        </Button> */}
                        </VStack>
                        <VStack space="md">
                            <Text color='$green600'>Measurement Information</Text>
                            {gender === "male" ? (

                                <VStack space='4xl' mb={20}>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>S</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='S' value={maleState?.S} onChangeText={(value) => setMaleState({ ...maleState, "S": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>H</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='H' value={maleState?.H} onChangeText={(value) => setMaleState({ ...maleState, "H": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>N</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='N' value={maleState?.N} onChangeText={(value) => setMaleState({ ...maleState, "N": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>SL</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='SL' value={maleState?.SL} onChangeText={(value) => setMaleState({ ...maleState, "SL": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>FR</Text>
                                            <Input width="$24" >
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='FR' value={maleState?.FR} onChangeText={(value) => setMaleState({ ...maleState, "FR": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>TL</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='TL' value={maleState?.TL} onChangeText={(value) => setMaleState({ ...maleState, "TL": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Lap</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Lap' value={maleState?.Lap} onChangeText={(value) => setMaleState({ ...maleState, "Lap": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>FW</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='FW' value={maleState?.FW} onChangeText={(value) => setMaleState({ ...maleState, "FW": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Links</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Links' value={maleState?.Links} onChangeText={(value) => setMaleState({ ...maleState, "Links": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>HK</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='HK' value={maleState?.HK} onChangeText={(value) => setMaleState({ ...maleState, "HK": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>BBR</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='BBR' value={maleState?.BBR} onChangeText={(value) => setMaleState({ ...maleState, "BBR": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            ) : (
                                <VStack space='4xl' mb={20}>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Armhole</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Armhole' value={femaleState?.Armhole} onChangeText={(value) => setFemaleState({ ...femaleState, "Armhole": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Shoulder</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Shoulder' value={femaleState?.Shoulder} onChangeText={(value) => setFemaleState({ ...femaleState, "Shoulder": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Bost</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Bost' value={femaleState?.Bost} onChangeText={(value) => setFemaleState({ ...femaleState, "Bost": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Under Bost</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Under Bost' value={femaleState?.UnderBost} onChangeText={(value) => setFemaleState({ ...femaleState, "UnderBost": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Bost Point</Text>
                                            <Input width="$24" >
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Bost Point' value={femaleState?.BostPoint} onChangeText={(value) => setFemaleState({ ...femaleState, "BostPoint": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Have Cut</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Have Cut' value={femaleState?.HaveCut} onChangeText={(value) => setFemaleState({ ...femaleState, "HaveCut": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Neeple</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Neeple' value={femaleState?.Neeple} onChangeText={(value) => setFemaleState({ ...femaleState, "Neeple": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Blause Length</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Blause Length' value={femaleState?.BlauseLength} onChangeText={(value) => setFemaleState({ ...femaleState, "BlauseLength": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Skirt Hips</Text>
                                            <Input width="$24">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Skirt Hips' value={femaleState?.SkirtHips} onChangeText={(value) => setFemaleState({ ...femaleState, "SkirtHips": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Skirt Length</Text>
                                            <Input width="$32">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Skirt Length' value={femaleState?.SkirtLength} onChangeText={(value) => setFemaleState({ ...femaleState, "SkirtLength": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Gwon Length</Text>
                                            <Input width="$32">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Gwon Length' value={femaleState?.GwonLength} onChangeText={(value) => setFemaleState({ ...femaleState, "GwonLength": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                    <HStack space='lg'>
                                        <VStack>
                                            <Text size='sm'>Slip Length</Text>
                                            <Input width="$32">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Slip Length' value={femaleState?.SlipLength} onChangeText={(value) => setFemaleState({ ...femaleState, "SlipLength": value })} />
                                            </Input>
                                        </VStack>
                                        <VStack>
                                            <Text size='sm'>Round Slip</Text>
                                            <Input width="$32">
                                                <InputField fontSize={14} keyboardType='decimal-pad' placeholder='Round Slip' value={femaleState?.RoundSlip} onChangeText={(value) => setFemaleState({ ...femaleState, "RoundSlip": value })} />
                                            </Input>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            )}


                        </VStack>

                        <VStack space="md">
                            <Text color='$green600'>Works</Text>
                            {customerWorks?.length > 0 ? (
                                customerWorks?.map((work: any, index: number) => <View key={work?._id} bgColor='#cbd5e1' p="$3" borderRadius="$md"><DetailWorkListItem data={work} index={index} /></View>)
                            ) : (<Text>This customer does not have any work.</Text>)}


                        </VStack>



                        <Button bgColor="green" onPress={handleCustomerSave} mb={20}>
                            {isSaving ? <ActivityIndicator color="white" /> :
                                <ButtonText>
                                    Save
                                </ButtonText>
                            }
                        </Button>
                    </VStack>


                </ScrollView>
            )}

        </SafeAreaView>
    )
}

export default CustomerId