import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SectionList,
  ViewToken,
  Dimensions,
} from "react-native";
import moment from "moment";
import useMessage from "../../hooks/useMessage";
import useAuth from "../../hooks/useAuth";
import useToastNotification from "../../hooks/useToastNotification";
import { getConversationsService } from "../../services/message";
import { IUser } from "../../types/user";
import { baseURL } from "../../services/api";
import { Ionicons } from "@expo/vector-icons";
import {
  Avatar,
  IconButton,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import ChatFooter from "../chat/ChatFooter";
import ChatSkeleton from "../chat/ChatSkeleton";
import { IMessage } from "../../types/message";
import { lightTheme } from "../../constant/theme";
import { uploadOptimizeImage } from "../../utils/image";

interface ChatProps {
  user: IUser | null;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const {
    loadingMessage,
    messages,
    isTypingList,
    currentConversation,
    setCurrentConversation,
    sendMessage,
  } = useMessage();
  const { addNotification } = useToastNotification();
  const { colors } = useTheme();
  const [messageInput, setMessageInput] = useState("");
  const [sending, setSending] = useState({
    value: false,
    image: "",
    message: "",
    failed: false,
  });
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);
        const res = await getConversationsService("Support");
        console.log("support conversation", res);
        setCurrentConversation(res[0] || null);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        addNotification(error);
      }
    };
    getConversations();
  }, []);

  const handleRetry = () => {
    setMessageInput(sending.message);
    setImage(sending.image);
    setSending({ value: false, failed: false, message: "", image: "" });
  };

  const handleMessageSubmit = async () => {
    if (!messageInput && !image) return;
    try {
      setSending({ value: true, image, message: messageInput, failed: false });
      setMessageInput("");
      setImage("");
      await sendMessage({
        image,
        content: messageInput,
        type: "Support",
        conversationId: currentConversation?._id as string,
      });
      setSending({ value: false, image: "", message: "", failed: false });
    } catch (error) {
      console.log(error);
      setSending((prev) => ({ ...prev, value: true, failed: true }));
    }
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
    <View style={{ flex: 1 }}>
      {renderStickyDate()}
      {loadingMessage || loading ? (
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
          }}
          placeholder="Type a message"
        />
        <IconButton icon="send" size={30} onPress={handleMessageSubmit} />
      </View>
    </View>
  );
};

export default Chat;

const WIDTH = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 8,
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
    top: 20,
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
