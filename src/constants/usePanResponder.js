import { useRef, useState } from 'react';
import { PanResponder, Animated } from 'react-native';

export default function usePanResponder(
  mapRef,
  setDraggedPosition,
  setTempMarker,
  setMessageVisible
) {
  const pan = useRef(new Animated.ValueXY()).current;
  let panMove = false;
  const [draggedPosition, setInternalDraggedPosition] = useState(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: async (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        panMove = true;
        if (mapRef.current) {
          try {
            const coordinate = await mapRef.current.coordinateForPoint({
              x: gesture.moveX,
              y: gesture.moveY,
            });
            setDraggedPosition(coordinate);
          } catch (error) {
            // if coordinateForPoint fails, try to estimate position
            const region = mapRef.current.__lastRegion || mapRef.current.props.initialRegion;
            const { width, height } = mapRef.current.props;
            const latitudeDelta = region.latitudeDelta;
            const longitudeDelta = region.longitudeDelta;

            const latitude = region.latitude - latitudeDelta * (gesture.moveY / height - 0.5);
            const longitude = region.longitude + longitudeDelta * (gesture.moveX / width - 0.5);

            setDraggedPosition({ latitude, longitude });
          }
        }
      },
      onPanResponderRelease: async (_, gesture) => {
        pan.flattenOffset();

        // reset the button position
        pan.setValue({ x: 0, y: 0 });

        if (mapRef.current) {
          try {
            if (panMove == true) {
              const finalCoordinate = await mapRef.current.coordinateForPoint({
                x: gesture.moveX,
                y: gesture.moveY,
              });

              // instead of immediately adding the marker, store it temporarily
              const newMarker = {
                id: Date.now(),
                coordinate: finalCoordinate,
              };

              setTempMarker(newMarker);
              setMessageVisible(true);
            }
          } catch (error) {
            console.log('Error:', error);
            if (draggedPosition) {
              const newMarker = {
                id: Date.now(),
                coordinate: draggedPosition,
              };
              setTempMarker(newMarker);
              setMessageVisible(true);
            }
          }
        }
        panMove = false;
        setDraggedPosition(null);
      },
    })
  ).current;

  return { pan, panResponder };
}
