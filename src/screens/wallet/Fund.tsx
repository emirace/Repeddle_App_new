import { View, StyleSheet } from "react-native"
import { Appbar, useTheme } from "react-native-paper"
import { FundNavigationProp } from "../../types/navigation/stack"
import FundComp from "./FundComp"

const Fund: React.FC<FundNavigationProp> = ({ navigation }) => {
  const { colors } = useTheme()

  const onSuccess = () => {
    navigation.navigate("Profile")
  }

  return (
    <View style={styles.container}>
      <Appbar.Header mode="small" style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Fund Wallet" />
        <Appbar.Action
          icon="minus"
          iconColor="white"
          onPress={() => {
            navigation.navigate("Withdraw")
          }}
        />
        <Appbar.Action
          iconColor="white"
          icon="history"
          onPress={() => {
            navigation.navigate("Transaction")
          }}
        />
      </Appbar.Header>
      <FundComp onSuccess={onSuccess} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  context: { padding: 20, paddingVertical: 25, flex: 1 },
  input: {
    marginBottom: 20,
    width: "100%",
  },
  fundButton: {},
})

export default Fund
