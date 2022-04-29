import { Card, ListItem } from "@rneui/themed";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";

export const Details = ({ route }) => {
  useEffect(() => {
    const controller = new AbortController();
    fetchTasksWithIndicator(route.params.id, controller)
      .catch((err) => {
        if (err.name !== "CanceledError") {
          Alert.alert("Network error: " + err, "Please try again later");
        } else {
          console.log("Was cancelled");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasksWithIndicator = async (id, controller) => {
    const personResponse = await axios.get(
      `https://api.lagtinget.ax/api/persons/${id}.json`,
      {
        signal: controller.signal,
      }
    );

    const fetchedTasks = await Promise.all(
      personResponse.data.bindings.map(async ({ organization, role }) => {
        const organizationResponse = await axios.get(
          `https://api.lagtinget.ax/api/organizations/${organization}.json`,
          {
            signal: controller.signal,
          }
        );

        const roleResponse = await axios.get(
          `https://api.lagtinget.ax/api/roles/${role}.json`,
          {
            signal: controller.signal,
          }
        );

        return Promise.resolve({
          organization: organizationResponse.data.title,
          role: roleResponse.data.title,
        });
      })
    );
    setTasks(fetchedTasks);
  };

  const fetchTasksOneByOne = async (id) => {
    const personResponse = await axios.get(
      `https://api.lagtinget.ax/api/persons/${id}.json`
    );

    personResponse.data.bindings.map(async ({ organization, role }) => {
      const organizationResponse = await axios.get(
        `https://api.lagtinget.ax/api/organizations/${organization}.json`
      );

      const roleResponse = await axios.get(
        `https://api.lagtinget.ax/api/roles/${role}.json`
      );

      setTasks((currentTasks) => {
        const updatedTasks = [
          ...currentTasks,
          {
            organization: organizationResponse.data.title,
            role: roleResponse.data.title,
          },
        ];
        return updatedTasks;
      });
    });
  };

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
        {loading ? (
          <ActivityIndicator color="black" size="large" />
        ) : (
          <FlatList
            style={{ marginBottom: 50 }}
            data={tasks}
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
