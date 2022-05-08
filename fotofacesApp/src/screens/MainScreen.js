import React, { useState, useEffect } from 'react';
import { Image, View, Platform, StyleSheet, Text } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../core/theme'





export default function MainScreen({ route, navigation }) {

  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const { email, identifier, old_photo } = route.params;

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


  // PHOTO VALIDATION
  function validPhoto(resp) {
    resp = JSON.parse(resp)

    if (resp["Colored Picture"] != true) {
      return false
    }

    if (resp["Face Candidate Detected"] != true) {
      return false
    }

    return false
  }

  return (
    <Background>
      <View style={{width: '100%'}}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'data:image/png;base64,'+old_photo}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{email}</Text>
              <Text style={styles.info}>{identifier}</Text>
            </View>
        </View>
      </View>
    
      <Paragraph>
      </Paragraph>
      <Button
        mode="contained"
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
      
      {imageUri !== null ? <>
      <Header>New Photo</Header>
      <Image style={{width: 180, height: 180}} source={{
          uri: imageUri
        }}/>
      <Button
        mode="outlined"
        onPress={() =>  {
          let formData = new FormData();
          formData.append("id", identifier);
          formData.append("candidate", image);

          let resp = fetch('http://20.76.47.56:5000/', {
            method: 'POST',
            body: formData
          }).then((data)=>{
            data.json().then((properties) => {
              if(validPhoto(properties["feedback"])) {
                navigation.navigate('PhotoAccept', { 
                  email: email.value,
                  identifier: logins["id"],
                  old_photo: logins["photo"],
                  image: image });
              } 
            })
          })
                        }
                }
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
    flex: 1,
    alignItems: 'center',
    padding:30,
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
  }
});