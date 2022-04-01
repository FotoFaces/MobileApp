import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import DisplayAnImage from '../components/Image'


export default function MainScreen({ navigation }) {
  return (
    <Background>
      <Header>Profile</Header>
      <DisplayAnImage />
      <Paragraph>
      </Paragraph>
      <Button
        mode="contained"
      >
        Take a Photo
      </Button>
      <Button
        mode="outlined"
      >
        Gallery
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('PhotoAccept')}
      >
        Accept Photo
      </Button>
    </Background>
  )
}
