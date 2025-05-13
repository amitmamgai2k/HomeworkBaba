import { ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
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
  const [selectedValue, setSelectedValue] = useState("high");
  const [fileUri, setFileUri] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // allows all file types
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result) {
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
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-3xl font-bold mb-6 text-center text-violet-800`}>Create New Assignment</Text>

          <View style={tw`flex flex-col gap-5 mb-6`}>
            {/* Full Name Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Full Name</Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                placeholder="Enter your full name"
              />
            </View>

            {/* Roll Number Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Roll Number / Student ID</Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                placeholder="Enter your roll number"
              />
            </View>

            {/* Assignment Title Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Assignment Title</Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                placeholder="Enter assignment title"
              />
            </View>

            {/* Subject Name Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Subject Name</Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                placeholder="Enter subject name"
              />
            </View>

            {/* Date Picker Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Completion Date</Text>
              <TouchableOpacity
                style={tw`flex flex-row items-center border border-gray-300 bg-gray-50 rounded-lg px-3`}
                onPress={() => setShowPicker(true)}
              >
                <Icon name="calendar" size={20} color="#6366F1" />
                <TextInput
                  style={tw`flex-1 px-3 py-3 text-gray-800`}
                  placeholder="Select date"
                  value={date.toLocaleDateString('en-CA')}
                  editable={false}
                />
              </TouchableOpacity>
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

            {/* Priority Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Assignment Priority</Text>
              <View style={tw`border border-gray-300 bg-gray-50 rounded-lg`}>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => setSelectedValue(itemValue)}
                  style={tw`text-gray-800`}
                >
                  <Picker.Item label="High Priority" value="high" />
                  <Picker.Item label="Medium Priority" value="medium" />
                  <Picker.Item label="Low Priority" value="low" />
                </Picker>
              </View>
            </View>

            {/* Description Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Assignment Description</Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800 h-24`}
                placeholder="Enter detailed description"
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            {/* File Upload Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>Upload File / Link</Text>
              <TouchableOpacity
                style={tw`flex flex-row items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-3`}
                onPress={pickDocument}
              >
                <Icon name="document-text" size={20} color="#6366F1" />
                <Text style={tw`ml-3 text-gray-500 flex-1`}>
                  {fileUri ? fileUri : "Select a file"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`bg-violet-600 py-4 rounded-xl items-center shadow-md mb-6`}
            onPress={handleSubmit}
          >
            <Text style={tw`text-white font-semibold`}>CREATE ASSIGNMENT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateAssignment