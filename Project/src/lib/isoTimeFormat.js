const isoTimeFormat = (dateTime) => {
    const data = new Date(dateTime);
    const localTime = data.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return localTime;
}

export default isoTimeFormat