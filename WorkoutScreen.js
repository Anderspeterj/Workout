import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Modal,
  TextInput, KeyboardAvoidingView, Platform, FlatList
} from 'react-native';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import LottieView from 'lottie-react-native';
import { commonStyles, colors } from './theme';

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [exerciseSelectionVisible, setExerciseSelectionVisible] = useState(false);
  const animationRefs = useRef({});
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
        setFilterModalVisible(false); // Close the filter modal after fetching exercises
        setExerciseSelectionVisible(true); // Show the exercise selection modal
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
    }, 50);

    setTimeout(() => {
      setActiveAnimation(null);
      setWorkoutExercises(prev => [...prev, exercise]);
      setWeights(prev => ({ ...prev, [exercise.id]: '' }));
      setReps(prev => ({ ...prev, [exercise.id]: '' }));
      setSets(prev => ({ ...prev, [exercise.id]: '' }));
      setShowSuccess(true);  // Show success animation
      setTimeout(() => {
        setShowSuccess(false);  // Hide success animation after 2 seconds
      }, 2000);
    }, 5000);
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

  const closeExerciseSelectionModal = () => {
    setExerciseSelectionVisible(false);
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../Workout-1/assets/animations/background.json')}
        autoPlay
        loop
        style={commonStyles.backgroundAnimation}
      />
      <View style={styles.overlay}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.lottieButton}>
            <LottieView
              source={require('../Workout-1/assets/animations/weight.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Your Workout</Text>
          <TouchableOpacity style={styles.lottieButton}>
            <LottieView
              source={require('../Workout-1/assets/animations/strong1.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.promptText}>Tap the search icon to start filtering exercises</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => setFilterModalVisible(true)}>
          <LottieView
            source={require('../Workout-1/assets/animations/search.json')}
            autoPlay
            loop
            style={styles.searchAnimation}
          />
        </TouchableOpacity>
        <FlatList
          data={workoutExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card key={item.id.toString()} style={styles.card}>
              <View style={styles.cardContent}>
                <Card.Cover source={{ uri: item.gifUrl }} style={styles.exerciseImage} />
                <View style={styles.exerciseDetails}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.exerciseDescription}>{item.target} exercise targeting {item.bodyPart}.</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => openModal(item)}>
                    <Text style={styles.addButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.exerciseListContent}
        />
        <TouchableOpacity style={styles.viewWorkoutButton} onPress={viewWorkout}>
          <Text style={styles.viewWorkoutButtonText}>View Workout</Text>
        </TouchableOpacity>
        <Modal
          visible={workoutModalVisible}
          animationType="slide"
          onRequestClose={closeWorkoutModal}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.workoutModalContainer}>
              <Text style={commonStyles.title}>Your Workout</Text>
              <FlatList
                data={workoutExercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View key={item.id.toString()} style={styles.workoutItem}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => openModal(item)}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.workoutListContent}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeWorkoutModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
          transparent={true}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={commonStyles.title}>Edit Exercise</Text>
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
        <Modal
          visible={filterModalVisible}
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={commonStyles.title}>Filter Exercises</Text>
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
                <Text style={styles.filterButtonText}>Apply Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={exerciseSelectionVisible}
          animationType="slide"
          onRequestClose={closeExerciseSelectionModal}
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.exerciseSelectionContainer}>
              <Text style={commonStyles.title}>Select Exercises</Text>
              <FlatList
                data={exercises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Card key={item.id.toString()} style={styles.card}>
                    <View style={styles.cardContent}>
                      <Card.Cover source={{ uri: item.gifUrl }} style={styles.exerciseImage} />
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.exerciseDescription}>{item.target} exercise targeting {item.bodyPart}.</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => addToWorkout(item)}>
                          {activeAnimation === item.id ? (
                            <LottieView
                              ref={ref => (animationRefs.current[item.id] = ref)}
                              source={require('../Workout-1/assets/animations/bear-drinking-tea.json')}
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
                contentContainerStyle={styles.exerciseListContent}
              />
              <TouchableOpacity style={styles.closeButton} onPress={closeExerciseSelectionModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {showSuccess && (
          <LottieView
            source={require('../Workout-1/assets/animations/success.json')}
            autoPlay
            loop={false}
            style={styles.successAnimation}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.background,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  promptText: {
    textAlign: 'center',
    color: colors.textPrimary,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    color: '#fff',
    backgroundColor: '#333',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  filterButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', // Center the button
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animation: {
    width: 50,
    height: 50,
  },
  card: {
    marginVertical: 8,
    backgroundColor: 'rgba(50, 50, 50, 0.8)', // Darker background for better contrast
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Lighter shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#ddd',
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Lighter shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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
    color: '#ccc', // Lightened text color
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Lighter shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseListContent: {
    paddingBottom: 20,
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
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutListContent: {
    paddingBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#42ccfa',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  workoutModalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#42ccfa',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  exerciseSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#42ccfa',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  inputLarge: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  lottieButton: {
    width: 60,
    height: 60,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  searchButton: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchAnimation: {
    width: '100%',
    height: '100%',
  },
  viewWorkoutButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center', // Center the button
    marginTop: 20,
  },
  viewWorkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successAnimation: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 100,
    zIndex: 1,
  },
});

export default WorkoutScreen;







