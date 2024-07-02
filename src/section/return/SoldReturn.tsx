import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import ReturnComp from "./ReturnComp"
import useReturn from "../../hooks/useReturn"
import { IReturn } from "../../types/order"
import { ReturnFormNavigationProp } from "../../types/navigation/stack"

type Props = {
  navigation: any
}

const SoldReturn = ({ navigation }: Props) => {
  const { fetchSoldReturns, loading } = useReturn()

  const [query, setQuery] = useState("")
  const [returns, setReturns] = useState<IReturn[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const getReturn = async () => {
      const res = await fetchSoldReturns()
      if (typeof res !== "string") {
        setReturns(res)
      } else setError(res)
    }

    getReturn()
  }, [])

  return (
    <ReturnComp
      loading={loading}
      navigation={navigation}
      returns={returns}
      error={error}
    />
  )
}

export default SoldReturn

const styles = StyleSheet.create({})
