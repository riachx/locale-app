import { db, auth, storage } from '../../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';

const uploadImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Upload Failed', 'User not authenticated.');
        return null;
      }

      const fileName = `profile_${Date.now()}`;
      const storageRef = ref(storage, `images/${userId}/${fileName}`);
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save the image URL in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profile_picture: downloadURL,
      });

      Alert.alert('Upload Successful', 'Profile picture updated!');

      return downloadURL;
    } else {
      Alert.alert('Upload Failed', 'No image selected.');
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    Alert.alert('Upload Failed', 'An error occurred while uploading.');
    return null;
  }
};

export default uploadImage;
