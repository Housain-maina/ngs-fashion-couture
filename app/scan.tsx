import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useNavigation, useRouter } from 'expo-router';

const Scan = () => {
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [scanned, setScanned] = useState(false);
    const router = useRouter()

    const navigation = useNavigation()

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        const unsubscribeDidFocus = navigation.addListener('focus', () => {
            setScanned(false)
        });
        return unsubscribeDidFocus;

    }, [navigation]);

    const handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
        setScanned(true);
        const parsedData = JSON.parse(data)
        const requiredKeys = ["workId", "customerId", "names"]

        const allKeysPresent = requiredKeys.every(key => parsedData.hasOwnProperty(key));

        if (allKeysPresent) {

            return router.navigate({
                pathname: "/addWork", params: {
                    id: parsedData?.customerId,
                    names: parsedData?.names
                }
            })
        } else {
            alert("Not a valid QR Code for this app.")
        }

    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>Camera permission not granted</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Tabs.Screen options={{
                title: "Scan a QR Code"
            }} />

            <View style={styles.cameraContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.camera}
                />
            </View>
            {
                scanned && (
                    <TouchableOpacity
                        style={{ position: "absolute", bottom: 40, backgroundColor: "red", padding: 10, borderRadius: 300 }}
                        onPress={() => setScanned(false)}

                    >
                        <Ionicons name="close" size={40} color="white" />
                    </TouchableOpacity>
                )
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 40,
    },
    cameraContainer: {
        width: '100%',
        height: "100%",
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: 10,

    },
    camera: {
        flex: 1,
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default Scan

