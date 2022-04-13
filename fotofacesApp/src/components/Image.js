import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { theme } from '../core/theme'

export default function DisplayImage({ photo_url, style, ...props }) {
  return (
     <View style={styles.thumbContainer}>
      <Image
        style={styles.thumbnail}
        source={{
          uri: photo_url,
        }}
      />
     </View>
  )
}

const styles = StyleSheet.create({
    thumbContainer: {
      width: '100%',
      height: 400,
    },
    thumbnail: {
      flex: 1,
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
      borderRadius: 2
    },


});
