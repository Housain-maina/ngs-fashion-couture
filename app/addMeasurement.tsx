import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useLocalSearchParams } from 'expo-router';
import { Button, ButtonText, HStack, Input, InputField, VStack } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { ActivityIndicator, ScrollView } from 'react-native';
import { getMeasurement } from '@/utils/helpers';
import { FemaleMeasurementCreateType, FemaleMeasurementType, MaleMeasurementCreateType, MaleMeasurementType } from '@/types';
import firestore from "@react-native-firebase/firestore";
import Toast from 'react-native-toast-message';



const AddMeasurement = () => {
    const { names, gender, id: customerId } = useLocalSearchParams();


    const [maleState, setMaleState] = useState<any>({ customerId: customerId })
    const [femaleState, setFemaleState] = useState<any>({ customerId: customerId })
    const [measurementId, setMeasurementId] = useState<any>(null)

    useEffect(() => {
        const query = firestore()
            .collection("measurements")
            .where("customerId", "==", customerId);

        query
            .get()
            .then(querySnapshot => {
                if (querySnapshot.size > 0) {
                    setMaleState({ ...maleState, ...querySnapshot.docs[0].data() })
                    setFemaleState({ ...femaleState, ...querySnapshot.docs[0].data() })
                    setMeasurementId(querySnapshot.docs[0].id)
                } else {

                    return null
                }
            })
            .catch(error => {
                console.error("Error getting documents:", error);
            });

    }, [])

    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        if (measurementId) {
            try {

                const docRef = firestore().collection("measurements").doc(measurementId);
                await docRef.update(gender === "male" ? maleState : femaleState);
                Toast.show({
                    type: "success",
                    text1: "Measurement Updated!",
                    text1Style: { color: "green" }
                })
            } catch (error) {
                console.error("Error updating measurement:", error);
            }
        } else {
            try {

                const newMeasurement = await firestore().collection("measurements").add(gender === "male" ? maleState : femaleState);
                setMeasurementId(newMeasurement.id)
                Toast.show({
                    type: "success",
                    text1: "Measurement Created!",
                    text1Style: { color: "green" }
                })
            } catch (error) {
                console.error("Error creating measurement:", error);
            }
        }

        setIsSaving(false)
    }



    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
            <Tabs.Screen options={{ headerTitle: `Measurement - ${names.toString()}` }} />
            <ScrollView>
                {gender === "male" ? (

                    <VStack space='4xl' mb={20}>
                        <HStack space='lg'>
                            <VStack>
                                <Text>S</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='S' value={maleState?.S} onChangeText={(value) => setMaleState({ ...maleState, "S": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>H</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='H' value={maleState?.H} onChangeText={(value) => setMaleState({ ...maleState, "H": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>N</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='N' value={maleState?.N} onChangeText={(value) => setMaleState({ ...maleState, "N": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>SL</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='SL' value={maleState?.SL} onChangeText={(value) => setMaleState({ ...maleState, "SL": value })} />
                                </Input>
                            </VStack>
                        </HStack>
                        <HStack space='lg'>
                            <VStack>
                                <Text>FR</Text>
                                <Input width="$16" >
                                    <InputField keyboardType='decimal-pad' placeholder='FR' value={maleState?.FR} onChangeText={(value) => setMaleState({ ...maleState, "FR": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>TL</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='TL' value={maleState?.TL} onChangeText={(value) => setMaleState({ ...maleState, "TL": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>Lap</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='Lap' value={maleState?.Lap} onChangeText={(value) => setMaleState({ ...maleState, "Lap": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>FW</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='FW' value={maleState?.FW} onChangeText={(value) => setMaleState({ ...maleState, "FW": value })} />
                                </Input>
                            </VStack>
                        </HStack>
                        <HStack space='lg'>
                            <VStack>
                                <Text>Links</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='Links' value={maleState?.Links} onChangeText={(value) => setMaleState({ ...maleState, "Links": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>HK</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='HK' value={maleState?.HK} onChangeText={(value) => setMaleState({ ...maleState, "HK": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>BBR</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='BBR' value={maleState?.BBR} onChangeText={(value) => setMaleState({ ...maleState, "BBR": value })} />
                                </Input>
                            </VStack>

                        </HStack>
                    </VStack>
                ) : (
                    <VStack space='4xl' mb={20}>
                        <HStack space='lg'>
                            <VStack>
                                <Text>B</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='B' value={femaleState?.B} onChangeText={(value) => setFemaleState({ ...femaleState, "B": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>W</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='W' value={femaleState?.W} onChangeText={(value) => setFemaleState({ ...femaleState, "W": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>L</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='L' value={femaleState?.L} onChangeText={(value) => setFemaleState({ ...femaleState, "L": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>H</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='H' value={femaleState?.H} onChangeText={(value) => setFemaleState({ ...femaleState, "H": value })} />
                                </Input>
                            </VStack>
                        </HStack>
                        <HStack space='lg'>
                            <VStack>
                                <Text>N</Text>
                                <Input width="$16" >
                                    <InputField keyboardType='decimal-pad' placeholder='N' value={femaleState?.N} onChangeText={(value) => setFemaleState({ ...femaleState, "N": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>HL</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='HL' value={femaleState?.HL} onChangeText={(value) => setFemaleState({ ...femaleState, "HL": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>SH</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='SH' value={femaleState?.SH} onChangeText={(value) => setFemaleState({ ...femaleState, "SH": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>UB</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='UB' value={femaleState?.UB} onChangeText={(value) => setFemaleState({ ...femaleState, "UB": value })} />
                                </Input>
                            </VStack>
                        </HStack>
                        <HStack space='lg'>
                            <VStack>
                                <Text>WL</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='WL' value={femaleState?.WL} onChangeText={(value) => setFemaleState({ ...femaleState, "WL": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>HP</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='HP' value={femaleState?.HP} onChangeText={(value) => setFemaleState({ ...femaleState, "HP": value })} />
                                </Input>
                            </VStack>
                            <VStack>
                                <Text>E</Text>
                                <Input width="$16">
                                    <InputField keyboardType='decimal-pad' placeholder='E' value={femaleState?.E} onChangeText={(value) => setFemaleState({ ...femaleState, "E": value })} />
                                </Input>
                            </VStack>

                        </HStack>
                    </VStack>
                )}
            </ScrollView>

            <Button bgColor='green' style={{ marginTop: "auto", marginBottom: 20 }} onPress={() => handleSave()}>
                {isSaving ? <ActivityIndicator color="white" /> : <ButtonText>Save Measurement</ButtonText>}

            </Button>


        </SafeAreaView>
    )
}

export default AddMeasurement