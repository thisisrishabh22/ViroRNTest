import { Viro360Image, ViroARScene, ViroARSceneNavigator, ViroBox, ViroMaterials, ViroNode, ViroText, ViroTrackingStateConstants, ViroPolyline, ViroSphere, ViroARPlane } from '@viro-community/react-viro';
import { Viro3DPoint } from '@viro-community/react-viro/dist/components/Types/ViroUtils';
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
  arCoordinates: Viro3DPoint; // Include arCoordinates property
};


const ARScene = () => {

  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([
    { id: 1, latitude: 19.243139, longitude: 72.982861, label: 'Target 1', arCoordinates: [0, 0, 0] },
    { id: 2, latitude: 19.243189, longitude: 72.982708, label: 'Target 2', arCoordinates: [0, 0, 0] },
    { id: 3, latitude: 19.122256, longitude: 72.9838502, label: 'Target 3', arCoordinates: [0, 0, 0] },
    { id: 4, latitude: 19.243703, longitude: 72.982632, label: 'Target 4', arCoordinates: [0, 0, 0] },
    // Add more points of interest here
  ]);
  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [lineCoordinates, setLineCoordinates] = useState<Viro3DPoint[]>([]);

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
        return [0, 0, 0] as Viro3DPoint;

      const targetPos = llToPX([latitude, longitude], 9, false, 256);
      const userPos = llToPX([currentLocation?.latitude, currentLocation?.longitude], 9, false, 256);
      const x = targetPos[0] - userPos[0];
      const z = targetPos[1] - userPos[1];
      const y = 0;

      console.log("{ x, y, z }", { x, y, z })

      return [x, y, z] as Viro3DPoint;
    };


    // Update AR world coordinates for each point of interest
    const updatedPoints = pointsOfInterest.map((poi) => {
      const { latitude, longitude } = poi;
      const arCoordinates = convertGPStoARCoordinates(latitude, longitude);
      return { ...poi, arCoordinates };
    });

    setPointsOfInterest(updatedPoints);

    const updatedLineCoordinates = updatedPoints.map((poi) => {
      return poi.arCoordinates;
    });

    setLineCoordinates(updatedLineCoordinates);

  }, [currentLocation]);

  return (
    <ViroARScene>
      <ViroARPlane>
        {
          lineCoordinates[0] &&
          (
            <ViroPolyline
              position={[0, 0, 0]}
              points={lineCoordinates}
              thickness={0.2}
              materials={"red"}
            />
          )}
        {pointsOfInterest.map((poi) => (
          <ViroNode key={poi.id}>
            <ViroText
              text={poi.label}
              scale={[1, 1, 1]}
              style={{ color: '#0000', textAlign: 'center', fontSize: 10 }}
              position={
                [
                  poi.arCoordinates[0],
                  poi.arCoordinates[1] + 0.5,
                  poi.arCoordinates[2]
                ]}
            />
            <ViroSphere
              position={
                [
                  poi.arCoordinates[0],
                  poi.arCoordinates[1],
                  poi.arCoordinates[2]
                ]}
              radius={0.2}
              scale={[0.1, 0.1, 0.1]}
            />
          </ViroNode>
        ))
        }
      </ViroARPlane>
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

ViroMaterials.createMaterials({
  red: {
    diffuseColor: 'red',
  },
});
