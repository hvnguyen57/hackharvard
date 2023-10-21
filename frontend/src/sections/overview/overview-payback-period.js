import PropTypes from 'prop-types';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon'; 
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';

export const OverviewTasksProgress = (props) => {
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={0.5}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              Payback Period
            </Typography>
            <Typography variant="h4">
              {value} years
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <ClockIcon /> 
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 1.5 }}>
        <Typography
              color="text.secondary"
              variant="caption"
            >
              Last updated:
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewTasksProgress.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object
};
