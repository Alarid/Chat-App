import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import useStatusBar from '../utils/useStatusBar';
import Loading from '../components/Loading';

export default function HomeScreen({navigation}) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useStatusBar('light-content');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threadList = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '', // give default
            latestMessage: {
              text: '',
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(threadList);

        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Room', {thread: item})}>
            <List.Item
              title={item.name}
              description={
                item.latestMessage ? item.latestMessage.text : 'Description'
              }
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
  },
  listDescription: {
    fontSize: 14,
  },
});
