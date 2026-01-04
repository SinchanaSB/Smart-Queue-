import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import QueueScreen from "./screens/QueueScreen";
import MyTokenScreen from "./screens/MyTokenScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Queue" component={QueueScreen} />
        <Stack.Screen name="MyToken" component={MyTokenScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
/*import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import QueueScreen from "./screens/QueueScreen";
import MyTokenScreen from "./screens/MyTokenScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Queue" component={QueueScreen} />
        <Stack.Screen name="MyToken" component={MyTokenScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/
