import { ListItem, Avatar, SearchBar } from "@rneui/themed";
import axios from "axios";
import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";

import mock from "../mock/persons.json";

export const Overview = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    axios
      .get("https://api.lagtinget.ax/api/persons.json?state=1")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch((err) => {
        Alert.alert("Network error: " + err, "Please try again later");
      });
  }, []);

  const updateSearch = (newSearch) => {
    setSearch(newSearch);

    if (newSearch === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (person) =>
            person.first_name.toLowerCase().match(newSearch.toLowerCase()) ||
            person.last_name.toLowerCase().match(newSearch.toLowerCase())
        )
      );
    }
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() =>
        navigation.navigate("Details", { name: item.name, id: item.id })
      }
    >
      <Avatar
        rounded
        size="large"
        source={item.image && { uri: item.image.url }}
        title={item.first_name.charAt(0) + item.last_name.charAt(0)}
        overlayContainerStyle={styles.avatar}
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search by name"
        lightTheme="true"
        inputContainerStyle={styles.searchBar}
        onChangeText={updateSearch}
        value={search}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    backgroundColor: "lightgrey",
  },
  searchBar: {
    backgroundColor: "white",
  },
});
