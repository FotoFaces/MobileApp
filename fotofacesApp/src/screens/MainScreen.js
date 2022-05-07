import React, { useState, useEffect } from 'react';
import { Image, View, Platform } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import * as ImagePicker from 'expo-image-picker';






export default function MainScreen({ navigation }) {

  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    console.log("sdfaf")
    console.log(result.base64);

    if (!result.cancelled) {
      console.log("data -> " + result.uri.split(",")[1])
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

    // Explore the result
    console.log("sdfaf")
    console.log(result.base64);

    if (!result.cancelled) {
      setImage(result.base64);
      setImageUri(result.uri)
    }
  }
  return (
    <Background>
      <Header>Profile</Header>
      <DisplayAnImage photo_url={imageUri}/>
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
      <Button
        mode="outlined"
        // onPress={() => navigation.navigate('PhotoAccept', { image2: image })}
        onPress={() =>  {

                            let formData = new FormData();
                            formData.append("id", 10);
                            formData.append("candidate", image);

                            let resp = fetch('http://192.168.1.162:8080/', {
                              method: 'POST',
                              body: formData
                            }).then((data)=>{console.log(data.json())})

                          }
                        }
      >
        Accept Photo
      </Button>
      <Button
        mode="outlined"
        // onPress={() => navigation.navigate('PhotoAccept', { image2: image })}
        onPress={() =>  {
                          const response = async () => {
                            await fetch('http://192.168.1.162:8080/hello', {
                              method: 'POST',
                              headers: {'Content-Type':'multipart/form-data',
                                        'Access-Control-Allow-Origin': '*'},
                            })

                              .then((data) => {console.log(data.json())});
                          }
                        }
                }
      >
    Send Post
      </Button>
    </Background>
  )
}
