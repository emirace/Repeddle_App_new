import { StyleSheet } from "react-native"

export const orderDetailsStyle = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
    color: "white",
  },
  sumaryContDetails: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sumaryCont: {
    // paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 3,
    paddingBottom: 10,
    marginTop: 10,
  },
  heading: {
    paddingVertical: 10,
    fontFamily: "absential-sans-bold",
    textTransform: "uppercase",
    // width: '100%',
    marginTop: 15,
  },
  itemNum: {
    flexDirection: "row",
  },
  orderItem: {
    flexDirection: "row",
    // flex: 8,
    marginBottom: 10,
  },
  image: {
    resizeMode: "cover",
    width: 80,
    height: 100,
  },
  details1: {
    paddingHorizontal: 20,
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    textTransform: "capitalize",
    fontWeight: "600",
    marginBottom: 5,
  },
  quantity: {
    marginBottom: 10,
  },
  itemPrice: {
    fontFamily: "absential-sans-bold",
  },
  actionButton: {
    // flex: 2,
    alignItems: "center",
  },
  detailButton: {
    flexDirection: "column",
    justifyContent: "center",
  },
  paymentDlivery: {
    flexDirection: "row",
    marginBottom: 15,
  },
  paymentDliveryItem: {
    flex: 1,
    height: "100%",
  },
  received: {
    color: "white",
    paddingVertical: 3,
    paddingHorizontal: 7,
    height: 30,
    borderRadius: 3,
    marginRight: 30,
  },
  afterAction: {
    flexDirection: "row",
    justifyContent: "center",
  },
  afterActionCont: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
  },
  userCont: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  username: {
    marginHorizontal: 20,
    fontFamily: "absential-sans-bold",
  },
  paymentRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  commision: {
    width: "100%",
    marginTop: 20,
  },
  key: {
    flex: 1,
  },
  value: {
    flex: 1,
  },
  trackingCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  cont123: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  deliveryKey: {
    flex: 1,
    textTransform: "capitalize",
    fontSize: 13,
  },
  deliveryValue: {
    flex: 2,
    textTransform: "capitalize",
    fontSize: 13,
  },
  subSumaryContDetails: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "grey",
    borderRadius: 5,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  link: { color: "white", fontFamily: "chronicle-text-bold" },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#00000030",
    marginVertical: 10,
  },
  printButton: {
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 5,
  },
  printText: { color: "white" },
})
