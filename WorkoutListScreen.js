import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { commonStyles, colors } from './theme'; // Ensure the path is correct

const WorkoutListScreen = ({ route }) => {
  const { workoutExercises, weights, reps, sets } = route.params;

  const exportToExcel = async () => {
    const data = workoutExercises.map(exercise => ({
      Name: exercise.name,
      Weight: weights[exercise.id],
      Reps: reps[exercise.id],
      Sets: sets[exercise.id],
      '1RM': (weights[exercise.id] * (1 + reps[exercise.id] / 30)).toFixed(2)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Workout');
    const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

    const uri = FileSystem.cacheDirectory + 'workout.xlsx';
    await FileSystem.writeAsStringAsync(uri, excelBuffer, { encoding: FileSystem.EncodingType.Base64 });

    await Sharing.shareAsync(uri);
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Your Workout</Text>
      <FlatList
        data={workoutExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.exerciseDetails}>Weight: {weights[item.id]} kg</Text>
            <Text style={styles.exerciseDetails}>Reps: {reps[item.id]}</Text>
            <Text style={styles.exerciseDetails}>Sets: {sets[item.id]}</Text>
            <Text style={styles.exerciseDetails}>1RM: {(weights[item.id] * (1 + reps[item.id] / 30)).toFixed(2)} kg</Text>
          </View>
        )}
        style={styles.workoutList}
        contentContainerStyle={styles.workoutListContent}
      />
      <TouchableOpacity style={commonStyles.createWorkoutButton} onPress={exportToExcel}>
        <Text style={commonStyles.createWorkoutButtonText}>Export to Excel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  workoutItem: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  workoutList: {
    maxHeight: 400,
  },
  workoutListContent: {
    paddingBottom: 10,
  },
});

export default WorkoutListScreen;



