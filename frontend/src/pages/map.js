import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import mapboxgl from 'mapbox-gl';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    height: '100vh',
    width: '100%',
  },
}));

const Map = () => {
  const classes = useStyles();
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-71.0589, 42.3601],
        zoom: 12,
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer: mapContainerRef });
  }, [map]);

  const mapContainerRef = React.useRef(null);

  return (
    <Box className={classes.mapContainer}>
      <div ref={mapContainerRef} className={classes.mapContainer} />
    </Box>
  );
};

Map.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Map;
