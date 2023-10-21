import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import MapIcon from '@heroicons/react/24/solid/MapIcon'; 
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Map',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon /> 
      </SvgIcon>
    )
  }
];
