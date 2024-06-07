import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { IconButton, Text, useTheme } from "react-native-paper"

type Props = {
  setShowCondition: (val: boolean) => void
}

const Condition = ({ setShowCondition }: Props) => {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => setShowCondition(false)}>
          <IconButton icon="chevron-back" />
        </TouchableOpacity>
        <Text style={styles.title}>Condition</Text>
        <View style={{ height: 40, width: 40 }} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View>
          <Text style={styles.subTitle}>NEW WITH TAGs</Text>
          <Text style={styles.content}>
            New with Tags: A preowned secondhand product that has never been
            worn or used. These products reflect no sign of use and have their
            original purchase tags on them (include a photo of the tag).{"\n"}
            <Text style={styles.smallContent}>
              This product shows no alterations, no defects, and comes with
              Original purchase tags.
            </Text>
          </Text>
        </View>
        <View>
          <Text style={styles.subTitle}>NEW WITH NO TAGs</Text>
          <Text style={styles.content}>
            A preowned secondhand product that has never been worn or used but
            doesn't have original purchase tags.{"\n"}
            <Text style={styles.smallContent}>
              This product should show no defects or alterations.
            </Text>
          </Text>
        </View>
        <View>
          <Text style={styles.subTitle}>EXCELLENT CONDITION</Text>
          <Text style={styles.content}>
            A preowned secondhand Product still in an excellent condition that
            has only been used or worn very slightly (perhaps 1–3 times) and
            carefully maintained. These Products may reflect very minimal signs
            of wear or usage. Please kindly take clear pictures of the slight
            usage signs to be visible on the product image.{"\n"}
            <Text style={styles.smallContent}>
              Product must not have any damage on the fabric or material, no
              worn smell, and no missing accessory, button, or pieces.
            </Text>
          </Text>
        </View>
        <View>
          <Text style={styles.subTitle}>GOOD CONDITION</Text>
          <Text style={styles.content}>
            A preowned secondhand product in very good condition which has been
            used or worn and properly maintained. No remarkable defects (tear,
            hole, or rust) expected. Any slight defect must be mentioned and
            indicated in the product description and photo.
          </Text>
        </View>
        <View>
          <Text style={styles.subTitle}>FAIR CONDITION</Text>
          <Text style={styles.content}>
            A preowned secondhand product which has been frequently used or
            worn. Products may show reasonable signs of defects, scratches, worn
            corners, or interior wear.{"\n"}
            <Text style={styles.smallContent}>
              Defects are to be shown on product photos and mentioned in the
              description.
            </Text>
          </Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}

export default Condition

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    textTransform: "capitalize",
    lineHeight: 25,
  },
  subTitle: {
    fontFamily: "chronicle-text-medium",
    // fontFamily: 'chronicle-text-bold',
    // fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  smallContent: {
    fontSize: 12,
  },
})
