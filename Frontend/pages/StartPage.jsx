import React from "react";
import { View, Text,Image, Pressable } from "react-native";
import tw from "../tailwind";
import start from "../assets/start.png";

const StartPage = ({ navigation }) => {
    return (
        <View style={tw`flex-1 items-center justify-center bg-violet-200`}>
            <Image
                source={start}
                resizeMode="contain"
                style={tw`w-100 h-100 mb-4 `}
            />

            <Text style={tw`text-3xl font-bold mb-4`}>Sign up to continue</Text>
            <Pressable
    onPress={() => navigation.navigate("Login")}
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