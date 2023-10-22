import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: 'calc(100vh - 64px)',
    width: '100%',
    position: 'relative',
  },
}));

const Map = () => {
  const classes = useStyles();
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <div className={classes.mapContainer}>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={{
            height: '100%',
            width: '100%',
          }}
          center={currentPosition}
          zoom={15}
        >
          {currentPosition && (
            <Marker position={currentPosition} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
