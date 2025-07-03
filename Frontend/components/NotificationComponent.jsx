// NotificationComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ToastAndroid } from 'react-native';
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

  useEffect(() => {
    if (socket) {
      socket.on("assignmentCreated", (data) => {
        const newNotification = {
          id: Date.now(),
          message: data.message,
          time: new Date().toLocaleTimeString(),
          read: false
        };
        addNotification(newNotification);
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      });

      return () => {
        socket.off("assignmentCreated");
      };
    }
  }, [socket]);

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

  // Save notifications to AsyncStorage
  const saveNotifications = async (notifications) => {
    try {
      await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Add new notification
  const addNotification = (notification) => {
    const updatedNotifications = [notification, ...notifications].slice(0, 20);
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    saveNotifications(updatedNotifications);
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

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotifications([]);
  };

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
                <Text style={tw`text-gray-500`}>No notifications</Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[tw`p-4 border-b border-gray-100`, !notification.read && tw`bg-blue-50`]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <Text style={tw`text-gray-800 mb-1`}>{notification.message}</Text>
                  <Text style={tw`text-gray-400 text-xs`}>{notification.time}</Text>
                  {!notification.read && (
                    <View style={tw`w-2 h-2 bg-blue-500 rounded-full absolute right-4 top-4`} />
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