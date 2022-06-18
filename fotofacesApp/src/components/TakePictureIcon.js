import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function TakePictureIcon() {
  return <Image source={require('../assets/radio-button-on_2.png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 110,
    marginBottom: 1,
  },
})