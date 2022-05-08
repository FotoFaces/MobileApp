import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import { Text, View, StyleSheet } from 'react-native';
import {useRoute} from '@react-navigation/native';

export default function PhotoChoice({ navigation }) {
  const { email, identifier, old_image, image } = route.params;

  const acceptPhoto = () => {
    // update photo
    let formData = new FormData();
    formData.append("param", image);

    fetch('http://20.76.47.56:8393/image/'+identifier, {
      method: 'POST',
      body: formData
    }).then((data)=>{
      data.json().then((properties) => {
        navigation.navigate('StartScreen');
      })
    })
  }


  const route = useRoute();
  return (
    <Background>
      <Header>Update Photo</Header>
      <Text 
        style={styles.headline}> ✅ Valid Photo !! 
      </Text>
      <Text>{"\n"}</Text>
      <DisplayAnImage photo_url={image} />
      <View style={styles.container}>
        <Paragraph>
          Are you sure you want to submit this photo?
        </Paragraph>
      </View>
      <View style={styles.container}>
        <View style={styles.button_1}>
          <Button
            mode="outlined"
            onPress={acceptPhoto}>
              Yes
          </Button>
        </View>
        <View style={styles.button_2}>
          <Button
            mode="outlined"
            onPress={
              // back to main screen
              navigation.navigate('MainScreen', 
              {
                email: email,
                identifier: identifier,
                old_photo: old_image
              }
              )
            }>
            No
          </Button>
        </View>
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
  container: {
    width:"100%",
    flexDirection: "row",
    flexWrap:"wrap",
    alignContent:"space-between",
    textAlign:"center",
    margin:5,
    padding:2,
  },
  button_2: {
    flex:2 ,
    margin:5,

},
  button_1: {
    flex:2 ,
    margin:5,
},

  headline: {
    color: 'green', // <-- The magic
    textAlign: 'center', // <-- The magic
    fontWeight: 'bold',
    fontSize: 19,
    lineHeight: 21
  }
})
