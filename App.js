import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from "anonymous-files";

export default function App() {

  const [selectedImage, setSelectedImage] = useState(null);

  const onPress = () => Alert.alert('How long have we been?', '~250.000 years of evolution!');

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    
    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri});
    } else {
      setSelectedImage({ localUri: pickerResult.uri });
    }
  }

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Homo Sapiens (Hombre Sabio)</Text>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={openImagePickerAsync}
      >
        <Image
          style={styles.logo}
          source={{
            uri:
              selectedImage
                ? selectedImage.localUri
                : 'https://sites.google.com/site/cmcientificos/_/rsrc/1467891160003/home/descarga1.jpg',
          }}
        />
      </TouchableOpacity>
      {
        selectedImage ?
          <Button
            title='Share'
            color="#533"
            onPress={openShareDialog}
          // accessibilityLabel="Learning React Native :0"
          />
          : <View />
      }
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Text style={styles.textButton}>Press Here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: '#222',
  },
  logo: {
    height: 220,
    width: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: "darkslategrey",
    padding: 10,
    marginVertical: 10,
  },
  textButton: { 
    color: "#ffffff",
  }
});
