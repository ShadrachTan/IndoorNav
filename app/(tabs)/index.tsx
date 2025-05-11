import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Indoor Navigation</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search for a location..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => console.log('Explore clicked')}
      >
        <Text style={styles.exploreButtonText}>Explore Locations</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchBar: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exploreButton: {
    width: '100%',
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
