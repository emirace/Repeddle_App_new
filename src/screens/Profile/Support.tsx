import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IGuestUser, IUser } from "../../types/user";
import useAuth from "../../hooks/useAuth";
import useToastNotification from "../../hooks/useToastNotification";
import { loginGuestService } from "../../services/user";
import socket from "../../socket";
import useArticle from "../../hooks/useArticle";
import FAQ from "../../components/support/FAQ";
import Form from "../../components/support/Form";
import Chat from "../../components/support/Chat";
import Header from "../../components/support/Header";
import { SupportNavigationProp } from "../../types/navigation/stack";

const Support: React.FC<SupportNavigationProp> = ({ navigation }) => {
  const { user: defaultUser } = useAuth();
  const { addNotification } = useToastNotification();
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (defaultUser) {
      setUser(defaultUser);
    } else {
      const email = localStorage.getItem("guestUserEmail");
      const fullName = localStorage.getItem("guestUserFullName");
      if (email && fullName) {
        loginGuest({ email, fullName });
      }
    }
  }, []);

  const loginGuest = async (value: IGuestUser) => {
    try {
      const { email, fullName } = value;
      const res = await loginGuestService({ email, fullName });
      if (res) {
        setUser(res);
        socket.emit("login", res._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <FAQ setScreen={setScreen} user={user} />;
      case "form":
        return <Form setScreen={setScreen} loginGuest={loginGuest} />;
      case "chat":
        return <Chat user={user} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        screen={screen}
        setScreen={setScreen}
        user={user}
      />
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Support;
