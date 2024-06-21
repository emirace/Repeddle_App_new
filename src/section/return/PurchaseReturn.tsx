import { StyleSheet, View } from "react-native"
import React from "react"
import { returns } from "../../utils/data"
import ReturnComp from "./ReturnComp"

type Props = {}

const PurchaseReturn = (props: Props) => {
  const loading = false
  const error = ""
  const returnData = returns

  return <ReturnComp loading={loading} returns={returnData} error={error} />
}

export default PurchaseReturn

const styles = StyleSheet.create({})
