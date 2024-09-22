// CalendarButton.js
import React from 'react';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';

const CalendarButton = () => {
  const currentDate = format(new Date(), 'MM/dd/yyyy');

  return (
    <Button
      variant="outlined"
      startIcon={<CalendarTodayIcon />}
    >
      {currentDate}
    </Button>
  );
};

export default CalendarButton;
