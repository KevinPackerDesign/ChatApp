import React from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as firebase from "firebase";
import "firebase/firestore";

export default class Screen2 extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      _id: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    const firebaseConfig = {
      apiKey: "AIzaSyBr4yau5Da4bWowcQGDXmGwplnaPhm8shE",
      authDomain: "chatapp-e1ac5.firebaseapp.com",
      projectId: "chatapp-e1ac5",
      storageBucket: "chatapp-e1ac5.appspot.com",
      messagingSenderId: "745622530335",
      appId: "1:745622530335:web:48a31625cf0a0ea0a3282a",
      measurementId: "G-30BR6JSJNX",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection("messages");
    console.log(this.referenceChatMessages);
    this.refMsgsUser = null;
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages: messages,
    });
    console.log(messages, "hello world");
  };

  addMessage(message) {
    this.referenceChatMessages.add(message);
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        _id: user._id,
        messages: [],
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  componentWillUnmout() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  onSend(messages = []) {
    console.log(messages[0]);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessage(messages[0]);
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "green",
          },
        }}
      />
    );
  }

  render() {
    let name = this.props.route.params.name;
    const { bgColor } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",

          backgroundColor: bgColor ? bgColor : "#fff",
        }}
      >
        <GiftedChat
          style={StyleSheet.giftedChat}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state._id,
            name: name,
            avatar: "https://placeimg.com/140/140/any",
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
