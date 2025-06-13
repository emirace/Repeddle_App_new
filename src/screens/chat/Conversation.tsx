import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Appbar, Badge, Searchbar, Text, useTheme } from "react-native-paper";
import useMessage from "../../hooks/useMessage";
import moment from "moment";
import { IConversation } from "../../types/message";
import { baseURL } from "../../services/api";
import { markMessagesAsRead } from "../../utils/socket";
import useAuth from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";

const Conversation: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const { markDotAsRead } = useNotification();
  const {
    conversations,
    getConversations,
    currentTab,
    setCurrentConversation,
    loading,
    isTypingList,
  } = useMessage();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getConversations(currentTab);
  }, [currentTab]);

  useEffect(() => {
    markDotAsRead("message");
  }, []);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const openChat = (conversation: IConversation) => {
    setCurrentConversation(conversation);
    markMessagesAsRead(conversation._id, user!._id);
    navigation.push("Chat");
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonItem}>
      <View
        style={[
          styles.skeletonAvatar,
          { backgroundColor: colors.elevation.level5 },
        ]}
      />
      <View style={styles.skeletonContent}>
        <View
          style={[
            styles.skeletonText,
            { backgroundColor: colors.elevation.level5 },
          ]}
        />
        <View
          style={[
            styles.skeletonText,
            { backgroundColor: colors.elevation.level5 },
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Conversations" />
      </Appbar.Header>
      <FlatList
        data={filteredConversations}
        keyExtractor={(item, index) => item._id || index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          console.log("item", item);
          return item.lastMessage ? (
            <TouchableOpacity
              style={styles.listItem}
              activeOpacity={0.7}
              onPress={() => openChat(item)}
            >
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={{ uri: baseURL + item.otherUser.image }}
                />
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.otherUser.username}</Text>
                  <Text style={styles.lastMessage}>
                    {isTypingList.find((type) => type.id === item._id) ? (
                      <Text style={{ color: colors.primary }}>typing...</Text>
                    ) : item?.lastMessage?.content?.length > 18 ? (
                      item.lastMessage.content.slice(0, 18) + "..."
                    ) : (
                      item?.lastMessage?.content
                    )}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>
                    {moment(item.lastMessage.createdAt).calendar()}
                  </Text>
                  {item.unreadCount > 0 && (
                    <Badge style={styles.badge}>{item.unreadCount}</Badge>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ) : null;
        }}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
        }
        style={styles.list}
        ListFooterComponent={
          loading ? (
            renderSkeleton()
          ) : filteredConversations.length <= 0 ? (
            <Text style={{ margin: 20 }}>No Conversation available</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    marginBottom: 8,
  },
  list: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    flexDirection: "row",
    padding: 10,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  badge: {},
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "absential-sans-bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  timeContainer: {
    marginLeft: 10,
    justifyContent: "flex-start",
  },
  time: {
    fontSize: 12,
    color: "#777",
  },
  skeletonItem: {
    flexDirection: "row",
    padding: 10,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonText: {
    height: 20,
    backgroundColor: "#ccc",
    marginBottom: 6,
    borderRadius: 4,
  },
});

export default Conversation;
