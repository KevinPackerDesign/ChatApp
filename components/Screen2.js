import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Screen2 extends React.Component {
  render() {
    let name = this.props.route.params.name;
    const { bgColor } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor ? bgColor : "#fff",
        }}
      >
        <Text>Hello Screen2!</Text>
      </View>
    );
  }
}
