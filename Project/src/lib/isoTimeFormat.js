const isoTimeFormat = (timeString) => {
    // If it's already a formatted time string with am/pm, just return it as-is
    if (typeof timeString === 'string' && (timeString.includes('am') || timeString.includes('pm'))) {
        return timeString;
    }
    
    // If it's a 24-hour format time string (like "18:00"), convert to 12-hour format
    if (typeof timeString === 'string' && timeString.includes(':') && !timeString.includes('am') && !timeString.includes('pm')) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    // If it's a full datetime string, format it
    const data = new Date(timeString);
    if (isNaN(data.getTime())) {
        return timeString; // Return original if invalid date
    }
    
    const localTime = data.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    
    return localTime;
}

export default isoTimeFormat