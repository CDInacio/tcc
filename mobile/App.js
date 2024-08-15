import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';

const Drawer = createDrawerNavigator();

function Feed() {
  return (
    <View>
      <Text>Feeed</Text>
    </View>
  );
}

function Article() {
  return (
    <View>
      <Text>Article</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
    <Drawer.Navigator>
      <Drawer.Screen name="Feed" component={Feed} />
      <Drawer.Screen name="Article" component={Article} />
    </Drawer.Navigator>
    </NavigationContainer>
  );
}