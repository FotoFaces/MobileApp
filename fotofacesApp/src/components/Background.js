import React from 'react'
import { ImageBackground, StyleSheet, KeyboardAvoidingView, ScrollView , View } from 'react-native'
import { theme } from '../core/theme'

export default function Background({ children }) {
  return (
      <ImageBackground
      source={require('../assets/angryimg.png')}
      resizeMode="stretch"
      style={styles.background}
    >
      <ScrollView>
        <View style={{width: '100%', paddingTop: '35%'}}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">  
            {children}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
