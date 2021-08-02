import { PixelRatio, Dimensions, Platform } from 'react-native';

export const { width, height } = Dimensions.get('window');

let ratio = PixelRatio.get();

export const RATIO = 360 / width;

export const BASE_URL = ''

export const headerHeight = height * 0.08

export const FONT = Platform.OS == 'ios' ? 2 : 0

export default { RATIO, BASE_URL, URL, FONT }
