import { Platform, StyleSheet } from "react-native"
import { normaliseH, normaliseW } from "../../utils/normalize"
import { lightTheme } from "../../constant/theme"

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: { width: 150, height: 50, borderRadius: 50, resizeMode: "contain" },
  slogan: { fontSize: 15, fontWeight: "400" },
  CompanyName: {
    fontSize: normaliseW(40),
    marginVertical: normaliseH(5),
    fontWeight: "700",
  },
  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    height: 300,
    borderRadius: 15,
  },
  itemText: {
    color: "white",
    fontSize: 30,
  },
  invisible: { backgroundColor: "transparent" },
  header: {
    position: "absolute",
    width: "100%",
    backgroundColor: lightTheme.colors.primary,
    height: 120,
    zIndex: 10,
  },
  paddingForHeader: {
    height: 50,
  },
  placeHolderForHeader: { height: 50 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 10,
  },
  bottomHeader: {
    height: 50,
    paddingHorizontal: 10,
  },
  scrollContent: {
    backgroundColor: "white",
    paddingVertical: 10,
  },
  title: { fontWeight: "bold", fontSize: 24, textTransform: "capitalize" },
  search: {
    marginVertical: normaliseH(10),
    marginBottom: 10,
    marginHorizontal: 5,
    height: 40,
  },
  catTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  category: {
    fontSize: 30,
    fontWeight: "600",
    textTransform: "capitalize",
    lineHeight: 30,
    fontFamily: "absential-sans-medium",
  },
  seeAll: {
    fontSize: 18,
    color: "#eb9f40",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  catStyles: {
    backgroundColor: "white",
    width: 250,
    height: 250,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  carText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
  },
  categoryScroll: { marginBottom: 10 },
  brandScroll: { padding: 10, paddingVertical: 20 },
  item: { flex: 1 },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  titleCont: {
    position: "absolute",
    bottom: 12,
  },
  title1: {
    fontSize: 20,
    color: "white",
    paddingLeft: 15,
    paddingVertical: 5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: "absential-sans-bold",
  },

  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  classic: { margin: 15 },
  classicImage: {
    width: "100%",
    height: 250,
    borderRadius: 5,
  },
  classicTextCont: {
    position: "absolute",
    top: "45%",
    left: 20,
    width: 120,
  },
  classicText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
  },
  classicButton: {
    alignItems: "flex-start",
  },
  classicButtonText: {
    color: "white",
    textTransform: "uppercase",
    borderBottomWidth: 2,
    fontWeight: "bold",
  },
  sellerCont: { width: 100, height: 100, borderRadius: 10, margin: 5 },
  sellerName: {
    color: "white",
    fontWeight: "bold",
    textTransform: "capitalize",
    bottom: 5,
    left: 10,
    position: "absolute",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 15,
  },
  vipBadge: {
    width: 20,
    height: 20,
    right: 0,
    top: 10,
    position: "absolute",
  },
  brandImage: { width: 60, height: 50, marginHorizontal: 10 },
  dash: {
    height: 2,
    width: 70,
    backgroundColor: lightTheme.colors.tertiary,
    marginBottom: 5,
    marginTop: 3,
    marginLeft: 10,
  },
  info: {
    paddingHorizontal: 10,
    textAlign: "justify",
    fontFamily: "chronicle-text",
    lineHeight: 18,
  },
})

export default homeStyles
