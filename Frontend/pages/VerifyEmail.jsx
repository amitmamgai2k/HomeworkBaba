import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase.config';
import { reload } from 'firebase/auth';
import tw from '../tailwind';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await reload(auth.currentUser);
      if (auth.currentUser.emailVerified) {
        ToastAndroid.show('Email verified!', ToastAndroid.SHORT);
        navigation.replace('InputForm');
      } else {
        ToastAndroid.show('Please verify your email first.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error.message);
      ToastAndroid.show('Something went wrong. Try again.', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-white px-4`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-2`}>Verify Your Email</Text>
      <Text style={tw`text-center text-gray-600 mb-6`}>
        A verification email has been sent. Click the link in your inbox to verify your account.
      </Text>

      <TouchableOpacity
        style={tw`bg-blue-600 px-6 py-3 rounded-lg`}
        onPress={handleCheckVerification}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={tw`text-white font-semibold`}>I’ve Verified My Email</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VerifyEmail;
