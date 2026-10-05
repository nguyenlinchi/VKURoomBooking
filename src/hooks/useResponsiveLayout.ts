import {
  useWindowDimensions
} from "react-native";

export function useResponsiveLayout() {

  const {
    width,
    height
  } = useWindowDimensions();

  const isLandscape =
    width > height;

  const isTablet =
    width >= 768;

  const columns =
    width >= 768
      ? 3
      : width >= 480
      ? 2
      : 1;

  const horizontalPadding =
    columns === 1
      ? 16
      : 24;

  const gap = 12;

  const cardWidth =
    columns === 1
      ? width - 32
      : (
          width -
          horizontalPadding * 2 -
          gap * (columns - 1)
        ) / columns;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    columns,
    cardWidth
  };
}