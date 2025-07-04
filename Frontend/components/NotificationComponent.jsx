// NotificationComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ToastAndroid, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from '../tailwind';

const NotificationComponent = ({ socket, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  // Debug: Log notifications changes
  useEffect(() => {
    console.log("📊 Notifications updated:", notifications.length, "notifications");
    console.log("📋 Notification IDs:", notifications.map(n => n.id));
  }, [notifications]);

  useEffect(() => {
    if (socket) {


      // Assignment created notifications
      socket.on("assignmentCreated", (data) => {
        console.log("📝 Assignment created notification:", data);
        const newNotification = {
          id: Date.now(),
          title: "New Assignment Created",
          message: data.message,
          type: "assignment_created",
          time: new Date().toLocaleTimeString(),
          read: false
        };
        addNotification(newNotification);

      });

      // Assignment completed notifications
      socket.on("assignmentCompleted", (data) => {
        console.log("🎉 Assignment completed notification:", data);
        const newNotification = {
          id: Date.now(),
          title: "Assignment Completed",
          message: data.message,
          type: "assignment_completed",
          time: new Date().toLocaleTimeString(),
          read: false,
          fileUrl: data.fileUrl,
          assignmentId: data.assignmentId
        };
        addNotification(newNotification);

      });

      return () => {
        console.log("🧹 NotificationComponent: Cleaning up socket listeners");
        socket.off("assignmentCreated");
        socket.off("assignmentCompleted");
      };
    }
  }, [socket, addNotification]); // Added addNotification to dependencies

  // Load notifications from AsyncStorage
  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(`notifications_${userId}`);
      if (stored) {
        const notifications = JSON.parse(stored);
        setNotifications(notifications);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Save notifications to AsyncStorage - FIXED: Use useCallback
  const saveNotifications = useCallback(async (notifications) => {
    try {
      await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
      console.log("💾 Saved", notifications.length, "notifications to storage");
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [userId]);

  // Add new notification - FIXED: Use useCallback to prevent stale closure
  const addNotification = useCallback((notification) => {
    console.log("➕ Adding notification:", notification.title);
    setNotifications(prev => {
      console.log("📊 Previous notifications count:", prev.length);
      const updatedNotifications = [notification, ...prev].slice(0, 20);
      console.log("📊 New notifications count:", updatedNotifications.length);
      saveNotifications(updatedNotifications);
      return updatedNotifications;
    });
    setUnreadCount(prev => prev + 1);
  }, [saveNotifications]); // Include saveNotifications in dependencies

  // Handle notification press
  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);

    // If it's a completed assignment with file, open the file
    if (notification.type === 'assignment_completed' && notification.fileUrl) {
      console.log("📄 Opening file:", notification.fileUrl);
      Linking.openURL(notification.fileUrl).catch(err =>
        console.error('Error opening file:', err)
      );
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment_created': return 'assignment';
      case 'assignment_completed': return 'check-circle';
      default: return 'notifications';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'assignment_created': return '#8B5CF6';
      case 'assignment_completed': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    saveNotifications(updatedNotifications);
  };

  // Clear all notifications - FIXED: Use useCallback
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotifications([]);
  }, [saveNotifications]);

  // Notification Modal
  const NotificationModal = () => (
    <Modal
      visible={showNotifications}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowNotifications(false)}
    >
      <TouchableOpacity
        style={tw`flex-1 bg-black/20`}
        activeOpacity={1}
        onPress={() => setShowNotifications(false)}
      >
        <View style={tw`absolute top-20 right-4 w-80 bg-white max-h-96 rounded-xl shadow-lg`}>
          {/* Header */}
          <View style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}>
            <Text style={tw`text-lg font-bold`}>Notifications</Text>
            <View style={tw`flex-row`}>
              <TouchableOpacity onPress={clearAllNotifications} style={tw`mr-3`}>
                <Text style={tw`text-red-500`}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications List */}
          <ScrollView style={tw`max-h-80`}>
            {notifications.length === 0 ? (
              <View style={tw`p-8 items-center`}>
                <MaterialIcons name="notifications-none" size={48} color="#D1D5DB" />
                <Text style={tw`text-gray-500 mt-2`}>No notifications</Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[tw`p-4 border-b border-gray-100 flex-row`, !notification.read && tw`bg-blue-50`]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={[
                    tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                    { backgroundColor: getNotificationColor(notification.type) + '20' }
                  ]}>
                    <MaterialIcons
                      name={getNotificationIcon(notification.type)}
                      size={20}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>

                  <View style={tw`flex-1`}>
                    <Text style={[
                      tw`font-semibold text-gray-800 mb-1`,
                      !notification.read && tw`text-violet-800`
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={tw`text-gray-600 text-sm mb-1`} numberOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text style={tw`text-gray-400 text-xs`}>
                      {notification.time}
                    </Text>

                    {/* Show file download option for completed assignments */}
                    {notification.type === 'assignment_completed' && notification.fileUrl && (
                      <View style={tw`mt-2`}>
                        <Text style={tw`text-green-600 text-xs font-semibold`}>
                          📎 Tap to download file
                        </Text>
                      </View>
                    )}
                  </View>

                  {!notification.read && (
                    <View style={tw`w-2 h-2 bg-blue-500 rounded-full mt-2`} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <>
      <TouchableOpacity
        style={tw`w-10 h-10 bg-white/20 rounded-full justify-center items-center`}
        onPress={() => setShowNotifications(true)}
      >
        <Icon name="notifications" size={20} color={unreadCount > 0 ? "#EF4444" : "#fff"} />
        {unreadCount > 0 && (
          <View style={tw`absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center`}>
            <Text style={tw`text-white text-xs font-bold`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <NotificationModal />
    </>
  );
};

export default NotificationComponent;