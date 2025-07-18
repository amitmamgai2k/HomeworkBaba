import { Image, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.config.js'
import tw from '../tailwind'
import Icon from 'react-native-vector-icons/AntDesign'
import School from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const UserProfile = ({ navigation }) => { // Add navigation prop
  const [userData, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('USER_DATA');
        if (data) setUser(JSON.parse(data));
      } catch (error) {
        console.error('Error retrieving data', error);
      }
    };
    getUserData();
  }, []);

  // Simple Firebase logout function
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {

              await signOut(auth);
              navigation.navigate('StartPage'); // Navigate to Login screen after logout


              await AsyncStorage.clear();

            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, label, value }) => (
    <View style={tw`flex-row items-center py-3`}>
      <View style={tw`w-12 h-12 bg-violet-100 rounded-xl items-center justify-center mr-4`}>
        {icon}
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
        <Text style={tw`text-gray-800 font-semibold text-base`}>{value || 'Not specified'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        {/* Header */}
        <View style={tw`bg-violet-600 px-6 pt-4 pb-20 rounded-b-3xl`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-2xl font-bold text-white flex-1 text-center`}>Profile</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center`}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={tw`px-6 -mt-16`}>
          {/* Profile Card */}
          <View style={tw`bg-white rounded-2xl shadow-lg p-6 mb-6 items-center`}>
            <Image
              source={{ uri: userData?.profilePicture || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTML0gExaohZHdZW3609F12nUmVc14WXYNx_w&s' }}
              style={tw`w-24 h-24 rounded-full border-4 border-violet-200`}
            />
            <Text style={tw`text-xl font-bold text-gray-800 mt-4`}>{userData?.name}</Text>
            <Text style={tw`text-violet-600 font-medium`}>{userData?.email}</Text>
          </View>

          {/* Personal Info */}
          <View style={tw`bg-white rounded-2xl shadow-sm p-6 mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Personal Information</Text>
            <ProfileItem icon={<Icon name="user" size={20} color="#8B5CF6" />} label="Full Name" value={userData?.name} />
            <ProfileItem icon={<Icon name="phone" size={20} color="#8B5CF6" />} label="Phone" value={userData?.phone} />
            <ProfileItem icon={<Icon name="calendar" size={20} color="#8B5CF6" />} label="Date of Birth" value={userData?.dob} />
            <ProfileItem icon={<Icon name="user" size={20} color="#8B5CF6" />} label="Gender" value={userData?.gender} />
          </View>

          {/* Education */}
          <View style={tw`bg-white rounded-2xl shadow-sm p-6 mb-4`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Education</Text>
            <ProfileItem icon={<School name="school" size={20} color="#8B5CF6" />} label="School" value={userData?.schoolName} />
            <ProfileItem icon={<School name="git-branch-outline" size={20} color="#8B5CF6" />} label="Major" value={userData?.major} />
            <ProfileItem icon={<School name="time" size={20} color="#8B5CF6" />} label="Class Year" value={userData?.classYear} />
          </View>

          {/* Logout Button */}
          <View style={tw`bg-white rounded-2xl shadow-sm p-6 mb-8`}>
            <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Account Actions</Text>

            <TouchableOpacity
              onPress={handleLogout}
              style={tw`bg-red-500 py-4 rounded-xl flex-row justify-center items-center`}
            >
              <MaterialIcons name="logout" size={20} color="#fff" />
              <Text style={tw`text-white font-bold ml-2 text-base`}>Logout</Text>
            </TouchableOpacity>

            <Text style={tw`text-gray-500 text-xs text-center mt-2`}>
              You will be signed out of your account
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;