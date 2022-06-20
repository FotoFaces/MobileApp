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
import SimpleLottie from '../components/SimpleLottie'
import ls, { set } from 'local-storage'


export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [imageError, setimageError] = useState(null);
  const [show, setShow] = useState(null);

  // properties
  const [modal, setModal] = useState(null);
  const [bright, setBright] = useState(null);
  const [color, setColor] = useState(null);
  const [eyes, setEyes] = useState(null);
  const [face, setFace] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [quality, setQuality] = useState(null);
  const [focus, setFocus] = useState(null);
  const [pose, setPose] = useState(null);
  const [sunglasses, setSunglasses] = useState(null);
  const [hats, setHats] = useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const preview = ls.get('ImageUri')
      const preview64 = ls.get("Image")
      //console.log(preview64)
      ls.set('ImageUri',null)
      ls.set("Image", null)
      if(preview !== null){
        setImageUri(preview)
        setImage(preview64)
      }
    });return unsubscribe;
  }, [navigation]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
      setImageUri(result.uri)
    }
  };

  const onSignUpPressed = async () => {
    console.log("\n\n")

    setShow("TRUE")
    setimageError(null)

    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setShow(null)
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

    if (image == null) {
      setShow(null)
      setimageError("Registration needs Photo")
      return
    }
    setimageError(null)
    const validationRet = await validation()

    setShow(null)
    return

  }


  const RegisterUser = () => {
    setimageError(null)
    let formData = new FormData();
    formData.append("photo", image);
    formData.append("name", name.value);
    formData.append("password", md5.hex_md5( password.value ));
    formData.append("email", email.value);
    //let resp = fetch('http://192.168.1.69:8393/user/2', {
    let resp = fetch('http://13.81.83.209:8393/user/2', {
    //let resp = fetch('http://20.23.116.163:8393/user/2', {
      method: 'PUT',
      body: formData
    }).then((data)=>{
      data.json().then((json) => {
        if (json["state"] == "success") {
          setShow(null)
          navigation.navigate("StartScreen")
        } else {
          setShow(null)
          setimageError("Error creating user, did you use correct data ?")
        }
      })
    }).catch((error) => {
      setShow(null)
      setimageError("Error connecting to the database, please try again")
    })
  }

  const validation = async () => {
    setShow("TRUE")
    setimageError(null)
    let formData = new FormData();

    formData.append("id", -1);
    formData.append("candidate", image);
    formData.append("reference", image);

    //console.log(formData);192.168.33.46
    //let resp = fetch('http://192.168.1.69:5000/', {
    //let resp = fetch('http://20.23.116.163:5000/', {
    let resp = await fetch('http://13.81.83.209:5000', {
      method: 'POST',
      body: formData
    }).then( async (data)=>{
      console.log(data)
      await data.json().then(async (properties) => {
        setModal("true")
        const validPhotoRet = await validPhoto(properties["feedback"])

        console.log("VALIDPHOTORET  ",validPhotoRet)
        if( validPhotoRet === false) { //NoError
          setModal(null)
          setShow(null)
          setimageError(null)
          RegisterUser()
          return true;
        } else {
          setShow(null)
          return false;
        }
      })
    }).catch(() => {
      console.log("Error connecting to FotoFaces")
      setShow(null)
      setimageError("Error Connecting to FotoFaces API, please try again")
      setModal(null)
      return false
    })

    console.log("here, ", resp)
  }

  // PHOTO VALIDATION
  const validPhoto = async (resp) => {

    console.log("resposta:" + resp)

    if (resp == null) {
        return false
    }

    resp = JSON.parse(resp)

    let error = false

    if (!resp.hasOwnProperty("Brightness") || resp["Brightness"] < 100) {
        setBright("true");
        error = true
    } else {
        setBright(null)
    }

    if (!resp.hasOwnProperty("Colored Picture") || resp["Colored Picture"] != "true") {
        setColor("true");
        error = true
    } else {
        setColor(null)
    }

    if (!resp.hasOwnProperty("Eyes Open") || resp["Eyes Open"] < 0.20) {
        setEyes("true");
        error = true
    } else {
        setEyes(null)
    }

    if (!resp.hasOwnProperty("Face Recognition") || resp["Face Recognition"] > 0.60) {
        setCandidate("true");
        error = true
    } else {
        setCandidate(null)
    }

    if (!resp.hasOwnProperty("Face Candidate Detected") || resp["Face Candidate Detected"] != "true") {
        setFace("true");
        error = true
    } else {
        setFace(null)
    }

    if (!resp.hasOwnProperty("Image Quality")|| resp["Image Quality"] > 36) {     // values
        setQuality("true");
        error = true
    } else {
        setQuality(null)
    }

    if (!resp.hasOwnProperty("focus") || resp["focus"] < 70) {
        setFocus("true");
        error = true
    } else {
        setFocus(null)
    }

    if (!resp.hasOwnProperty("Head Pose") || resp["Head Pose"][0] > 20|| resp["Head Pose"][1] > 20|| resp["Head Pose"][2] > 20) {
        setPose("true");
        error = true
    } else {
        setPose(null)
    }

    // Glasses como sunglasses
    if (!resp.hasOwnProperty("Sunglasses") || resp["Sunglasses"] != "false") {
        setSunglasses("true");
        error = true
    } else {
        setSunglasses(null)
    }

    if (!resp.hasOwnProperty("Hats") || resp["Hats"] != "false") {
        setHats("true");
        error = true
    } else {
        setHats(null)
    }

    console.log("ERROR - > ", error)
    return error
  }

  return (
    <Background>
      <View style={{marginTop: '-30%'}}></View>

      <BackButton goBack={navigation.goBack}/>
      <View>
        {image !== null ? <><Image style={styles.avatar} source={{uri: imageUri}}/></> : <><Image style={styles.avatar} source={require('../assets/avatar.jpg')}/></>}
      </View>
      <View style={{width: '100%', marginTop: 200, paddingTop: 20, marginBottom: 30}}>
      <Paragraph>Create Account</Paragraph>

      {show !== null ? <SimpleLottie /> :null }

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
        onPress={() => navigation.push('CameraApp') }
      >
        Take a Photo
      </Button>
      <Button
        mode="outlined"
        onPress={pickImage}
      >
        Gallery
      </Button>

        {imageError ? <><Text style={styles.error}>{imageError}</Text></> : null}

        {modal ? <>
        <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', paddingTop: 20}}>
                <Text>Bright: {bright ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>Colored: {color ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>Eyes Open: {eyes ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
            </View>

            <View style={{flexDirection: 'row', paddingTop: 5}}>
                <Text>Face Detected: {face ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>Face Recognizion: {candidate ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
            </View>

            <View style={{flexDirection: 'row', paddingTop: 5}}>
                <Text>Quality: {quality ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>Focus: {focus ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>Front Face: {pose ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
            </View>

            <View style={{flexDirection: 'row', paddingTop: 5}}>
                <Text>No Hats: {hats ? <Text>&#x2705;</Text>  : <Text>&#x274C;</Text> }</Text>
                <Text style={{paddingLeft: 20}}>No Sunglasses: {sunglasses ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
            </View>
        </View>
        </>: null}

      <Button
        mode="outlined"
        color={'white'}
        style={{marginTop: 24, backgroundColor: theme.colors.primary}}
        onPress={onSignUpPressed}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text style={{color: '#ffffff'}}>Already have an account? </Text>
        <TouchableOpacity onPress={() => {
          ls.set("Image", null)
          ls.set("ImageUri", null)
          navigation.replace('LoginScreen')
        }
        }>
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
    color: '#9be4ff',
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
