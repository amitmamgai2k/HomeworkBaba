import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground, StatusBar, SafeAreaView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from '../tailwind';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const UserHomePage = ({ navigation }) => {
  const userName = 'Amit';
  const currentTime = new Date().getHours();
  let greeting = 'Good Morning';



  if (currentTime >= 12 && currentTime < 17) {
    greeting = 'Good Afternoon';
  } else if (currentTime >= 17) {
    greeting = 'Good Evening';
  }


  const dueAssignments = [
    {
      id: 1,
      title: 'Data Communication And Networking',
      subject: 'Computer Science',
      dueDate: '5/12/2025',
      progress: 65,
      priority: 'high',
    },
    {
      id: 2,
      title: 'Ai and Machine Learning',
      subject: 'Computer Science',
      dueDate: '5/15/2025',
      progress: 20,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Case Study: Market Entry Strategy',
      subject: 'Business',
      dueDate: '5/20/2025',
      progress: 10,
      priority: 'low',
    },

  ];

  const subjects = [
    {
      id: 1,
      title: 'College Assignments',
      icon: 'edit',
      color: '#8B5CF6', // violet-500
      description: 'General assignments and projects',
      count: 5
    },
    {
      id: 2,
      title: 'Reports',
      icon: 'bar-chart',
      color: '#EC4899', // pink-500
      description: 'Technical and experimental reports',
      count: 3
    },
    {
      id: 3,
      title: 'Case Studies',
      icon: 'folder',
      color: '#F59E0B', // amber-500
      description: 'In-depth analysis of specific topics',
      count: 2
    },
    {
      id: 4,
      title: 'Reviews',
      icon: 'star',
      color: '#10B981', // emerald-500
      description: 'Literature and article reviews',
      count: 4
    },
    {
      id: 5,
      title: 'Presentations',
      icon: 'desktop',
      color: '#3B82F6', // blue-500
      description: 'Slideshows and visual presentations',
      count: 1
    },
    {
      id: 6,
      title: 'Hand Written Notes',
      icon: 'pencil',
      color: '#8B5CF6', // violet-500
      description: 'Detailed notes and summaries',
      count: 0

    },
  ];


  const categories = [
    {
      id: 1,
      title: 'Coding',
      icon: 'code',
      color: '#259F2C', // violet-500

    },
    {
      id: 2,
      title: 'Maths',
      icon: 'calculate',
      color: '#EC4899', // pink-500

    },
    {
      id: 3,
      title: 'History',
      icon: 'book',
      color: '#F59E0B', // amber-500

    },
    {
      id: 4,
      title: 'English',
      icon: 'language',
      color: '#10B981', // emerald-500

    },
    {
      id: 5,
      title: 'Physics',
      icon: 'science',
      color: '#3B82F6', // blue-500

    },
    {
      id: 6,
      title: 'Chemistry',
      icon: 'biotech',
      color: '#6366F1', // indigo-500

    },
    {
      id: 7,
      title: 'Biology',
      icon: 'pets',
      color: '#34D399', // green-400

    },
    {
      id: 8,
      title: 'Geography',
      icon: 'public',
      color: '#60A5FA', // blue-400

    },
    {
      id: 9,
      title: 'Economics',
      icon: 'trending-up',
      color: '#F87171', // red-400

    },
  ];




  const [selectedCategory, setSelectedCategory] = useState(null);
const [showAllDueAssignments, setShowAllDueAssignments] = useState(false);
  const displayedDueAssignments = showAllDueAssignments ? dueAssignments : dueAssignments.slice(0, 2);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const displayedSubjects = showAllSubjects ? subjects : subjects.slice(0, 4);

  // Function to render priority indicator
  const renderPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-600',
      medium: 'bg-orange-100 text-orange-600',
      low: 'bg-blue-100 text-blue-600'
    };

    return (
      <View style={tw`${colors[priority].split(' ')[0]} px-2 py-1 rounded-full`}>
        <Text style={tw`${colors[priority].split(' ')[1]} text-xs font-bold uppercase`}>{priority}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50 `}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-24`}>
        {/* Header */}
        <View style={[tw`px-5 pt-6 pb-6 rounded-b-3xl`, styles.headerGradient]}>
          <View style={tw`flex flex-row justify-between items-center mb-4`}>
            <View style={tw`flex flex-row items-center`}>
              <View style={tw`h-10 w-10 bg-white rounded-full justify-center items-center mr-3 shadow-sm`}>
                <Text style={tw`text-violet-500 font-bold text-xl`}>{userName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={tw`text-2xl font-bold text-white`}>Hello, {userName}</Text>
                <Text style={tw`text-white text-opacity-90 text-lg`}>{greeting}</Text>
              </View>
            </View>
            <View style={tw`flex flex-row`}>
              <TouchableOpacity style={tw`w-10 h-10 bg-white bg-opacity-20 rounded-full justify-center items-center relative`}>
                <Icon name="notifications" size={22} color="#fff" />
                <View style={tw`absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border border-white`}></View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Assignment stats */}
          <View style={tw`flex flex-row justify-between`}>
            <TouchableOpacity style={tw`h-30 flex-1 bg-white bg-opacity-20 rounded-2xl mr-3 p-4 justify-between`}>
              <View style={tw`w-10 h-10 bg-white bg-opacity-20 rounded-lg justify-center items-center`}>
                <AntDesign name="clockcircle" size={20} color="#fff" />
              </View>
              <View>
                <Text style={tw`text-white text-3xl font-bold`}>03</Text>
                <Text style={tw`text-white`}>Due Soon</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={tw`h-30 flex-1 bg-white bg-opacity-20 rounded-2xl p-4 justify-between`}>
              <View style={tw`w-10 h-10 bg-white bg-opacity-20 rounded-lg justify-center items-center`}>
                <AntDesign name="checkcircle" size={20} color="#fff" />
              </View>
              <View>
                <Text style={tw`text-white text-3xl font-bold`}>12</Text>
                <Text style={tw`text-white`}>Completed</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Assignments */}
        <View style={tw`px-5 mt-6`}>
          <TouchableOpacity
            style={tw`bg-violet-600 py-4 rounded-2xl flex flex-row justify-center items-center shadow-sm`}
            onPress={() => alert('Create a new assignment')}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={tw`text-white font-bold ml-2 text-lg`}>Add New Assignment</Text>
          </TouchableOpacity>

          <View style={tw`mt-6 `}>
          <View style={tw`flex flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Popular Categories</Text>

          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`pb-2`}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={`category-chip-${category.id}`}
                style={[
                  tw`mr-3 px-4 py-3 rounded-xl flex flex-row items-center shadow-sm`,
                  { backgroundColor: category.color },
                  selectedCategory === category.id && tw`border-2 border-white`
                ]}
                onPress={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              >
                <MaterialIcons name={category.icon} size={18} color="#fff" />
                <Text style={tw`text-white font-bold ml-2`}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        </View>

        {/* Due Assignments */}
        <View style={tw`px-5 mt-4`}>
          <View style={tw`flex flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Due Assignments Status</Text>
            <TouchableOpacity onPress={() => setShowAllDueAssignments(!showAllDueAssignments)}>
              <Text style={tw`text-violet-500 font-semibold`}>{showAllDueAssignments ? 'See less' : 'See all'}</Text>
            </TouchableOpacity>
          </View>

          {displayedDueAssignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={tw`bg-gray-50 p-4 rounded-xl shadow-lg  mb-3 flex flex-row items-center`}
              onPress={() => alert(`Open assignment: ${assignment.title}`)}
            >
              <View style={tw`mr-3`}>
                <View style={[tw`w-12 h-12 rounded-xl items-center justify-center`, { backgroundColor: `${getSubjectColor(assignment.subject, subjects)}20` }]}>
                  <FontAwesome
                    name={getSubjectIcon(assignment.subject, subjects)}
                    size={20}
                    color={getSubjectColor(assignment.subject, subjects)}
                  />
                </View>
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-gray-800 font-bold mb-1`} >
                  {assignment.title}
                </Text>
                <View style={tw`flex flex-row items-center justify-between mb-2`}>
                  <Text style={tw`text-gray-500 text-xs`}>{assignment.subject}</Text>
                  <View style={tw`flex flex-row items-center`}>
                    <Icon name="calendar" size={10} color="#6B7280" />
                    <Text style={tw`text-gray-500 text-xs ml-1`}>Due: {assignment.dueDate}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={tw`bg-gray-200 h-1 rounded-full w-full overflow-hidden`}>
                  <View
                    style={[
                      tw`h-full rounded-full`,
                      { width: `${assignment.progress}%`, backgroundColor: getPriorityColor(assignment.priority) }
                    ]}
                  />
                </View>

                <View style={tw`flex flex-row justify-between items-center mt-2`}>
                  <Text style={tw`text-gray-600 text-xs`}>{assignment.progress}% Complete</Text>
                  {renderPriorityBadge(assignment.priority)}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>



        {/* Assignment Categories */}
        <View style={tw`px-5 mt-4 mb-4`}>
          <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>Assignment Categories</Text>

          <View style={tw`flex flex-row flex-wrap justify-between`}>
            {displayedSubjects.map((subject) => (
              <TouchableOpacity
                key={`subject-${subject.id}`}
                style={tw`bg-gray-50 rounded-xl shadow-lg  mb-4 w-[48%] overflow-hidden`}
                onPress={() => alert(`View ${subject.title} assignments`)}
              >
                <View style={tw`p-4`}>
                  <View style={[tw`w-12 h-12 rounded-lg items-center justify-center mb-3`, { backgroundColor: `${subject.color}20` }]}>
                    <FontAwesome name={subject.icon} size={20} color={subject.color} />
                  </View>
                  <Text style={tw`text-gray-800 font-bold mb-1`}>{subject.title}</Text>
                  <Text style={tw`text-gray-500 text-xs mb-2`} numberOfLines={1}>
                    {subject.description}
                  </Text>
                  <View style={tw`flex flex-row items-center`}>
                    <View style={tw`bg-gray-100 px-2 py-1 rounded-full`}>
                      <Text style={tw`text-gray-700 text-xs font-bold`}>{subject.count} {subject.count === 1 ? 'item' : 'items'}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* See All / Show Less button */}
          {subjects.length > 4 && (
            <TouchableOpacity
              onPress={() => setShowAllSubjects(!showAllSubjects)}
              style={tw`p-3 bg-gray-100 rounded-xl items-center mt-2 border border-gray-200`}
            >
              <Text style={tw`text-gray-700 font-bold`}>
                {showAllSubjects ? 'Show Less' : 'View All Categories'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={tw`flex flex-row justify-between bg-white absolute bottom-0 left-0 right-0 shadow-lg rounded-t-3xl py-2`}>
        <TouchableOpacity style={tw`flex-1 items-center justify-center py-2`} onPress={() => navigation.navigate('UserHomePage')}>
          <View style={tw`bg-violet-500 p-2 rounded-xl mb-1`}>
            <AntDesign name="home" size={22} color="#fff" />
          </View>
          <Text style={tw`text-xs font-bold text-violet-700`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-1 items-center justify-center py-2`} onPress={() => navigation.navigate('CreateAssignment')}>
          <View style={tw`bg-violet-500 p-2 rounded-xl mb-1`}>
            <AntDesign name="plus" size={22} color="#fff" />
          </View>
          <Text style={tw`text-xs font-bold text-violet-700`}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-1 items-center justify-center py-2`}>
          <View style={tw`bg-violet-500 p-2 rounded-xl mb-1`}>
            <Entypo name="clipboard" size={22} color="#fff" />
          </View>
          <Text style={tw`text-xs font-bold text-violet-700`}>Assignments</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-1 items-center justify-center py-2`} onPress={() => navigation.navigate('UserProfile')}>
          <View style={tw`bg-violet-500 p-2 rounded-xl mb-1`}>
            <Entypo name="user" size={22} color="#fff" />
          </View>
          <Text style={tw`text-xs font-bold text-violet-700`}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Helper functions
function getSubjectColor(subjectName, subjects) {
  const subject = subjects.find(s => s.title === subjectName);
  if (subject) return subject.color;

  // Default colors for subjects not in our predefined list
  const defaultColors = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#6366F1'];
  const hash = subjectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return defaultColors[hash % defaultColors.length];
}

function getSubjectIcon(subjectName, subjects) {
  const subject = subjects.find(s => s.title === subjectName);
  if (subject) return subject.icon;

  // Default icons
  const defaultIcons = ['file-text-o', 'folder', 'book', 'edit', 'graduation-cap'];
  const hash = subjectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return defaultIcons[hash % defaultIcons.length];
}

function getPriorityColor(priority) {
  switch(priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#3B82F6';
    default: return '#8B5CF6';
  }
}

const styles = StyleSheet.create({
  headerGradient: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default UserHomePage;