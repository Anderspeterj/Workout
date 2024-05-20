import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, Text, Button } from '@ui-kitten/components';

function HomeScreen({ navigation }) {
  const handleButtonPress = () => {
    navigation.navigate('Workout');
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Layout style={styles.container}>
        <Text category='h1' style={styles.title}>VOLUME UP YOUR BODY GOALS</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.imageContainer}>
          <Image source={require('../Workout/img/fitness.jpg')} style={styles.image} />
        </TouchableOpacity>
        <Button style={styles.button} onPress={handleButtonPress}>
          MAKE YOUR OWN WORKOUT
        </Button>
        <Text style={styles.registerText}>DON'T HAVE ANY ACCOUNT? <Text style={styles.registerLink}>REGISTER</Text></Text>
      </Layout>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 1.5,
    marginBottom: 30,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 350,
    height: 250,
    borderRadius: 10,
    transition: 'transform 0.3s ease',
  },
  button: {
    backgroundColor: '#ffdf00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  registerLink: {
    color: '#ffdf00',
    fontWeight: 'bold',
  },
});

export default HomeScreen;





