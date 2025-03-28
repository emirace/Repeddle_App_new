import { Dimensions } from "react-native";
import React from "react";
import { currency, region } from "../utils/common";
import { useTheme } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

type Data = { name: string; order: number; earning: number; totalSale: number };

type Props = {
  data: Data[];
};

const Chart = ({ data }: Props) => {
  const { colors } = useTheme();

  function getList(data: Data[], property: string) {
    if (!data || !Array.isArray(data) || data.length < 1) {
      return [{ name: "Today", earning: 0, totalSale: 0, order: 0 }].map(
        (obj) => obj[property]
      );
    }
    return data.map((obj) => obj[property]);
  }

  return (
    <LineChart
      data={{
        labels: getList(data, "name"),
        datasets: [
          {
            data: getList(data, "earning"),
          },
        ],
      }}
      width={Dimensions.get("window").width - 20} // from react-native
      height={220}
      yAxisLabel={currency(region())}
      // yAxisSuffix="k"
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: colors.secondary,
        // backgroundGradientFrom: colors.secondary,
        // backgroundGradientTo: colors.secondary,
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => colors.secondary,
        // propsForBackgroundLines: {'DD':"black"},
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

        propsForDots: {
          r: "5",
          strokeWidth: "2",
          stroke: colors.primary,
          fill: colors.primary,
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 5,
      }}
    />
  );
};

export default Chart;
