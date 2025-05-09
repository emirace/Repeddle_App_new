import * as ImagePicker from "expo-image-picker";
import {
  ImageManipulator,
  manipulateAsync,
  SaveFormat,
} from "expo-image-manipulator";
import { saveImageService } from "../services/image";

export const uploadOptimizeImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    console.log("Permission to access media library denied");
    return;
  }

  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 6],
    quality: 1,
  });

  if (pickerResult.canceled) {
    return;
  }

  let localUri = pickerResult.assets[0].uri;
  let filename = localUri.split("/").pop();
  let match = /\.(\w+)$/.exec(filename!);
  let type = match ? `image/${match[1]}` : `image`;

  const maxSize = 1024;
  const height = pickerResult.assets[0].height;
  const width = pickerResult.assets[0].width;

  const aspectRatio = width / height;
  let newWidth, newHeight;
  if (aspectRatio >= 1) {
    newWidth = maxSize;
    newHeight = maxSize / aspectRatio;
  } else {
    newHeight = maxSize;
    newWidth = maxSize * aspectRatio;
  }

  try {
    const context = ImageManipulator.manipulate(localUri).resize({
      height: newHeight,
      width: newWidth,
    });
    const image = await context.renderAsync();
    const resizedImage = await image.saveAsync({
      format: SaveFormat.PNG,
      compress: 0.8,
    });
    // const resizedImage = await manipulateAsync(
    //   localUri,
    //   [{ resize: { width: newWidth, height: newHeight } }],
    //   { format: SaveFormat.JPEG, compress: 0.8 }
    // );

    const formData = new FormData();
    //@ts-ignore
    formData.append("image", {
      uri: resizedImage.uri,
      name: filename,
      type,
    });
    const response = await saveImageService(formData);
    return response;
  } catch (err) {
    console.log("Image manipulation error: ", err);
    throw err;
  }
};
