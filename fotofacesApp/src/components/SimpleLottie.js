import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { isAbsolute } from "path-browserify";

export default function SimpleLottie() {
    return (
      <View>
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
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -440,
      width: 500,
      height: 1500,
      backgroundColor: '#0000005a',
      zIndex: 10
    }
  });