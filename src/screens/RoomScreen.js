import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import {AuthContext} from '../navigation/AuthProvider';

export default function RoomScreen({route}) {
  const [messages, setMessages] = useState([]);
  const {thread} = route.params;
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  // useEffect(() => {
  //   console.log({user});
  // }, []);

  // Handle messages sent
  const handleSend = async (newMessages) => {
    const text = newMessages[0].text;

    firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });

    await firestore()
      .collection('THREADS')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  };

  // Messages listener
  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const newMessages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }
          return data;
        });
        setMessages(newMessages);
      });

    return () => messagesListener();
  });

  // Render loading screen
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6646ee" />
    </View>
  );

  // Render own messages bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6646ee',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
        },
      }}
    />
  );

  // Render send button
  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <IconButton icon="send" size={32} color="#6646ee" />
      </View>
    </Send>
  );

  // Render scroll to bottom
  const renderScrollToBottom = (props) => (
    <View style={styles.scrollToBottom}>
      <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
    </View>
  );

  // Render system message
  const renderSystemMessage = (props) => {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{_id: currentUser.uid}}
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderLoading={renderLoading}
      renderSystemMessage={renderSystemMessage}
      scrollToBottomComponent={renderScrollToBottom}
      placeholder="Say something"
      showUserAvatar
      alwaysShowSend
      scrollToBottom
    />
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollToBottom: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6646ee',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
