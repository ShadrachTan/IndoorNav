import 'react-native-svg';

declare module 'react-native-svg' {
  export interface SvgProps {
    children?: React.ReactNode;
  }
}