function generateTimeSlots(startTime, endTime, duration, bookedSlots = []) {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (
    currentHour < endHour || 
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Add slot if not booked
    if (!bookedSlots.includes(timeString)) {
      slots.push(timeString);
    }
    
    // Add duration
    currentMinute += duration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute %= 60;
    }
  }
  
  return slots;
}

module.exports = generateTimeSlots;