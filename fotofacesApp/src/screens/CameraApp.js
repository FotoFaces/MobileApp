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

  React.useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // const detections = {
  //   BLINK: { promptText: "Blink both eyes", minProbability: 0.4 },
  //   TURN_HEAD_LEFT: { promptText: "Turn head left", maxAngle: -7.5 },
  //   TURN_HEAD_RIGHT: { promptText: "Turn head right", minAngle: 7.5 },
  //   NOD: { promptText: "Nod", minDiff: 1 },
  //   SMILE: { promptText: "Smile", minProbability: 0.7 }
  // }
  
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
        ls.set('ImageUri',data.uri)
        navigation.navigate('MainScreen')

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
        {/* <Text style={styles.action}>
          {state.faceDetected &&
            detections[state.detectionsList[state.currentDetectionIndex]]
              .promptText}
        </Text> */}
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