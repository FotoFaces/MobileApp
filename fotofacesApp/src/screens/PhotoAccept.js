import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'
import { Text, View, StyleSheet } from 'react-native';

export default function PhotoChoice({ navigation }) {
  return (
    <Background>
      <Header>Update Photo</Header>
      <DisplayAnImage />
      <View style={styles.container}>
        <Paragraph>
          Are you sure you want to submit this photo?
        </Paragraph>
      </View>
      <View style={styles.container}>
        <View style={styles.button_1}>
          <Button
            mode="outlined">
              Yes
          </Button>
        </View>
        <View style={styles.button_2}>
          <Button
            mode="outlined">
            No
          </Button>
        </View>
      </View>
    </Background>
  )
}


const styles = StyleSheet.create({
  container: {
    width:"100%",
    flexDirection: "row",
    flexWrap:"wrap",
    alignContent:"space-between",
    textAlign:"center",
    margin:5,
    padding:2,
  },
  button_2: {
    flex:2 ,
    margin:5,

},
  button_1: {
    flex:2 ,
    margin:5,
}
})
