import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../tailwind';
import { useAuth } from '../context/UserContext';
import { fetchAssignments } from '../Redux/Slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const MyAssignment = () => {
  const { user } = useAuth();
  const uid = user?.uid;


  const assignments = useSelector((state) => state.user?.assignments || []);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAssignments = async () => {
      if (!uid) {
        console.error("User ID is not available");
        return;
      }
      setLoading(true);
      try {
        await dispatch(fetchAssignments(uid)).unwrap();
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
      setLoading(false);
    };

    loadAssignments();
  }, [uid, dispatch]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-300 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (completionDate) => {
    return new Date(completionDate) < new Date();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilePress = (fileUrl) => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch(err => console.error('Error opening file:', err));
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-violet-50`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View>
          {loading ? (
            <Text style={tw`text-center text-lg text-gray-700`}>Loading assignments...</Text>
          ) : (
            <View>
              <Text style={tw`text-2xl font-bold mb-4 text-center text-violet-800`}>My Assignments</Text>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <View
                    key={assignment._id || index}
                    style={tw`mb-4 p-4 border-2 border-white rounded-lg shadow-lg bg-violet-200`}
                  >
                    {/* Header Row */}
                    <View style={tw`flex flex-row justify-between items-center mb-3`}>
                      <Text style={tw`text-xs text-gray-600 font-mono`}>
                        ID: {assignment._id}
                      </Text>
                      <View style={tw`px-2 py-1 rounded-full ${getPriorityColor(assignment.priority)}`}>
                        <Text style={tw`text-xs font-semibold capitalize`}>
                          {assignment.priority}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`flex flex-row justify-between items-center mb-3`}>
                      <Text style={tw`text-lg font-bold text-black mb-2 `}>
                      {assignment.assignmentTitle}
                    </Text>
                      <View style={tw`px-2 py-1 rounded-full ${getStatusColor(assignment.status)}`}>
                        <Text style={tw`text-xs font-semibold capitalize`}>
                          {assignment.status}
                        </Text>
                      </View>
                    </View>

                    {/* Assignment Title */}


                    {/* Subject and Student Info */}
                    <View style={tw`flex flex-row justify-between mb-2`}>
                      <Text style={tw`text-gray-700 font-semibold`}>
                        Subject: <Text style={tw`font-normal`}>{assignment.subjectName}</Text>
                      </Text>
                      <Text style={tw`text-gray-700 font-semibold`}>
                        Roll Number: <Text style={tw`font-normal`}>{assignment.rollNumber}</Text>
                      </Text>
                    </View>

                    {/* Student Name */}
                    <Text style={tw`text-gray-700 font-semibold mb-2`}>
                      Name: <Text style={tw`font-normal`}>{assignment.fullName}</Text>
                    </Text>

                    {/* Due Date */}
                    <View style={tw`mb-2`}>
                      <Text style={tw`text-gray-700 font-semibold`}>
                        Due Date:
                        <Text style={tw`font-normal ${isOverdue(assignment.completionDate) ? 'text-red-600' : 'text-gray-700'}`}>
                          {' '}{formatDate(assignment.completionDate)}
                        </Text>
                        {isOverdue(assignment.completionDate) && (
                          <Text style={tw`text-red-600 font-bold`}> (OVERDUE)</Text>
                        )}
                      </Text>
                    </View>

                    {/* Description */}
                    <Text style={tw`text-gray-700 font-semibold mb-2`}>
                      Description:
                    </Text>
                    <Text style={tw`text-gray-600 mb-3 leading-5`}>
                      {assignment.description}
                    </Text>

                    {/* File Attachment */}
                    {assignment.fileUrl && (
                      <TouchableOpacity
                        onPress={() => handleFilePress(assignment.fileUrl)}
                        style={tw`bg-violet-600 px-3 py-2 rounded-md mb-2`}
                      >
                        <Text style={tw`text-white text-center font-semibold`}>
                          📎 View Attachment
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Created Date */}
                    <Text style={tw`text-xs text-gray-500 mt-2`}>
                      Created: {formatDate(assignment.createdAt)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={tw`flex items-center justify-center py-10`}>
                  <Text style={tw`text-center text-gray-700 text-lg mb-2`}>📋</Text>
                  <Text style={tw`text-center text-gray-700`}>No assignments found.</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAssignment;

const styles = StyleSheet.create({});