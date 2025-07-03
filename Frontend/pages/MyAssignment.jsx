import { Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../tailwind';
import { useAuth } from '../context/UserContext';
import { fetchAssignments, deleteAssignment } from '../Redux/Slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MyAssignment = () => {
  const { user } = useAuth();
  const assignments = useSelector((state) => state.user?.assignments || []);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        await dispatch(fetchAssignments({ uid: user.uid })).unwrap();
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
      setLoading(false);
    };
    loadAssignments();
  }, [user?.uid, dispatch]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'overdue': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const isOverdue = (date) => new Date(date) < new Date();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const handleFilePress = (fileUrl) => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch(err => console.error('Error opening file:', err));
    }
  };

  const handleDelete = (assignmentId, title) => {
    Alert.alert(
      'Delete Assignment',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteAssignment(assignmentId))
              .unwrap()
              .then(() => {
                navigator.navigate('UserHomePage');
              })
              .catch((error) => {
                console.error('Error deleting assignment:', error);
              });
          }
        }
      ]
    );





  };

  const StatusBadge = ({ status }) => (
    <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: getStatusColor(status) + '20' }]}>
      <Text style={[tw`text-xs font-bold`, { color: getStatusColor(status) }]}>
        {status?.toUpperCase()}
      </Text>
    </View>
  );

  const PriorityBadge = ({ priority }) => (
    <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: getPriorityColor(priority) + '20' }]}>
      <Text style={[tw`text-xs font-bold`, { color: getPriorityColor(priority) }]}>
        {priority?.toUpperCase()}
      </Text>
    </View>
  );

  const AssignmentCard = ({ assignment }) => (
    <View style={tw`bg-white rounded-xl p-5 mb-4 shadow-sm border border-gray-100`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View style={tw`flex-1 mr-3`}>
          <Text style={tw`text-xs text-gray-500 font-medium mb-1`}>ASSIGNMENT TITLE</Text>
          <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{assignment.assignmentTitle}</Text>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-xs text-gray-500 font-medium mr-2`}>SUBJECT:</Text>
            <Text style={tw`text-violet-600 font-medium`}>{assignment.subjectName}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(assignment._id)}
          style={tw`p-2 bg-red-50 rounded-lg`}
        >
          <Icon name="delete-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Status & Priority */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View>
          <Text style={tw`text-xs text-gray-500 font-medium mb-1`}>STATUS</Text>
          <StatusBadge status={assignment.status} />
        </View>
        <View>
          <Text style={tw`text-xs text-gray-500 font-medium mb-1`}>PRIORITY</Text>
          <PriorityBadge priority={assignment.priority} />
        </View>
      </View>

      {/* Info Grid */}
      <View style={tw`mb-4 space-y-2`}>
        <View style={tw`flex-row justify-between`}>
          <View style={tw`flex-1 mr-2`}>
            <Text style={tw`text-xs text-gray-500 font-medium`}>STUDENT NAME</Text>
            <Text style={tw`text-gray-800 font-medium`}>{assignment.fullName}</Text>
          </View>
          <View>
            <Text style={tw`text-xs text-gray-500 font-medium`}>ROLL NUMBER</Text>
            <Text style={tw`text-gray-800 font-medium`}>{assignment.rollNumber}</Text>
          </View>
        </View>

        <View>
          <Text style={tw`text-xs text-gray-500 font-medium mb-1`}>DUE DATE</Text>
          <View style={tw`flex-row items-center`}>
            <Icon name="schedule" size={16} color={isOverdue(assignment.completionDate) ? '#EF4444' : '#6B7280'} />
            <Text style={[tw`text-sm ml-1 font-medium`, isOverdue(assignment.completionDate) ? tw`text-red-600` : tw`text-gray-700`]}>
              {formatDate(assignment.completionDate)}
              {isOverdue(assignment.completionDate) && ' (OVERDUE)'}
            </Text>
          </View>
        </View>
      </View>

      {/* Description */}
      {assignment.description && (
        <View style={tw`mb-4`}>
          <Text style={tw`text-xs text-gray-500 font-medium mb-2`}>DESCRIPTION</Text>
          <Text style={tw`text-gray-700 leading-5`}>{assignment.description}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={tw`pt-3 border-t border-gray-100`}>
        {assignment.fileUrl && (
          <View style={tw`mb-3`}>
            <Text style={tw`text-xs text-gray-500 font-medium mb-2`}>ATTACHMENT</Text>
            <TouchableOpacity
              onPress={() => handleFilePress(assignment.fileUrl)}
              style={tw`flex-row items-center bg-violet-100 px-4 py-3 rounded-lg`}
            >
              <AntDesign name="paperclip" size={16} color="#8B5CF6" />
              <Text style={tw`text-violet-700 font-medium ml-2`}>View Attached File</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-xs text-gray-500 font-medium`}>CREATED</Text>
            <Text style={tw`text-xs text-gray-600`}>
              {formatDate(assignment.createdAt)}
            </Text>
          </View>
          <View>
            <Text style={tw`text-xs text-gray-500 font-medium`}>ID</Text>
            <Text style={tw`text-xs text-gray-600 font-mono`}>
              {assignment._id?.slice(-8)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Loading assignments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`bg-violet-600 px-6 pt-4 pb-6 rounded-b-3xl`}>
        <Text style={tw`text-2xl font-bold text-white text-center`}>My Assignments</Text>
        <Text style={tw`text-violet-200 text-center mt-1`}>{assignments.length} assignments</Text>
      </View>

      <ScrollView style={tw`flex-1 px-4 -mt-2`} showsVerticalScrollIndicator={false}>
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <AssignmentCard key={assignment._id || index} assignment={assignment} />
          ))
        ) : (
          <View style={tw`bg-white rounded-xl p-8 mt-4 items-center`}>
            <Icon name="assignment" size={48} color="#D1D5DB" />
            <Text style={tw`text-gray-500 text-lg mt-3`}>No assignments found</Text>
            <Text style={tw`text-gray-400 text-center mt-1`}>Your assignments will appear here</Text>
          </View>
        )}
        <View style={tw`h-4`} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAssignment;