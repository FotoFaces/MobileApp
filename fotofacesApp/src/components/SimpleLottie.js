import React from "react";
import { StyleSheet, View, Text } from "react-native";
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
      zIndex: 100,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 300,
      height: 300,
    },
  });