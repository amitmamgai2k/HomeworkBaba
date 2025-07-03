import React from "react";
import { SafeAreaView, Text,View } from "react-native";
import tw from "./tailwind";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartPage from "./pages/StartPage";
import { StatusBar } from "expo-status-bar";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/UserContext";
import UserHomePage from "./pages/UserHomePage";
import CreateAssignment from "./pages/CreateAssignment";
import InputForm from "./pages/InputForm";
import VerifyEmail from "./pages/VerifyEmail";
import UserProfile from "./pages/UserProfile";
import MyAssignment from "./pages/MyAssignment";
import { store } from "./Redux/store";
import { Provider } from "react-redux";
import SocketProvider from "./context/SocketContext";


const Stack = createNativeStackNavigator();
const App = () => {
	return (
		<Provider store={store}>

		<AuthProvider>
			<SocketProvider>
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
								<Stack.Screen
									name="RegisterPage"
									component={RegisterPage}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="UserHomePage"
									component={UserHomePage}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="CreateAssignment"
									component={CreateAssignment}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="InputForm"
									component={InputForm}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="VerifyEmail"
									component={VerifyEmail}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="UserProfile"
									component={UserProfile}
									options={{
										headerShown: false,
									}}
								/>
								<Stack.Screen
									name="MyAssignments"
									component={MyAssignment}
									options={{
										headerShown: false,
									}}
								/>


					</Stack.Navigator>

				</SafeAreaView>
			</NavigationContainer>
			</SocketProvider>
		</AuthProvider>


		</Provider>
	);
};

export default App;