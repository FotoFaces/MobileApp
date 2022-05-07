import React, { useState, useEffect } from 'react';
import { Image, View, Platform } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import * as ImagePicker from 'expo-image-picker';






export default function MainScreen({ route, navigation }) {

  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const { email, identifier, old_image } = route.params;

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
        onPress={() =>  {
                            let formData = new FormData();
                            formData.append("id", identifier);
                            formData.append("candidate", image);

                            let resp = fetch('http://localhost:5000/', {
                              method: 'POST',
                              body: formData
                            }).then((data)=>{
                              data.json().then((properties) => {
                                if(validPhoto(properties["feedback"])) {
                                  navigation.navigate('PhotoAccept', { image2: image });
                                } 
                              })
                            })
                        }
                }
      >
        Accept Photo
      </Button>
    </Background>
  )
}
