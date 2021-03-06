import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import DisplayAnImage from '../components/Image'

export default function Dashboard({ navigation }) {
  return (
    <Background>
      <Header>Profile</Header>
      <Paragraph>
        Current Photo
      </Paragraph>
      <DisplayAnImage />
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('PhotoAccept')}
      >
        Take a New Photo
      </Button>
    </Background>
  )
}
