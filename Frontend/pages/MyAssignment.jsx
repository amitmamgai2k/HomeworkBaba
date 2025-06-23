import { StyleSheet, Text, View } from 'react-native'
import {useEffect,useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from '../tailwind';
import { useAuth } from '../context/UserContext';
import { fetchAssignments } from '../Redux/Slices/userSlice';
import { useDispatch } from 'react-redux';

const MyAssignment = () => {
    const {user} = useAuth();
    const uid = user?.uid;
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(user){
            setLoading(true);
            dispatch(fetchAssignments(uid))
                .then((response) => {
                    setAssignments(response.payload);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to fetch assignments:", error);
                    setLoading(false);
                });
        }
    })



  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ marginTop: 20 }}>
            {loading ? (
                <Text style={{ fontSize: 16 }}>Loading assignments...</Text>
            )
                : (
                    <Text style={{ fontSize: 16 }}>No assignments found.</Text>
                )
            }
        </View>

    </SafeAreaView>
  )
}

export default MyAssignment

const styles = StyleSheet.create({})