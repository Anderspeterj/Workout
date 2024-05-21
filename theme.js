import { StyleSheet } from 'react-native';

const colors = {
  primary: '#4CAF50',
  secondary: '#1e3d59',
  background: '#f0f4f7',
  textPrimary: '#fff',
  textSecondary: '#bbb',
};

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lottieButton: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  createWorkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  createWorkoutButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '118.3%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1,
  },
});

export { colors, commonStyles };
