import { StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { returns } from "../../utils/data"
import ReturnComp from "./ReturnComp"
import useReturn from "../../hooks/useReturn"
import { IReturn } from "../../types/order"

type Props = {}

const PurchaseReturn = (props: Props) => {
  const { fetchPurchaseReturns, loading } = useReturn()

  const [query, setQuery] = useState("")
  const [returns, setReturns] = useState<IReturn[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const getReturn = async () => {
      const res = await fetchPurchaseReturns()
      if (typeof res !== "string") {
        setReturns(res)
      } else setError(res)
    }

    getReturn()
  }, [])

  return <ReturnComp loading={loading} returns={returns} error={error} />
}

export default PurchaseReturn

const styles = StyleSheet.create({})
