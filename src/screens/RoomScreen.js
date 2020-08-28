import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
    {
      _id: 1,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User',
      },
    },
  ]);

  const handleSend = (newMessage = []) => {
    setMessages(GiftedChat.append(messages, newMessage));
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6646ee" />
    </View>
  );

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

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <IconButton icon="send" size={32} color="#6646ee" />
      </View>
    </Send>
  );

  const renderScrollToBottom = (props) => (
    <View style={styles.scrollToBottom}>
      <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
    </View>
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{_id: 1, name: 'Yoh Legrand'}}
      renderBubble={renderBubble}
      renderSend={renderSend}
      renderLoading={renderLoading}
      placeholder="Say something"
      showUserAvatar
      alwaysShowSend
      scrollToBottom
      scrollToBottomComponent={renderScrollToBottom}
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
});
