import React from "react";
import { SafeAreaView, Text,View } from "react-native";
import tw from "./tailwind";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartPage from "./pages/StartPage";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
const App = () => {
	return (
		<>
			<StatusBar hidden={true} />
			<NavigationContainer>
				<SafeAreaView style={tw`flex-1`}>
					<Stack.Navigator initialRouteName="StartPage">
						<Stack.Screen
							name="StartPage"
							component={StartPage}
							options={{
								headerShown: false,
							}}
						/>
					</Stack.Navigator>
				</SafeAreaView>
			</NavigationContainer>
		</>
	);
};

export default App;