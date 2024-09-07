import React from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import * as Progress from 'react-native-progress'

interface ImageUploaderProps {
  avatarUrl: string | null
  loading: boolean
  uploadProgress: number
}

export default function ImageUploader({ avatarUrl, loading }: ImageUploaderProps = { avatarUrl: null, loading: false, uploadProgress: 0 }) {
  return (
    <View style={styles.container}>
      {avatarUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: avatarUrl }} 
            style={[
              styles.image, 
              loading && styles.imageLoading
            ]} 
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingText}>Uploading...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageLoading: {
    opacity: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 10,
  },
})