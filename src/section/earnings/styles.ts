import { StyleSheet } from "react-native"
import { useTheme } from "react-native-paper"

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: useTheme().colors.primary,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textTransform: "capitalize",
    color: "white",
  },
  earnCont: {
    marginVertical: 10,
    padding: 20,
    borderRadius: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 5,
  },
  earning: {
    fontSize: 40,
    marginHorizontal: 20,
    textAlign: "right",
    lineHeight: undefined,
  },
  itemCont: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
    borderBottomColor: "grey",
  },
  salesHeader: {
    fontSize: 23,
    fontWeight: "bold",
    marginVertical: 10,
    marginTop: 20,
    lineHeight: undefined,
  },
  image: { width: 30, height: 30, borderRadius: 30, backgroundColor: "grey" },
  view: { borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10 },
  tableHeader: { flexDirection: "row", alignItems: "center", padding: 8 },
  tableHead: { flex: 1, fontWeight: "bold", textTransform: "uppercase" },
})
