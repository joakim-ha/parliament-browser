import { Card, ListItem } from "@rneui/themed";
import { useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";

import { PersonDetailsContext } from "../providers/PersonDetailsProvider";

export const Details = ({ route }) => {
  const provider = useContext(PersonDetailsContext);

  useEffect(() => {
    provider.setId(route.params.id);

    return () => provider.setId(null);
  }, []);

  useEffect(() => {
    if (provider.error) {
      Alert.alert("Network error");
    }
  }, [provider.error]);

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.role}</ListItem.Title>
        <ListItem.Subtitle>{item.organization}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Card containerStyle={{ flex: 1, marginBottom: 15 }}>
        <Card.Title>Tasks</Card.Title>
        <Card.Divider />
        {provider.loading ? (
          <ActivityIndicator color="black" size="large" />
        ) : (
          <FlatList
            style={{ marginBottom: 50 }}
            data={provider.tasks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
          />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
