import { Viro360Image, ViroARScene, ViroARSceneNavigator, ViroBox, ViroMaterials, ViroNode, ViroText, ViroTrackingStateConstants, ViroPolyline, ViroSphere } from '@viro-community/react-viro';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import GetLocation, { Location } from 'react-native-get-location';
import {
  llToPX,
} from 'web-merc-projection'

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
    { id: 3, latitude: 19.122256, longitude: 72.9838502, label: 'Target 3', arCoordinates: { x: 0, y: 0, z: 0 } },
    // Add more points of interest here
  ]);
  const [currentLocation, setCurrentLocation] = useState<Location>();

  const initialCameraPosition = { x: 0, y: 0, z: 0 }; // Set your initial camera position

  useEffect(() => {

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        console.log("------------- location --------------");
        console.log(location);
        console.log("------------- location --------------");
        setCurrentLocation(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }, []);

  useEffect(() => {
    if (!currentLocation)
      return;

    // Convert GPS coordinates to AR world coordinates using Web Mercator projection
    const convertGPStoARCoordinates = (latitude: PointOfInterest['latitude'], longitude: PointOfInterest['longitude']) => {

      if (!currentLocation)
        return { x: 0, y: 0, z: 0 };

      const targetPos = llToPX([latitude, longitude], 9, false, 256);
      const userPos = llToPX([currentLocation?.latitude, currentLocation?.longitude], 9, false, 256);
      const x = targetPos[0] - userPos[0];
      const z = targetPos[1] - userPos[1];
      const y = 0;

      console.log("{ x, y, z }", { x, y, z })

      return { x, y, z };
    };


    // Update AR world coordinates for each point of interest
    const updatedPoints = pointsOfInterest.map((poi) => {
      const { latitude, longitude } = poi;
      const arCoordinates = convertGPStoARCoordinates(latitude, longitude);
      return { ...poi, arCoordinates };
    });

    setPointsOfInterest(updatedPoints);
  }, [currentLocation]);
  console.log("Rendered")
  // console.log(pointsOfInterest)

  return (
    <ViroARScene>
      {pointsOfInterest.map((poi) => (
        <ViroNode key={poi.id}>
          <ViroText
            text={poi.label}
            scale={[1, 1, 1]}
            style={{ color: '#0000', textAlign: 'center', fontSize: 10 }}
            position={
              [
                poi.arCoordinates.x,
                poi.arCoordinates.y + 0.5,
                poi.arCoordinates.z,
              ]}
          />
          <ViroSphere
            position={
              [
                poi.arCoordinates.x,
                poi.arCoordinates.y,
                poi.arCoordinates.z,
              ]}
            radius={0.5}
            scale={[0.4, 0.4, 0.4]}
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
