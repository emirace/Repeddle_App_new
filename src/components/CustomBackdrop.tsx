import React, { useMemo } from 'react';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const { colors } = useTheme();
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: 'transparent',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );
  console.log(animatedIndex);

  return <Animated.View style={containerStyle} />;
};

export default CustomBackdrop;
