import { useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Svg, { Circle, Line } from 'react-native-svg';

type Point = { x: number; y: number };
type MapData = {
  image: any;
  gridData: { layers: { data: number[] }[]; width: number; height: number };
  points: Record<string, Point>;
};

const maps: Record<string, MapData> = {
  'Ground Floor': {
    image: require('../../assets/images/Ground floor 2.jpg'),
    gridData: require('../../assets/GroundFloor2.json'),
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
  '2nd Floor - Building 2': {
    image: require('../../assets/images/2nd floor.jpg'),
    gridData: require('../../assets/2ndFloor.json'),
    points: {
      start: { x: 30, y: 118 },
      '3nd Floor - Building 2': { x: 43, y: 118 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 2201': { x: 80, y: 30 },
      'Room 2202': { x: 134, y: 30 },
      'Room 2203': { x: 183, y: 30 },
      'Room 2204': { x: 235, y: 30 },
      'Room 2205': { x: 288, y: 30 },
      'Room 2206': { x: 80, y: 103 },
      'Room 2207': { x: 134, y: 103 },
      'Room 2208': { x: 183, y: 103 },
      'Room 2209': { x: 235, y: 103 },
      'Room 2210': { x: 288, y: 103 },
    },
  },
  '3rd Floor - Building 2': {
    image: require('../../assets/images/3rd floor.jpg'),
    gridData: require('../../assets/3rdFloor.json'),
    points: {
      start: { x: 28, y: 118 },
      '4th Floor - Building 2': { x: 43, y: 118 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 2301': { x: 80, y: 30 },
      'Room 2302': { x: 134, y: 30 },
      'Room 2303': { x: 183, y: 30 },
      'Room 2304': { x: 235, y: 30 },
      'Room 2305': { x: 288, y: 30 },
      'Room 2306': { x: 80, y: 103 },
      'Room 2307': { x: 134, y: 103 },
      'Room 2308': { x: 183, y: 103 },
      'Room 2309': { x: 235, y: 103 },
      'Room 2310': { x: 288, y: 103 },
    },
  },
  '4th Floor - Building 2': {
    image: require('../../assets/images/4th floor.jpg'),
    gridData: require('../../assets/4thFloor.json'),
    points: {
      start: { x: 25, y: 118 },
      '5th Floor - Building 2': { x: 43, y: 118 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 2401': { x: 80, y: 30 },
      'Room 2402': { x: 134, y: 30 },
      'Room 2403': { x: 183, y: 30 },
      'Room 2404': { x: 235, y: 30 },
      'Room 2405': { x: 288, y: 30 },
      'Room 2406': { x: 80, y: 103 },
      'Room 2407': { x: 134, y: 103 },
      'Room 2408': { x: 183, y: 103 },
      'Room 2409': { x: 235, y: 103 },
      'Room 2410': { x: 288, y: 103 },
    },
  },

  '5th Floor - Building 2': {
    image: require('../../assets/images/5th floor.jpg'),
    gridData: require('../../assets/5thFloor.json'),
    points: {
      start: { x: 28, y: 116 },
      "Women's CR": { x: 330, y: 29 },
      "Men's CR": { x: 30, y: 29 },
      'Room 2501': { x: 80, y: 30 },
      'Room 2502': { x: 134, y: 30 },
      'Room 2503': { x: 183, y: 30 },
      'Room 2504': { x: 235, y: 30 },
      'Room 2505': { x: 288, y: 30 },
      'Room 2506': { x: 80, y: 103 },
      'Room 2507': { x: 134, y: 103 },
      'Room 2508': { x: 183, y: 103 },
      'Room 2509': { x: 235, y: 103 },
      'Room 2510': { x: 288, y: 103 },
    },
  },
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Map = () => {
  const [floorOpen, setFloorOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>('Ground Floor');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );

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
    if (!selectedDestination || !(selectedDestination in currentMap.points))
      return null;

    const points = currentMap.points;
    const startX = Math.floor(points.start.x / tileSize);
    const startY = Math.floor(points.start.y / tileSize);
    const destX = Math.floor(points[selectedDestination].x / tileSize);
    const destY = Math.floor(points[selectedDestination].y / tileSize);

    const openSet = [
      { x: startX, y: startY, cost: 0, path: [] as { x: number; y: number }[] },
    ];
    const closedSet = new Set<string>();

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
          grid[neighbor.y * gridWidth + neighbor.x] === 1
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
      <Image
        source={currentMap.image}
        style={{
          position: 'absolute',
          width: gridPixelWidth,
          height: gridPixelHeight,
          top: offsetY,
          left: offsetX,
        }}
        resizeMode="contain"
      />

      <Svg style={StyleSheet.absoluteFill}>
        {drawRoute()}
        {Object.entries(currentMap.points).map(([key, point]) => {
          if (key === 'start' || key === selectedDestination) {
            return (
              <Circle
                key={key}
                cx={point.x + offsetX}
                cy={point.y + offsetY}
                r={5}
                fill={key === 'start' ? '#ef4444' : '#22c55e'}
                stroke="#000"
                strokeWidth={1}
              />
            );
          }
          return null;
        })}
      </Svg>

      <View style={styles.dropdownContainer}>
        <View style={styles.floorDropdownWrapper}>
          <DropDownPicker
            open={floorOpen}
            value={selectedFloor}
            items={Object.keys(maps).map((floor) => ({
              label: floor,
              value: floor,
            }))}
            setOpen={setFloorOpen}
            setValue={(val) => {
              setSelectedFloor(
                typeof val === 'function' ? val(selectedFloor) : val
              );
              setSelectedDestination(null);
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder="Select Floor"
            textStyle={{ color: '#1e40af' }}
          />
        </View>

        <View style={styles.destDropdownWrapper}>
          <DropDownPicker
            open={destOpen}
            value={selectedDestination}
            items={Object.keys(currentMap.points)
              .filter((p) => p !== 'start')
              .map((p) => ({ label: p, value: p }))}
            setOpen={setDestOpen}
            setValue={(val) =>
              setSelectedDestination(
                typeof val === 'function' ? val(selectedDestination) : val
              )
            }
            searchable={true}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder="Select Destination"
            textStyle={{ color: '#1e40af' }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe' },
  dropdownContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
  },
  floorDropdownWrapper: {
    zIndex: 2000,
    marginBottom: 15,
  },
  destDropdownWrapper: {
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#3b82f6',
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    height: 45,
  },
  dropDownContainer: {
    borderColor: '#3b82f6',
    borderRadius: 8,
    backgroundColor: '#dbeafe',
  },
});

export default Map;
