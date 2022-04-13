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

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <Background>
      <Header>Profile</Header>
      <DisplayAnImage/>
      <Paragraph>
      </Paragraph>
      <Button
        mode="contained"
      >
        Take a Photo
      </Button>
      <Button
        mode="outlined"
        onPress={() => pickImage}
      >
        Gallery
      </Button>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('PhotoAccept')}
      >
        Accept Photo
      </Button>
    </Background>
  )
}
