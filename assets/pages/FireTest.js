import React, { useEffect, useState } from 'react';
import { Text, View, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { SafeAreaView } from 'react-native-safe-area-context';

const FireTest = () => {
  const [dish, setDish] = useState(null);

  const getData = async () => {
    try {
      const foodsCollection = await getDocs(collection(db, 'food'));
      foodsCollection.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
      });
      setDish(foodsCollection.docs[0].data());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <Text>Firebase Test</Text>
      {dish ? <Text>{dish.price}</Text> : <Text>Loading...</Text>}
      {dish ? <Text>{dish.title}</Text> : <Text>Loading...</Text>}
      {/*{dish ? <Image source = {{uri:dish.image_url }} style = {{height:500, width:500}}/> : <Text>Loading...</Text>}*/}
    </SafeAreaView>
  );
};

export default FireTest;
