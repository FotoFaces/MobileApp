import React, {useState} from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import { Text, View, StyleSheet, Image } from 'react-native';
import SimpleLottie from '../components/SimpleLottie'


export default function PhotoAccept({ route, navigation }) {

  const { email, identifier, old_photo, name, image, imageUri } = route.params;
  const [show, setShow] = React.useState(null);

  const acceptPhoto = () => {
    setShow("TRUE")
    // update photo
    let formData = new FormData();
    formData.append("param", image);

    fetch('http://192.168.1.70:8393/image/'+identifier, {
      method: 'PUT',
      body: formData
    }).then((data)=>{
      setShow(null)
      navigation.navigate('StartScreen')
      })
  }

  return (
    <Background>
      <Header>Update Photo</Header>
      <Text
        style={styles.headline}> ✅ Valid Photo !!
      </Text>

      {show !== null ? <SimpleLottie /> :null }

        <View style={styles.container}>
          <View style={{flex:2, marginRight: 30}}>
            <Paragraph>Old Photo</Paragraph>
            <Image style={styles.avatar} source={{uri: 'data:image/png;base64,'+old_photo}}/>
          </View>
          <View style={{flex:2, marginLeft: 30}}>
            <Paragraph>New Photo</Paragraph>
            <Image style={styles.avatar} source={{uri: 'data:image/png;base64,'+image}}/>
          </View>
        </View>

        <View style={{marginTop: 146}}>
          <View style={styles.container}>
            <Paragraph>
              Are you sure you want to submit this photo?
            </Paragraph>
            <View style={styles.button}>
              <Button
                mode="outlined"
                onPress={acceptPhoto}>
                  Yes
              </Button>
            </View>
            <View style={styles.button}>
              <Button
                mode="outlined"
                onPress={() => {
                    // back to main screen
                    navigation.navigate('MainScreen')
                }}>
                No
              </Button>
            </View>
          </View>
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
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
  container: {
    width:"100%",
    flexDirection: "row",
    flexWrap:"wrap",
    alignContent:"space-between",
    alignItems:'center',
    justifyContent:'center',
    textAlign:"center",
    margin:5,
    padding:2,
    marginTop: 30
  },
  button: {
    flex:2,
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
