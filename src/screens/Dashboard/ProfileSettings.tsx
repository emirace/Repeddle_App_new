import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native"
import React, { PropsWithChildren, useState } from "react"
import {
  ActivityIndicator,
  Appbar,
  Button,
  Switch,
  Text,
  useTheme,
} from "react-native-paper"
import useAuth from "../../hooks/useAuth"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { banks, states } from "../../utils/constants"
import { region, timeDifference } from "../../utils/common"
import moment from "moment"
import { normaliseH } from "../../utils/normalize"
import MyButton from "../../components/MyButton"
import { UpdateUser } from "../../types/user"
import Input from "../../components/Input"
import useNewsletter from "../../hooks/useNewsletter"
import Rebundle from "../../components/Rebundle"
import { ProfileSettingsNavigationProp } from "../../types/navigation/stack"
import useToastNotification from "../../hooks/useToastNotification"
import { baseURL } from "../../services/api"
import { uploadOptimizeImage } from "../../utils/image"

type Props = ProfileSettingsNavigationProp

const ProfileSettings = ({ navigation }: Props) => {
  const { user, loading, updateUser, error: userError } = useAuth()
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()

  const [username, setUsername] = useState("")

  const [image, setImage] = useState("")
  const [removingLetter, setRemovingLetter] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)

  // moment.locale()

  const [input, setInput] = useState({
    email: user?.email,
    password: "",
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.username,
    phone: user?.phone,
    about: user?.about,
    confirmPassword: "",
    role: user?.role,
    dob: new Date().toString(),
    active: user?.active,
    usernameLastUpdate: user?.usernameLastUpdated,
    zipcode: user?.address?.zipcode,
    state: user?.address?.state,
    apartment: user?.address?.apartment,
    street: user?.address?.street,
    address: !!user?.address,
    accountName: user?.accountName,
    bankName: user?.bankName,
    accountNumber: user?.accountNumber,
    newsletter: user?.allowNewsletter,
  })

  const [error, setError] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    about: "",
    confirmPassword: "",
    role: "",
    dob: "",
    active: "",
    usernameLastUpdate: "",
    zipcode: "",
    state: "",
    apartment: "",
    street: "",
    accountName: "",
    bankName: "",
    accountNumber: "",
    newsletter: "",
  })

  const addressValidate = () => {
    Keyboard.dismiss()
    let valid = true
    if (!input.street) {
      handleError("Enter your street", "street")
      valid = false
    }
    // if (!input.apartment) {
    //   handleError('Enter your apartment', 'apartment');
    //   valid = false;
    // }
    if (!input.state) {
      handleError("Select your state", "state")
      valid = false
    }
    if (!input.zipcode) {
      handleError("Enter your zip code", "zipcode")
      valid = false
    }

    if (valid) {
      handleAddressChange()
    }
  }

  const handleAddressChange = async () => {
    setIsLoading(true)
    const res = await updateUser({
      address: {
        state: input.state,
        street: input.street,
        apartment: input.apartment,
        zipcode: input.zipcode,
      },
    })
    if (res) {
      addNotification({
        message: "Address Updated Successfully",
        error: false,
      })
      // setShowAddress(false)
    } else {
      addNotification({
        message: userError || "Failed to verify address",
        error: true,
      })
    }

    setIsLoading(false)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [newsletterStatus, setNewsletterStatus] = useState(input.newsletter)
  const [show, setShow] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [bundle, setBundle] = useState(false)
  const [rebundleStatus, setRebundleStatus] = useState(false)

  const handleOnChange = (
    text: string | undefined,
    inputVal: keyof typeof input
  ) => {
    setInput((prevState) => ({ ...prevState, [inputVal]: text }))
  }
  const handleError = (errorMessage: string, errVal: keyof typeof error) => {
    setError((prevState) => ({ ...prevState, [errVal]: errorMessage }))
  }

  const pickImage = async () => {
    try {
      setLoadingUpload(true)

      const res = await uploadOptimizeImage()
      setImage(res as string)
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      })
    } finally {
      setLoadingUpload(false)
    }
  }

  const daydiff = input.usernameLastUpdate
    ? 30 - timeDifference(new Date(input.usernameLastUpdate), new Date())
    : 0

  const validate = () => {
    Keyboard.dismiss()
    let valid = true
    if (!input.firstName) {
      handleError("Please enter your first Name", "firstName")
      valid = false
    }
    if (!input.lastName) {
      handleError("Please enter your last Name", "lastName")
      valid = false
    }

    if (input.confirmPassword) {
      if (input.password !== input.confirmPassword) {
        handleError("Passwords do not match", "confirmPassword")
        valid = false
      }
    }
    if (!input.email) {
      handleError("Please enter an email", "email")
      valid = false
    } else if (
      !input.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      valid = false
      handleError("Please input a valid email", "email")
    }
    if (input.password) {
      if (input.password.length < 6) {
        valid = false
        handleError("Your password must be at least 6 characters", "password")
      } else if (input.password.search(/[a-z]/i) < 0) {
        handleError(
          "Password must contain at least 1 lowercase alphabetical character",
          "password"
        )
        valid = false
      } else if (input.password.search(/[A-Z]/) < 0) {
        handleError(
          "Password must contain at least 1 uppercase alphabetical character",
          "password"
        )
        valid = false
      } else if (input.password.search(/[0-9]/) < 0) {
        handleError("Password must contain at least 1 digit", "password")
        valid = false
      }
    }

    if (valid) {
      if (username.length > 0) {
        Alert.alert(
          "Change Username",
          "Are you sure you want to edit your username? The next edit window  will be after 30 days",
          [
            {
              text: "Cancel",
              onPress: () => {
                return
              },
              style: "cancel",
            },
            { text: "OK", onPress: () => submitHandler() },
          ],
          { cancelable: false }
        )
      } else {
        submitHandler()
      }
    }
  }

  const accountValidate = () => {
    let valid = true
    if (!input.accountNumber) {
      handleError("Enter a valid account number", "accountNumber")
      valid = false
    }
    if (!input.accountName) {
      handleError("Enter a valid account name", "accountName")
      valid = false
    }
    if (!input.bankName) {
      handleError("Select a valid bank", "bankName")
      valid = false
    }

    if (valid) {
      handleAccount()
    }
  }

  const handleAccount = async () => {
    setIsLoading(true)
    const res = await updateUser({
      accountName: input.accountName,
      accountNumber: input.accountNumber,
      bankName: input.bankName,
    })
    if (res) {
      addNotification({
        message: "Account Updated Successfully",
        error: false,
      })
      // setShowAccount(false)
    } else {
      addNotification({
        message: userError || "Failed to verify account",
        error: true,
      })
    }
    setIsLoading(false)
  }

  const submitHandler = async () => {
    setIsLoading(true)

    const data: UpdateUser = {
      firstName: input.firstName!,
      lastName: input.lastName!,
      dob: input.dob,
      phone: input.phone ?? "",
      about: input.about ?? "",
      address: {
        apartment: input.apartment ?? "",
        state: input.state ?? "",
        street: input.state ?? "",
        zipcode: input.zipcode ?? 0,
      },
    }

    if (image) data.image = image
    try {
      const res = await updateUser(data)

      if (res) {
        addNotification({ message: "Updated sucessfully" })
      }
    } catch (error: any) {
      addNotification({ message: error, error: true })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewsletter = async (val: boolean) => {
    setRemovingLetter(true)
    const resp = await updateUser({ allowNewsletter: val })
    if (resp) {
      setNewsletterStatus(val)
      setInput({ ...input, newsletter: val })
      addNotification({
        message: val
          ? "Subscribed to newsletter"
          : "Unsubscribed from newsletter",
      })
    } else {
      addNotification({
        message: val
          ? "Failed to subscribe to newsletter"
          : "Failed to unsubscribe from newsletter",
        error: true,
      })
    }
  }

  return (
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
        <Appbar.Content title="Profile" titleStyle={{ color: "white" }} />
        <Appbar.Action icon="magnify" iconColor="white" />
      </Appbar.Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={styles.content}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={[
              styles.image,
              { backgroundColor: colors.primary, borderRadius: 40 },
            ]}
          >
            <Image
              source={{ uri: image ? baseURL + image : baseURL + user?.image }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            {loadingUpload ? (
              <ActivityIndicator />
            ) : (
              <Ionicons
                onPress={pickImage}
                disabled={loadingUpload}
                style={styles.edit}
                name="camera-outline"
                size={18}
                color={colors.background}
              />
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text1 style={{ color: colors.primary }}>{user?.role}</Text1>
          <View style={styles.container1}>
            <FontAwesome5
              name="bolt"
              style={[styles.icon, { color: colors.primary }]}
            />
            <Text style={input.active ? styles.activeText : styles.bannedText}>
              {input.active ? "Active" : "Banned"}
            </Text>
          </View>
        </View>
        <View style={styles.form}>
          <Text1 style={styles.label}>Username</Text1>
          {daydiff > 0 && (
            <Text style={{ fontSize: 12, color: colors.secondary }}>
              updated {moment(input.usernameLastUpdate).fromNow()}, next update
              in
              {daydiff} days
            </Text>
          )}
          <Input
            value={input.username}
            icon="pencil"
            onChangeText={(text) => {
              handleOnChange(text, "username")
              setUsername(text)
            }}
            style={{ color: colors.onBackground, width: "100%" }}
            placeholder="Username"
            error={error.username}
            editable={daydiff < 0}
            onFocus={() => {
              handleError("", "username")
            }}
          />
          <Text1 style={styles.label}>First Name</Text1>
          <Input
            value={input.firstName}
            icon="person-outline"
            onChangeText={(text) => handleOnChange(text, "firstName")}
            placeholder="First Name"
            error={error.firstName}
            style={{ color: colors.onBackground, width: "100%" }}
            onFocus={() => {
              handleError("", "firstName")
            }}
          />
          <Text1 style={styles.label}>Last Name</Text1>
          <Input
            value={input.lastName}
            icon="person-outline"
            onChangeText={(text) => handleOnChange(text, "lastName")}
            placeholder="Last Name"
            error={error.lastName}
            style={{ color: colors.onBackground, width: "100%" }}
            onFocus={() => {
              handleError("", "lastName")
            }}
          />
          <Text1 style={styles.label}>Email</Text1>
          <Input
            value={input.email}
            icon="mail-outline"
            onChangeText={(text) => handleOnChange(text, "email")}
            placeholder="Email"
            style={{ color: colors.onBackground, width: "100%" }}
            error={error.email}
            onFocus={() => {
              handleError("", "email")
            }}
          />
          <Text1 style={styles.label}>Phone</Text1>
          <Input
            value={input.phone}
            icon="call-outline"
            onChangeText={(text) => handleOnChange(text, "phone")}
            placeholder="Phone"
            error={error.phone}
            style={{ color: colors.onBackground, width: "100%" }}
            keyboardType="numeric"
            onFocus={() => {
              handleError("", "phone")
            }}
          />
          <Text1 style={styles.label}>Date of birth</Text1>
          <TouchableOpacity
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.elevation.level2,
              justifyContent: "space-between",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => setShow(true)}
          >
            <Text1>{moment(input.dob).format("Do MMM YYYY")}</Text1>
            <Ionicons
              name="calendar-sharp"
              size={24}
              color={colors.primary}
              style={{
                marginLeft: 20,
              }}
            />
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(input.dob) || new Date()}
              mode={"date"}
              is24Hour={true}
              onChange={(event, selectedDate) => {
                setShow(false)
                return handleOnChange(selectedDate?.toString(), "dob")
              }}
            />
          )}
          <Text1 style={styles.label}>Password</Text1>
          <Input
            icon="lock-closed-outline"
            onChangeText={(text) => handleOnChange(text, "password")}
            placeholder="Password"
            password
            error={error.password}
            style={{ color: colors.onBackground, width: "100%" }}
            onFocus={() => {
              handleError("", "password")
            }}
          />
          <Text1 style={styles.label}>Confirm Password</Text1>
          <Input
            icon="lock-closed-outline"
            onChangeText={(text) => handleOnChange(text, "confirmPassword")}
            placeholder="Confirm Password"
            password
            style={{ color: colors.onBackground, width: "100%" }}
            error={error.confirmPassword}
            onFocus={() => {
              handleError("", "confirmPassword")
            }}
          />
          <Text1 style={styles.label}>About</Text1>
          <TextInput
            style={[
              styles.textarea,
              {
                backgroundColor: colors.elevation.level2,
                color: colors.onBackground,
                padding: 10,
                width: "100%",
              },
            ]}
            multiline={true}
            placeholder="About"
            placeholderTextColor={colors.onBackground}
            numberOfLines={10}
            textAlignVertical="top"
            onChangeText={(text) => handleOnChange(text, "about")}
            value={input.about}
          />
          <Text1 style={styles.label}>Address</Text1>
          {input?.street && (
            <View style={styles.infoContainer}>
              <View style={styles.info}>
                <Text style={styles.key}>Street:</Text>
                <Text style={styles.value}>{input.street}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.key}>Apartment:</Text>
                <Text style={styles.value}>{input.apartment}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.key}>State:</Text>
                <Text style={styles.value}>{input.state}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.key}>Zipcode:</Text>
                <Text style={styles.value}>{input.zipcode}</Text>
              </View>
            </View>
          )}
          <Text1 style={styles.label}>Account</Text1>
          {input.accountNumber && (
            <View style={styles.infoContainer}>
              <View style={styles.info}>
                <Text style={styles.key}>Account Name:</Text>
                <Text style={styles.value}>{input.accountName}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.key}>Account Number:</Text>
                <Text style={styles.value}>{input.accountNumber}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.key}>Bank Name:</Text>
                <Text style={styles.value}>{input.bankName}</Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowAddress(true)}
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 5,
              padding: 5,
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <Text1 style={[styles.label, { color: "white" }]}>
              Add Address
            </Text1>
          </TouchableOpacity>
          {(user?.role === "Admin" ||
            (!input.accountNumber && user?.role !== "Admin")) && (
            <TouchableOpacity
              onPress={() => setShowAccount(true)}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 5,
                padding: 5,
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <Text1 style={[styles.label, { color: "white" }]}>
                Add Bank Account
              </Text1>
            </TouchableOpacity>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAddress}
            onRequestClose={() => {
              setShowAddress(!showAddress)
            }}
          >
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  { backgroundColor: colors.background },
                ]}
              >
                <View style={styles.heading}>
                  <Text style={[styles.modalTitle]}>Add Address</Text>
                  <TouchableOpacity
                    onPress={() => setShowAddress(!showAddress)}
                  >
                    <Ionicons
                      name="close"
                      size={28}
                      color={colors.onBackground}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 10 }}>
                  The provided address may be use for return should there be a
                  need. This address is not displayed to buyers
                </Text>
                <View style={{ paddingVertical: 20 }}>
                  <Text1 style={styles.label}>Street</Text1>
                  <Input
                    value={input.street}
                    icon="pencil-outline"
                    style={{ color: colors.onBackground, width: "100%" }}
                    onChangeText={(text) => handleOnChange(text, "street")}
                    placeholder={input.street}
                    error={error.street}
                    onFocus={() => {
                      handleError("", "street")
                    }}
                  />
                  <Text1 style={styles.label}>Apartment/Complex</Text1>
                  <Input
                    value={input.apartment}
                    style={{ color: colors.onBackground, width: "100%" }}
                    icon="pencil-outline"
                    onChangeText={(text) => handleOnChange(text, "apartment")}
                    placeholder={input.apartment}
                    error={error.apartment}
                    onFocus={() => {
                      handleError("", "apartment")
                    }}
                  />
                  <Text1 style={styles.label}>Province</Text1>
                  <Picker
                    selectedValue={input.state}
                    style={{
                      backgroundColor: colors.elevation.level2,
                      padding: 5,
                      color: colors.onBackground,
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      handleOnChange(itemValue, "state")
                      handleError("", "state")
                    }}
                  >
                    <Picker.Item
                      style={{
                        backgroundColor: colors.elevation.level2,
                        color: colors.onBackground,
                      }}
                      label={"--select province--"}
                      value={""}
                    />
                    {region() === "NG"
                      ? states.Nigeria.map((name, index) => (
                          <Picker.Item
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            key={index}
                            label={name}
                            value={name}
                          />
                        ))
                      : states.SouthAfrican.map((name, index) => (
                          <Picker.Item
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            key={index}
                            label={name}
                            value={name}
                          />
                        ))}
                  </Picker>
                  <Text1 style={styles.label}>Zip Code</Text1>
                  <Input
                    value={input.zipcode?.toString()}
                    icon="pencil-outline"
                    style={{ color: colors.onBackground, width: "100%" }}
                    onChangeText={(text) => handleOnChange(text, "zipcode")}
                    placeholder={`${input.zipcode || ""}`}
                    error={error.zipcode}
                    onFocus={() => {
                      handleError("", "zipcode")
                    }}
                  />

                  <Button
                    onPress={addressValidate}
                    children="Submit"
                    loading={isLoading}
                    mode="contained"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showAccount}
            onRequestClose={() => {
              setShowAccount(!showAccount)
            }}
          >
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  { backgroundColor: colors.background },
                ]}
              >
                <View style={styles.heading}>
                  <Text style={[styles.modalTitle]}>Add Bank Account</Text>
                  <TouchableOpacity
                    onPress={() => setShowAccount(!showAccount)}
                  >
                    <Ionicons
                      name="close"
                      size={18}
                      color={colors.onBackground}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 10 }}>
                  To become a Seller, kindly provide your banking details where
                  you can transfer your earnings deposited in your Repeddle
                  wallet
                </Text>
                <View style={{ paddingVertical: 20 }}>
                  <Text1 style={styles.label}>Account Name</Text1>
                  <Input
                    value={input.accountName}
                    style={{ color: colors.onBackground, width: "100%" }}
                    icon="pencil-outline"
                    onChangeText={(text) => handleOnChange(text, "accountName")}
                    placeholder={input.accountName}
                    error={error.accountName}
                    onFocus={() => {
                      handleError("", "accountName")
                    }}
                  />
                  <Text1 style={styles.label}>Account Number</Text1>
                  <Input
                    value={input.accountNumber?.toString()}
                    icon="pencil-outline"
                    style={{ color: colors.onBackground, width: "100%" }}
                    onChangeText={(text) =>
                      handleOnChange(text, "accountNumber")
                    }
                    error={error.accountNumber}
                    onFocus={() => {
                      handleError("", "accountNumber")
                    }}
                  />
                  <Text1 style={styles.label}>Bank Name</Text1>
                  <Picker
                    selectedValue={input.bankName}
                    style={{
                      backgroundColor: colors.elevation.level2,
                      padding: 5,
                      color: colors.onBackground,
                    }}
                    onValueChange={(itemValue, itemIndex) => {
                      handleOnChange(itemValue, "bankName")
                      handleError("", "bankName")
                    }}
                  >
                    <Picker.Item
                      style={{
                        backgroundColor: colors.elevation.level2,
                        color: colors.onBackground,
                      }}
                      label={"--select bank--"}
                      value={""}
                    />
                    {region() === "NG"
                      ? banks.Nigeria.map((name, index) => (
                          <Picker.Item
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            key={index}
                            label={name.name}
                            value={name.name}
                          />
                        ))
                      : banks.SouthAfrica.map((name, index) => (
                          <Picker.Item
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            key={index}
                            label={name.name}
                            value={name.name}
                          />
                        ))}
                  </Picker>

                  <Text style={{ color: colors.error, marginVertical: 5 }}>
                    Note: This cannot be change once saved, contact support to
                    make any changes.
                  </Text>
                  <Button
                    onPress={accountValidate}
                    children="Submit"
                    loading={isLoading}
                    mode="contained"
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 5,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={[styles.row, { marginBottom: 10 }]}>
              <Text style={[]}>Subscribe to newsletter</Text>
            </View>
            {removingLetter ? (
              <ActivityIndicator size="small" />
            ) : (
              <Switch
                trackColor={{ false: "#767577", true: "#dedede" }}
                thumbColor={newsletterStatus ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleNewsletter}
                value={newsletterStatus}
                disabled={removingLetter}
              />
            )}
          </View>
          {!isLoading && (
            <Rebundle
              rebundleStatus={rebundleStatus}
              setRebundleStatus={setRebundleStatus}
              bundle={bundle}
              setBundle={setBundle}
            />
          )}
        </View>
      </ScrollView>
      <View style={{ margin: 15 }}>
        <Button
          onPress={validate}
          children="Update"
          loading={isLoading}
          disabled={isLoading}
          mode="contained"
          style={{
            backgroundColor: colors.primary,
            borderRadius: 5,
          }}
          icon={"pencil"}
        />
      </View>
    </View>
  )
}

const Text1 = ({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) => {
  return <Text style={[styles.label, style]}>{children}</Text>
}

export default ProfileSettings

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
  content: {
    flex: 1,
    paddingTop: normaliseH(30),
    width: "100%",
    paddingHorizontal: 20,
  },
  image: { width: 80 },
  edit: {
    position: "absolute",
    bottom: 0,
    right: -10,
    borderRadius: 50,
    padding: 5,
  },
  form: { marginTop: normaliseH(30), paddingBottom: 40 },
  label: { marginBottom: 5, fontSize: 15 },
  textarea: {
    borderRadius: 5,
    marginVertical: normaliseH(10),
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    paddingVertical: normaliseH(20),
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalTitle: { fontFamily: "absential-sans-bold", fontSize: 20 },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: "60%",
    alignItems: "center",
  },
  // close: {
  //   position: "absolute",
  //   top: 20,
  //   right: 20,
  // },
  container1: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  activeText: {
    color: "orange", // Update with your desired color for active state
  },
  bannedText: {
    color: "purple", // Update with your desired color for banned state
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 5,
  },
  key: { flex: 1 },
  value: { flex: 2, marginLeft: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
})
