import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Dimensions, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native'; // Import LottieView for animations

const { width, height } = Dimensions.get('window');

function WorkoutScreen() {
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [weights, setWeights] = useState({});
  const [reps, setReps] = useState({});
  const [sets, setSets] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const animationRefs = useRef({});
  const [activeAnimation, setActiveAnimation] = useState(null);

  const fetchBodyParts = async () => {
    try {
      const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', {
        headers: {
          'X-RapidAPI-Key': '8635fbc913mshbb084128b19528fp1f742djsn79f2d47b3468',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });
      setBodyParts(response.data);
    } catch (error) {
      console.error('Failed to fetch body parts:', error);
      Alert.alert('Error', 'Failed to load body part list');
    }
  };

  useEffect(() => {
    fetchBodyParts();
  }, []);

  const fetchExercises = async () => {
    if (selectedBodyPart) {
      try {
        const response = await axios.get(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${selectedBodyPart}`, {
          headers: {
            'X-RapidAPI-Key': '8635fbc913mshbb084128b19528fp1f742djsn79f2d47b3468',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        });
        setExercises(response.data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
        Alert.alert('Error', 'Failed to load exercises');
      }
    } else {
      Alert.alert('Input Required', 'Please select a muscle group to filter.');
    }
  };

  const addToWorkout = (exercise) => {
    setActiveAnimation(exercise.id);
    setTimeout(() => {
      if (animationRefs.current[exercise.id]) {
        animationRefs.current[exercise.id].play();
      }
    }, 50); // Give a short delay to ensure ref is ready before calling play

    setTimeout(() => {
      setActiveAnimation(null);
      setWorkoutExercises(prev => [...prev, exercise]);
      setWeights(prev => ({ ...prev, [exercise.id]: '' }));
      setReps(prev => ({ ...prev, [exercise.id]: '' }));
      setSets(prev => ({ ...prev, [exercise.id]: '' }));
    }, 5000); // Adjust this value to the duration of the animation in milliseconds
  };

  const openModal = (exercise) => {
    setCurrentExercise(exercise);
    setModalVisible(true);
  };

  const closeModal = () => {
    setCurrentExercise(null);
    setModalVisible(false);
  };

  const saveExerciseDetails = () => {
    closeModal();
  };

  const viewWorkout = () => {
    setWorkoutModalVisible(true);
  };

  const closeWorkoutModal = () => {
    setWorkoutModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Workout</Text>
      <Picker
        selectedValue={selectedBodyPart}
        onValueChange={(itemValue) => setSelectedBodyPart(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Body Part" value="" />
        {bodyParts.map((part, index) => (
          <Picker.Item key={index.toString()} label={part} value={part} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.filterButton} onPress={fetchExercises}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()} // Ensure each key is unique
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Card.Cover source={{ uri: item.gifUrl }} style={styles.exerciseImage} />
              <View style={styles.exerciseDetails}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.exerciseDescription}>{item.target} exercise targeting {item.bodyPart}.</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => addToWorkout(item)}>
                  {activeAnimation === item.id ? (
                    <LottieView
                      ref={ref => (animationRefs.current[item.id] = ref)}
                      source={require('../Workout/assets/animations/bear-drinking-tea.json')}
                      autoPlay={false}
                      loop={false}
                      style={styles.animation}
                    />
                  ) : (
                    <Text style={styles.addButtonText}>Add to Workout</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        style={styles.exerciseList}
        contentContainerStyle={styles.exerciseListContent}
      />
      <TouchableOpacity style={styles.viewWorkoutButton} onPress={viewWorkout}>
        <Text style={styles.viewWorkoutButtonText}>View Workout</Text>
      </TouchableOpacity>
      <Modal
        visible={workoutModalVisible}
        animationType="slide"
        onRequestClose={closeWorkoutModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.subTitle}>Your Workout</Text>
          <FlatList
            data={workoutExercises}
            keyExtractor={(item) => item.id.toString()} // Ensure each key is unique
            renderItem={({ item }) => (
              <View style={styles.workoutItem}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.workoutList}
            contentContainerStyle={styles.workoutListContent}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={closeWorkoutModal}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Exercise</Text>
            {currentExercise && (
              <>
                <Text style={styles.exerciseName}>{currentExercise.name}</Text>
                <TextInput
                  placeholder="Weight"
                  placeholderTextColor="#bbb"
                  value={weights[currentExercise.id]}
                  onChangeText={(text) => setWeights({ ...weights, [currentExercise.id]: text })}
                  style={styles.inputLarge}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Reps"
                  placeholderTextColor="#bbb"
                  value={reps[currentExercise.id]}
                  onChangeText={(text) => setReps({ ...reps, [currentExercise.id]: text })}
                  style={styles.inputLarge}
                  keyboardType="numeric"
                />
                <TextInput
                  placeholder="Sets"
                  placeholderTextColor="#bbb"
                  value={sets[currentExercise.id]}
                  onChangeText={(text) => setSets({ ...sets, [currentExercise.id]: text })}
                  style={styles.inputLarge}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveExerciseDetails}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#fff',
    backgroundColor: '#333',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  animation: {
    width: 50,
    height: 50,
  },
  filterButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  card: {
    marginVertical: 8,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  exerciseImage: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  exerciseDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  workoutItem: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fff',
    flex: 2,
  },
  editButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  workoutList: {
    flex: 1,
  },
  workoutListContent: {
    paddingBottom: 10,
  },
  viewWorkoutButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  viewWorkoutButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputLarge: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  closeModalButton: {
    backgroundColor: '#ffdf00',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeModalButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default WorkoutScreen;















