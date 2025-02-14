import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import { Appbar, IconButton, Text, useTheme } from "react-native-paper"
import { Feather, Ionicons } from "@expo/vector-icons"
import useAuth from "../../hooks/useAuth"
import { MyAccountNavigationProp } from "../../types/navigation/stack"
import useUser from "../../hooks/useUser"
import { IUser, UserByUsername } from "../../types/user"
import All from "../../section/myAccount/All"
import Selling from "../../section/myAccount/Selling"
import Liked from "../../section/myAccount/Liked"
import Saved from "../../section/myAccount/Saved"
import Sold from "../../section/myAccount/Sold"
import {
  Tabs,
  MaterialTabBar,
  TabBarProps,
} from "react-native-collapsible-tab-view"
import RebundlePoster from "../../components/RebundlePoster"
import Rating from "../../components/Rating"
import { baseURL } from "../../services/api"
import { lightTheme } from "../../constant/theme"
import Loader from "../../components/ui/Loader"
import useToastNotification from "../../hooks/useToastNotification"

type Props = MyAccountNavigationProp

const TabBar = (props: TabBarProps<string>) => {
  const { colors } = useTheme()
  return (
    <MaterialTabBar
      {...props}
      indicatorStyle={{ backgroundColor: lightTheme.colors.primary }}
      labelStyle={{
        textTransform: "capitalize",
        fontFamily: "absential-sans-bold",
        color: colors.onBackground,
      }}
      activeColor={colors.onBackground}
      inactiveColor={colors.onBackground}
    />
  )
}

const MyAccount = ({ navigation, route }: Props) => {
  const { colors } = useTheme()
  const { user: userInfo } = useAuth()
  const { getUserByUsername, error, loading: loadingUser } = useUser()
  const { username } = route.params
  const { addNotification } = useToastNotification()

  const [userData, setUserData] = useState<UserByUsername>()

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserByUsername(username)
      if (typeof res !== "string") {
        setUserData(res)
      } else {
        addNotification({ message: res, error: true })
      }
    }

    fetchUser()
  }, [username])

  const isOnlineCon = (c: string) => {
    // if (onlineUser.length > 0) {
    //   let onlineUserList = [];
    //   onlineUser.map((o) => onlineUserList.push(o._id));
    //   if (onlineUserList.includes(c)) {
    //     return true;
    //   } else return false;
    // }
    return true
  }

  const isFollowing = useMemo(
    () => !!userData?.user.followers.find((x) => x === userInfo?._id),
    [userData, userInfo]
  )

  return loadingUser ? (
    <Loader />
  ) : userData ? (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title={userData.user.username}
          titleStyle={{ textTransform: "capitalize", color: "white" }}
        />
        {userInfo?._id === userData.user._id && (
          <Appbar.Action
            icon={({ color, size }) => (
              <Feather
                iconColor="white"
                name="edit"
                size={size}
                color={color}
              />
            )}
            onPress={() => navigation.push("ProfileSettings")}
          />
        )}
      </Appbar.Header>
      <Tabs.Container
        headerContainerStyle={{
          backgroundColor: colors.background,
        }}
        renderHeader={() => (
          <RenderHeader
            isFollowing={isFollowing}
            isOnlineCon={isOnlineCon}
            navigation={navigation}
            user={userData.user}
            userInfo={userInfo}
          />
        )}
        renderTabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Tab name="All">
          <All products={userData.products.all} navigation={navigation} />
        </Tabs.Tab>
        <Tabs.Tab name="Selling">
          <Selling
            products={userData.products.selling}
            navigation={navigation}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Sold">
          <Sold products={userData.products.sold} navigation={navigation} />
        </Tabs.Tab>
        <Tabs.Tab name="Liked">
          <Liked products={userData.products.liked} navigation={navigation} />
        </Tabs.Tab>
        {userInfo?._id === userData.user._id ? (
          <Tabs.Tab name="Wishlist">
            <Saved products={[]} navigation={navigation} />
          </Tabs.Tab>
        ) : null}
      </Tabs.Container>
    </View>
  ) : null
}

type RenderProps = {
  isOnlineCon: (id: string) => boolean
  user: UserByUsername["user"]
  userInfo: IUser | null
  navigation: MyAccountNavigationProp["navigation"]
  isFollowing: boolean
}

