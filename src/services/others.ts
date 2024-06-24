import { DeliveryMeta, Stations } from "./../types/product"
import axios from "axios"
import api from "./api"
import { CartItem } from "../contexts/CartContext"

export const loginGig = async () => {
  const { data } = await api.post(
    "https://thirdparty.gigl-go.com/api/thirdparty/login",
    {
      username: "IND1109425",
      Password: "RBUVBi9EZs_7t_q@6019",
      SessionObj: "",
    }
  )
  return {
    token: data.Object.access_token,
    username: data.Object.UserName,
    userId: data.Object.UserId,
  }
}

export const fetchStations = async () => {
  try {
    const token = await loginGig()

    const { data }: { data: { Object: Stations[] } } = await axios.get(
      "https://thirdparty.gigl-go.com/api/thirdparty/localStations",
      {
        headers: { Authorization: `Bearer ${token.token}` },
      }
    )

    return { stations: data.Object, token }
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getGigPrice = async (
  item: CartItem,
  meta: DeliveryMeta,
  coordinates: { lat: string; lng: string },
  token: { userId: string; token: string; username: string }
) => {
  try {
    const { data } = await axios.post(
      "https://thirdparty.gigl-go.com/api/thirdparty/price",
      {
        ReceiverAddress: meta.address,
        CustomerCode: token.username,
        SenderLocality: item.meta.address,
        SenderAddress: item.meta.address,
        ReceiverPhoneNumber: meta.phone,
        VehicleType: "BIKE",
        SenderPhoneNumber: item.meta.phone,
        SenderName: item.meta.name,
        ReceiverName: meta.name,
        UserId: token.userId,
        ReceiverStationId: meta.stationId,
        SenderStationId: item.meta.stationId,
        ReceiverLocation: {
          Latitude: coordinates.lat,
          Longitude: coordinates.lng,
        },
        SenderLocation: {
          Latitude: item.meta.lat,
          Longitude: item.meta.lng,
        },
        PreShipmentItems: [
          {
            SpecialPackageId: "0",
            Quantity: item.quantity,
            Weight: 1,
            ItemType: "Normal",
            ItemName: item.name,
            Value: item.sellingPrice,
            ShipmentType: "Regular",
            Description: item.description,
            ImageUrl: item.images[0],
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token.token}` },
      }
    )

    return data.Object
  } catch (error) {
    throw new Error(
      "Error selecting delivery method, try again later or try other delivery method"
    )
  }
}
