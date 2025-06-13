import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { IUser } from "../../types/user";
import { Ionicons } from "@expo/vector-icons";
import { currentAddress, goto, region } from "../../utils/common";
import { useTheme } from "react-native-paper";
import useArticle from "../../hooks/useArticle";
import { Article } from "../../types/article";

interface FAQProps {
  setScreen: (screen: string) => void;
  user: IUser | null;
}

const FAQ: React.FC<FAQProps> = ({ setScreen, user }) => {
  const { colors } = useTheme();
  const { fetchArticles } = useArticle();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const searchArticles = async () => {
      try {
        const filteredArticles = await fetchArticles(searchQuery);
        setFilteredArticles(filteredArticles);
      } catch (error) {
        console.log("Error searching articles");
      }
    };

    searchArticles();
  }, [searchQuery]);

  const handleContinue = () => {
    if (user) {
      if (user.role === "Admin") {
        setScreen("admin");
      } else {
        setScreen("chat");
      }
    } else {
      setScreen("form");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSpacing} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQ</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={30} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search question"
            value={searchQuery}
            onChangeText={(e) => setSearchQuery(e)}
          />
        </View>
        {filteredArticles.length <= 0 && <Text>No articles available</Text>}
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleItem}
              onPress={() =>
                goto(`${currentAddress(region())}/articles/${item._id}`)
              }
            >
              <Text style={styles.articleText}>{item.topic}</Text>
              <Ionicons
                name="chevron-forward"
                size={30}
                color={colors.onBackground}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Start a conversation</Text>
        <View style={styles.chatPreview}>
          <Image source={{ uri: "" }} style={styles.avatar} />
          <Text>We will reply as soon as we can, but usually within 2hrs</Text>
        </View>
        <TouchableOpacity style={styles.messageButton} onPress={handleContinue}>
          <Ionicons name="paper-plane" size={25} color={colors.onBackground} />
          <Text style={styles.buttonText}>Send us a message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerSpacing: { height: 32 },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 25,
    padding: 8,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, width: "100%" },
  articleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  articleText: { fontSize: 16 },
  chatPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "black" },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: { marginLeft: 8 },
});

export default FAQ;
