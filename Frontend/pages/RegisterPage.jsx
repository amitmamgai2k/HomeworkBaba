import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, Image, ToastAndroid } from 'react-native';
import { auth } from '../firebase.config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,

  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import tw from '../tailwind';
import start from '../assets/start.png';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RegisterPage({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

 const handleSignUp = async () => {
  if (!email || !password) {
    setError('Email and password are required');
    ToastAndroid.show('Email and password are required', ToastAndroid.SHORT);
    return;
  }

  setLoading(true);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(auth.currentUser);

    ToastAndroid.show('Verify your email before continuing.', ToastAndroid.LONG);


    await AsyncStorage.setItem('user', JSON.stringify(auth.currentUser));
    navigation.navigate('VerifyEmail');
    setError('');

  } catch (error) {
    console.log(error.message);
    ToastAndroid.show(error.message, ToastAndroid.LONG);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      ToastAndroid.show('Email and password are required', ToastAndroid.SHORT);


      return;
    }

    setLoading(true);
    try {

      await signInWithEmailAndPassword(auth, email, password);
      ToastAndroid.show('Signed in successfully!', ToastAndroid.SHORT);

       if(AsyncStorage.getItem('USER_DATA') === null){
      navigation.navigate('InputForm');
       }else{
        navigation.navigate('UserHomePage');
       }


      setError('');
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
      console.log(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      ToastAndroid.show('Please enter your email', ToastAndroid.SHORT);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      ToastAndroid.show('Password reset email sent!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-200`}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-violet-100`}>
      <StatusBar/>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        <View style={tw`px-6 py-12 flex-1 justify-center`}>
          <View style={tw`items-center mb-8`}>
            <Image source={start} style={tw`h-40 w-60 rounded-full`} resizeMode='cover' />
            <Text style={tw`text-gray-800 font-bold text-3xl mt-4`}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={tw`text-gray-500 text-center mt-2`}>
              {isLogin
                ? "Sign in to your account"
                : "Join us don't waste your time in writing Assignment"}
            </Text>
          </View>

          <View style={tw`gap-4 mb-6`}>
            <View style={[
              tw`rounded-xl bg-violet-200 px-4 py-3`,
              isFocused && tw`border-2 border-violet-500`
            ]}>
              <TextInput
                placeholder="Enter Your Email"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                style={tw`text-black text-base`}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            <View
              style={[
                tw`bg-violet-200 rounded-lg px-4 py-3 flex-row items-center`,
                isPasswordFocused && tw`border-2 border-violet-500`,
              ]}
            >
              <TextInput
                placeholder="Enter Your Password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                secureTextEntry={!showPassword}
                style={tw`text-black text-base flex-1`}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {isLogin && (
              <TouchableOpacity style={tw`items-end`} onPress={handleForgotPassword}>
                <Text style={tw`text-violet-500 text-sm font-bold`}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={tw`bg-violet-500 py-4 rounded-lg items-center shadow-lg mb-6`}
            onPress={isLogin ? handleSignIn : handleSignUp}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              {isLogin ? "Log In" : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={tw`flex-row justify-center`}>
            <Text style={tw`text-gray-400`}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={tw`text-violet-500 font-semibold`}>
                {isLogin ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}