import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingState,
  ViroTrackingReason,
  ViroButton,
  ViroSphere
} from '@viro-community/react-viro';
import { Viro3DPoint } from '@viro-community/react-viro/dist/components/Types/ViroUtils';

interface Coordinates {
  id: number;
  coordinates: Viro3DPoint | undefined;
}

const HelloWorldSceneAR = () => {
  const [coordinates, setCoordinates] = useState<Coordinates[]>([{ "coordinates": [0.2537532448768616, -1.228468656539917, -1.2376713752746582], "id": 1 }, { "coordinates": [-0.2174995243549347, -1.1287752389907837, -1.0586485862731934], "id": 2 }, { "coordinates": [-0.629641592502594, -1.2444515228271484, -0.9369375109672546], "id": 3 }, { "coordinates": [-0.7692882418632507, -0.987709105014801, -1.4685478210449219], "id": 4 }, { "coordinates": [-0.8436772227287292, -0.8886220455169678, -1.8343422412872314], "id": 5 }, { "coordinates": [-0.9250354170799255, -0.884567379951477, -2.222095012664795], "id": 6 }, { "coordinates": [-0.9987673759460449, -0.8240764737129211, -2.5986433029174805], "id": 7 }, { "coordinates": [-1.0510752201080322, -0.8471832275390625, -2.9861409664154053], "id": 8 }, { "coordinates": [-1.0115647315979004, -0.8483832478523254, -3.277928113937378], "id": 9 }, { "coordinates": [-0.6903905272483826, -0.9149320125579834, -3.405579090118408], "id": 10 }, { "coordinates": [-0.3525904417037964, -0.8816515207290649, -3.521821975708008], "id": 11 }, { "coordinates": [0.06288915872573853, -0.889143705368042, -3.732713222503662], "id": 12 }, { "coordinates": [0.40278393030166626, -0.826123058795929, -3.9350171089172363], "id": 13 }, { "coordinates": [0.7681126594543457, -0.8385581970214844, -4.163658142089844], "id": 14 }])
  const [isTracking, setIsTracking] = useState<boolean>(false);
  console.log(coordinates)

  function onInitialized(state: ViroTrackingState, reason: ViroTrackingReason) {
    console.log('----------Initialized---------', state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      console.log("-------Tracking is working-------");
      setIsTracking(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
      console.log("-------Tracking is not working-------");
      setIsTracking(false);
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {isTracking && (
        <>
          {
            coordinates.map((coordinate) => {
              return (
                <ViroSphere
                  radius={0.4}
                  key={coordinate.id}
                  position={coordinate.coordinates}
                  scale={[0.2, 0.2, 0.2]}
                  onDrag={(coord) => {
                    // set current coordinates
                    setCoordinates((prevCoordinates) => {
                      return prevCoordinates.map((prevCoordinate) => prevCoordinate.id === coordinate.id ? { ...prevCoordinate, coordinates: [coord[0], coord[1], coord[2]] } : prevCoordinate)
                    })
                  }}
                />
              )
            })
          }
          <ViroButton
            position={[0, 0, -2]}
            source={require("./res/tracker.jpeg")}
            onClick={(position, source) => {
              console.log('clicked', position, source);
              setCoordinates((prevCoordinates) => {
                return [
                  ...prevCoordinates,
                  { id: prevCoordinates.length + 1, coordinates: [0, 1, -1] }
                ]
              })
            }}
          /></>
      )}
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
