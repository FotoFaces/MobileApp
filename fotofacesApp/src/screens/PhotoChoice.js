import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'

export default function PhotoChoice({ navigation }) {
  return (
    <Background>
      <Logo />
      <Header>Borges</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
    </Background>
  )
}
