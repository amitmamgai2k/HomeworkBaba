import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../context/UserContext'


const UserProfile = () => {

    const UserData = AsyncStorage.getItem('USER_DATA');
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <View>
            <Text>UserProfile</Text>
        </View>
    </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({})