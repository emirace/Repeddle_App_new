import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { returns } from "../../utils/data"
import ReturnComp from "./ReturnComp"
import useReturn from "../../hooks/useReturn"
import { IReturn } from "../../types/order"
import { ReturnFormNavigationProp } from "../../types/navigation/stack"

type Props = {
  navigation: any
}

const PurchaseReturn = ({ navigation }: Props) => {
  const { fetchPurchaseReturns } = useReturn()

  const [query, setQuery] = useState("")
  const [returns, setReturns] = useState<IReturn[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  console.log(loading)

  useEffect(() => {
    const getReturn = async () => {
      setLoading(true)
      const res = await fetchPurchaseReturns()
      if (typeof res !== "string") {
        setReturns(res)
      } else setError(res)

      setLoading(false)
    }

    getReturn()
  }, [])

  return (
    <ReturnComp
      navigation={navigation}
      loading={loading}
      returns={returns}
      error={error}
    />
  )
}

export default PurchaseReturn

const styles = StyleSheet.create({})
