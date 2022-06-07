import React, { useState, useEffect } from 'react';
import { Image, View, Platform, StyleSheet, Text, ScrollView } from 'react-native'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../core/theme'
import ls from 'local-storage'
import SimpleLottie from '../components/SimpleLottie'


export default function MainScreen({ route, navigation }) {

  const [cameraPermission, setCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const { email, identifier, old_photo, name } = route.params;
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
      const preview =   ls.get('ImageUri')
      const preview64 = ls.get("Image")
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

  const validation = () => {
    setShow("TRUE")
    let formData = new FormData();

    formData.append("id", identifier);
    formData.append("candidate", image);

    let resp = fetch('http://20.67.62.59:5000/', {
      method: 'POST',
      body: formData
    }).then((data)=>{
      //console.log(data)
      data.json().then((properties) => {
        setModal("true")
        if(validPhoto(properties["feedback"])) {

          setShow(null)
          navigation.navigate('PhotoAccept', {
            email: email.value,
            identifier: identifier,
            old_photo: old_photo,
            name: name,
            image: properties["cropped"],
            imageUri: imageUri
          });
        } else {
          setShow(null)
        }
      })
    }).catch(function(error) {
      setShow(null)
      reject(new Error(`Unable to retrieve events.\n${error.message}`));
    })
    console.log(resp)
  }

  // PHOTO VALIDATION
  function validPhoto(resp) {
    console.log(resp)
    resp = JSON.parse(resp)

    let error = false

    if (!resp.hasOwnProperty("Brightness") || resp["Brightness"] < 90) {
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

    if (!resp.hasOwnProperty("Eyes Open") || resp["Eyes Open"] < 0.21) {
        setEyes("true");
        error = true
    } else {
        setEyes(null)
    }

    if (!resp.hasOwnProperty("Face Recognition") || resp["Face Recognition"] > 0.6) {
        setFace("true");
        error = true
    } else {
        setFace(null)

    }

    if (!resp.hasOwnProperty("Face Candidate Detected") || resp["Face Candidate Detected"] != "true") {
        setCandidate("true");
        error = true
    } else {
        setCandidate(null)
    }

    if (!resp.hasOwnProperty("Image Quality")|| resp["Image Quality"] > 25) {     // values
        setQuality("true");
        error = true
    } else {
        setQuality(null)
    }

    if (!resp.hasOwnProperty("focus") || resp["focus"] < 90) {
        setFocus("true");
        error = true
    } else {
        setFocus(null)
    }

    if (!resp.hasOwnProperty("Head Pose") || resp["Head Pose"][0] > 15|| resp["Head Pose"][1] > 15|| resp["Head Pose"][2] > 15) {
        setPose("true");
        error = true
    } else {
        setPose(null)
    }

    if (!resp.hasOwnProperty("Sunglasses") || resp["Sunglasses"] != "false") {
        setSunglasses("true");
        error = true
    } else {
        setSunglasses(null)
    }

    if (!resp.hasOwnProperty("Hats") || resp["hats"] != "false") {
        setHats("true");
        error = true
    } else {
        setHats(null)
    }

    if (error) {
        return false
    } else {
        return true
    }
  }

  return (
    <Background>
      <View style={{width: '100%', marginTop: '-30%', marginBottom: 40}}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'data:image/png;base64,'+old_photo}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{email}</Text>
              <Text style={styles.info}>{name}</Text>
            </View>
          </View>
      </View>

      {show !== null ? <SimpleLottie /> :null }

      <Button
        mode="outlined"
        //onPress={openCamera}
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
                <Text>No Hats: {hats ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
                <Text style={{paddingLeft: 20}}>No Sunglasses: {sunglasses ? <Text>&#x274C;</Text> : <Text>&#x2705;</Text>}</Text>
            </View>
        </View>
        </>: null}

      {imageUri !== null ? <>
      <Header>New Photo</Header>

      <Image style={{width: 200, height: 200, marginTop: -20, marginBottom: 8, borderRadius: 10, borderColor: "white", borderWidth: 4}} source={{
          uri: imageUri
        }}/>

      <Button
        mode="outlined"
        color={'white'}
        style={{marginBottom: 40, backgroundColor: theme.colors.primary}}
        onPress={validation}
      >
        Validate Photo
      </Button>
      </> : null}

    </Background>

  )
}

const styles = StyleSheet.create({
  header:{
    height: 230,
    width: '100%'
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:70
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
    color: '#ffffff',
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: '#ffffff',
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
