import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import tw from '../tailwind';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/UserContext';
import { fetchAssignmentStatus, fetchAssignments } from '../Redux/Slices/userSlice';
import { SocketContext } from '../socket.js';

const UserHomePage = ({ navigation }) => {
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();

  const [userData, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState({ assignments: false, categories: false });

  const { assignmentStatus } = useSelector((state) => state.user);
  const assignments = useSelector((state) => state.user?.assignments || []);

  // Data Configuration
  const CATEGORIES = [
    { id: 1, title: 'Coding', icon: 'code', color: '#8B5CF6' },
    { id: 2, title: 'Mathematics', icon: 'calculate', color: '#EC4899' },
    { id: 3, title: 'Science', icon: 'science', color: '#10B981' },
    { id: 4, title: 'Literature', icon: 'book', color: '#F59E0B' },
    { id: 5, title: 'History', icon: 'public', color: '#3B82F6' },
    { id: 6, title: 'Art & Design', icon: 'palette', color: '#6366F1' }
  ];

  const ASSIGNMENT_TYPES = [
    { id: 1, title: 'Essays', icon: 'edit', color: '#8B5CF6', count: 5 },
    { id: 2, title: 'Reports', icon: 'bar-chart', color: '#EC4899', count: 3 },
    { id: 3, title: 'Presentations', icon: 'laptop', color: '#10B981', count: 2 },
    { id: 4, title: 'Projects', icon: 'folder', color: '#F59E0B', count: 4 }
  ];

  const STATS = [
    { key: 'overdue', label: 'Overdue', icon: 'exclamationcircle', color: '#EF4444' },
    { key: 'pending', label: 'Pending', icon: 'clockcircle', color: '#F59E0B' },
    { key: 'completed', label: 'Completed', icon: 'checkcircle', color: '#10B981' }
  ];

  // Effects
  useEffect(() => {
    socket?.emit("join", { userId: user?.uid });
    loadUserData();
    loadAssignments();
  }, [user?.uid]);

  useEffect(() => {
   socket.on("assignmentCreated", (data) => {
    ToastAndroid.show(data.message, ToastAndroid.SHORT);
});
});


  // Helper Functions
  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('USER_DATA');
      if (data) setUser(JSON.parse(data));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadAssignments = async () => {
    if (!user?.uid) return;
    try {
      await Promise.all([
        dispatch(fetchAssignmentStatus(user.uid)).unwrap(),
        dispatch(fetchAssignments({ uid: user.uid, status: 'overdue' })).unwrap()
      ]);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAssignments().finally(() => setRefreshing(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatAssignments = () => assignments.map((assignment, index) => ({
    id: index + 1,
    title: assignment.assignmentTitle,
    subject: assignment.subjectName,
    dueDate: new Date(assignment.completionDate).toLocaleDateString(),
    priority: assignment.priority
  }));

  // Component Renderers
  const StatCard = ({ stat }) => (
    <TouchableOpacity style={tw`flex-1 bg-white/20 rounded-xl mx-1 p-4`}>
      <View style={[tw`w-10 h-10 rounded-lg justify-center items-center mb-2`, { backgroundColor: `${stat.color}30` }]}>
        <AntDesign name={stat.icon} size={20} color="#fff" />
      </View>
      <Text style={tw`text-white text-2xl font-bold`}>{assignmentStatus?.[stat.key] || 0}</Text>
      <Text style={tw`text-white/90 text-sm`}>{stat.label}</Text>
    </TouchableOpacity>
  );

  const CategoryChip = ({ category }) => (
    <TouchableOpacity
      style={[tw`mr-3 px-4 py-2 rounded-full flex-row items-center`, { backgroundColor: category.color }]}
    >
      <MaterialIcons name={category.icon} size={16} color="#fff" />
      <Text style={tw`text-white font-medium ml-2 text-sm`}>{category.title}</Text>
    </TouchableOpacity>
  );

  const AssignmentCard = ({ assignment }) => (
    <TouchableOpacity style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm`}>
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <Text style={tw`text-gray-800 font-bold flex-1`} numberOfLines={1}>
          {assignment.title}
        </Text>
        <View style={[tw`px-2 py-1 rounded-full`, { backgroundColor: assignment.priority === 'high' ? '#FEE2E2' : assignment.priority === 'medium' ? '#FEF3C7' : '#DBEAFE' }]}>
          <Text style={[tw`text-xs font-bold`, { color: assignment.priority === 'high' ? '#DC2626' : assignment.priority === 'medium' ? '#D97706' : '#2563EB' }]}>
            {assignment.priority?.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`text-gray-500 text-sm`}>{assignment.subject}</Text>
        <Text style={tw`text-gray-400 text-xs`}>Due: {assignment.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );

  const TypeCard = ({ type }) => (
    <TouchableOpacity style={tw`bg-white rounded-xl p-4 w-[48%] mb-3 shadow-sm`}>
      <View style={[tw`w-10 h-10 rounded-lg items-center justify-center mb-3`, { backgroundColor: `${type.color}20` }]}>
        <MaterialIcons name={type.icon} size={20} color={type.color} />
      </View>
      <Text style={tw`text-gray-800 font-bold mb-1`}>{type.title}</Text>
      <Text style={tw`text-gray-500 text-xs`}>{type.count} items</Text>
    </TouchableOpacity>
  );

  const NavButton = ({ icon, label, onPress, active = false }) => (
    <TouchableOpacity style={tw`flex-1 items-center py-3`} onPress={onPress}>
      <View style={[tw`p-2 rounded-xl mb-1`, active ? tw`bg-violet-500` : tw`bg-gray-100`]}>
        <AntDesign name={icon} size={20} color={active ? "#fff" : "#6B7280"} />
      </View>
      <Text style={[tw`text-xs font-medium`, active ? tw`text-violet-600` : tw`text-gray-500`]}>{label}</Text>
    </TouchableOpacity>
  );

  const userName = userData?.name || 'User';
  const dueAssignments = formatAssignments();
  const displayedAssignments = showAll.assignments ? dueAssignments : dueAssignments.slice(0, 3);
  const displayedTypes = showAll.categories ? ASSIGNMENT_TYPES : ASSIGNMENT_TYPES.slice(0, 4);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-24`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={[tw`px-5 pt-6 pb-6 rounded-b-3xl`, styles.headerGradient]}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-12 h-12 bg-white rounded-full justify-center items-center mr-3`}>
                <Text style={tw`text-violet-500 font-bold text-lg`}>{userName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={tw`text-xl font-bold text-white`}>{getGreeting()}</Text>
                <Text style={tw`text-white/90`}>{userName}</Text>
              </View>
            </View>
            <TouchableOpacity style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center`}>
              <Icon name="notifications" size={20} color="#fff" />
              <View style={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full`} />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={tw`flex-row justify-between`}>
            {STATS.map(stat => <StatCard key={stat.key} stat={stat} />)}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={tw`px-5 mt-6`}>
          <TouchableOpacity
            style={tw`bg-violet-600 py-4 rounded-xl flex-row justify-center items-center`}
            onPress={() => navigation.navigate('CreateAssignment')}
          >
            <AntDesign name="plus" size={18} color="#fff" />
            <Text style={tw`text-white font-bold ml-2`}>Create Assignment</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={tw`px-5 mt-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map(category => <CategoryChip key={category.id} category={category} />)}
          </ScrollView>
        </View>

        {/* Due Assignments */}
        <View style={tw`px-5 mt-6`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>Recent Assignments</Text>
            <TouchableOpacity onPress={() => setShowAll(prev => ({ ...prev, assignments: !prev.assignments }))}>
              <Text style={tw`text-violet-500 font-medium`}>
                {showAll.assignments ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          {displayedAssignments.map(assignment => <AssignmentCard key={assignment.id} assignment={assignment} />)}
        </View>

        {/* Assignment Types */}
        <View style={tw`px-5 mt-6`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Assignment Types</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {displayedTypes.map(type => <TypeCard key={type.id} type={type} />)}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2`}>
        <View style={tw`flex-row justify-around`}>
          <NavButton icon="home" label="Home" onPress={() => navigation.navigate('UserHomePage')} active />
          <NavButton icon="plus" label="Create" onPress={() => navigation.navigate('CreateAssignment')} />
          <NavButton icon="book" label="My Assignments" onPress={() => navigation.navigate('MyAssignments')} />
          <NavButton icon="user" label="Profile" onPress={() => navigation.navigate('UserProfile')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default UserHomePage;