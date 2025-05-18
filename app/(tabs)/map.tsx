import { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Svg, { Circle, Line } from 'react-native-svg';

// Map configurations with corresponding JSON and points
const maps = {
  'Ground Floor': {
    image: require('../../assets/images/Ground floor 2.jpg'),
    gridData: require('C:/React/IndoorNav/assets/GroundFloor2.json'),
    points: {
      start: { x: 180, y: 155 },
      '2nd Floor - Building 2': { x: 37, y: 40 },
      'Office of Student Affairs': { x: 245, y: 145 },
      'Arts and Science': { x: 100, y: 47 },
      'General Education Department': { x: 131, y: 47 },
      'Registrar 1': { x: 160, y: 47 },
      'Registrar 2': { x: 195, y: 47 },
      'Cashier 1': { x: 230, y: 47 },
      'Cashier 2': { x: 260, y: 47 },
      Clinic: { x: 290, y: 47 },
      Office: { x: 67, y: 47 },
    },
  },
  'Building 2 - 1st Floor': {
    image: require('../../assets/images/1st Floor.jpg'),
    gridData: require('C:/React/IndoorNav/assets/1stFloor.json'),
    points: {
      start: { x: 30, y: 118 },
      '3rd Floor - Building 2': { x: 43, y: 118 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 1': { x: 80, y: 30 },
      'Room 2': { x: 134, y: 30 },
      'Room 3': { x: 183, y: 30 },
      'Room 4': { x: 235, y: 30 },
      'Room 5': { x: 288, y: 30 },
      'Room 6': { x: 80, y: 103 },
      'Room 7': { x: 134, y: 103 },
      'Room 8': { x: 183, y: 103 },
      'Room 9': { x: 235, y: 103 },
      'Room 10': { x: 288, y: 103 },
    },
  },
  'Building 2 - 2nd Floor': {
    image: require('../../assets/images/2nd Floor.jpg'),
    gridData: require('C:/React/IndoorNav/assets/2ndFloor.json'),
    points: {
      start: { x: 28, y: 120 },
      '3rd Floor - Building 2': { x: 42, y: 120 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 1': { x: 80, y: 30 },
      'Room 2': { x: 134, y: 30 },
      'Room 3': { x: 183, y: 30 },
      'Room 4': { x: 235, y: 30 },
      'Room 5': { x: 288, y: 30 },
      'Room 6': { x: 80, y: 103 },
      'Room 7': { x: 134, y: 103 },
      'Room 8': { x: 183, y: 103 },
      'Room 9': { x: 235, y: 103 },
      'Room 10': { x: 288, y: 103 },
    },
  },
  'Building 2 - 3rd Floor': {
    image: require('../../assets/images/3rd Floor.jpg'),
    gridData: require('C:/React/IndoorNav/assets/3rdFloor.json'),
    points: {
      start: { x: 25, y: 120 },
      '4th Floor - Building 2': { x: 40, y: 120 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 1': { x: 80, y: 30 },
      'Room 2': { x: 134, y: 30 },
      'Room 3': { x: 183, y: 30 },
      'Room 4': { x: 235, y: 30 },
      'Room 5': { x: 288, y: 30 },
      'Room 6': { x: 80, y: 103 },
      'Room 7': { x: 134, y: 103 },
      'Room 8': { x: 183, y: 103 },
      'Room 9': { x: 235, y: 103 },
      'Room 10': { x: 288, y: 103 },
    },
  },
  'Building 2 - 4th Floor': {
    image: require('../../assets/images/4th Floor.jpg'),
    gridData: require('C:/React/IndoorNav/assets/4thFloor.json'),
    points: {
      start: { x: 30, y: 115 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 1': { x: 80, y: 30 },
      'Room 2': { x: 134, y: 30 },
      'Room 3': { x: 183, y: 30 },
      'Room 4': { x: 235, y: 30 },
      'Room 5': { x: 288, y: 30 },
      'Room 6': { x: 80, y: 103 },
      'Room 7': { x: 134, y: 103 },
      'Room 8': { x: 183, y: 103 },
      'Room 9': { x: 235, y: 103 },
      'Room 10': { x: 288, y: 103 },
    },
  },
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Map = () => {
  const [floorOpen, setFloorOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('Ground Floor');
  const [selectedDestination, setSelectedDestination] = useState(null);

  const currentMap = maps[selectedFloor];
  const gridData = currentMap.gridData.layers[0];
  const grid = gridData.data;
  const gridWidth = currentMap.gridData.width;
  const gridHeight = currentMap.gridData.height;

  const tileSize = Math.min(screenWidth / gridWidth, screenHeight / gridHeight);
  const gridPixelWidth = gridWidth * tileSize;
  const gridPixelHeight = gridHeight * tileSize;
  const offsetX = (screenWidth - gridPixelWidth) / 2;
  const offsetY = (screenHeight - gridPixelHeight) / 2;

  const drawRoute = () => {
    if (!selectedDestination || !currentMap.points[selectedDestination])
      return null;

    const points = currentMap.points;
    const startX = Math.floor(points.start.x / tileSize);
    const startY = Math.floor(points.start.y / tileSize);
    const destX = Math.floor(points[selectedDestination].x / tileSize);
    const destY = Math.floor(points[selectedDestination].y / tileSize);

    const openSet = [{ x: startX, y: startY, cost: 0, path: [] }];
    const closedSet = new Set();

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.cost - b.cost);
      const current = openSet.shift();
      if (!current) continue;

      if (current.x === destX && current.y === destY) {
        const route = current.path.concat({ x: destX, y: destY });

        return route.map((point, idx) => {
          if (idx === route.length - 1) return null;
          const start = {
            x: route[idx].x * tileSize + tileSize / 2 + offsetX,
            y: route[idx].y * tileSize + tileSize / 2 + offsetY,
          };
          const end = {
            x: route[idx + 1].x * tileSize + tileSize / 2 + offsetX,
            y: route[idx + 1].y * tileSize + tileSize / 2 + offsetY,
          };
          return (
            <Line
              key={`line-${idx}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="blue"
              strokeWidth="2"
            />
          );
        });
      }

      const key = `${current.x},${current.y}`;
      if (closedSet.has(key)) continue;
      closedSet.add(key);

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
          grid[neighbor.y * gridWidth + neighbor.x] === 1 // Walkable
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

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Map Image */}
      <Image
        source={currentMap.image}
        style={[
          styles.mapImage,
          {
            width: gridPixelWidth,
            height: gridPixelHeight,
            top: offsetY,
            left: offsetX,
          },
        ]}
        resizeMode="contain"
      />

      {/* Grid and Route Overlay */}
      <Svg style={StyleSheet.absoluteFill}>
        {drawRoute()}
        {/* Render only the start point and the selected destination */}
        {Object.entries(currentMap.points).map(([key, point]) => {
          if (key === 'start' || key === selectedDestination) {
            return (
              <Circle
                key={key}
                cx={point.x + offsetX}
                cy={point.y + offsetY}
                r={3}
                fill={key === 'start' ? 'red' : 'green'}
              />
            );
          }
          return null;
        })}
      </Svg>

      {/* Dropdowns */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={floorOpen}
          value={selectedFloor}
          items={Object.keys(maps).map((floor) => ({
            label: floor,
            value: floor,
          }))}
          setOpen={setFloorOpen}
          setValue={setSelectedFloor}
          onChangeValue={(value) => {
            setSelectedFloor(value);
            setSelectedDestination(null); // Reset destination on floor change
          }}
          style={styles.dropdown}
        />
        <DropDownPicker
          open={destOpen}
          value={selectedDestination}
          items={Object.keys(currentMap.points)
            .filter((point) => point !== 'start')
            .map((point) => ({ label: point, value: point }))}
          setOpen={setDestOpen}
          setValue={setSelectedDestination}
          onChangeValue={(value) => setSelectedDestination(value)}
          style={styles.dropdown}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  mapImage: { position: 'absolute' },
  dropdownContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#ddd',
  },
});

export default Map;
