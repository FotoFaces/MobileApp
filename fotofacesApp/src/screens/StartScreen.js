import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { theme } from '../core/theme'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>FotoFaces</Header>
      <Paragraph>
        The easiest way to update your photo
      </Paragraph>
      <Button
        mode="outlined"
        color={'white'}
        style={{backgroundColor: theme.colors.primary}}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
