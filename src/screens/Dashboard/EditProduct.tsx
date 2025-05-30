import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Appbar,
  Button,
  Checkbox,
  Switch,
  Text,
  useTheme,
} from "react-native-paper"
import useProducts from "../../hooks/useProducts"
import { IBrand, IProduct, ISize } from "../../types/product"
import { EditProductNavigationProp } from "../../types/navigation/stack"
import useCategory from "../../hooks/useCategory"
import Input from "../../components/Input"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import { color2, features, materials } from "../../utils/constants"
import { currency, deleteImage, region } from "../../utils/common"
import MyButton from "../../components/MyButton"
import { normaliseH } from "../../utils/normalize"
import AddDeliveryOption from "../../components/AddDeliveryOption"
import Condition from "../../components/Condition"
import useBrands from "../../hooks/useBrand"
import Loader from "../../components/ui/Loader"
import { baseURL } from "../../services/api"
import useToastNotification from "../../hooks/useToastNotification"
import CartIcon from "../../components/ui/cartIcon"
import Tooltip from "../../components/Tooltip"
import AddOtherBrands from "../../components/AddOtherBrands"
import { uploadOptimizeImage } from "../../utils/image"

type Props = EditProductNavigationProp

const EditProduct = ({ navigation, route }: Props) => {
  const { colors } = useTheme()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { fetchProductById, fetchProductBySlug, error, updateProduct } =
    useProducts()
  const { fetchBrands, brands } = useBrands()
  const { fetchCategories, categories } = useCategory()
  const { addNotification } = useToastNotification()

  const [input, setInput] = useState({
    name: "",
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image: "",
    // video,
    mainCategory: "",
    subCategory: "",
    category: "",
    description: "",
    brand: "",
    costPrice: "",
    sellingPrice: "",
    specification: "",
    condition: "New",
    keyFeatures: "",
    video: "",
    material: "",
    tag: "",
    color: "",
    luxuryImage: "",
    luxury: false,
    vintage: false,
  })
  const [tempSize, setTempSize] = useState("S")
  const [modalVisible, setModalVisible] = useState(false)
  const [countInStock, setCountInStock] = useState(1)
  const [sizes, setSizes] = useState<ISize[]>([])
  const [sizesError, setSizesError] = useState("")
  const [addSize, setAddSize] = useState(sizes.length < 1)
  const [showCondition, setShowCondition] = useState(false)
  const [price, setPrice] = useState("")

  const [showOtherBrand, setShowOtherBrand] = useState(true)
  const [paxi, setPaxi] = useState(true)
  const [gig, setGig] = useState(false)
  const [pudo, setPudo] = useState(false)
  const [postnet, setPostnet] = useState(false)
  const [aramex, setAramex] = useState(false)
  const [pickup, setPickup] = useState(true)
  const [bundle, setBundle] = useState(false)
  const [meta, setMeta] = useState({})
  const [validationError, setValidationError] = useState<{
    [key in keyof typeof input]?: String
  }>({})
  const [deliveryOption, setDeliveryOption] = useState([
    { name: "Pick up from Seller", value: 0 },
  ])
  const [handledImage, setHandledImage] = useState<string>()
  const [tags, setTags] = useState<string[]>([])
  const [colorsVal, setColorsVal] = useState<string[]>([])
  const [sizesInputCounts, setSizesInputCounts] = useState([1])

  const [queryBrand, setQueryBrand] = useState("")
  const [searchBrand, setSearchBrand] = useState<IBrand[]>([])
  const [loadingUpload, setLoadingUpload] = useState(false)

  const handleOnChange = (text: string | boolean, key: keyof typeof input) => {
    setInput((prevState) => ({ ...prevState, [key]: text }))
  }

  const handleError = (text: string | boolean, key: keyof typeof input) => {
    setValidationError((prevState) => ({ ...prevState, [key]: text }))
  }

  const handleTags = (tagVal: string) => {
    const tag = tagVal.trim()
    if (tag.includes(" ")) {
      addNotification({
        message: "Please remove space",
        error: true,
      })
      return
    }

    if (tags.length >= 5) {
      addNotification({ message: "You can't add more five tags ", error: true })

      return
    }
    if (tag.length > 0) {
      tags.push(tag)
      handleOnChange("", "tag")
    }
  }

  const removeTags = (tag: string) => {
    const newtags = tags.filter((data) => data != tag)
    setTags(newtags)
  }

  const removeColor = (color: string) => {
    const newColor = colorsVal.filter((data) => data != color)
    setColorsVal(newColor)
  }

  const discount = useMemo(() => {
    if (parseInt(input.costPrice) < parseInt(input?.sellingPrice ?? "0"))
      return 0
    return (
      ((parseInt(input.costPrice) - parseInt(input?.sellingPrice ?? "0")) /
        parseInt(input.costPrice)) *
      100
    )
  }, [input.costPrice, input?.sellingPrice])

  const sizeHandler = (sizenow: string) => {
    if (!sizenow) {
      addNotification({ message: "Please enter size", error: true })
      return
    }

    const exist = sizes.some((s) => s.size === sizenow)

    if (exist) {
      const newSizes = sizes.filter((s) => s.size !== sizenow)
      setSizes(newSizes)
    } else {
      setSizes((prevSizes) => [...prevSizes, { size: sizenow, quantity: 1 }])
    }

    setInput((prev) => ({ ...prev, selectedSize: "" }))
  }

  const addSizeQuantity = (label: string, value: number) => {
    const sizeIndex = sizes.findIndex((x) => x.size === label)
    if (sizeIndex === -1) return
    sizes[sizeIndex].quantity = value
  }
  const [refresh, setRefresh] = useState(false)
  const addSizesCont = () => {
    setSizesInputCounts([...sizesInputCounts, 1])
  }

  const pickImage = async (key: keyof typeof input) => {
    try {
      setHandledImage(key)
      setLoadingUpload(true)

      const res = await uploadOptimizeImage()
      handleOnChange(res as string, key)
    } catch (error: any) {
      addNotification({
        message: error || "Unable to upload image try again later",
        error: true,
      })
    } finally {
      setHandledImage(undefined)
      setLoadingUpload(false)
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      let res: string | IProduct | null
      if (route.params.slug) res = await fetchProductBySlug(route.params.slug)
      else res = await fetchProductById(route.params.id)
      if (res && typeof res !== "string") {
        setInput({
          name: res.name,
          mainCategory: res.mainCategory,
          subCategory: res.subCategory ?? input.subCategory,
          category: res.category ?? input.category,
          description: res.description,
          brand: res.brand ?? input.brand,
          sellingPrice: res.sellingPrice?.toString(),
          costPrice: res.costPrice?.toString() || "",
          specification: res.specification ?? input.specification,
          condition: res.condition,
          keyFeatures: res.keyFeatures ?? input.keyFeatures,
          video: res.video ?? input.video,
          material: res.material ?? input.material,
          luxuryImage: res.luxuryImage ?? input.luxuryImage,
          luxury: res.luxury ?? input.luxury,
          vintage: res.vintage ?? input.vintage,
          image1: res.images[0],
          image2: res.images[1],
          image3: res.images[2],
          image4: res.images[3],
          tag: "",
          color: "",
          image: "",
        })

        setTags(tags)
        setPrice(res.costPrice?.toString() || "")
        setColorsVal(res.color ?? colorsVal)
        setTags(res.tags)
      } else {
        addNotification({
          message: res || error || "Failed to get product details",
          error: true,
        })
      }
      setLoading(false)
    }

    fetchProduct()
  }, [route.params.id, refresh])

  useEffect(() => {
    const fetchCate = async () => {
      const res = await fetchCategories()
      if (res) {
      } else {
        addNotification({ message: error, error: true })
      }
    }

    fetchCate()
  }, [])

  useEffect(() => {
    const getFilterBrand = async () => {
      const params: string[][] = [["search", queryBrand]]

      const string = new URLSearchParams(params).toString()

      const res = await fetchBrands(string)

      if (res) setSearchBrand(brands)
    }

    if (queryBrand) getFilterBrand()
  }, [queryBrand])

  const validation = () => {
    var valid = true
    if (!input.name) {
      handleError("Enter product name", "name")
      valid = false
    }

    if (!input.image1) {
      handleError("Add at least one image", "image")
      valid = false
    }
    if (!input.mainCategory) {
      handleError("Select main category", "mainCategory")
      valid = false
    }
    if (!input.subCategory) {
      handleError("Select sub category", "subCategory")
      valid = false
    }
    if (!input.category) {
      handleError("Select category", "category")
      valid = false
    }
    if (!input.brand) {
      handleError("Select brand", "brand")
      valid = false
    }
    if (!input.costPrice) {
      handleError("Enter a valid price", "costPrice")
      valid = false
    }

    if (input.sellingPrice && input.sellingPrice > input.costPrice) {
      handleError("Selling price must be less than cost price", "sellingPrice")
    }
    // if (!input.shippingLocation) {
    //   handleError("Select shipping location", "shippingLocation");
    //   valid = false;
    // }
    if (!input.condition) {
      handleError("Select condition", "condition")
      valid = false
    }

    if (!input.keyFeatures) {
      handleError("Select features", "keyFeatures")
      valid = false
    }
    if (!colorsVal.length) {
      handleError("Select at least one color", "color")
      valid = false
    }

    if (addSize) {
      if (countInStock < 1) {
        setSizesError("Enter count in stock")
        valid = false
      }
    } else {
      if (!sizes.length) {
        setSizesError("Enter a valid size and quantity available")
        valid = false
      }
    }
    if (!input.description) {
      handleError("Description is required", "description")
      valid = false
    }
    if (valid) {
      submitHandler()
    } else
      addNotification({
        message: "Error creating product, fill mising fields ",
        error: true,
      })
  }

  const onDeleteImage = async (key: keyof typeof input) => {
    if (!input[key]) return
    setHandledImage(key)
    try {
      setLoadingUpload(true)
      const imageName = (input[key] as string).split("/").pop()
      if (imageName) {
        const res = await deleteImage(imageName)
        addNotification({ message: res })
        handleOnChange("", key)
      }
    } catch (error) {
      addNotification({ message: "Failed to delete image", error: true })
    }
    setHandledImage(undefined)
    setLoadingUpload(false)
  }

  const submitHandler = async () => {
    setUpdating(true)
    if (addSize === false && sizes.length === 0) {
      addNotification({ message: "Please add size", error: true })
      return
    }
    const images: string[] = []
    if (input.image1) images.push(input.image1)
    if (input.image2) images.push(input.image2)
    if (input.image3) images.push(input.image3)
    if (input.image4) images.push(input.image4)

    const res = await updateProduct(route.params.id, {
      name: input.name,
      images,
      video: input.video,
      mainCategory: input.mainCategory,
      subCategory: input.subCategory,
      category: input.category,
      description: input.description,
      brand: input.brand,
      sellingPrice: +input.sellingPrice,
      costPrice: +input.costPrice,
      deliveryOption,
      meta: meta,
      tags,
      specification: input.specification,
      sizes,
      condition: input.condition,
      keyFeatures: input.keyFeatures,
      luxury: input.luxury,
      vintage: input.vintage,
      material: input.material,
      color: colorsVal,
      luxuryImage: input.luxuryImage,
      // addSize,
      countInStock,
    })

    if (res) {
      addNotification({ message: "Product Updated", error: false })
      setRefresh(!refresh)
      if (navigation.canGoBack()) return navigation.goBack()
      navigation.push("ProductList")
    } else {
      addNotification({ message: error, error: true })
    }
    setUpdating(false)
  }

  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Edit Product" />
        <Appbar.Content
          style={{ flex: 0 }}
          title={
            <View>
              <CartIcon
                iconColor="white"
                onPress={() => navigation.push("Cart")}
              />
            </View>
          }
        />
      </Appbar.Header>
      {loading ? (
        <Loader />
      ) : (
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.info}>
            When adding product, do not ignore to fill all relevant fields and
            following the product adding rules. Always remember; The best
            picture and descriptions sells faster. Ensure to upload high quality
            product photos with all details showing.
          </Text>
          <Text style={[styles.label]}>Product Name</Text>
          <Input
            icon="pencil-outline"
            onChangeText={(text) => handleOnChange(text, "name")}
            placeholder="Product Name"
            value={input.name}
            placeholderTextColor={"grey"}
            style={{ color: colors.onBackground, width: "100%" }}
          />
          {validationError.name && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.name}
            </Text>
          )}
          <Text style={[styles.label]}>Main category</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.mainCategory}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue) =>
                handleOnChange(itemValue, "mainCategory")
              }
              mode="dropdown"
            >
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                  width: "100%",
                }}
                label={"--select--"}
                value={""}
              />
              {categories &&
                categories.map(({ name, subCategories }, index) => (
                  <Picker.Item
                    style={{
                      backgroundColor: colors.elevation.level2,
                      color: colors.onBackground,
                    }}
                    key={index}
                    label={name}
                    value={name}
                  />
                ))}
            </Picker>
          </View>
          {validationError.mainCategory && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.mainCategory}
            </Text>
          )}
          <Text style={[styles.label]}>Category</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.category}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue) =>
                handleOnChange(itemValue, "category")
              }
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
              {categories &&
                categories.map(
                  ({ name, subCategories }) =>
                    name === input.mainCategory &&
                    subCategories.map(({ name }, index) => (
                      <Picker.Item
                        style={{
                          backgroundColor: colors.elevation.level2,
                          color: colors.onBackground,
                        }}
                        label={name}
                        value={name}
                        key={index}
                      />
                    ))
                )}
            </Picker>
          </View>
          {validationError.category && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.category}
            </Text>
          )}
          <Text style={[styles.label]}>Sub Category</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.subCategory}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue) =>
                handleOnChange(itemValue, "subCategory")
              }
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
              {categories &&
                categories.map(
                  ({ name, subCategories }) =>
                    name === input.mainCategory &&
                    subCategories.map(
                      ({ name, items }) =>
                        name === input.category &&
                        items.map((item, index) => (
                          <Picker.Item
                            style={{
                              backgroundColor: colors.elevation.level2,
                              color: colors.onBackground,
                            }}
                            label={item.name}
                            value={item.name}
                            key={index}
                          />
                        ))
                    )
                )}
            </Picker>
          </View>
          {validationError.subCategory && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.subCategory}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.label]}>condition</Text>
            <Tooltip content="Should you not be certain which condition your product falls under when listing, we suggest you choose between the last three option depending on what you see (if your product isn’t NEW or with TAG) and take very clear visible photos indicating every little details. Also, to avoid returns and help you sell fast, give every possible information in your product description so as to clearly inform buyer about your product’s condition.">
              <Ionicons
                name="help-circle"
                size={15}
                color={colors.onBackground}
                style={{ marginHorizontal: 5 }}
              />
            </Tooltip>

            <TouchableOpacity onPress={() => setShowCondition(true)}>
              <Text style={styles.infoLink}>help?</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showCondition}
            onRequestClose={() => {
              setShowCondition(!showCondition)
            }}
          >
            <Condition setShowCondition={setShowCondition} />
          </Modal>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.condition}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue, itemIndex) =>
                handleOnChange(itemValue, "condition")
              }
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
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                value="New with Tags"
                label="New with Tags"
              />
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                value="New with No Tags"
                label="New with No Tags"
              />
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                value="Excellent Condition"
                label="Excellent Condition"
              />
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                value="Good Condition"
                label="Good Condition"
              />
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                value="Fair Condition"
                label="Fair Condition"
              />
            </Picker>
          </View>
          {validationError.condition && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.condition}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.label]}>Materials/Fibric</Text>
            <Tooltip
              content="How do I know what the primary material of the product is?
                      This information is mostly indicated on the Product
                      labels, please refer to the label detailing the
                      composition of your Product."
            >
              <Ionicons
                name="help-circle"
                size={15}
                color={colors.onBackground}
                style={{ marginHorizontal: 5 }}
              />
            </Tooltip>
          </View>
          <Text style={styles.info}>Specify Product's primary material.</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.material}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue, itemIndex) =>
                handleOnChange(itemValue, "material")
              }
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
              {materials.map((m, index) => (
                <Picker.Item
                  style={{
                    backgroundColor: colors.elevation.level2,
                    color: colors.onBackground,
                  }}
                  label={m}
                  value={m}
                  key={index}
                />
              ))}
            </Picker>
          </View>
          {validationError.material && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.material}
            </Text>
          )}
          <Text style={[styles.label]}>Brands</Text>
          <TextInput
            placeholder="Search brands"
            value={input.brand.length > 0 ? input.brand : queryBrand}
            onChangeText={(text) => {
              handleOnChange("", "brand")
              setQueryBrand(text)
            }}
            style={[
              styles.textInput,
              {
                color: colors.onBackground,
                borderColor: colors.outline,
                width: "100%",
              },
            ]}
            placeholderTextColor={"grey"}
            cursorColor={colors.onBackground}
            onBlur={() => input.brand.length > 0 && setQueryBrand("")}
          />
          {validationError.brand && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.brand}
            </Text>
          )}
          {searchBrand &&
            queryBrand.length > 0 &&
            [...searchBrand, { name: "Other", _id: Math.random() }].map(
              (p, index) => (
                <View key={p._id}>
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      if (p.name === "Other") {
                        setShowOtherBrand(true)
                      } else {
                        handleOnChange(p.name, "brand")
                      }
                      setQueryBrand("")
                    }}
                  >
                    <Ionicons
                      style={{ marginRight: 5 }}
                      name="stop-circle"
                      size={10}
                      color={colors.secondary}
                    />
                    <Text style={[styles.itemText]}>{p.name}</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          {validationError.brand && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.brand}
            </Text>
          )}
          {showOtherBrand ? (
            <AddOtherBrands
              handleOnChange={handleOnChange}
              setShowOtherBrand={setShowOtherBrand}
            />
          ) : null}

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.onBackground }]}>
              Color
            </Text>

            <Tooltip
              content="How can I ensure that colour of the 
              product is clear? For you to get accuracy in 
              colour. Please take photos using a good source 
              of natural light to ensure clear colour. The 
              best and 
              accurate photos always sale 95% faster"
            >
              <Ionicons
                name="help-circle"
                size={15}
                color={colors.onBackground}
                style={{ marginHorizontal: 5 }}
              />
            </Tooltip>
          </View>
          <Text style={styles.info}>
            Specify the main colour of the product (choose 2 colours minimum)
          </Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.color}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue, itemIndex) => {
                handleOnChange(itemValue, "color")
                setColorsVal((val) => [...new Set([...colorsVal, itemValue])])
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
              {color2.map((c, index) => (
                <Picker.Item
                  style={{
                    backgroundColor: colors.elevation.level2,
                    color: colors.onBackground,
                  }}
                  key={index}
                  label={c}
                  value={c}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.tagList}>
            {colorsVal.map((t, i) => (
              <View
                style={[
                  styles.tagItem,
                  { backgroundColor: colors.elevation.level2 },
                ]}
                key={i}
              >
                <Text style={styles.tagText}>{t}</Text>
                <TouchableOpacity onPress={() => removeColor(t)}>
                  <Ionicons
                    name={"close"}
                    style={styles.removeIcon}
                    color={colors.onBackground}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {validationError.color && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.color}
            </Text>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.label]}>Product images</Text>

            <Tooltip content="If image size appears to be too large, you can simply crop the image on your phone and try again. This should reduce the size of the image you're trying upload.">
              <Ionicons
                name="help-circle"
                size={15}
                color={colors.onBackground}
                style={{ marginHorizontal: 5 }}
              />
            </Tooltip>
          </View>
          <Text style={styles.info}>
            You will need to add aleast one image and a max of four images. Add
            clear and quality images. Ensure to follow the image uplaod rules.{" "}
            <Text style={{ color: colors.secondary }}>
              Please note: Image/Video size should be less than 8MB.
            </Text>
          </Text>
          <View style={styles.imageCont}>
            <TouchableOpacity
              onPress={() => pickImage("image1")}
              disabled={loadingUpload}
              style={[
                styles.camera,
                { backgroundColor: colors.elevation.level2 },
              ]}
            >
              {handledImage === "image1" && loadingUpload ? (
                <ActivityIndicator />
              ) : input.image1 ? (
                <>
                  <Image
                    source={{ uri: baseURL + input.image1 }}
                    style={styles.image}
                  />
                  <Pressable
                    style={styles.trash}
                    onPress={() => onDeleteImage("image1")}
                  >
                    <Ionicons name="trash-outline" size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage("image2")}
              disabled={loadingUpload}
              style={[
                styles.camera,
                { backgroundColor: colors.elevation.level2 },
              ]}
            >
              {handledImage === "image2" && loadingUpload ? (
                <ActivityIndicator />
              ) : input.image2 ? (
                <>
                  <Image
                    source={{ uri: baseURL + input.image2 }}
                    style={styles.image}
                  />
                  <Pressable
                    style={styles.trash}
                    onPress={() => onDeleteImage("image2")}
                  >
                    <Ionicons name="trash-outline" size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage("image3")}
              disabled={loadingUpload}
              style={[
                styles.camera,
                { backgroundColor: colors.elevation.level2 },
              ]}
            >
              {handledImage === "image3" && loadingUpload ? (
                <ActivityIndicator />
              ) : input.image3 ? (
                <>
                  <Image
                    source={{ uri: baseURL + input.image3 }}
                    style={styles.image}
                  />
                  <Pressable
                    style={styles.trash}
                    onPress={() => onDeleteImage("image3")}
                  >
                    <Ionicons name="trash-outline" size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage("image4")}
              disabled={loadingUpload}
              style={[
                styles.camera,
                { backgroundColor: colors.elevation.level2 },
              ]}
            >
              {handledImage === "image4" && loadingUpload ? (
                <ActivityIndicator />
              ) : input.image4 ? (
                <>
                  <Image
                    source={{ uri: baseURL + input.image4 }}
                    style={styles.image}
                  />
                  <Pressable
                    style={styles.trash}
                    onPress={() => onDeleteImage("image4")}
                  >
                    <Ionicons name="trash-outline" size={16} color="black" />
                  </Pressable>
                </>
              ) : (
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          </View>
          {validationError.image && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.image}
            </Text>
          )}
          <TouchableOpacity>
            <Text style={[styles.addVideo, { color: colors.primary }]}>
              ADD SHORT VIDEO
            </Text>
          </TouchableOpacity>
          <View style={[{ flexDirection: "row" }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  // style={styles.checkbox}
                  status={input.luxury ? "checked" : "unchecked"}
                  onPress={() => handleOnChange(!input.luxury, "luxury")}
                  color={input.luxury ? colors.primary : undefined}
                />
                <Text style={[styles.label]}>Luxury</Text>
              </View>
              <Text style={styles.info}>
                Product that is a well-known luxury brand. Please kindly select
                this box only if your goods are Luxury product
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  // style={styles.checkbox}
                  status={input.vintage ? "checked" : "unchecked"}
                  onPress={() => handleOnChange(!input.vintage, "vintage")}
                  color={input.vintage ? colors.primary : undefined}
                />
                <Text style={[styles.label]}>vintage</Text>
              </View>
              <Text style={styles.info}>
                Product that is at least 15 years old. Please kindly select this
                box only if your goods are Vintage product
              </Text>
            </View>
            {(input.luxury || input.vintage) && (
              <View
                style={{
                  flex: 1,
                  padding: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => pickImage("luxury")}
                  style={{
                    backgroundColor: colors.elevation.level2,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                >
                  {handledImage === "luxuryImage" && loadingUpload ? (
                    <ActivityIndicator />
                  ) : input.luxuryImage ? (
                    <>
                      <Image
                        source={{ uri: baseURL + input.luxuryImage }}
                        style={{ width: "100%", height: 120 }}
                      />
                      <Pressable
                        style={styles.trash}
                        onPress={() => onDeleteImage("luxuryImage")}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="black"
                        />
                      </Pressable>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="camera-outline"
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={{ textAlign: "center" }}>
                        “Certificate, invoice, serial number”
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <Text style={styles.info}>
                  This information is mandatory for luxury brands. This
                  information will not be publicly displayed. Only use this
                  option if you select any of the above, “Vintage or luxury
                  Product”
                </Text>
              </View>
            )}
          </View>
          <View style={styles.checkContainer}>
            <Text style={{ marginRight: 10 }}>Item do not require size</Text>
            <View style={styles.infoRow}>
              <Tooltip
                content="If I feel the product and the size seems to differ from what indicated on the label, what should I do?
              Please be advised to list the product with the size printed on the label. Mentioning the size discrepancy, you noticed in the product description helps a great deal for buyers to make informed size decision. If buyers are forewarned, they will not be disappointed. This minimizes the chances of your products been returned as a result of unfit size."
              >
                <Ionicons
                  name="help-circle"
                  size={15}
                  color={colors.onBackground}
                  style={{ marginHorizontal: 5 }}
                />
              </Tooltip>
            </View>
            <Switch
              style={styles.checkbox1}
              trackColor={{ false: "#ddd", true: "#ddd" }}
              thumbColor={addSize ? colors.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setAddSize}
              value={addSize}
            />
          </View>
          {!addSize ? (
            <>
              <Text style={[styles.label, { color: colors.onBackground }]}>
                add size
              </Text>
              <Text style={styles.info}>
                Provide the exact size as indicated on your product's label.
              </Text>
              {sizesInputCounts.map((c, index) => (
                <View key={index} style={{ flexDirection: "row" }}>
                  <View key={index} style={[{ flex: 1 }]}>
                    <Input
                      placeholder="Enter Size"
                      maxLength={3}
                      onChangeText={(text) => {
                        setTempSize(text)
                      }}
                      placeholderTextColor={"grey"}
                      style={{ color: colors.onBackground, width: "100%" }}
                      onBlur={() => sizeHandler(tempSize)}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Input
                      placeholder="Quantity"
                      keyboardType="numeric"
                      placeholderTextColor={"grey"}
                      onChangeText={(text) => addSizeQuantity(tempSize, +text)}
                      style={{ color: colors.onBackground, width: "100%" }}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity onPress={addSizesCont}>
                <Text style={[styles.addSize, { color: colors.primary }]}>
                  {sizes.length <= 1 ? "Add Size" : "Add More Size"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.label]}>Count in stock</Text>
              <TextInput
                keyboardType="numeric"
                placeholderTextColor={colors.onBackground}
                style={[
                  styles.input,
                  {
                    color: colors.onBackground,
                    backgroundColor: colors.elevation.level2,
                    width: "100%",
                  },
                ]}
                placeholder={`${countInStock}`}
                value={countInStock.toString()}
                onChangeText={(text) => setCountInStock(+text)}
              />
            </>
          )}
          {sizesError && (
            <Text style={{ color: "red", fontSize: 12 }}>{sizesError}</Text>
          )}
          <View style={styles.infoRow}>
            <Text style={[styles.label]}>Shipping Location</Text>

            <Tooltip
              content="Please select if your product can be shipped anywhere around
              your country. If you're in Nigeria, Only select Nigeria. If
              you are selling in South Africa only select South Africa"
            >
              <Ionicons
                name="help-circle"
                size={15}
                color={colors.onBackground}
                style={{ marginHorizontal: 5 }}
              />
            </Tooltip>
          </View>
          {/* TODO: not in product schema  */}
          {/* <View style={styles.picker}>
            <Picker
              selectedValue={input.shippingLocation}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: "grey",
              }}
              onValueChange={(itemValue, itemIndex) =>
                handleOnChange(itemValue, "shippingLocation")
              }
            >
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                label={"--select--"}
                value={""}
              />
              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                label={"Nigeria"}
                value={"Nigeria"}
              />

              <Picker.Item
                style={{
                  backgroundColor: colors.elevation.level2,
                  color: colors.onBackground,
                }}
                label={"South Africa"}
                value={"South Africa"}
              />
            </Picker>
          </View>
          {validationError.shippingLocation && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.shippingLocation}
            </Text>
          )} */}
          <Text style={[styles.label]}>Key Feature : Pattern & Print</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={input.keyFeatures}
              style={{
                backgroundColor: colors.elevation.level2,
                padding: 5,
                color: colors.onBackground,
              }}
              onValueChange={(itemValue) =>
                handleOnChange(itemValue, "keyFeatures")
              }
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
              {features.map((f, index) => (
                <Picker.Item
                  style={{
                    backgroundColor: colors.elevation.level2,
                    color: colors.onBackground,
                  }}
                  label={f}
                  value={f}
                  key={index}
                />
              ))}
            </Picker>
          </View>
          {validationError.keyFeatures && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.keyFeatures}
            </Text>
          )}
          <Text style={[styles.label]}>Delivery options</Text>
          {deliveryOption.map((d) => (
            <View key={d.name} style={styles.deliv}>
              <Ionicons name="checkmark" style={styles.icon} color="orange" />
              <Text>{d.name}</Text>
            </View>
          ))}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
          >
            <AddDeliveryOption
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              paxi={paxi}
              setPaxi={setPaxi}
              gig={gig}
              setGig={setGig}
              pudo={pudo}
              setPudo={setPudo}
              aramex={aramex}
              setAramex={setAramex}
              postnet={postnet}
              setPostnet={setPostnet}
              pickup={pickup}
              setPickup={setPickup}
              bundle={bundle}
              setBundle={setBundle}
              setDeliveryOption={setDeliveryOption}
              meta={meta}
              setMeta={setMeta}
              deliveryOption={deliveryOption}
            />
          </Modal>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.addSize, { color: colors.primary }]}>
              Add More Delivery Option
            </Text>
          </TouchableOpacity>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}
          >
            <Text style={[styles.price, { color: colors.primary }]}>
              {currency(region())}
              {input.sellingPrice || input.costPrice}
            </Text>
            {discount ? (
              <Text
                style={[
                  styles.price,
                  {
                    textDecorationLine: "line-through",
                    color: colors.primary,
                    fontWeight: "400",
                  },
                ]}
              >
                {currency(region())}
                {input.costPrice}
              </Text>
            ) : null}

            {discount ? (
              <Text
                style={[
                  styles.price,
                  {
                    color: colors.secondary,
                    fontWeight: "400",
                  },
                ]}
              >
                {discount.toFixed()}% discount
              </Text>
            ) : null}
          </View>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.infoRow}>
                <Text style={[styles.label]}>price</Text>

                <Tooltip content="Any price suggestion for my product? We encourage you to be as reasonable as possible, as over prized products are turn off to buyers. Keep in mind that our community are experienced secondhand THRIFT buyers & sellers both in vintage and luxury goods and overpricing may affect the sale of your product. However, buyers will appreciate a fairly reasonable price that’s worth the value of your product. Also, bear in mind that there might be competitive product you may be selling on our app or website, hence, be sure to beat any possible competition you can. Offer discounts, promos or free delivery where and when possible as these are great ways to sell FAST! We are doing our best to provide you with competitive goods and price suggestions for similar and previously SOLD products.">
                  <Ionicons
                    name="help-circle"
                    size={20}
                    color={colors.onBackground}
                    style={{ marginHorizontal: 5 }}
                  />
                </Tooltip>
              </View>
              <Input
                onChangeText={(text) => handleOnChange(text, "costPrice")}
                placeholder="Actual price"
                onFocus={() => {}}
                keyboardType="numeric"
                style={{ color: colors.onBackground, width: "100%" }}
                value={input.costPrice}
              />
              {validationError.costPrice && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {validationError.costPrice}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.label]}>Selling Price</Text>
              <Input
                keyboardType="numeric"
                style={{ color: colors.onBackground, width: "100%" }}
                onChangeText={(text) => handleOnChange(text, "sellingPrice")}
                placeholder="Selling Price"
                onFocus={() => {}}
                value={input.sellingPrice}
              />
              {validationError.sellingPrice && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {validationError.sellingPrice}
                </Text>
              )}
            </View>
          </View>
          <Text style={[styles.info, { padding: 0, color: colors.secondary }]}>
            Our commission
          </Text>
          <Text style={styles.info}>
            To give you unmatched user experience and support the growth of your
            business as part of our community, you will not be charged Repeddle
            commission fee. To understand how our fee works after the grace
            period, please have a look at our fee structure
            <Text style={{ color: colors.secondary }}> here</Text>
          </Text>
          <Text style={[styles.label]}>specification</Text>
          <Text style={styles.info}>
            FOR CHILDREN'S WEAR/SH0ES, Please manually enter the Size/Age
            brackets as shown on the label of clothes/shoes
          </Text>
          <TextInput
            style={[
              styles.textarea,
              {
                backgroundColor: colors.elevation.level2,
                color: colors.onBackground,
                width: "100%",
              },
            ]}
            multiline={true}
            textAlignVertical="top"
            placeholder="  Specs"
            placeholderTextColor={colors.onBackground}
            numberOfLines={5}
            onChangeText={(text) => handleOnChange(text, "specification")}
            value={input.specification}
          />
          {validationError.specification && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.specification}
            </Text>
          )}
          <Text style={[styles.label]}>description</Text>
          <TextInput
            style={[
              styles.textarea,
              {
                backgroundColor: colors.elevation.level2,
                color: colors.onBackground,
                minHeight: 80,
                width: "100%",
              },
            ]}
            multiline={true}
            textAlignVertical="top"
            placeholder="  Description"
            placeholderTextColor={colors.onBackground}
            numberOfLines={10}
            onChangeText={(text) => handleOnChange(text, "description")}
            value={input.description}
          />
          {validationError.description && (
            <Text style={{ color: "red", fontSize: 12 }}>
              {validationError.description}
            </Text>
          )}
          <View style={styles.item}>
            <Text style={styles.label}>Add Tags #</Text>
            <View style={styles.tagCont}>
              <View
                style={[
                  styles.tagInputCont,
                  { backgroundColor: colors.elevation.level2 },
                ]}
              >
                <TextInput
                  style={[
                    styles.tagInput,
                    { color: colors.onBackground, width: "100%" },
                  ]}
                  value={input.tag}
                  onChangeText={(value) => handleOnChange(value, "tag")}
                />
                <TouchableOpacity
                  style={[styles.addTag, { backgroundColor: colors.primary }]}
                  onPress={() => handleTags(input.tag)}
                >
                  <Text style={styles.addTagText}>Add</Text>
                </TouchableOpacity>
              </View>
              {validationError.tag && (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {validationError.tag}
                </Text>
              )}
              <View style={styles.tagList}>
                {tags.map((t, i) => (
                  <View
                    style={[
                      styles.tagItem,
                      { backgroundColor: colors.elevation.level2 },
                    ]}
                    key={i}
                  >
                    <Text style={styles.tagText}>{t}</Text>
                    <TouchableOpacity onPress={() => removeTags(t)}>
                      <Ionicons
                        name={"close"}
                        style={styles.removeIcon}
                        color={colors.onBackground}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Button
              mode="contained"
              loading={updating}
              disabled={updating}
              onPress={() => validation()}
              style={{ borderRadius: 10 }}
            >
              Update Product
            </Button>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default EditProduct

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    fontFamily: "absential-sans-bold",
    fontSize: 24,
    textTransform: "capitalize",
  },
  form: { marginTop: 5, marginHorizontal: 20 },
  label: {
    textTransform: "capitalize",
    fontSize: 15,
    fontFamily: "absential-sans-medium",
    marginTop: 15,
    marginBottom: 10,
  },
  picker: { height: 40, overflow: "hidden", justifyContent: "center" },
  inputCont: { marginVertical: 5 },
  imageCont: { flexDirection: "row", justifyContent: "space-around" },
  camera: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden",
  },
  labelMain: {
    fontFamily: "absential-sans-bold",
    fontSize: 18,
    textTransform: "uppercase",
  },
  addSize: {
    textAlign: "right",
    fontFamily: "chronicle-text-bold",
    marginTop: 5,
  },
  textarea: {
    borderRadius: 5,
    marginVertical: normaliseH(10),
    padding: 5,
  },
  price: {
    marginHorizontal: 5,
    fontFamily: "absential-sans-bold",
  },
  checkbox: { marginRight: 10, width: 20, height: 20 },
  image: { width: "100%", flex: 1 },

  info: {
    color: "grey",
    // padding: 5,
    textAlign: "justify",
    fontSize: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoLink: {
    fontSize: 11,
    textDecorationLine: "underline",
  },
  input: {
    borderRadius: 5,
    height: 40,
    padding: 10,
  },
  checkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // label: {
  //   marginRight: 10,
  // },
  checkbox1: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  addVideo: {
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "chronicle-text-bold",
  },
  deliv: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  trash: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 2,
    borderRadius: "50%",
    backgroundColor: "white",
  },
  item: {
    marginBottom: 10,
  },
  // label: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   marginBottom: 5,
  // },
  tagCont: {},
  tagInputCont: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    borderColor: "gray",
  },
  tagInput: {
    flex: 1,
    borderRadius: 5,
    height: "100%",
    paddingHorizontal: 10,
  },
  addTag: {
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  addTagText: {
    color: "white",
    fontFamily: "chronicle-text-bold",
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "lightgray",
  },
  tagText: {
    marginRight: 10,
  },
  removeIcon: {
    fontSize: 11,
  },

  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    padding: 10,
    fontSize: 15,
    marginVertical: 5,
  },

  listItem: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    textTransform: "capitalize",
    borderRadius: 5,
  },

  itemText: {
    fontSize: 15,
    textTransform: "capitalize",
  },
})
