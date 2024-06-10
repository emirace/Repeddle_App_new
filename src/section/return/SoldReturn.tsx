import { StyleSheet, View } from "react-native"
import React from "react"
import ReturnComp from "./ReturnComp"
import { returns } from "../../utils/data"

type Props = {}

const SoldReturn = (props: Props) => {
  const loading = false
  const error = ""
  const returnData = returns

  return <ReturnComp loading={loading} returns={returnData} error={error} />
}

export default SoldReturn

const styles = StyleSheet.create({})
