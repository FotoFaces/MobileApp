import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity} from 'react-native';
import PictureIcon from '../components/TakePictureIcon'
import ls from 'local-storage'


export default function CameraApp({navigation}) {
  const [hasPermission, setHasPermission] = React.useState();
  const [camera, setCamera] = React.useState(null);
  const [faceData, setFaceData] = React.useState([]);
  const[count,setCount]=React.useState(0);

  React.useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  function box() {
    if (faceData.length === 0) {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>No faces :(</Text>
        </View>
      );  
    }
    else{
      console.log(count)
      if(count==0){
        if(faceData[0]["leftEyeOpenProbability"] < 0.4 || faceData[0]["rightEyeOpenProbability"] < 0.4){
          setCount(1)
        }else{
          return(
            <View style={styles.faces}>
              <Text style={styles.faceDesc}>Please Wink your eyes once</Text>
            </View>
          )
        }
      }
      if(count==1){
        if(faceData[0]["leftEyeOpenProbability"] > 0.7){
          setCount(2)
        }else{
          return(
            <View style={styles.faces}>
              <Text style={styles.faceDesc}>Please Smile</Text>
            </View>
          )
        }
      }
      // if(counter==3){
      //   if(faceData.rightEyeOpenProbability<0.4 || faceData.leftEyeOpenProbability < 0.4){
      //     counter+=1
      //   }else{
      //     return(
      //       <View style={styles.faces}>
      //         <Text style={styles.faceDesc}>Please Wink your eyes once</Text>
      //       </View>
      //     )
      //   }
      // }
    }
    // else{
    //   if(faceData[0]["bounds"]["size"]["width"]+faceData[0]["bounds"]["size"]["height"]>900){
    //     return(<View style={{position:'absolute',top:faceData[0]["bounds"]["origin"]["y"],left:faceData[0]["bounds"]["origin"]["x"],width:faceData[0]["bounds"]["size"]["width"], height:faceData[0]["bounds"]["size"]["height"], borderWidth: 5, borderColor:"red"}}><Text style={{color:'red',fontSize:40}}>Too close!!</Text></View>);
    //   }else{
    //   return(<View style={{position:'absolute',top:faceData[0]["bounds"]["origin"]["y"],left:faceData[0]["bounds"]["origin"]["x"],width:faceData[0]["bounds"]["size"]["width"], height:faceData[0]["bounds"]["size"]["height"], borderWidth: 5}}></View>
    //   );
    //   }
    // }
  }

  const takePictureNow = async () => {
    if (faceData.length === 0) {
      return (alert("No face found!!"));
    }
    else{
      if(camera){
        const data = await camera.takePictureAsync({
          quality: 1,
          base64: true
        })
        ls.set('ImageUri',data.uri)
        ls.set('Image64',data.base64)
        navigation.navigate('MainScreen')

      }
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    console.log(faces);
  }
  

  return (
    <Camera 
      type={Camera.Constants.Type.front}
      style={styles.camera}
      ref={ref => setCamera(ref)}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true
      }}>
        <TouchableOpacity
              style={{
                alignContent: 'center',
                position: 'absolute',
                bottom: 10
            }}
            onPress={() => takePictureNow()}>
            <PictureIcon />
        </TouchableOpacity>
      {box()}
    </Camera>
  );

  
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },
  faceDesc: {
    fontSize: 20
  },
  action: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold"
  }
});