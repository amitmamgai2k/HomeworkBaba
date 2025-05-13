import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import tw from '../tailwind';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/UserContext';
import { updateProfile } from 'firebase/auth';

const InputForm = ({ navigation }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    schoolName: '',
    major: '',
    phone: '',
    dob: '',
    profileImage: '',
  });

  const isFormValid = (userId) => {
    return (
      userData.name.trim() !== '' &&
      userData.schoolName.trim() !== '' &&
      userData.gender.trim() !== ''
    );
  };

  const handleTextChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };
  const { user } = useAuth();
  console.log('user', user);



  const handlePickImage = async () => {
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUserData({ ...userData, profileImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Image Error', 'There was a problem selecting your image.');
    }
  };

  const handleSubmit = async () => {
    console.log('userData', userData);

  if (!isFormValid()) {
    Alert.alert('Form Incomplete', 'Please fill all required fields.');
    return;
  }



  try {

    await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
    updateProfile(user, {
      displayName: userData.name,
      photoURL: userData.profileImage,
      phoneNumber: userData.phone,
    })

    navigation.navigate('UserHomePage');
  } catch (error) {
    console.error('Error saving data:', error);
    Alert.alert('Storage Error', 'Could not save your data. Please try again.');
  }
};


  // Parse date string to Date object for the picker
  const getDateObject = () => {
    if (userData.dob) {
      try {
        return new Date(userData.dob);
      } catch (e) {
        return new Date();
      }
    }
    return new Date();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 mt-2`}
        showsVerticalScrollIndicator={false}
      >
        <Text style={tw`text-3xl font-bold text-center mb-6`}>
          Complete Your Profile
        </Text>

        {/* Profile Image */}
        <View style={tw`mb-8 items-center`}>
          <TouchableOpacity
            style={tw`relative`}
            onPress={handlePickImage}
          >
            {userData.profileImage ? (
              <Image
                source={{ uri: userData.profileImage }}
                style={tw`w-24 h-24 rounded-full border-2 border-violet-500`}
              />
            ) : (
              <View style={tw`w-24 h-24 rounded-full bg-violet-100 items-center justify-center`}>
                <Icon name="person" size={48} color="gray" />
              </View>
            )}
            <View style={tw`absolute bottom-0 right-0 bg-violet-500 p-2 rounded-full`}>
              <Icon name="camera" size={16} color="#dabaf3" />
            </View>
          </TouchableOpacity>
          <Text style={tw`mt-2 text-violet-600 text-sm`}>
            Tap to upload profile photo
          </Text>
        </View>

        {/* Name - Required Field */}
        <View style={tw`mb-4  `}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            Full Name <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View style={tw`flex-row items-center border-1 bg-violet-100 rounded-xl  px-3 pb-1`}>
            <Icon name="person-outline" size={20} color="#6b7280" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 p-3 text-gray-800`}
              placeholder="Enter your full name"
              value={userData.name}
              onChangeText={(text) => handleTextChange('name', text)}
            />
          </View>
        </View>

        {/* Gender - Required Field */}
        <View style={tw`mb-4 `}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            Gender <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View style={tw`flex-row items-center px-3 border-1 bg-violet-100 rounded-xl `}>
            <FontAwesome name="venus-mars" size={20} color="#6b7280" style={tw`mr-2`} />
            <View style={tw`flex-1   `}>
              <Picker
                selectedValue={userData.gender}
                onValueChange={(value) => handleTextChange('gender', value)}
                style={tw`text-gray-800`}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>
        </View>

        {/* School Name - Required Field */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            School/College/University <Text style={tw`text-red-500`}>*</Text>
          </Text>
          <View style={tw`flex-row items-center border-1 bg-violet-100 rounded-xl  px-3 pb-1`}>
            <Icon name="school-outline" size={20} color="#6b7280" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 p-3 text-gray-800`}
              placeholder="Enter your school name"
              value={userData.schoolName}
              onChangeText={(text) => handleTextChange('schoolName', text)}
            />
          </View>
        </View>

        {/* Major/Stream */}
        <View style={tw`mb-4 `}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            Major/Stream
          </Text>
          <View style={tw`flex-row items-center border-1 bg-violet-100 rounded-xl px-3 pb-1`}>
            <MaterialIcons name="category" size={20} color="#6b7280" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 p-3 text-gray-800`}
              placeholder="Enter your major"
              value={userData.major}
              onChangeText={(text) => handleTextChange('major', text)}
            />
          </View>
        </View>

        {/* Class Year */}


        {/* Phone Number */}
        <View style={tw`mb-4 `}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            Phone Number
          </Text>
          <View style={tw`flex-row items-center border-1 bg-violet-100 rounded-xl px-3 pb-1`}>
            <Icon name="call-outline" size={20} color="#6b7280" style={tw`mr-2`} />
            <TextInput
              style={tw`flex-1 p-3 text-gray-800`}
              placeholder="Enter your phone number"
              value={userData.phone}
              onChangeText={(text) => handleTextChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Date of Birth */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium mb-1 text-gray-600 px-3 pt-2`}>
            Date of Birth
          </Text>
          <TouchableOpacity
            style={tw`flex-row items-center px-3 border-1 bg-violet-100 rounded-xl pb-1`}
            onPress={() => setShowPicker(true)}
          >
            <Icon name="calendar-outline" size={20} color="#6b7280" style={tw`mr-2`} />
            <Text style={tw`flex-1 p-3 ${userData.dob ? 'text-gray-800' : 'text-gray-400'}`}>
              {userData.dob || 'Select your date of birth'}
            </Text>
            <Icon name="chevron-down-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={getDateObject()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  handleTextChange('dob', date.toLocaleDateString());
                }
              }}
              maximumDate={new Date()}
            />
          )}
        </View>

        <View style={tw`bg-violet-50 p-4 rounded-xl mb-8 flex-row`}>
          <Icon name="information-circle-outline" size={24} color="#a23cf1 " style={tw`mr-2`} />
          <View style={tw`flex-1`}>
            <Text style={tw`text-violet-800 font-medium mb-1 text-base`}>
              Why we need this information
            </Text>
            <Text style={tw`text-violet-700 text-sm`}>
              Providing your details helps us personalize your experience and connect you with relevant resources. Fields marked with <Text style={tw`text-red-500`}>*</Text> are required.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={tw`px-6 py-4 border-t border-gray-200 bg-white shadow-md`}>
        <TouchableOpacity
          style={[
            tw`rounded-xl py-4 items-center justify-center flex-row`,
            isFormValid() ? tw`bg-violet-600` : tw`bg-gray-300`,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={tw`text-white font-bold text-lg mr-2`}>SAVE AND CONTINUE</Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InputForm;