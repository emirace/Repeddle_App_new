import {
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native"
import React, { PropsWithChildren } from "react"
import { IconButton, Text, useTheme } from "react-native-paper"
import { normaliseH } from "../utils/normalize"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  setShowDeliveryHistory?: (val: boolean) => void
  status: number
}

const DeliveryHistory = ({ setShowDeliveryHistory, status }: Props) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {setShowDeliveryHistory && (
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => setShowDeliveryHistory(false)}>
            <IconButton icon="chevron-back" />
          </TouchableOpacity>
          <Text style={styles.title}>Delivery Status </Text>
          <View style={{ width: 40 }} />
        </View>
      )}
      <View style={styles.content}>
        {status < 6 ? (
          <>
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 1 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Not yet Dispatched</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 1 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 2 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 2 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Dispatch</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 2 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 3 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 3 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>In Transit</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 3 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 4 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 4 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Delivered</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 4 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 5 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 5 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Received</Text1>
            </View>
          </>
        ) : status < 12 ? (
          <>
            {/* <View
              style={[
                styles.line,
                { backgroundColor: status >= 6 ? "green" : "grey" },
              ]}
            /> */}
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 6 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Return Logged</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 6 ? "green" : "grey" },
              ]}
            />
            {status > 7 ? (
              <>
                <View
                  style={[
                    styles.line,
                    { backgroundColor: status >= 8 ? "green" : "grey" },
                  ]}
                />
                <View style={styles.boxCont}>
                  <View
                    style={[
                      styles.box,
                      { backgroundColor: status >= 8 ? "green" : "grey" },
                    ]}
                  >
                    <Ionicons name="checkmark-sharp" size={13} color="white" />
                  </View>
                  <Text1>Return Approved</Text1>
                </View>
                <View
                  style={[
                    styles.line,
                    { backgroundColor: status >= 8 ? "green" : "grey" },
                  ]}
                />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.line,
                    { backgroundColor: status >= 7 ? "green" : "grey" },
                  ]}
                />
                <View style={styles.boxCont}>
                  <View
                    style={[
                      styles.box,
                      { backgroundColor: status >= 7 ? colors.error : "grey" },
                    ]}
                  >
                    <Ionicons name="checkmark-sharp" size={13} color="white" />
                  </View>
                  <Text1>Return Declined</Text1>
                </View>

                <View style={[styles.line]} />
              </>
            )}
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 9 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 9 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Return Dispatched</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 9 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 10 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 10 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Return Delivered</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 10 ? "green" : "grey" },
              ]}
            />
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 11 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 11 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Return Received</Text1>
            </View>
          </>
        ) : status > 12 ? (
          <>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 13 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 13 ? "green" : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Pay Seller</Text1>
            </View>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 13 ? "green" : "grey" },
              ]}
            />
          </>
        ) : (
          <>
            <View
              style={[
                styles.line,
                { backgroundColor: status >= 12 ? "green" : "grey" },
              ]}
            />
            <View style={styles.boxCont}>
              <View
                style={[
                  styles.box,
                  { backgroundColor: status >= 12 ? colors.error : "grey" },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={13} color="white" />
              </View>
              <Text1>Refund Buyer</Text1>
            </View>

            <View style={[styles.line]} />
          </>
        )}
      </View>
    </View>
  )
}

type TextaProps = PropsWithChildren<{
  style?: StyleProp<TextStyle>
}> &
  TextProps

const Text1 = ({ style, children, ...props }: TextaProps) => {
  return (
    <Text style={[style]} {...props}>
      {children}
    </Text>
  )
}

export default DeliveryHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: normaliseH(10),
  },
  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  content: {
    padding: 10,
  },
  boxCont: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  box: {
    width: 20,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginHorizontal: 20,
  },
  text: {
    position: "absolute",
    left: "50%",
    top: 35,
    // transform: translateX(-50%),
    textAlign: "center",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 1,
  },
  line: {
    width: 3,
    height: 15,
    backgroundColor: "grey",
    marginHorizontal: 30,
  },
})
