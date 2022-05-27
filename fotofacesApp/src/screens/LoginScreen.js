import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import md5 from "react-native-md5";
import SimpleLottie from '../components/SimpleLottie'


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: 'admin@ua.pt', error: '' })
  const [password, setPassword] = useState({ value: 'adminpg', error: '' })
  const [show, setShow] = useState(null)

  const onLoginPressed = () => {
    setShow("TRUE")

    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setShow(null)
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    let resp = fetch('http://192.168.1.162:8393/user/'+email.value, {
      method: 'GET',
    }).then((data)=>{
      data.json().then((logins) => {

        let hex_md5v = md5.hex_md5( password.value );

        if (hex_md5v === logins["password"]) {
          setShow(null)
          navigation.navigate('MainScreen',
          {
            email: email.value,
            identifier: logins["id"],
            old_photo: logins["photo"],
            name: logins["name"]
          }
          );
        }
        else {
          setShow(null)
          setEmail({ ...email, error: " " })
          setPassword({ ...password, error: "Email or password incorrect" })
        }
      })
    })

    return
  }

  const onLoginSSO = () => {
    const acceptedAccessTokenInfo = ["access_token", "token_type", "expires_in", "id_token"];

    // WSO2 APPLICATION, CALLs AND ENDPOINT DETAILS
    const authorizeEndpoint = "https://wso2-gw.ua.pt/authorize";
    const tokenEndpoint = "https://wso2-gw.ua.pt/token";
    const redirectURI = "http://localhost";
    const consumerKey = "agh44RajMJcYvCIq3lSMrutfPJ0a"
    // Base64 encoded string: <Consumer Key>:<Consumer Secret>
    const authorizationBase64Credentials = "YWdoNDRSYWpNSmNZdkNJcTNsU01ydXRmUEowYTpKWVNZNU1iYkJQR0Y4WURYZmdoeUdKRnVmNFVh";

    location = `${authorizeEndpoint}?response_type=code&state=1234567890&scope=openid&client_id=${consumerKey}&redirect_uri=${redirectURI}`

    // should wait for response

    let searchParams = new URL(location).searchParams;

    if (searchParams.has("code")) {

      let code = searchParams.get("code");

      alert(code)

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded")
      myHeaders.append("Authorization", `Basic ${authorizationBase64Credentials}`);

      fetch(`${tokenEndpoint}?code=${code}&redirect_uri=${redirectURI}&grant_type=authorization_code`, {
          method: "POST",
          headers: myHeaders
      }).then(response => response.json())
        .then(res => {
            Object.keys(res).forEach((item, index) => {
                if (acceptedAccessTokenInfo.includes(item)) {
                  navigation.navigate('MainScreen',
                  {
                    email: email.value,
                    identifier: logins["id"],
                    old_photo: logins["photo"]
                  }
                  );
                }
            });
        })
        .catch(err => {
            console.log(`Received an error: ${err}`);
        });
    }

    return
  }


  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back</Header>

      {show !== null ? <SimpleLottie /> :null }

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="outlined"
        color={'white'}
        style={{backgroundColor: theme.colors.primary}} onPress={onLoginPressed}>
        Login
      </Button>

      <Button mode="outlined"
        color={'white'}
        style={{backgroundColor: theme.colors.primary}} onPress={onLoginSSO}>
        SSO Login
      </Button>

      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: '#ffffff'
  },
  link: {
    fontWeight: 'bold',
    color: '#9be4ff',
  },
})
