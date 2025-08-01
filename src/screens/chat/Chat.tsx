import React, { useState, useEffect } from "react";
import {
  SectionList,
  View,
  TextInput,
  Image,
  StyleSheet,
  ViewToken,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Avatar,
  IconButton,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { ChatNavigationProp } from "../../types/navigation/stack";
import { IMessage } from "../../types/message";
import moment from "moment";
import { lightTheme } from "../../constant/theme";
import useMessage from "../../hooks/useMessage";
import { baseURL } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import ChatFooter from "../../components/chat/ChatFooter";
import { getSocket } from "../../socket";
import ChatSkeleton from "../../components/chat/ChatSkeleton";
import useToastNotification from "../../hooks/useToastNotification";
import { Ionicons } from "@expo/vector-icons";
import { uploadOptimizeImage } from "../../utils/image";

const socket = getSocket();

const Chat: React.FC<ChatNavigationProp> = ({ navigation, route }) => {
  const conversationId = route.params?.conversationId;
  const {
    loadingMessage,
    messages,
    conversations,
    isTypingList,
    currentConversation,
    setCurrentConversation,
    isAnimating,
    sendMessage,
  } = useMessage();
  const { user } = useAuth();
  const { addNotification } = useToastNotification();
  const { colors } = useTheme();
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState({
    value: false,
    message: "",
    failed: false,
    image: "",
  });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  console.log(currentConversation, conversationId, conversations);

  useEffect(() => {
    if (conversationId) {
      const currentConversation = conversations.find(
        (conversation) => conversation._id.toString() === conversationId
      );
      if (currentConversation) {
        setCurrentConversation(currentConversation);
      }
    }
  }, [conversationId, conversations.length]);

  // Function to emit startTyping event
  const startTyping = () => {
    socket.emit("typing", {
      conversationId: currentConversation?._id,
      userId: user?._id,
    });
  };

  // Function to emit stopTyping event
  const stopTyping = () => {
    socket.emit("stopTyping", {
      conversationId: currentConversation?._id,
      userId: user?._id,
    });
  };

  const handleMessageSubmit = async () => {
    // Handle sending message logic
    if (!currentConversation) return;
    // if (!messageInput) return;
    try {
      setSending({ value: true, message: messageInput, failed: false, image });
      setMessageInput("");
      setImage("");
      await sendMessage({
        content: messageInput,
        conversationId: currentConversation._id,
        image,
        type: currentConversation.type,
      });
      setSending({ value: false, message: "", failed: false, image: "" });
    } catch (error) {
      console.log(error);
      setSending((prev) => ({ ...prev, value: true, failed: true }));
    }
  };

  const handleRetry = () => {
    setMessageInput(sending.message);
    setImage(sending.image);
    setSending((prev) => ({
      ...prev,
      value: false,
      failed: false,
      message: "",
      image: "",
    }));
  };

  const getDayLabel = (timestamp: string): string => {
    var dayLabel: string;
    const today = moment();
    const yesterday = moment().subtract(1, "days");

    const messageDate = moment(timestamp);
    const withinLastSevenDays = messageDate.isSameOrAfter(
      today.clone().subtract(6, "days"),
      "day"
    );
    if (messageDate.isSame(today, "day")) {
      dayLabel = "Today";
    } else if (messageDate.isSame(yesterday, "day")) {
      dayLabel = "Yesterday";
    } else if (withinLastSevenDays) {
      dayLabel = messageDate.format("dddd"); // Return the name of the day
    } else {
      dayLabel = messageDate.format("DD/MM/YYYY"); // Return date in DD/MM/YYYY format
    }

    return dayLabel;
  };

  const renderMessageContent = (message: IMessage) => {
    let content = message.content;

    // if (message.forwardedFrom) {
    //   content = `Forwarded from ${message.forwardedFrom}: ${message.content}`;
    // } else if (message.replyTo) {
    //   const replyMessage = messages.find((msg) => msg.id === message.replyTo);
    //   content = `Replying to: "${replyMessage?.content}"\n${message.content}`;
    // } else if (message.referencedUser) {
    //   content = `${message.content}\nReferenced User: ${message.referencedUser}`;
    // } else if (message.referencedProduct) {
    //   content = `${message.content}\nReferenced Product: ${message.referencedProduct}`;
    // }

    return content;
  };

  const groupedMessages = messages
    .slice()
    .reverse()
    .reduce((acc, message) => {
      const dayLabel = getDayLabel(message.createdAt);
      if (!acc[dayLabel]) {
        acc[dayLabel] = [];
      }
      acc[dayLabel].push(message);
      return acc;
    }, {} as Record<string, IMessage[]>);

  const sections = Object.keys(groupedMessages).map((dayLabel) => ({
    title: dayLabel,
    data: groupedMessages[dayLabel],
  }));

  const renderMessage = ({ item }: { item: IMessage }) => (
    <View
      key={item._id}
      style={[
        styles.messageContainer,
        item.sender === user?._id ? styles.sent : styles.received,
      ]}
    >
      {item.sender !== user?._id && (
        <Avatar.Image
          size={20}
          source={{ uri: baseURL + currentConversation?.otherUser.image }}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === user?._id ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        {item.image && (
          <Image
            source={{ uri: baseURL + item.image }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <Text style={styles.messageText}>{renderMessageContent(item)}</Text>
        <Text style={styles.timestamp}>
          {moment(item.createdAt).format("LT")}
        </Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View
      style={[styles.dayLabelContainer, { backgroundColor: colors.surface }]}
    >
      <Text style={styles.dayLabel}>{title}</Text>
    </View>
  );

  const renderStickyDate = () => {
    return currentDate ? (
      <View style={styles.stickyDate}>
        <View
          style={[
            styles.stickyDateTextCont,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={styles.stickyDateText}>{currentDate}</Text>
        </View>
      </View>
    ) : null;
  };

  const updateStickyDate = ({
    viewableItems,
    changed,
  }: {
    viewableItems: Array<ViewToken>;
    changed: Array<ViewToken>;
  }) => {
    if (viewableItems && viewableItems.length) {
      const sectionHeaders = viewableItems.filter((i) => i.index === null);
      if (sectionHeaders.length > 0) {
        const firstSectionTitle = sectionHeaders[0].item.title;
        const sectionIndex = sections.findIndex(
          (section) => section.title === firstSectionTitle
        );
        if (sectionIndex > 0 && sections[sectionIndex + 1]) {
          setCurrentDate(sections[sectionIndex + 1].title);
        } else {
          setCurrentDate(null);
        }
      } else {
        const lastItem = viewableItems[0];
        if (lastItem && lastItem.section) {
          setCurrentDate(lastItem.section.title);
        }
      }
    }
  };

  const pickImage = async () => {
    try {
      setUploading(true);

      const res = await uploadOptimizeImage();
      setImage(res as string);
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <View style={styles.headerContent}>
          <Avatar.Image
            size={40}
            source={{ uri: baseURL + currentConversation?.otherUser.image }}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {currentConversation?.otherUser.username}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isTypingList.find((type) => type.id === currentConversation?._id)
                ? "typing..."
                : "online"}
            </Text>
          </View>
        </View>
        <Appbar.Action
          icon="flag"
          onPress={() => {
            /* Handle report */
          }}
        />
      </Appbar.Header>
      {renderStickyDate()}
      {loadingMessage ? (
        <ChatSkeleton />
      ) : (
        <SectionList
          sections={sections} // Reverse to show latest messages at the bottom
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          renderSectionFooter={renderSectionHeader}
          style={[
            styles.chatList,
            { backgroundColor: colors.elevation.level1 },
          ]}
          ListHeaderComponent={
            <ChatFooter
              currentConversation={currentConversation}
              handleRetry={handleRetry}
              isTypingList={isTypingList}
              sending={sending}
            />
          }
          inverted
          onViewableItemsChanged={updateStickyDate}
        />
      )}

      {image && (
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: colors.elevation.level5,
            },
          ]}
        >
          <Image source={{ uri: baseURL + image }} style={styles.image} />
          <TouchableOpacity onPress={() => setImage("")}>
            <Ionicons name="close" size={24} color={colors.onBackground} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.inputContainer}>
        {uploading ? (
          <ActivityIndicator />
        ) : (
          <IconButton icon="image-outline" size={30} onPress={pickImage} />
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.elevation.level5,
              color: colors.onBackground,
            },
          ]}
          value={messageInput}
          onChangeText={(text) => {
            setMessageInput(text);
            startTyping();
          }}
          placeholder="Type a message"
          onFocus={startTyping}
          onBlur={stopTyping}
        />
        <IconButton icon="send" size={30} onPress={handleMessageSubmit} />
      </View>
    </View>
  );
};

const WIDTH = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 8,
    marginLeft: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    color: "white",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
    color: "white",
    textAlign: "right",
  },
  sent: {
    justifyContent: "flex-end",
  },
  received: {
    justifyContent: "flex-start",
  },
  sentBubble: {
    backgroundColor: lightTheme.colors.primary,
    alignSelf: "flex-end",
  },
  receivedBubble: {
    backgroundColor: lightTheme.colors.secondary,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "absential-sans-bold",
  },
  headerSubtitle: {
    fontSize: 14,
  },
  dayLabelContainer: {
    alignSelf: "center",
    marginVertical: 8,
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 10,
  },
  dayLabel: {},
  stickyDate: {
    alignItems: "center",
    justifyContent: "center",
    width: WIDTH,
    position: "absolute",
    top: 120,
    zIndex: 50,
  },
  stickyDateTextCont: {
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 20,
  },
  stickyDateText: {
    textAlign: "center",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
});

export default Chat;
