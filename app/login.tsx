import { Button, ButtonSpinner, ButtonText, FormControl, FormControlHelper, FormControlHelperText, InputField, Link, VStack } from "@gluestack-ui/themed";
import { Text, Center, Heading, Divider, ScrollView, Input } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image } from "react-native";
import { Box } from "@gluestack-ui/themed";
import auth from '@react-native-firebase/auth';
import { useState } from "react";




export default function LogIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)



  const handleFormSubmit = async () => {
    setIsLoading(true)
    await auth()
      .signInWithEmailAndPassword(email.toLowerCase(), password)
      .then((res) => {

      })
      .catch(error => {

        if (error.code === 'auth/invalid-credential') {
          return setError("Invalid email or password")
        }
        if (error.code === 'auth/too-many-requests') {
          return setError("Too many log in attempts. Try again later.")
        }

        console.error(error);
      });
    setIsLoading(false)
  }

  function isValidEmail(email: string) {
    const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image source={require("../assets/images/man-cloth.jpg")} alt="attire" resizeMode="cover" style={{
        width: "100%",
        height: "100%"
      }} />
      <Box style={{ paddingHorizontal: "8%", paddingVertical: "10%", position: "absolute", bottom: "0%", width: "100%", backgroundColor: "white" }}>
        <FormControl>
          <VStack space="lg" reversed={false}>
            <Heading textAlign="center">NGS Fashion Couture</Heading>

            <Input variant="outline" size="lg" isDisabled={false} isInvalid={false} isReadOnly={false} >
              <InputField
                placeholder='Email Address'
                value={email}
                onChangeText={value => setEmail(value)}

              />
            </Input>
            <Box>


              <Input variant="outline" size="lg" isDisabled={false} isInvalid={false} isReadOnly={false} >
                <InputField
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChangeText={value => setPassword(value)}


                />
              </Input>

              {error && (
                <FormControlHelper>
                  <FormControlHelperText color="$red500">
                    {error}
                  </FormControlHelperText>
                </FormControlHelper>
              )}
            </Box>
            <Button size="lg" backgroundColor={isLoading || !isValidEmail(email) || password.length < 6 ? "$trueGray300" : "$primary500"} onPress={handleFormSubmit} disabled={isLoading || !isValidEmail(email) || password.length < 6}>
              {isLoading ? <ButtonSpinner /> :
                <ButtonText>Log In</ButtonText>
              }
            </Button>
            {/* <Link href="/customers">
              <Text underline textAlign="center">Forgot Password?</Text>
            </Link> */}
          </VStack>
        </FormControl>
      </Box>


    </SafeAreaView >
  );
}
