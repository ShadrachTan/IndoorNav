import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const points = {
  start: { x: 180, y: 510 },
  roomA: { x: 100, y: 260 },
  roomB: { x: 140, y: 208 },
};

const paths = {
  start: { roomA: ['start', 'roomA'], roomB: ['start', 'roomB'] },
  roomA: { start: ['roomA', 'start'], roomB: ['roomA', 'roomB'] },
  roomB: { start: ['roomB', 'start'], roomA: ['roomB', 'roomA'] },
};

const Map = () => {
  const [selectedDestination, setSelectedDestination] = useState('roomA');

  const findPath = (from, to) => {
    return paths[from][to];
  };

  const drawRoute = () => {
    const route = findPath('start', selectedDestination);

    const elements = [];
    for (let i = 0; i < route.length - 1; i++) {
      const start = points[route[i]];
      const end = points[route[i + 1]];
      elements.push(
        <Line
          key={`line-${i}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="blue"
          strokeWidth="2"
        />
      );
    }
    return elements;
  };

  return (
    <View style={styles.container}>
      {/* Map Image */}
      <Image
        source={require('../../assets/images/EAC-Entrance-B2.jpg')}
        style={styles.mapImage}
        resizeMode="contain"
      />

      {/* SVG Overlay for Routing */}
      <Svg style={StyleSheet.absoluteFill}>
        {/* Draw Route */}
        {drawRoute()}

        {/* Mark Points */}
        {Object.entries(points).map(([key, point]) => (
          <Circle
            key={key}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={key === 'start' ? 'red' : 'green'}
          />
        ))}
      </Svg>

      {/* Destination Selector */}
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.button, selectedDestination === 'roomA' && styles.selectedButton]}
          onPress={() => setSelectedDestination('roomA')}
        >
          <Text style={styles.buttonText}>Room A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedDestination === 'roomB' && styles.selectedButton]}
          onPress={() => setSelectedDestination('roomB')}
        >
          <Text style={styles.buttonText}>Room B</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  selector: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    elevation: 5,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Map;
