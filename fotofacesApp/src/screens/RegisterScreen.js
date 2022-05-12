import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
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
import { nameValidator } from '../helpers/nameValidator'
import Paragraph from '../components/Paragraph'
import md5 from "react-native-md5";
import * as ImagePicker from 'expo-image-picker';


export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageError, setimageError] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
      setImageUri(result.uri)
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
      setImageUri(result.uri)
    }
  }

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    if (image == null) {
      setimageError("Registration needs Photo")
      return
    }
    setimageError(null)

    let formData = new FormData();
    formData.append("photo", image);
    formData.append("name", name.value);
    formData.append("password", md5.hex_md5( password.value ));
    formData.append("email", email.value);
    
    let resp = fetch('http://localhost:8393/user/2', {
      method: 'PUT',
      body: formData
    }).then((data)=>{
      data.json().then((json) => {
        if (json["state"] == "success") {
          navigation.navigate("StartScreen")
        } else {
          setimageError("Error creating user, did you use correct data ?")
        }
      })
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <View>
        {image !== null ? <><Image style={styles.avatar} source={{uri: imageUri}}/></> : <><Image style={styles.avatar} source={require('../assets/logo.png')}/></>}
      </View>
      <View style={{width: '100%', marginTop: 200}}>
      <Paragraph>Create Account</Paragraph>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
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
      <Button
        mode="outlined"
        onPress={openCamera}
      >
        Take a Photo
      </Button>
      <Button
        mode="outlined"
        onPress={pickImage}
      >
        Gallery
      </Button>
      {imageError !== null ? <Text style={styles.error}>{imageError}</Text> : null}
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:20
  },
  error: {
    fontSize: 20,
    color: theme.colors.error,
    paddingTop: 8,
  }
})