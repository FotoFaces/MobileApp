import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { isAbsolute } from "path-browserify";

export default function SimpleLottie() {
    return (
      <View>
        {/* <View style={styles.backgroundOp}></View> */}
          <LottieView
            source={require("../assets/99833-edupia-loading.json")}
            style={styles.animation}
            autoPlay
          />
      </View>
    );
  }
  const styles = StyleSheet.create({
    animation: {
      zIndex: 100,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -50,
      width: 300,
      height: 300,
    },
    backgroundOp: {
      backgroundColor: '#ffffff',
      zIndex: 50,
      width: '100%',
      height: '100%',
      justifyContent:"center",
      alignItems:"center"
    }
  });