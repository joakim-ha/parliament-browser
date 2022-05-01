import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PersonDetailsProvider } from "./providers/PersonDetailsProvider";
import { Details } from "./screens/Details";
import { Overview } from "./screens/Overview";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <PersonDetailsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Overview">
          <Stack.Screen
            name="Overview"
            component={Overview}
            options={{ title: "Members of the Parliament" }}
          />
          <Stack.Screen
            name="Details"
            component={Details}
            options={({ route }) => ({ title: route.params.name })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PersonDetailsProvider>
  );
}
