import { useContext } from "react";
import { MessageContext } from "../contexts/MessageContext";

const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a CartProvider");
  }
  return context;
};

export default useMessage;
