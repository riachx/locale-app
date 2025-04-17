import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// filtering by date
export const filterTodayPins = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const q = query(
    collection(db, 'pins'),
    where('timestamp', '>=', today),
    where('timestamp', '<', tomorrow)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export const filterMarkersByScore = markers => {
  const sortedMarkers = [...markers].sort((a, b) => b.score - a.score);
  return sortedMarkers.slice(0, 3); // get top 3 markers
};

export const filterMarkersByUser = markers => {
  return markers.filter(marker => marker.isMine === true);
};

export const filterMarkersByFriends = markers => {
  return markers.filter(marker => marker.isMine === false);
};

export const filterMarkersByDate = markers => {
  const sortedMarkers = [...markers].sort((a, b) => {
    const timestampA = a.timestamp?.toDate() || new Date(0);
    const timestampB = b.timestamp?.toDate() || new Date(0);
    return timestampB - timestampA; // Sort in descending order (newest first)
  });
  return sortedMarkers.slice(0, 3);
};

export const filterMarkersByTime = async timeFilter => {
  try {
    const now = new Date();
    let cutoffDate = new Date();

    switch (timeFilter) {
      case 'day':
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return null;
    }

    const pinsRef = collection(db, 'pins');
    const q = query(pinsRef, where('timestamp', '>=', cutoffDate));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        coordinate: {
          latitude: Number(data.coordinate.latitude),
          longitude: Number(data.coordinate.longitude),
        },
        title: data.title,
        description: data.description,
        image: { uri: data.image || 'https://i.imgur.com/lqqIvIr.png' },
        score: data.score || 0,
        username: data.username || 'Unknown',
        user_id: data.user_id,
        timestamp: data.timestamp,
      };
    });
  } catch (error) {
    console.error('Error filtering markers by time:', error);
    throw error;
  }
};
