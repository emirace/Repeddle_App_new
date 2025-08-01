import { ScrollView, StyleSheet, View } from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import {
  Appbar,
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper"
import { WriteReviewNavigationProp } from "../types/navigation/stack"
import Loader from "../components/ui/Loader"
import useProducts from "../hooks/useProducts"
import { IProduct, IReview } from "../types/product"
import useToastNotification from "../hooks/useToastNotification"
import { UserByUsername } from "../types/user"
import useUser from "../hooks/useUser"
import { Picker } from "@react-native-picker/picker"
import useAuth from "../hooks/useAuth"

const WriteProductReview = ({
  route,
  navigation,
}: WriteReviewNavigationProp) => {
  const params = route.params

  const reviewData = useMemo(() => {
    if ("comment" in params) {
      return params
    } else {
      return undefined
    }
  }, [params])

  const { fetchProductBySlug, error, createProductReview } = useProducts()
  const { getUserByUsername, reviewSeller } = useUser()
  const { addNotification } = useToastNotification()
  const { user } = useAuth()

  const [product, setProduct] = useState<IProduct>()
  const [seller, setSeller] = useState<UserByUsername>()
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState(reviewData?.comment || "")
  const [rating, setRating] = useState(reviewData?.rating || 0)
  const [like, setLike] = useState<boolean>(reviewData?.like || false)
  const { colors } = useTheme()

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.item === "product") {
        const product = await fetchProductBySlug(params.slug)
        if (product) {
          setProduct(product)
          const review = product.reviews.find(
            (review) => review.user._id === user?._id
          )
          if (review) {
            setComment(review.comment)
            setRating(review.rating)
            setLike(review.like)
          }
        } else {
          addNotification({
            message: error || "Product not found",
            error: true,
          })
        }
      } else {
        const seller = await getUserByUsername(params.username)
        if (typeof seller !== "string") {
          setSeller(seller)
          const review = seller.user.reviews?.find(
            (review) => review.user._id === user?._id
          )
          if (review) {
            setComment(review.comment)
            setRating(review.rating)
            setLike(review.like)
          }
        } else {
          addNotification({
            message: seller || "Seller not found",
            error: true,
          })
        }
      }
      setIsLoading(false)
    }
    fetchProduct()
  }, [params])

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      if (params.item === "product") {
        if (product) {
          navigation.replace("Product", { slug: product.slug })
        } else {
          navigation.replace("Main")
        }
      } else {
        if (seller) {
          navigation.replace("MyAccount", { username: seller.user.username })
        } else {
          navigation.replace("Main")
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!comment) {
      addNotification({ message: "Please enter a review", error: true })
      return
    }
    if (!rating) {
      addNotification({ message: "Please select a rating", error: true })
      return
    }
    if (!like) {
      addNotification({ message: "Please select a like", error: true })
      return
    }

    if (params.item === "product") {
      if (!product) {
        addNotification({ message: "Product not found", error: true })
        return
      }
      let res: {
        message: string
        review: IReview
      } | null = null
      if (reviewData) {
        res = await updateProductReview(product?._id, {
          comment,
          rating: Number(rating),
          like,
          _id: reviewData._id,
        })
      } else {
        res = await createProductReview(product?._id, {
          comment,
          rating: Number(rating),
          like,
        })
      }
      if (typeof res !== "string") {
        addNotification({ message: "Review added successfully" })
        handleBack()
      } else {
        addNotification({ message: res, error: true })
      }
    } else {
      if (!seller) {
        addNotification({ message: "Seller not found", error: true })
        return
      }

      let res: {
        message: string
        review: IReview
      } | null = null
      if (reviewData) {
        res = await updateSellerReview(seller.user._id, {
          comment,
          rating: Number(rating),
          like,
          _id: reviewData._id,
        })
      } else {
        res = await reviewSeller(seller.user._id, {
          comment,
          rating: Number(rating),
          like,
        })
      }
      if (typeof res !== "string") {
        addNotification({ message: "Review added successfully" })
        handleBack()
      } else {
        addNotification({ message: res, error: true })
      }
    }
  }

  const options = [
    { label: "1- Poor", value: 1 },
    { label: "2- Fair", value: 2 },
    { label: "3- Good", value: 3 },
    { label: "4- Very good", value: 4 },
    { label: "5- Excellent", value: 5 },
  ]

  const canReview = useMemo(
    () => true,
    // () => user && product?.buyers.some((buyer) => buyer === user._id),
    [product, user]
  )

  const handleEdit = () => {
    console.log("edit")
  }
  const handleDelete = () => {
    console.log("delete")
  }

  return isLoading ? (
    <Loader />
  ) : canReview ? (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction iconColor="white" onPress={handleBack} />
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title={`${reviewData ? "Edit" : "Write a"} ${params.item} review`}
        />
        <Appbar.Action icon="delete" onPress={handleDelete} iconColor="white" />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <TextInput
          label="Write a review"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          style={styles.textInput}
        />
        <View>
          <Text style={[styles.label]}>Rating</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={rating}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue) => {
                setRating(itemValue)
              }}
              mode="dropdown"
            >
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                label={"--select--"}
                value={""}
              />
              {options &&
                options.map(({ label, value }) => (
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    label={label}
                    value={value}
                    key={value}
                  />
                ))}
            </Picker>
          </View>
        </View>

        <View>
          <Text style={[styles.label]}>Like</Text>
          <View style={styles.like}>
            <IconButton
              icon="thumb-up"
              onPress={() => setLike(true)}
              iconColor={like === true ? colors.primary : colors.onBackground}
              mode="outlined"
            />
            <IconButton
              icon="thumb-down"
              onPress={() => setLike(false)}
              iconColor={like === false ? colors.primary : colors.onBackground}
              mode="outlined"
            />
          </View>
        </View>

        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction iconColor="white" onPress={handleBack} />
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title={`${reviewData ? "Edit" : "Write a"} ${params.item} review`}
        />
      </Appbar.Header>
      <Text style={{ textAlign: "center" }}>
        You can't review this {params.item}, you are not a buyer of this{" "}
        {params.item === "product" ? "product" : "user's products"}
      </Text>
    </View>
  )
}

export default WriteProductReview

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    textTransform: "capitalize",
    fontSize: 15,
    fontFamily: "absential-sans-medium",
    marginTop: 15,
    marginBottom: 10,
  },
  picker: { height: 40, overflow: "hidden", justifyContent: "center" },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  content: {
    gap: 10,
  },
  like: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
  },
  textInput: {
    minHeight: 80,
  },
})
