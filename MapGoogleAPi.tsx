import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapGoogleAPI() {
  const [origin, setOrigin] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setOrigin(currentLocation.coords);
    })();
  }, []);

  if (!origin) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      <Marker
        coordinate={{
          latitude: origin.latitude,
          longitude: origin.longitude,
        }}
        title="You are here"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height / 2,
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
