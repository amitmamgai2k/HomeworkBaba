import { ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import tw from '../tailwind'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';

const CreateAssignment = ({navigation}) => {
 const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
   const [fileUri, setFileUri] = useState(null);
  const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // allows all file types
      copyToCacheDirectory: true,
      multiple: false,
    });


    if (result ) {
      const uri = result.assets[0].uri;

      setFileUri(uri);
    } else {
      console.log('No file selected or selection cancelled.');
    }
  } catch (error) {
    console.error('Error picking document:', error);
  }
};

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };
  const handleSubmit = () => {
    // Handle form submission logic here
    ToastAndroid.show('Assignment Created Successfully', ToastAndroid.SHORT);

    navigation.navigate('UserHomePage');
    console.log('Form submitted');

  };
  return (
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView showsVerticalScrollIndicator={false} >
    <View>
      <Text style={tw`text-2xl font-bold mb-4 self-center`}>Create New Assignment</Text>
      <View style = {tw`flex flex-col gap-4 `}>
  <View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Enter Your  Full Name</Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="Amit Mamgai"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Enter Your Roll Number / Student Id </Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="02116404524"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Enter Assignment Title </Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="Data Structures Assignment"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Enter Assignment Title </Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="02116404524"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Enter Subject Name</Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="Data Structures and Algorithms"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Pick Assignment Completion Date</Text>
  <TouchableOpacity style={tw`flex flex-row items-center  border border-gray-800 bg-violet-100 px-4 rounded-md `} onPress={() => {
    setShowPicker(true);
  }}>
     <Icon name="calendar" size={24} color="black" onPress={() => {}} />
  <TextInput
    style={tw` bg-violet-100 rounded-md px-4 py-4 `}
    placeholder="2023-10-31"
    value={date.toLocaleDateString('en-CA')}
    editable={false}
  />
  </TouchableOpacity >
     {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
          minimumDate={new Date()}

        />
      )}

</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Select Assignment Priority</Text>
  <View style={tw`bg-violet-100 rounded-md   border border-gray-800  w-full`}>
  <Picker
    selectedValue={selectedValue}
    onValueChange={(itemValue) => setSelectedValue(itemValue)}

  >
    <Picker.Item label="High" value="high" />
    <Picker.Item label="Medium" value="medium" />
    <Picker.Item label="Low" value="low" />
  </Picker>
  </View>

</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Detail Assignment Description</Text>
  <TextInput
    style={tw`border border-gray-800 bg-violet-100 rounded-md px-4 py-4 w-full`}
    placeholder="This assignment is about data structures and algorithms"
  />
</View>
<View style={tw`bg-violet-300 p-4 rounded-lg shadow-md mx-4`}>
  <Text style={tw`text-lg font-semibold mb-2`}>Upload a Sample File / Link</Text>

  <TouchableOpacity
    style={tw`flex flex-row items-center border border-gray-800 bg-violet-100 px-4 py-2 rounded-md`}
    onPress ={pickDocument}
  >
    <Icon name="document-text" size={24} color="black" />
    <TextInput
      style={tw`ml-3 flex-1 bg-violet-100 rounded-md`}
      placeholder="Sample File"
      value={fileUri}
      editable={false}
    />
  </TouchableOpacity>
</View>


<TouchableOpacity style={tw`bg-violet-500 py-4 rounded-lg items-center shadow-lg mb-6 mx-4`} onPress = {handleSubmit}>
  <Text style={tw`text-white text-lg font-semibold`}>Create Assignment</Text>
  </TouchableOpacity>





      </View>
    </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default CreateAssignment

