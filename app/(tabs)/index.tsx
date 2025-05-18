import { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');

  return (
    <ImageBackground
      source={require('../../assets/images/eac-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay} />

      <View style={styles.header}>
        <Image
          source={require('../../assets/images/adaptive-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.headerText}>Indoor Navigation</Text>
          <Text style={styles.subHeaderText}>EAC Cavite</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>
          {userName
            ? `Welcome ${userName} to EAC Cavite Indoor Navigation`
            : 'Welcome to EAC Cavite Indoor Navigation'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="words"
          returnKeyType="done"
        />

        <Text style={styles.instructions}>
          To get started, go to Map and pick your location. The app will guide
          you to your destination.
        </Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    zIndex: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 55,
    backgroundColor: '#D32F2F',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#FBE9E7',
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    width: '80%',
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#fff',
    marginBottom: 25,
    borderColor: '#fff',
    borderWidth: 1,
  },
  instructions: {
    fontSize: 17,
    color: '#eee',
    lineHeight: 24,
    textAlign: 'center',
  },
});
