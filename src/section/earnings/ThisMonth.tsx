import { FlatList, View } from "react-native"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import RenderItem from "./RenderItem"
import TopView from "./TopView"
import Loader from "../../components/ui/Loader"
import moment from "moment"
import { IOrder, IOrderSummary } from "../../types/order"
import useToastNotification from "../../hooks/useToastNotification"
import useOrder from "../../hooks/useOrder"

const ThisMonth = () => {
  const now = useMemo(() => new Date(), [])
  const from = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
    [now]
  )
  const to = useMemo(() => moment().startOf("day").toDate(), [])

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
        getOrdersSummary({
          endDate: to.toString(),
          startDate: from.toString(),
        }),

        fetchSoldOrders({
          endDate: to.toString(),
          startDate: from.toString(),
        }),
      ])

      handleSummary(summary)
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
        ListHeaderComponent={<TopView orderData={[]} totalSales={0} />}
      />
    </View>
  )
}

export default ThisMonth
