import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";

interface ChatBoxProps {
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [showFAQ, setShowFAQ] = useState(true);

  const handleStartConversation = () => {
    setShowFAQ(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {showFAQ ? "FAQ" : "Support Chat"}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✖</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {showFAQ ? (
          <View>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              <Text style={styles.faqItem}>• How can I reset my password?</Text>
              <Text style={styles.faqItem}>
                • Where can I find my order history?
              </Text>
              <Text style={styles.faqItem}>• How do I contact support?</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleStartConversation}
            >
              <Text style={styles.buttonText}>Start a conversation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text>Welcome to support chat!</Text>
          </View>
        )}
      </ScrollView>
      {!showFAQ && (
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Type your message..." />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 300,
    height: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 18,
    color: "gray",
  },
  content: {
    padding: 10,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  faqList: {
    marginBottom: 10,
  },
  faqItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: "gray",
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
});

export default ChatBox;
