import { StatusBar } from 'expo-status-bar';
import {  Text, View } from 'react-native';
import tw from './tailwind';
export default function App() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-2xl text-blue-500 bg-red-400`}>Hello, world!</Text>
      <StatusBar style="auto" />
  </View>

  );
}

