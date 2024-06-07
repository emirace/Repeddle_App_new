import { Text } from "react-native-paper"

export function displayDeliveryStatus(status: string) {
  if (status === "Delivered") {
    return (
      <Text
        style={{
          backgroundColor: "#7de317",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }
  if (status === "reject") {
    return (
      <Text
        style={{
          backgroundColor: "rgb(255, 221, 186)",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }

  if (status === "Processing") {
    return (
      <Text
        style={{
          backgroundColor: "blue",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }

  if (status === "Dispatched") {
    return (
      <Text
        style={{
          backgroundColor: "#FFC000",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }

  if (status === "Dispatched") {
    return (
      <Text
        style={{
          backgroundColor: "#FFC000",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }
  if (status === "In Transit") {
    return (
      <Text
        style={{
          backgroundColor: "#FFC000",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }
  if (status === "Processing") {
    return (
      <Text
        style={{
          backgroundColor: "FFBF00",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }

  if (status === "Hold") {
    return (
      <Text
        style={{
          backgroundColor: "rgb(255, 221, 186)",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "black",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  } else {
    return (
      <Text
        style={{
          backgroundColor: "grey",
          textTransform: "uppercase",
          borderRadius: 3,
          color: "white",
          textAlign: "center",
          paddingHorizontal: 10,
          paddingVertical: 2,
        }}
      >
        {status}
      </Text>
    )
  }
}