const RenderHeader = ({
  isOnlineCon,
  user,
  userInfo,
  navigation,
  isFollowing,
}: RenderProps) => {
  const { colors } = useTheme()
  const { followUser, unFollowUser, error } = useAuth()
  const { addNotification } = useToastNotification()

  const followHandle = async () => {
    if (!user?._id) return

    if (user?._id === userInfo?._id) {
      addNotification({ message: "You can't follow yourself", error: true })
    }

    if (isFollowing) {
      const res = await unFollowUser(user._id)
      if (res) {
        addNotification({ message: res })
      } else {
        addNotification({
          message: error ?? "failed to unfollow user",
          error: true,
        })
      }
    } else {
      const res = await followUser(user._id)
      if (res) {
        addNotification({ message: res })
      } else {
        addNotification({
          message: error ?? "failed to follow user",
          error: true,
        })
      }
    }
  }

  const addConversation = async (id: string, type: string) => {}

  const handlereport = async (id: string) => {}

  const onShare = async () => {
    try {
      Share.share({ message: user.username })
    } catch (error) {}
  }

  return (
    <View pointerEvents="box-none">
      <View
        pointerEvents="box-none"
        style={[styles.topCont, { backgroundColor: colors.elevation.level2 }]}
      >
        <View style={styles.onlineCont}>
          {isOnlineCon(user._id) ? (
            <Text
              style={[
                styles.online,
                { color: colors.primary, borderColor: colors.primary },
              ]}
            >
              online
            </Text>
          ) : (
            <Text
              style={[
                styles.offline,
                { color: colors.secondary, borderColor: colors.secondary },
              ]}
            >
              offline
            </Text>
          )}
        </View>
        <Image source={{ uri: baseURL + user.image }} style={styles.image} />
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <Text style={styles.username}>@{user.username}</Text>
          <TouchableOpacity
            onPress={onShare}
            style={[styles.share, { backgroundColor: colors.elevation.level2 }]}
          >
            <IconButton
              style={{ margin: 0 }}
              size={16}
              iconColor={colors.secondary}
              icon="share-variant"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.followCont}>
          <Text>{user.followers.length} Follower</Text>
          <Text>{user.following.length} Following</Text>
          {userInfo && userInfo._id !== user._id && (
            <Text
              onPress={followHandle}
              style={[styles.followButton, { backgroundColor: colors.primary }]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.push("SellerReview", {
              username: user.username,
            })
          }
        >
          <Rating rating={user.rating ?? 0} numReviews={user.numReviews} />
        </TouchableOpacity>
      </View>
      <View pointerEvents="box-none" style={{ margin: 10 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => addConversation(user._id, "user")}
        >
          <Text style={styles.buttonText}>Message Me</Text>
        </TouchableOpacity>
      </View>
      <View pointerEvents="box-none" style={{ marginHorizontal: 10 }}>
        {user.rebundle?.status && <RebundlePoster />}
      </View>
      <View
        pointerEvents="none"
        style={[styles.topCont, { backgroundColor: colors.elevation.level2 }]}
      >
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <Ionicons
              name="pricetag"
              size={15}
              color={colors.onBackground}
              style={{ marginRight: 10 }}
            />
            <Text>Sold</Text>
          </View>
          <Text style={{ fontFamily: "chronicle-text-bold" }}>
            {user.sold && user.sold.length}
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <Ionicons
              name="person"
              size={15}
              color={colors.onBackground}
              style={{ marginRight: 10 }}
            />
            <Text>Member Since</Text>
          </View>
          <Text style={{ fontFamily: "chronicle-text-bold" }}>
            {user.createdAt && user.createdAt.substring(0, 10)}
          </Text>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <Ionicons
              name="location"
              size={15}
              color={colors.onBackground}
              style={{ marginRight: 10 }}
            />
            <Text>From</Text>
          </View>
          <Text style={{ fontFamily: "chronicle-text-bold" }}>
            {user.region === "NGN" ? "Nigeria" : "South Africa"}
          </Text>
        </View>

        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <Ionicons
              name="globe"
              size={15}
              color={colors.onBackground}
              style={{ marginRight: 10 }}
            />
            <Text>Language</Text>
          </View>
          <Text style={{ fontFamily: "chronicle-text-bold" }}>English</Text>
        </View>
      </View>
      <View
        pointerEvents="none"
        style={[
          { margin: 10, padding: 10, borderRadius: 5 },
          { backgroundColor: colors.elevation.level2 },
        ]}
      >
        <Text style={{ fontFamily: "chronicle-text-bold", marginBottom: 5 }}>
          About
        </Text>
        <Text>{user.about}</Text>
      </View>
      <View pointerEvents="box-none" style={{ margin: 10, marginBottom: 20 }}>
        <TouchableOpacity
          style={[styles.buttonOutline, { borderColor: colors.secondary }]}
          onPress={() => handlereport(user._id)}
        >
          <Text style={[styles.buttonOutlineText, { color: colors.secondary }]}>
            Report Seller
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MyAccount

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  onlineCont: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "flex-end",
    width: "100%",
  },
  online: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  offline: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  share: {},
  topCont: {
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  image: { width: 150, height: 150, borderRadius: 80 },
  username: {
    fontFamily: "absential-sans-bold",
    marginVertical: 10,
  },
  followCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  button: {
    borderRadius: 5,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontFamily: "chronicle-text-bold", color: "white" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    flex: 1,
  },
  buttonOutline: {
    borderRadius: 5,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOutlineText: { fontFamily: "chronicle-text-bold" },
  tab: { height: Dimensions.get("window").height - 45 },
  followButton: {
    color: "white",
    padding: 5,
    borderRadius: 5,
    alignSelf: "center",
  },
})
