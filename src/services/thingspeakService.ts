// ThingSpeak configuration
const THINGSPEAK_CHANNEL_ID = '2958676'; // ThingSpeak channel ID
const THINGSPEAK_API_KEY = 'JRIAIADQNT3T5BG1';

export const fetchLatestWeight = async (): Promise<number> => {
  try {
    console.log('Fetching weight from ThingSpeak...');
    const response = await fetch(
      `https://api.thingspeak.com/channels/${THINGSPEAK_CHANNEL_ID}/feeds.json?api_key=${THINGSPEAK_API_KEY}&results=1`
    );
    
    if (!response.ok) {
      console.error('ThingSpeak API error:', response.status, response.statusText);
      throw new Error(`Failed to fetch weight data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('ThingSpeak response:', data);

    if (!data.feeds || data.feeds.length === 0) {
      throw new Error('No weight data available');
    }

    const latestFeed = data.feeds[0];
    const weight = parseFloat(latestFeed.field1);
    
    if (isNaN(weight)) {
      throw new Error('Invalid weight data received');
    }

    // Return raw weight value without standardization
    console.log('Successfully fetched raw weight:', weight);
    return weight;
  } catch (error) {
    console.error('Error fetching weight from ThingSpeak:', error);
    throw error;
  }
}; 