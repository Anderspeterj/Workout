import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import LottieView from 'lottie-react-native';
import { commonStyles } from './theme'; // Ensure the path is correct

const { width, height } = Dimensions.get('window');

function HomeScreen({ navigation }) {
  const handleButtonPress = () => {
    navigation.navigate('Workout');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../Workout-1/assets/animations/background.json')}
        autoPlay
        loop
        style={commonStyles.backgroundAnimation}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Layout style={commonStyles.container}>
          <View style={commonStyles.header}>
            <TouchableOpacity style={styles.lottieWeightButton}>
              <LottieView
                source={require('../Workout-1/assets/animations/weight.json')}
                autoPlay
                loop
                style={styles.lottieWeightAnimation}
              />
            </TouchableOpacity>
            <View style={commonStyles.textContainer}>
              <Text category='h1' style={commonStyles.title}>Workout-Maker</Text>
              <Text style={commonStyles.subtitle}>Create your own workout</Text>
            </View>
          </View>
          <View style={styles.lottieContainer}>
            <TouchableOpacity style={commonStyles.lottieButton} onPress={handleButtonPress}>
              <LottieView
                source={require('../Workout-1/assets/animations/mobile-running.json')}
                autoPlay
                loop
                style={commonStyles.lottieAnimation}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={commonStyles.createWorkoutButton} onPress={handleButtonPress}>
            <Text style={commonStyles.createWorkoutButtonText}>Create Your Workout</Text>
          </TouchableOpacity>
        </Layout>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  lottieWeightButton: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  lottieWeightAnimation: {
    width: '100%',
    height: '100%',
  },
  lottieContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default HomeScreen;









