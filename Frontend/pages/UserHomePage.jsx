import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, RefreshControl, ToastAndroid, Animated, Modal } from 'react-native';
import React, { useCallback, useEffect, useState, useContext, useRef } from 'react';
import tw from '../tailwind';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/UserContext';
import { fetchAssignmentStatus, fetchAssignments } from '../Redux/Slices/userSlice';
import { SocketContext } from '../context/SocketContext.js';

const UserHomePage = ({ navigation }) => {
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);


  const dispatch = useDispatch();

  const [userData, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showAll, setShowAll] = useState({ assignments: false, categories: false });

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

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
    loadNotifications();
  }, [user?.uid]);

  useEffect(() => {

      socket.on("assignmentCreated", (data) => {
        addNotification({
          id: Date.now(),
          title: "New Assignment Created",
          message: data.message,
          type: "assignment",
          timestamp: new Date(),
          read: false,
          data: data
        });
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      });


      return () => {
        socket.off("assignmentCreated");

      };

  }, [socket]);

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

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(`NOTIFICATIONS_${user?.uid}`);
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = async (newNotifications) => {
    try {
      await AsyncStorage.setItem(`NOTIFICATIONS_${user?.uid}`, JSON.stringify(newNotifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 50);
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => prev + 1);

    // Animate badge
    Animated.sequence([
      Animated.timing(badgeAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(badgeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);

      if (notification && !notification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }

      return updated;
    });
  };

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment': return 'book';
      case 'update': return 'edit';
      case 'deadline': return 'clock';
      default: return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'assignment': return '#8B5CF6';
      case 'update': return '#10B981';
      case 'deadline': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
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
  const NotificationItem = ({ notification }) => (
    <TouchableOpacity
      style={[tw`p-4 border-b border-gray-100 flex-row`, !notification.read && tw`bg-violet-50`]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={[tw`w-10 h-10 rounded-full items-center justify-center mr-3`, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
        <MaterialIcons name={getNotificationIcon(notification.type)} size={20} color={getNotificationColor(notification.type)} />
      </View>
      <View style={tw`flex-1`}>
        <Text style={[tw`font-semibold text-gray-800`, !notification.read && tw`text-violet-800`]}>
          {notification.title}
        </Text>
        <Text style={tw`text-gray-600 text-sm mt-1`} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={tw`text-gray-400 text-xs mt-2`}>
          {formatTime(notification.timestamp)}
        </Text>
      </View>
      {!notification.read && (
        <View style={tw`w-2 h-2 bg-violet-500 rounded-full mt-2`} />
      )}
      <TouchableOpacity
        style={tw`p-1 ml-2`}
        onPress={() => deleteNotification(notification.id)}
      >
        <MaterialIcons name="close" size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const NotificationDropdown = () => (
    <Modal
      visible={showNotifications}
      transparent={true}
      animationType="none"
      onRequestClose={() => setShowNotifications(false)}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black/20`}
        activeOpacity={1}
        onPress={() => setShowNotifications(false)}
      >
        <Animated.View
          style={[
            tw`absolute top-20 right-4 w-80 bg-white rounded-xl shadow-lg max-h-96`,
            {
              opacity: notificationAnim,
              transform: [{
                translateY: notificationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })
              }]
            }
          ]}
        >
          {/* Header */}
          <View style={tw`p-4 border-b border-gray-100 flex-row justify-between items-center`}>
            <Text style={tw`font-bold text-lg text-gray-800`}>Notifications</Text>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity onPress={markAllAsRead} style={tw`mr-3`}>
                <Text style={tw`text-violet-500 text-sm`}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <MaterialIcons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView style={tw`max-h-80`} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={tw`p-8 items-center`}>
                <MaterialIcons name="notifications-none" size={48} color="#D1D5DB" />
                <Text style={tw`text-gray-500 mt-2`}>No notifications yet</Text>
              </View>
            ) : (
              notifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

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
            <TouchableOpacity
              style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center`}
              onPress={toggleNotifications}
            >
              <Icon name="notifications" size={20} color="#fff" />
              {unreadCount > 0 && (
                <Animated.View
                  style={[
                    tw`absolute -top-1 -right-1 min-w-3 h-3 bg-red-500 rounded-full items-center justify-center px-1`,
                    { transform: [{ scale: badgeAnim }] }
                  ]}
                >
                  <Text style={tw`text-white text-xs font-bold`}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </Animated.View>
              )}
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

      {/* Notification Dropdown */}
      <NotificationDropdown />

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