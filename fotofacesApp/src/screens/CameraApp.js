import { SafeAreaView, Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {TouchableOpacity} from 'react-native';
import PictureIcon from '../components/TakePictureIcon'
import ls from 'local-storage'
import MaskedView from "@react-native-community/masked-view"
import { AnimatedCircularProgress } from "react-native-circular-progress"



const { width: windowWidth } = Dimensions.get("window")
const PREVIEW_SIZE = 325
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE
}


export default function CameraApp({navigation}) {
  const [hasPermission, setHasPermission] = React.useState();
  const [camera, setCamera] = React.useState(null);
  const [faceData, setFaceData] = React.useState([]);
  const [count,setCount]=React.useState(0);
  const [progressFill, setProgressFill]=React.useState(0);


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
      if(count>0){
        setCount(0)
        setProgressFill(0)
      }
      return (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructions}>Please place your head inside the moldure</Text>
        </View>
      );
    }
    else{
      if(count===0){
        if(faceData[0]["leftEyeOpenProbability"] < 0.4 || faceData[0]["rightEyeOpenProbability"] < 0.4){
          setCount(1)
          setProgressFill(50)
        }else{
          return(
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructions}>Wink one of your eyes</Text>
            </View>
          )
        }
      }
      if(count==1){
        if(faceData[0]["smilingProbability"] > 0.7){
          setCount(2)
          setProgressFill(100)
        }else{
          return(
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructions}>Smile!!</Text>
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
      if(camera && count==2){
        const data = await camera.takePictureAsync({quality : 1, base64: true})
        ls.set('ImageUri',data.uri)
        ls.set('Image',data.base64)
        navigation.navigate('MainScreen')

      }
      else{
        return (alert("Please complete the steps given."));
      }
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
  }


  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={<View style={styles.mask} />}
      >
        <Camera
          type={Camera.Constants.Type.front}
          style={{width:windowWidth,
            }}
          ref={ref => setCamera(ref)}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true
          }}>
            <AnimatedCircularProgress
                style={styles.circularProgress}
                size={PREVIEW_SIZE}
                width={5}
                backgroundWidth={7}
                fill={progressFill}
                tintColor="#3485FF"
                backgroundColor="#e8e8e8"
              />
        </Camera>

      </MaskedView>
      <TouchableOpacity
                  style={{
                    alignContent: 'center',
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 10
                }}
                onPress={() => takePictureNow()}>
                <PictureIcon />
        </TouchableOpacity>
      {box()}
    </SafeAreaView>

  );


}


const styles = StyleSheet.create({
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
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: "center",
    backgroundColor: "white"
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX
  },
  instructions: {
    fontSize: 20,
    textAlign: "center",
    top: 25,
    position: "absolute"
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE
  },
  action: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold"
  }
});
