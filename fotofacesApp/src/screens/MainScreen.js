import React, { useState, useEffect } from 'react';
import { Image, View, Platform, StyleSheet, Text, ScrollView } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../core/theme'
import {useRoute} from '@react-navigation/native';
import ls from 'local-storage'
import SimpleLottie from '../components/SimpleLottie'


export default function MainScreen({ route, navigation }) {

  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [invalidPhoto, setInvalidPhoto] = useState(null);
  const { email, identifier, old_photo, name } = route.params;
  const [show, setShow] = useState(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("i was here")
      const preview = ls.get('ImageUri')
      const preview64 = ls.get("Image64")
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
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.base64);
      setImageUri(result.uri)
    }
    
  };

  const validation = () => {
    setShow("TRUE")
    let formData = new FormData();
    formData.append("id", identifier);
    formData.append("candidate", image);

    let resp = fetch('http://192.168.1.70:5000/', {
      method: 'POST',
      body: formData
    }).then((data)=>{
      data.json().then((properties) => {
        if(validPhoto(properties)) {
          setShow(null)
          navigation.navigate('PhotoAccept', { 
            email: email.value,
            identifier: identifier,
            old_photo: old_photo,
            name: name,
            image: image,
            imageUri: imageUri
          });
        } else {
          setShow(null)
        }
      })
    })
  }

// Brightness: 141.30041354355131
// ​
// "Colored Picture": true
// ​
// "Crop Position": Array(4) [ 43, 24, 228, … ]     ->
// ​
// Cropping: true                                   ->
// ​
// "Eyes Open": 0.3252342680307727
// ​
// "Face Candidate Detected": true
// ​
// "Face Recognition": 0.6674974599316463
// ​
// Glasses: false                                   ->
// ​
// "Head Pose": Array(3) [ -6.101179017848855, -0.9526796653174112, -0.8817007163672532 ]       ->
// ​
// "Image Quality": 70.59932708740234
// ​
// Resize: 2.7027027027027026                                         ->
// ​
// Sunglasses: Array [ 20.95436507936509, 27.22477324263039 ]         ->
// ​
// focus: 86.36363636363637



  // PHOTO VALIDATION
  function validPhoto(resp) {
    console.log(resp)

    if (!"Brightness" in Object.keys(resp) || resp["Brightness"] < 90) {
      setInvalidPhoto("Picture needs to be bright!!");
      return false
    }

    if (!"Colored Picture" in Object.keys(resp) || resp["Colored Picture"] != true) {
      setInvalidPhoto("Picture needs to be colored!!");
      return false
    }

    if (!"Eyes Open" in Object.keys(resp) || resp["Eyes Open"] < 0.21) {
      setInvalidPhoto("Face needs to have the eyes open!!");
      return false
    }

    if (!"Face Recognition" in Object.keys(resp) || resp["Face Recognition"] > 0.6) {
      setInvalidPhoto("Picture needs to be the same person as the old image!!");
      return false
    }

    if (!"Face Candidate Detected" in Object.keys(resp) || resp["Face Candidate Detected"] != true) {
      setInvalidPhoto("No face detected!!");
      return false
    }

    if (!"Image Quality" in Object.keys(resp) || resp["Image Quality"] > 50) {     // values
      setInvalidPhoto("Image Quality needs to be better!!");
      return false
    }

    if (!"focus" in Object.keys(resp) || resp["focus"] < 80) {
      setInvalidPhoto("Image shouldn't be blurred!!");
      return false
    }

    setInvalidPhoto(null)
    return true
  }

  return (
    <Background>
      <View style={{width: '100%', marginTop: '-30%'}}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'data:image/png;base64,'+old_photo}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{email}</Text>
              <Text style={styles.info}>{name}</Text>
            </View>
          </View>
      </View>
    
      <Paragraph>
      </Paragraph>

      {show !== null ? <SimpleLottie /> :null }

      <Button
        mode="contained"
        //onPress={openCamera}
        onPress={() => navigation.navigate('CameraApp') }
      >
        Take a Photo
      </Button>
      <Button
        mode="outlined"
        onPress={pickImage}
      >
        Gallery
      </Button>

      {invalidPhoto !== null ? 
      <>
      <Text style={styles.error}>{invalidPhoto}</Text>
      </>
      : null}
      
      {imageUri !== null ? <>
      <Header>New Photo</Header>
      <Image style={{width: 180, height: 180}} source={{
          uri: imageUri
        }}/>
      <Button
        mode="outlined"
        onPress={validation}
        style={{marginBottom: 40}}
      >
        Validate Photo
      </Button>
      </> : null}
    </Background>

  )
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: theme.colors.primary,
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 0,
    alignItems: 'center',
    paddingTop:20,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: theme.colors.primary,
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  error: {
    fontSize: 20,
    color: theme.colors.error,
    paddingTop: 8,
    paddingTop: 30,
    paddingBottom: 10
  }
});