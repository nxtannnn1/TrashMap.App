import React, { forwardRef, useCallback, useImperativeHandle } from "react";
// @ts-ignore
import { Dimensions, StyleSheet, View } from "react-native";
// @ts-ignore
import { Gesture, GestureDetector } from "react-native-gesture-handler";
// @ts-ignore
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// ====================================================================
// CONSTANTES DE SNAP
// O estado mínimo é 25%, a bandeja nunca fecha completamente (0%).
// ====================================================================
const TOP_Y = -SCREEN_HEIGHT * 0.85; // 85% da tela (estado máximo)
const MIDDLE_Y = -SCREEN_HEIGHT * 0.5; // 50% da tela (estado padrão)
const BOTTOM_Y = -SCREEN_HEIGHT * 0.30; // 25% da tela (estado mínimo)
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT;

export type BottomSheetHandle = {
  openFull: () => void;
  openDefault: () => void;
  minimize: () => void;
  close: () => void;
};

const CustomBottomSheet = forwardRef<
  BottomSheetHandle,
  { children: React.ReactNode }
>(({ children }, ref) => {
  const translateY = useSharedValue(MIDDLE_Y);

  const snapToPoint = (point: number) => {
    "worklet";
    translateY.value = withTiming(point, {
      duration: 300,
    });
  };

  // Funções de Controle (Expostas via ref)
  const openFullSheet = useCallback(() => snapToPoint(TOP_Y), []);
  const openDefaultSheet = useCallback(() => snapToPoint(MIDDLE_Y), []);
  const minimizeSheet = useCallback(() => snapToPoint(BOTTOM_Y), []);

  // ALTERAÇÃO: 'close' agora apenas minimiza para 25%
  const closeSheet = useCallback(() => snapToPoint(BOTTOM_Y), []);

  useImperativeHandle(ref, () => ({
    openFull: openFullSheet,
    openDefault: openDefaultSheet,
    minimize: minimizeSheet,
    close: closeSheet,
  }));

  // Gesto de Arrastar (Pan Gesture)
  const panGesture = Gesture.Pan()
    .hitSlop({ top: -20, bottom: -20 })
    .onUpdate((event) => {
      // ALTERAÇÃO: Limita o movimento entre TOP_Y (-85%) e BOTTOM_Y (-25%)
      const newTranslateY = event.translationY + translateY.value;
      translateY.value = Math.min(Math.max(newTranslateY, TOP_Y), BOTTOM_Y);
    })
    .onEnd(({ translationY, velocityY }) => {
      "worklet";
      const finalTranslateY = translationY + translateY.value;
      const topMidPoint = (TOP_Y + MIDDLE_Y) / 2;
      const middleMidPoint = (MIDDLE_Y + BOTTOM_Y) / 2;

      // Snaps (com lógica de velocidade)
      if (velocityY < -1000 || finalTranslateY < topMidPoint) {
        runOnJS(openFullSheet)();
        return;
      }
      if (finalTranslateY < middleMidPoint) {
        runOnJS(openDefaultSheet)();
        return;
      }

      // ALTERAÇÃO: O fallback sempre volta para o estado minimizado (25%).
      runOnJS(minimizeSheet)();
    });

  // Estilo Animado do Container
  const rSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      // ALTERAÇÃO: zIndex fixo (2) para garantir que a bandeja fique acima do backdrop.
      zIndex: 2,
    };
  });

  // Estilo Animado do Backdrop
  const rBackdropStyle = useAnimatedStyle(() => {
    // A opacidade interpola apenas até o mínimo (0.1 em 25%)
    const opacity = interpolate(
      translateY.value,
      [TOP_Y, MIDDLE_Y, BOTTOM_Y],
      [1, 0.5, 0.1],
      Extrapolate.CLAMP
    );

    // CORREÇÃO DE TOQUE: O backdrop tem zIndex: 1 (ativo) ou -1 (inativo/minimizado)
    // O valor BOTTOM_Y - 5 é usado como buffer para garantir que o toque seja reativado logo acima do ponto de snap de 25%.
    const isAboveMinimize = translateY.value < BOTTOM_Y - 5;

    return {
      opacity: opacity,
      zIndex: isAboveMinimize ? 1 : -1,
    };
  });

  return (
    <>
      {/* Backdrop (Tocar para Minimizar) */}
      <Animated.View style={[customSheetStyles.backdrop, rBackdropStyle]}>
        <GestureDetector
          gesture={Gesture.Tap().onEnd(() => runOnJS(minimizeSheet)())}
        >
          <View style={StyleSheet.absoluteFillObject} />
        </GestureDetector>
      </Animated.View>

      {/* Bottom Sheet Principal */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[customSheetStyles.sheetContainer, rSheetStyle]}>
          <View style={customSheetStyles.handleArea}>
            <View style={customSheetStyles.handleIndicator} />
          </View>
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
});

CustomBottomSheet.displayName = "CustomBottomSheet";

const customSheetStyles = StyleSheet.create({
  sheetContainer: {
    height: BOTTOM_SHEET_HEIGHT,
    width: "100%",
    backgroundColor: "#1E603A",
    position: "absolute",
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: "hidden",
    flex: 1,
  },
  handleArea: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  handleIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: -1,
  },
});

export default CustomBottomSheet;
