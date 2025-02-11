import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import React, { ReactNode, useRef, useState } from "react"
import { Text, useTheme } from "react-native-paper"
import Popover from "react-native-popover-view"

type Props = {
  children: ReactNode
  content: string
  onClick?: () => void
  onClose?: () => void
}

const { width: screenWidth } = Dimensions.get("window")
const Tooltip = ({ children, content, onClick, onClose }: Props) => {
  const { colors } = useTheme()

  const touchable = useRef<View>(null)
  const [showPopover, setShowPopover] = useState(false)

  const openPopup = () => {
    onClick?.()
    setShowPopover(true)
  }

  const closePopup = () => {
    onClose?.()
    setShowPopover(false)
  }

  return (
    <>
      <TouchableOpacity ref={touchable} onPress={openPopup}>
        {children}
      </TouchableOpacity>

      <Popover
        from={touchable}
        isVisible={showPopover}
        onRequestClose={closePopup}
        popoverStyle={{ backgroundColor: colors.background }}
      >
        <View style={styles.tooltip}>
          <Text style={{ lineHeight: 18 }}>{content}</Text>
        </View>
      </Popover>
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center" },
  tooltip: {
    padding: 10,
    maxWidth: screenWidth * 0.8,
  },
})

export default Tooltip
