import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={(ev) => {
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        onPress={props.onPress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        {props.children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
