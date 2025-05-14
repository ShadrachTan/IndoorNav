import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import gridData from 'C:/React/IndoorNav/assets/GroundFloor2.json'; // Import JSON grid file

// Extract the first layer assuming it's the walkable grid
const walkableLayer = gridData.layers[0]; // Use the first layer directly

if (!walkableLayer) {
  throw new Error('Walkable layer not found in the grid data.');
}

const grid = walkableLayer.data;
const gridWidth = gridData.width;
const gridHeight = gridData.height;

// Get device screen dimensions
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Dynamically calculate tile size based on map resolution and grid dimensions
const tileSize = Math.min(screenWidth / gridWidth, screenHeight / gridHeight);

// Calculate offsets to center the grid
const gridPixelWidth = gridWidth * tileSize;
const gridPixelHeight = gridHeight * tileSize;
const offsetX = (screenWidth - gridPixelWidth) / 2;
const offsetY = (screenHeight - gridPixelHeight) / 2;

// Define helper functions
const isWalkable = (x, y) => grid[y * gridWidth + x] === 1;

const points = {
  start: { x: 180, y: 150 },
  roomA: { x: 37, y: 40 },
  roomB: { x: 232, y: 47 },
};

// Dijkstra's Algorithm for pathfinding
const findPath = (start, destination) => {
  const startX = Math.floor(points[start].x / tileSize);
  const startY = Math.floor(points[start].y / tileSize);
  const destX = Math.floor(points[destination].x / tileSize);
  const destY = Math.floor(points[destination].y / tileSize);

  // Initialize open and closed sets
  const openSet = [{ x: startX, y: startY, cost: 0, path: [] }];
  const closedSet = new Set();

  while (openSet.length > 0) {
    // Sort by cost and pop the lowest-cost node
    openSet.sort((a, b) => a.cost - b.cost);
    const current = openSet.shift();

    // Ensure `current` is defined before proceeding
    if (!current) continue;

    // If the destination is reached, return the path
    if (current.x === destX && current.y === destY) {
      return current.path.concat({ x: destX, y: destY });
    }

    // Add current node to the closed set
    const key = `${current.x},${current.y}`;
    if (closedSet.has(key)) continue;
    closedSet.add(key);

    // Check neighbors
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.x >= 0 &&
        neighbor.x < gridWidth &&
        neighbor.y >= 0 &&
        neighbor.y < gridHeight &&
        isWalkable(neighbor.x, neighbor.y)
      ) {
        openSet.push({
          x: neighbor.x,
          y: neighbor.y,
          cost: current.cost + 1,
          path: current.path.concat({ x: current.x, y: current.y }),
        });
      }
    }
  }

  // Return empty path if no path is found
  return [];
};

// Render the grid overlay
const renderGrid = () => {
  const elements = [];
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const color = grid[y * gridWidth + x] === 1 ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
      elements.push(
        <Rect
          key={`${x}-${y}`}
          x={x * tileSize + offsetX}
          y={y * tileSize + offsetY}
          width={tileSize}
          height={tileSize}
          fill={color}
        />
      );
    }
  }
  return elements;
};

const Map = () => {
  const [selectedDestination, setSelectedDestination] = useState(null); // Track selected destination
  const [route, setRoute] = useState([]); // Track the current route

  const toggleRoute = (destination) => {
    if (destination === selectedDestination) {
      // If the same button is pressed, turn off the route
      setSelectedDestination(null);
      setRoute([]);
    } else {
      // Update the route for the selected destination
      setSelectedDestination(destination);
      setRoute(findPath('start', destination));
    }
  };

  const drawRoute = () => {
    if (route.length === 0) return null; // Do not render if no route exists

    const elements = [];
    for (let i = 0; i < route.length - 1; i++) {
      const start = {
        x: route[i].x * tileSize + tileSize / 2 + offsetX,
        y: route[i].y * tileSize + tileSize / 2 + offsetY,
      };
      const end = {
        x: route[i + 1].x * tileSize + tileSize / 2 + offsetX,
        y: route[i + 1].y * tileSize + tileSize / 2 + offsetY,
      };
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
        source={require('../../assets/images/Ground floor.jpg')}
        style={[styles.mapImage, { top: offsetY, left: offsetX }]}
        resizeMode="contain"
      />

      {/* SVG Overlay for Routing and Grid */}
      <Svg style={StyleSheet.absoluteFill}>
        {/*renderGrid()*/} {/* Render Grid for alignment*/}
        {drawRoute()}
        {Object.entries(points).map(([key, point]) => (
          <Circle
            key={key}
            cx={point.x + offsetX}
            cy={point.y + offsetY}
            r="3"
            fill={key === 'start' ? 'red' : 'green'}
          />
        ))}
      </Svg>

      {/* Destination Selector */}
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.button, selectedDestination === 'roomA' && styles.selectedButton]}
          onPress={() => toggleRoute('roomA')}
        >
          <Text style={styles.buttonText}>Building 2 - 2nd Floor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedDestination === 'roomB' && styles.selectedButton]}
          onPress={() => toggleRoute('roomB')}
        >
          <Text style={styles.buttonText}>Cashier</Text>
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
    position: 'absolute',
    width: gridPixelWidth,
    height: gridPixelHeight,
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
