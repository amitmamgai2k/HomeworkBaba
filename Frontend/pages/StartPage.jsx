import React from "react";
import { View, Text,Image, Pressable } from "react-native";
import tw from "../tailwind";
import start from "../assets/start.png";
import AsyncStorage from "@react-native-async-storage/async-storage";




const StartPage = ({ navigation }) => {
    const handleStart = () => {
    //     console.log('User Data', AsyncStorage.getItem("USER_DATA"));
    //     console.log('User', AsyncStorage.getItem("user"));

    //     if(!AsyncStorage.getItem("user")) {
    //     navigation.navigate("RegisterPage");
    //    }
    //     else if (!AsyncStorage.getItem("USER_DATA")){
    //         navigation.navigate("InputForm");
    //     }
    //     else {
    //         navigation.navigate("UserHomePage");
    //     }
          navigation.navigate("RegisterPage");

    };
    return (
        <View style={tw`flex-1 items-center justify-center bg-violet-200`}>
            <Image
                source={start}
                resizeMode="contain"
                style={tw`w-100 h-100 mb-4 `}
            />

            <Text style={tw`text-2xl font-bold mb-4`}>Sign up to continue</Text>
            <Pressable
    onPress={handleStart}
    style={({ pressed }) => [
        tw`p-4 rounded-full w-[70%] items-center border-2`,
        pressed ? tw`bg-violet-600 border-white` : tw`bg-[#77368e] border-transparent`,
    ]}
>
    <Text style={tw`text-white text-xl font-bold`}>Get Started</Text>
</Pressable>


        </View>
    );
};

export default StartPage;