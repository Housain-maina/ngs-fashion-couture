import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useLocalSearchParams } from 'expo-router';
import { Button, ButtonText, Heading, HStack, Input, InputField, VStack } from '@gluestack-ui/themed';
import { CustomerType } from '@/types';
import { Text } from '@gluestack-ui/themed';
import { ScrollView } from 'react-native';


const AddMeasurement = () => {
    const { names, gender } = useLocalSearchParams();


    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 15 }}>
            <Tabs.Screen options={{ headerTitle: names }} />
            <ScrollView>
                <VStack space='4xl'>
                    <HStack space='lg'>
                        <VStack>
                            <Text>S</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='S' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>H</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='H' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>N</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='N' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>SL</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='SL' />
                            </Input>
                        </VStack>
                    </HStack>
                    <HStack space='lg'>
                        <VStack>
                            <Text>FR</Text>
                            <Input width="$16" >
                                <InputField keyboardType='decimal-pad' placeholder='FR' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>TL</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='TL' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>Lap</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='Lap' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>FW</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='FW' />
                            </Input>
                        </VStack>
                    </HStack>
                    <HStack space='lg'>
                        <VStack>
                            <Text>Links</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='Links' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>HK</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='HK' />
                            </Input>
                        </VStack>
                        <VStack>
                            <Text>BBR</Text>
                            <Input width="$16">
                                <InputField keyboardType='decimal-pad' placeholder='BBR' />
                            </Input>
                        </VStack>

                    </HStack>
                </VStack>
            </ScrollView>

            <Button bgColor='green' style={{ marginTop: "auto", marginBottom: 20 }}>
                <ButtonText>Save Measurement</ButtonText>
            </Button>


        </SafeAreaView>
    )
}

export default AddMeasurement