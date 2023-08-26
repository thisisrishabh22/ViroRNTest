import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, createRef, useRef, useState } from 'react'
import { Coordinates } from '../types/Coordinates';
import { ViroARScene } from '@viro-community/react-viro';


type ARContextType = {
  coordinates: Coordinates[];
  addNode: () => void;
  setCoordinates: Dispatch<SetStateAction<Coordinates[]>>;
  currentSceneRef: React.MutableRefObject<null>;
  isTracking: boolean;
  setIsTracking: Dispatch<SetStateAction<boolean>>;
};

// create context
const ARContext = createContext<ARContextType>({
  coordinates: [],
  addNode: () => { },
  setCoordinates: () => { },
  currentSceneRef: createRef(),
  isTracking: false,
  setIsTracking: () => { },
});


const ARContextProvider = (props: PropsWithChildren) => {
  const { children } = props;


  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const currentSceneRef = useRef<ViroARScene | null>(null);

  const addNode = async () => {
    console.log("trying adding node");
    if (!isTracking) {
      return;
    }

    if (!currentSceneRef.current) {
      return;
    }

    const camPosition = await currentSceneRef.current.getCameraOrientationAsync?.();
    if (camPosition == null) {
      return
    }

    console.log("camPosition", camPosition);
    const newCoordinate: Coordinates = {
      id: coordinates.length + 1,
      coordinates: [camPosition.position[0], camPosition.position[1], camPosition.position[2] - 1], // Adjust the starting position as needed
    };
    setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinate]);
    console.log("node added");
  }

  return (
    <ARContext.Provider value={{ coordinates, addNode, setCoordinates, currentSceneRef, isTracking, setIsTracking }}>
      {children}
    </ARContext.Provider>
  );
}


export { ARContext, ARContextProvider };
