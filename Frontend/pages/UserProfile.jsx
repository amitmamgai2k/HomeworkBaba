import { Image, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../context/UserContext'
import tw from '../tailwind'
import Icon from 'react-native-vector-icons/AntDesign'
import School from 'react-native-vector-icons/Ionicons'
import { StatusBar } from 'react-native-web'

const UserProfile = () => {
  const [userData, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('USER_DATA');
        if (userData !== null) {
          setUser(JSON.parse(userData));
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error retrieving data', error);
      }
    };

    getUserData();
  }, []);

  console.log('userData', userData);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`flex-1 px-6 pb-8`}>
          {/* Header */}
          <View style={tw`items-center pt-4 pb-6`}>
            <Text style={tw`text-3xl font-bold text-violet-700`}>User Profile</Text>
          </View>

          {/* Profile Image */}
          <View style={tw`items-center mb-8`}>
            <View style={tw`rounded-full border-4 border-violet-600 shadow-lg`}>
              <Image
                source={{ uri: 'https://media.licdn.com/dms/image/v2/D5635AQFRuIFBYjbuTw/profile-framedphoto-shrink_400_400/B56ZYLhd5_H0Ac-/0/1743950045103?e=1747911600&v=beta&t=nAYNEQ-LIHFPlZabv7Bt0ScTj3cyAjGhOShAH9vjA6w' }}
                resizeMode="cover"
                alt="Profile Image"
                style={tw`w-40 h-40 rounded-full`}
              />
            </View>



          </View>

          {/* Info Card */}
          <View style={tw`bg-white rounded-3xl shadow-lg p-6 mb-6`}>
            <Text style={tw`text-xl font-bold text-violet-700 mb-4 border-b border-gray-200 pb-2`}>
              Personal Information
            </Text>

            <View style={tw`space-y-5`}>
              <ProfileItem
                icon={<Icon name="user" size={24} color="#77368e" />}
                label="Full Name"
                value={userData?.name}
              />
              <ProfileItem
                icon={<Icon name="mail" size={24} color="#77368e" />}
                label="Email"
                value={userData?.email}
              />

              <ProfileItem
                icon={<Icon name="phone" size={24} color="#77368e" />}
                label="Phone"
                value={userData?.phone}
              />

              <ProfileItem
                icon={<Icon name="calendar" size={24} color="#77368e" />}
                label="Date of Birth"
                value={userData?.dob}
              />

              <ProfileItem
                icon={<Icon name="user" size={24} color="#77368e" />}
                label="Gender"
                value={userData?.gender}
              />
            </View>
          </View>

          {/* Education Card */}
          <View style={tw`bg-white rounded-3xl shadow-lg p-6`}>
            <Text style={tw`text-xl font-bold text-violet-700 mb-4 border-b border-gray-200 pb-2`}>
              Education
            </Text>

            <View style={tw`space-y-5`}>
              <ProfileItem
                icon={<School name="school" size={24} color="#77368e" />}
                label="School"
                value={userData?.schoolName}
              />

              <ProfileItem
                icon={<School name="git-branch-outline" size={24} color="#77368e" />}
                label="Major"
                value={userData?.major}
              />

              <ProfileItem
                icon={<School name="time" size={24} color="#77368e" />}
                label="Class Year"
                value={userData?.classYear}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper component for profile items
const ProfileItem = ({ icon, label, value }) => {
  return (
    <View style={tw`flex-row items-center`}>
      <View style={tw`w-10`}>{icon}</View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
        <Text style={tw`text-lg font-medium text-gray-800`}>{value || 'Not specified'}</Text>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});