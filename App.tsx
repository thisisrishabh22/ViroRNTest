import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ViroARScene,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingState,
  ViroTrackingReason,
  ViroSphere,
  ViroARPlane,
  ViroMaterials,
  ViroAnchor,
  ViroNode,
} from '@viro-community/react-viro';
import { Viro3DPoint } from '@viro-community/react-viro/dist/components/Types/ViroUtils';
import { ARContext } from './Context/ARContext';
import { Coordinates } from './types/Coordinates';

const HelloWorldSceneAR = () => {
  const [draggingSphere, setDraggingSphere] = useState<number | null>(null);

  const { coordinates, setCoordinates, currentSceneRef, isTracking, setIsTracking } = useContext(ARContext);

  function onInitialized(state: ViroTrackingState, reason: ViroTrackingReason) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setIsTracking(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setIsTracking(false);
    }
  }

  const handleDragStart = (id: number) => {
    setDraggingSphere(id);
  };

  const handleDrag = (id: number, newPosition: Viro3DPoint) => {
    handleDragStart(id);
    setCoordinates((prevCoordinates) =>
      prevCoordinates.map((coord) =>
        coord.id === id
          ? { ...coord, coordinates: [newPosition[0], 0.1, newPosition[2]] }
          : coord
      )
    );
    handleDragRelease();
  };

  const handleDragRelease = () => {
    setDraggingSphere(null);
  };

  return (
    <ViroARScene
      onTrackingUpdated={onInitialized}
      ref={currentSceneRef}
      onAnchorFound={() => console.log("anchor found")}
      onAnchorUpdated={() => console.log("anchor updated")}
      onAnchorRemoved={() => console.log("anchor removed")}
    >
      <ViroARPlane>
        {coordinates.map((coordinate) => (
          <ViroSphere
            key={coordinate.id}
            position={coordinate.coordinates}
            radius={0.1}
            dragType="FixedToWorld"
            onDrag={(newPosition, source) => {
              console.log(newPosition, source);
              handleDrag(coordinate.id, newPosition)
            }}
            physicsBody={{ type: 'Static', restitution: 0.1, useGravity: true }}
            materials={['stone']}
          />
        ))}
      </ViroARPlane>
    </ViroARScene>
  );
};

export default () => {
  const { addNode } = useContext(ARContext);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.arContainer}
      />

      <View style={styles.controlView}>
        <Button
          onPress={addNode}
          title='Add Node'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arContainer: {
    flex: 1,
  },
  addButton: {
    width: 200,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
  },
  controlView: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

ViroMaterials.createMaterials({
  'stone': {
    diffuseTexture: require('./res/stone_texture.jpeg')
  }
})
