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
  'Building 2 - 1st Floor': {
    image: require('../../assets/images/1st Floor.jpg'),
    gridData: require('../../assets/1stFloor.json'),
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
  // ...add other floors as needed
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

      <Svg style={StyleSheet.absoluteFill}>
        {drawRoute()}
        {Object.entries(currentMap.points).map(([key, point]) => {
          const pt = point as Point;
          if (key === 'start' || key === selectedDestination) {
            return (
              <Circle
                key={key}
                cx={pt.x + offsetX}
                cy={pt.y + offsetY}
                r={5}
                fill={key === 'start' ? '#ef4444' : '#22c55e'} // red & green shades
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
            setValue={(callbackOrValue) => {
              if (typeof callbackOrValue === 'function') {
                setSelectedFloor(callbackOrValue(selectedFloor));
              } else {
                setSelectedFloor(callbackOrValue);
              }
              setSelectedDestination(null);
            }}
            onChangeValue={(value) => {
              if (value) {
                setSelectedFloor(value);
                setSelectedDestination(null);
              }
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainer}
            listItemLabelStyle={{ color: '#1e40af' }}
            placeholder="Select Floor"
            textStyle={{ color: '#1e40af' }}
          />
        </View>

        <View style={styles.destDropdownWrapper}>
          <DropDownPicker
            open={destOpen}
            value={selectedDestination}
            items={Object.keys(currentMap.points)
              .filter((point) => point !== 'start')
              .map((point) => ({ label: point, value: point }))}
            setOpen={setDestOpen}
            setValue={(callbackOrValue) => {
              if (typeof callbackOrValue === 'function') {
                setSelectedDestination(callbackOrValue(selectedDestination));
              } else {
                setSelectedDestination(callbackOrValue);
              }
            }}
            onChangeValue={(value) => {
              setSelectedDestination(value);
            }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropDownContainer}
            listItemLabelStyle={{ color: '#1e40af' }}
            placeholder="Select Destination"
            textStyle={{ color: '#1e40af' }}
            searchable={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', position: 'relative' },
  mapImage: { position: 'absolute' },
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
