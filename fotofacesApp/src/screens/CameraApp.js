import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity} from 'react-native';
import PictureIcon from '../components/TakePictureIcon'


export default function CameraApp({ navigation }) {
  const [hasPermission, setHasPermission] = React.useState();
  const [camera, setCamera] = React.useState(null);
  const [faceData, setFaceData] = React.useState([]);
  const [image, setImage] = React.useState(null);

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
      if(faceData[0]["bounds"]["size"]["width"]+faceData[0]["bounds"]["size"]["height"]>900){
        return(<View style={{position:'absolute',top:faceData[0]["bounds"]["origin"]["y"],left:faceData[0]["bounds"]["origin"]["x"],width:faceData[0]["bounds"]["size"]["width"], height:faceData[0]["bounds"]["size"]["height"], borderWidth: 5, borderColor:"red"}}><Text style={{color:'red',fontSize:40}}>Too close!!</Text></View>);
      }else{
      return(<View style={{position:'absolute',top:faceData[0]["bounds"]["origin"]["y"],left:faceData[0]["bounds"]["origin"]["x"],width:faceData[0]["bounds"]["size"]["width"], height:faceData[0]["bounds"]["size"]["height"], borderWidth: 5}}></View>
      );
      }
    }
  }

  const takePictureNow = async () => {
    if (faceData.length === 0) {
      return (alert("No face found!!"));
    }
    else{
      if(camera){
        const data = await camera.takePictureAsync(null)
        setImage(data.uri);
        console.log(data.uri)
        navigation.navigate('MainScreen', {image2: image})
      }
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
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
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
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
    justifyContent: 'center'
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
  }
});