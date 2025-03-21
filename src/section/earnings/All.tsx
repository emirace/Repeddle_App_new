import { FlatList, View } from "react-native"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import TopView from "./TopView"
import RenderItem from "./RenderItem"
import Loader from "../../components/ui/Loader"
import moment from "moment"
import { IOrder, IOrderSummary } from "../../types/order"
import useToastNotification from "../../hooks/useToastNotification"
import useOrder from "../../hooks/useOrder"

type Props = {}

const All = (props: Props) => {
  const today = useMemo(() => moment().startOf("day"), [])
  const from = useMemo(() => today.toDate(), [today])
  const to = useMemo(() => moment(today).endOf("day").toDate(), [today])

  const { getOrdersSummary, fetchSoldOrders } = useOrder()
  const { addNotification } = useToastNotification()

  const [loading, setLoading] = useState(true)
  const [totalSales, setTotalSales] = useState(0)
  const [order, setOrder] = useState<IOrder[]>([])
  const [orderData, setOrderData] = useState<
    { name: string; order: number; earning: number; totalSale: number }[]
  >([])

  const handleSummary = useCallback((res: string | IOrderSummary) => {
    if (typeof res !== "string") {
      let totalSale = 0
      const orderData1 = res.dailySoldOrders.map((x) => {
        totalSale = totalSale + Number(x.sales)
        console.log(totalSale)
        return {
          name: moment(`${x._id}`).format("D MMM"),
          order: x.orders,
          earning: x.sales,
          totalSale,
        }
      })
      setTotalSales(totalSale)
      setOrderData(orderData1)
    } else {
      addNotification({ error: true, message: res || "Failed to fetch data" })
    }
  }, [])

  useEffect(() => {
    const fetchAl = async () => {
      setLoading(true)

      const [summary, orders] = await Promise.all([
        getOrdersSummary({}),

        fetchSoldOrders(),
      ])

      handleSummary(summary)
      console.log(summary)
      if (orders?.length) {
        setOrder(orders)
      }

      setLoading(false)
    }

    fetchAl()
  }, [from, to])

  if (loading) {
    return <Loader />
  }

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <FlatList
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        data={order}
        ListHeaderComponent={() => <TopView orderData={[]} totalSales={0} />}
      />
    </View>
  )
}

export default All
