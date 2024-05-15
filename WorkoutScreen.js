import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from './apiService';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';

const { width, height } = Dimensions.get('window');




function WorkoutScreen() {
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [weights, setWeights] = useState({});
  const [reps, setReps] = useState({});

  useEffect(() => {
    fetchBodyParts();
  }, []);

  const fetchBodyParts = async () => {
    try {
      const response = await apiClient.get('/exercises/bodyPartList');
      setBodyParts(response.data);
    } catch (error) {
      console.error('Failed to fetch body parts:', error);
      Alert.alert('Error', 'Failed to load body part list');
    }
  };

  const fetchExercises = async () => {
    if (selectedBodyPart) {
      try {
        const response = await apiClient.get(`/exercises/bodyPart/${selectedBodyPart}`);
        setExercises(response.data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
        Alert.alert('Error', 'Failed to load exercises');
      }
    } else {
      Alert.alert('Input Required', 'Please select a muscle group to search for.');
    }
  };

  const handleSearch = () => {
    fetchExercises();
  };

  const addToWorkout = (exercise) => {
    setWorkoutExercises(prev => [...prev, exercise]);
    setWeights(prev => ({ ...prev, [exercise.id]: '' }));
    setReps(prev => ({ ...prev, [exercise.id]: '' }));
  };

  const calculateOneRM = (exerciseId) => {
    const weight = weights[exerciseId];
    const rep = reps[exerciseId];
    if (weight && rep) {
      const oneRM = weight * (1 + rep / 30);
      Alert.alert('1RM', `Your 1RM for this exercise is: ${oneRM.toFixed(2)} kgs`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#121212' }}>
      <TextInput 
        label="Search muscle group" 
        value={selectedBodyPart} 
        onChangeText={setSelectedBodyPart} 
        mode="outlined" 
        style={{ marginBottom: 10 }}
      />
      <Button mode="contained" onPress={handleSearch} style={{ marginBottom: 10 }}>
        Search
      </Button>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }}>
            <Card.Title title={item.name} />
            <Card.Cover source={{ uri: item.gifUrl }} />
            <Card.Actions>
              <Button onPress={() => addToWorkout(item)}>Add to Workout</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',  // Consistent dark background
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#333',  // Unified dark gray for inputs
    color: '#fff',
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0d47a1',  // Stylish blue for contrast
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: '#252525',  // Slightly lighter gray for list items
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  workoutItem: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    color: '#bbb',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  workoutList: {
    marginTop: 10,
  },
  exerciseList: {
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#26a69a',  // Teal button for actions like Calculate 1RM
    borderRadius: 25,
    padding: 8,
    marginHorizontal: 10,
  },
  inputSmall: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#222',  // Slightly darker for input fields within cards
    borderRadius: 25,
    height: 40,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 14,
  },
});



export default WorkoutScreen;
