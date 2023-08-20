import { Viro360Image, ViroARScene, ViroARSceneNavigator, ViroBox, ViroMaterials, ViroNode, ViroText, ViroTrackingStateConstants, ViroPolyline } from '@viro-community/react-viro';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

// Define a type for your points of interest
type PointOfInterest = {
  id: number;
  latitude: number;
  longitude: number;
  label: string;
  arCoordinates: { x: number; y: number; z: number }; // Include arCoordinates property
};


const ARScene = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([
    { id: 1, latitude: 19.243139, longitude: 72.982861, label: 'Target 1', arCoordinates: { x: 0, y: 0, z: 0 } },
    { id: 2, latitude: 19.243189, longitude: 72.982708, label: 'Target 2', arCoordinates: { x: 0, y: 0, z: 0 } },
    { id: 3, latitude: 0, longitude: 0, label: 'Target 3', arCoordinates: { x: 0, y: 0, z: 0 } },
    // Add more points of interest here
  ]);

  const initialCameraPosition = { x: 0, y: 0, z: 0 }; // Set your initial camera position

  useEffect(() => {

    // Convert GPS coordinates to AR world coordinates using Web Mercator projection
    const convertGPStoARCoordinates = (latitude: PointOfInterest['latitude'], longitude: PointOfInterest['longitude']) => {
      const metersPerLatDegree = 111200; // Approx. meters per degree latitude
      const metersPerLngDegree = 111200 * Math.cos(latitude * (Math.PI / 180)); // Approx. meters per degree longitude

      const x = (longitude - initialCameraPosition.x) * metersPerLngDegree;
      const y = 0; // Elevation can be considered as y-coordinate
      const z = (latitude - initialCameraPosition.z) * metersPerLatDegree;

      return { x, y, z };
    };


    // Update AR world coordinates for each point of interest
    const updatedPoints = pointsOfInterest.map((poi) => {
      const { latitude, longitude } = poi;
      const arCoordinates = convertGPStoARCoordinates(latitude, longitude);
      return { ...poi, arCoordinates };
    });

    setPointsOfInterest(updatedPoints);
  }, []);
  console.log("Rendered")
  console.log(pointsOfInterest)

  return (
    <ViroARScene>
      {pointsOfInterest.map((poi) => (
        <ViroNode key={poi.id}>
          <ViroText
            text={poi.label}
            scale={[1, 1, 1]}
            position={
              [
                poi.arCoordinates.x,
                poi.arCoordinates.y,
                poi.arCoordinates.z,
              ]}
          />
        </ViroNode>
      ))
      }
    </ViroARScene >
  );
}


export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: ARScene,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
