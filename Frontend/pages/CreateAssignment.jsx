import { ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import tw from '../tailwind'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import * as DocumentPicker from 'expo-document-picker'
import { useAuth } from '../context/UserContext'
import { createAssignment } from '../Redux/Slices/userSlice';
import { useDispatch } from 'react-redux'

const CreateAssignment = ({ navigation }) => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    title: '',
    subject: '',
    description: '',
  })

  // Separate states for complex fields
  const [completionDate, setCompletionDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [priority, setPriority] = useState('high')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form validation
  const validateForm = () => {
    const errors = []

    if (!formData.fullName.trim()) errors.push('Full name is required')
    if (!formData.rollNumber.trim()) errors.push('Roll number is required')
    if (!formData.title.trim()) errors.push('Assignment title is required')
    if (!formData.subject.trim()) errors.push('Subject name is required')
    if (!formData.description.trim()) errors.push('Description is required')

    if (completionDate <= new Date()) {
      errors.push('Completion date must be in the future')
    }

    return errors
  }

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle date picker
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setCompletionDate(selectedDate)
    }
  }

  // Handle document picker
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0]
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          size: file.size,
          type: file.mimeType
        })
        ToastAndroid.show('File selected successfully', ToastAndroid.SHORT)
      }
    } catch (error) {
      console.error('Error picking document:', error)
      ToastAndroid.show('Error selecting file', ToastAndroid.SHORT)
    }
  }

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null)
    ToastAndroid.show('File removed', ToastAndroid.SHORT)
  }

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm()

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'))
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare assignment data
      const assignmentData = {
        uid: user?.uid || '',
        fullName: formData.fullName.trim(),
        rollNumber: formData.rollNumber.trim(),
         assignmentTitle: formData.title.trim(),
        subjectName: formData.subject.trim(),
        completionDate: completionDate.toISOString(),
        priority: priority,
        description: formData.description.trim(),
        fileUrl: selectedFile,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }

      // TODO: Replace with actual API call
      await dispatch(createAssignment(assignmentData))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      ToastAndroid.show('Assignment created successfully!', ToastAndroid.SHORT)
      navigation.navigate('UserHomePage')

    } catch (error) {
      console.error('Error creating assignment:', error)
      ToastAndroid.show('Failed to create assignment. Please try again.', ToastAndroid.LONG)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={tw`px-4 py-6`}>
          <Text style={tw`text-3xl font-bold mb-6 text-center text-violet-800`}>
            Create New Assignment
          </Text>

          <View style={tw`flex flex-col gap-5 mb-6`}>
            {/* Full Name Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Full Name *
              </Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Roll Number Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Roll Number / Student ID *
              </Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                value={formData.rollNumber}
                onChangeText={(value) => handleInputChange('rollNumber', value)}
                placeholder="Enter your roll number"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Assignment Title Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Assignment Title *
              </Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                placeholder="Enter assignment title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Subject Name Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Subject Name *
              </Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800`}
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholder="Enter subject name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Date Picker Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Completion Date *
              </Text>
              <TouchableOpacity
                style={tw`flex flex-row items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-3`}
                onPress={() => setShowDatePicker(true)}
              >
                <Icon name="calendar" size={20} color="#6366F1" />
                <Text style={tw`flex-1 px-3 text-gray-800`}>
                  {completionDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
                <Icon name="chevron-down" size={16} color="#9CA3AF" />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={completionDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Priority Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Assignment Priority
              </Text>
              <View style={tw`border border-gray-300 bg-gray-50 rounded-lg`}>
                <Picker
                  selectedValue={priority}
                  onValueChange={(itemValue) => setPriority(itemValue)}
                  style={tw`text-gray-800`}
                >
                  <Picker.Item label=" High Priority" value="high" />
                  <Picker.Item label=" Medium Priority" value="medium" />
                  <Picker.Item label=" Low Priority" value="low" />
                </Picker>
              </View>
            </View>

            {/* Description Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Assignment Description *
              </Text>
              <TextInput
                style={tw`border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 w-full text-gray-800 h-24`}
                placeholder="Enter detailed description of the assignment"
                placeholderTextColor="#9CA3AF"
                multiline={true}
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                textAlignVertical="top"
              />
            </View>

            {/* File Upload Field */}
            <View style={tw`bg-white p-4 rounded-xl shadow-sm border border-gray-200`}>
              <Text style={tw`text-sm font-semibold mb-2 text-gray-700`}>
                Upload File (Optional)
              </Text>

              {!selectedFile ? (
                <TouchableOpacity
                  style={tw`flex flex-row items-center border border-gray-300 bg-gray-50 rounded-lg px-3 py-3`}
                  onPress={pickDocument}
                >
                  <Icon name="document-attach" size={20} color="#6366F1" />
                  <Text style={tw`ml-3 text-gray-500 flex-1`}>
                    Select a file or document
                  </Text>
                  <Icon name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={tw`border border-green-300 bg-green-50 rounded-lg px-3 py-3`}>
                  <View style={tw`flex flex-row items-center justify-between`}>
                    <View style={tw`flex flex-row items-center flex-1`}>
                      <Icon name="document" size={20} color="#059669" />
                      <View style={tw`ml-3 flex-1`}>
                        <Text style={tw`text-gray-800 font-medium`} numberOfLines={1}>
                          {selectedFile.name}
                        </Text>
                        <Text style={tw`text-gray-500 text-xs`}>
                          {formatFileSize(selectedFile.size)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={removeFile} style={tw`ml-2`}>
                      <Icon name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={tw`${isSubmitting ? 'bg-gray-400' : 'bg-violet-600'} py-4 rounded-xl items-center shadow-md mb-6`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={tw`text-white font-semibold text-lg`}>
              {isSubmitting ? 'CREATING...' : 'CREATE ASSIGNMENT'}
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-gray-500 text-xs text-center`}>
            Fields marked with * are required
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateAssignment