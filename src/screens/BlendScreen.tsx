import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  PanResponder,
} from 'react-native';
import Svg, { Path, Rect, Ellipse, Line, Defs, ClipPath } from 'react-native-svg';
import Text from '../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getOilsByIds, Oil } from '../data/oilDatabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Blend'>;

const { width } = Dimensions.get('window');
const BOTTLE_W = 56;
const BOTTLE_H = 96;
const FLASK_W  = 180;
const FLASK_H  = 220;

const BODY_TOP    = 68;
const BODY_BOTTOM = 218;
const BODY_HEIGHT = BODY_BOTTOM - BODY_TOP;

const FILL_Y = [
  BODY_BOTTOM,
  Math.round(BODY_BOTTOM - BODY_HEIGHT * 0.30),
  Math.round(BODY_BOTTOM - BODY_HEIGHT * 0.60),
  Math.round(BODY_BOTTOM - BODY_HEIGHT * 0.85),
];

const AnimatedSvgRect    = Animated.createAnimatedComponent(Rect);
const AnimatedSvgEllipse = Animated.createAnimatedComponent(Ellipse);

function blendColors(hexColors: string[]): string {
  if (hexColors.length === 0) return 'transparent';
  const rgbs = hexColors.map((h) => ({
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  }));
  const n     = rgbs.length;
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  const r     = rgbs.reduce((s, c) => s + c.r, 0) / n;
  const g     = rgbs.reduce((s, c) => s + c.g, 0) / n;
  const b     = rgbs.reduce((s, c) => s + c.b, 0) / n;
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ─── Flask SVG ───────────────────────────────────────────────────────────────

interface FlaskSVGProps {
  liquidTopAnim : Animated.Value;
  liquidColor   : string;
}

function FlaskSVG({ liquidTopAnim, liquidColor }: FlaskSVGProps) {
  const hasLiquid = liquidColor !== 'transparent';
  return (
    <Svg width={FLASK_W} height={FLASK_H} viewBox="0 0 180 220">
      <Defs>
        <ClipPath id="liquidClip">
          <Path d="M 75 68 C 65 100 2 140 8 200 Q 90 218 172 200 C 178 140 115 100 105 68 Z" />
        </ClipPath>
      </Defs>

      <AnimatedSvgRect
        x={0}
        y={liquidTopAnim as unknown as number}
        width={180}
        height={FLASK_H}
        fill={hasLiquid ? liquidColor : 'transparent'}
        fillOpacity={hasLiquid ? 0.52 : 0}
        clipPath="url(#liquidClip)"
      />
      <AnimatedSvgEllipse
        cx={90}
        cy={liquidTopAnim as unknown as number}
        rx={68}
        ry={9}
        fill={hasLiquid ? liquidColor : 'transparent'}
        fillOpacity={hasLiquid ? 0.85 : 0}
        clipPath="url(#liquidClip)"
      />

      <Path
        d="M 75 22 L 75 68 C 65 100 2 140 8 200 Q 90 218 172 200 C 178 140 115 100 105 68 L 105 22 Z"
        fill="rgba(200,180,232,0.15)"
        stroke="#C8B4E8"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <Line x1="75" y1="68" x2="105" y2="68" stroke="#C8B4E8" strokeWidth={1.2} strokeDasharray="3 2" />

      <Rect x="72" y="0" width="36" height="24" rx="8" fill="#C4956A" stroke="#A87C50" strokeWidth={1.5} />
      <Line x1="72" y1="8"  x2="108" y2="8"  stroke="#8B6040" strokeWidth={0.8} strokeOpacity={0.45} />
      <Line x1="72" y1="16" x2="108" y2="16" stroke="#8B6040" strokeWidth={0.8} strokeOpacity={0.45} />

      <Line x1="82" y1="26" x2="82" y2="64" stroke="rgba(255,255,255,0.65)" strokeWidth={3} strokeLinecap="round" />
      <Path d="M 68 86 L 34 162" stroke="rgba(255,255,255,0.38)" strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function BlendScreen({ route, navigation }: Props) {
  const { oilIds, blendName, blendDescription } = route.params;
  const oils = useMemo(() => getOilsByIds(oilIds), [oilIds]);

  const [droppedOils, setDroppedOils] = useState<string[]>([]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [liquidColor, setLiquidColor] = useState<string>('transparent');

  const droppedRef     = useRef<string[]>([]);
  const oilsRef        = useRef(oils);
  const flaskBoundsRef = useRef({ x: 0, y: 0, w: FLASK_W, h: FLASK_H });
  const flaskRef       = useRef<View>(null);
  const liquidTop      = useRef(new Animated.Value(BODY_BOTTOM)).current;

  // Per-bottle animated values — position offset, scale, opacity
  const bottleAnims = useRef(
    Array.from({ length: 3 }, () => ({
      xy:      new Animated.ValueXY({ x: 0, y: 0 }),
      scale:   new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))
  ).current;

  // Screen-space origin of each bottle, captured on drag start for spring-back
  const bottleOrigins  = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: 3 }, () => ({ x: 0, y: 0 }))
  );
  const bottleViewRefs = useRef<Array<View | null>>([null, null, null]);

  const measureFlask = useCallback(() => {
    flaskRef.current?.measureInWindow((x, y, w, h) => {
      flaskBoundsRef.current = { x, y, w, h };
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(measureFlask, 400);
    return () => clearTimeout(t);
  }, [measureFlask]);

  const dropOil = useCallback((idx: number, oil: Oil) => {
    const newDropped = [...droppedRef.current, oil.id];
    droppedRef.current = newDropped;
    setDroppedOils([...newDropped]);

    const colors = newDropped
      .map((id) => oilsRef.current.find((o) => o.id === id)?.color)
      .filter((c): c is string => !!c);
    setLiquidColor(blendColors(colors));

    Animated.timing(liquidTop, {
      toValue  : FILL_Y[Math.min(newDropped.length, FILL_Y.length - 1)],
      duration : 600,
      easing   : Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [liquidTop]);

  const makePanResponder = useCallback((idx: number) => {
    const anim = bottleAnims[idx];

    const springBack = () => {
      Animated.parallel([
        Animated.spring(anim.xy, {
          toValue: { x: 0, y: 0 },
          damping: 15,
          stiffness: 200,
          useNativeDriver: false,
        } as any),
        Animated.spring(anim.scale, {
          toValue: 1,
          damping: 12,
          stiffness: 200,
          useNativeDriver: false,
        } as any),
        Animated.timing(anim.opacity, { toValue: 1, duration: 150, useNativeDriver: false }),
      ]).start();
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => {
        const oil = oilsRef.current[idx];
        return !!oil && !droppedRef.current.includes(oil.id);
      },
      onPanResponderGrant: () => {
        // Capture screen-space origin for spring-back target calculation
        bottleViewRefs.current[idx]?.measureInWindow((x, y) => {
          bottleOrigins.current[idx] = { x, y };
        });
        anim.xy.setValue({ x: 0, y: 0 });
        setDraggingIdx(idx);
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 1.2,
            damping: 12,
            stiffness: 200,
            useNativeDriver: false,
          } as any),
          Animated.timing(anim.opacity, { toValue: 0.9, duration: 100, useNativeDriver: false }),
        ]).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: anim.xy.x, dy: anim.xy.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const b   = flaskBoundsRef.current;
        const oil = oilsRef.current[idx];
        const hit =
          pageX >= b.x && pageX <= b.x + b.w &&
          pageY >= b.y && pageY <= b.y + b.h;

        if (hit && oil && !droppedRef.current.includes(oil.id)) {
          // Animate bottle into flask center then fade out
          const origin  = bottleOrigins.current[idx];
          const targetX = b.x + b.w / 2 - origin.x - BOTTLE_W / 2;
          const targetY = b.y + b.h / 2 - origin.y - BOTTLE_H / 2;

          Animated.parallel([
            Animated.timing(anim.xy, {
              toValue: { x: targetX, y: targetY },
              duration: 280,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false,
            }),
            Animated.timing(anim.scale, { toValue: 0.5, duration: 280, useNativeDriver: false }),
            Animated.sequence([
              Animated.delay(150),
              Animated.timing(anim.opacity, { toValue: 0, duration: 180, useNativeDriver: false }),
            ]),
          ]).start(() => {
            setDraggingIdx(null);
            dropOil(idx, oil);
          });
        } else {
          setDraggingIdx(null);
          springBack();
        }
      },
      onPanResponderTerminate: () => {
        setDraggingIdx(null);
        springBack();
      },
    });
  }, [dropOil, bottleAnims]);

  const pan0 = useRef(makePanResponder(0)).current;
  const pan1 = useRef(makePanResponder(1)).current;
  const pan2 = useRef(makePanResponder(2)).current;
  const panResponders = [pan0, pan1, pan2];

  const handleComplete = () => {
    navigation.navigate('Result', {
      oilIds: droppedRef.current.length > 0 ? droppedRef.current : oilIds,
      blendName,
      blendDescription,
      moodLevel: 3,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{blendName}</Text>

      {/* Flask + ingredient tags */}
      <View style={styles.flaskArea}>
        <View ref={flaskRef} onLayout={measureFlask} style={styles.flaskWrapper}>
          <FlaskSVG liquidTopAnim={liquidTop} liquidColor={liquidColor} />
        </View>

        {droppedOils.length > 0 && (
          <View style={styles.tagsRow}>
            {oils.filter((o) => droppedOils.includes(o.id)).map((oil) => (
              <View
                key={oil.id}
                style={[styles.tag, { borderColor: oil.color, backgroundColor: oil.color + '28' }]}
              >
                <View style={[styles.tagDot, { backgroundColor: oil.color }]} />
                <Text style={styles.tagText}>{oil.nameKo}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Oil bottles */}
      <View style={styles.bottlesRow}>
        {oils.map((oil, idx) => {
          const dropped    = droppedOils.includes(oil.id);
          const anim       = bottleAnims[idx];
          const isDragging = draggingIdx === idx;

          return (
            <View
              key={oil.id}
              style={[styles.bottleSlot, isDragging && styles.slotActive]}
            >
              {/* Ghost ring at origin while bottle is being dragged */}
              {isDragging && (
                <View
                  style={[styles.ghost, { borderColor: oil.color + '70' }]}
                  pointerEvents="none"
                />
              )}

              <Animated.View
                ref={(r: any) => { bottleViewRefs.current[idx] = r; }}
                style={[
                  styles.bottleItem,
                  {
                    transform: [
                      { translateX: anim.xy.x },
                      { translateY: anim.xy.y },
                      { scale: anim.scale },
                    ],
                    opacity: dropped ? 0 : anim.opacity,
                  },
                ]}
                {...panResponders[idx]?.panHandlers}
              >
                <Image
                  source={require('../../assets/bottle.png')}
                  style={[styles.bottleImage, { tintColor: oil.color }]}
                  resizeMode="contain"
                />
                <Text style={[styles.bottleName, { color: oil.color }]}>{oil.nameKo}</Text>
              </Animated.View>
            </View>
          );
        })}
      </View>

      {droppedOils.length > 0 && (
        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete} activeOpacity={0.85}>
          <Text style={styles.completeText}>블렌딩 완료 →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Ownglyph_corncorn',
    color: '#2D1B5C',
    marginBottom: 8,
    textAlign: 'center',
  },

  flaskArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  flaskWrapper: {
    width: FLASK_W,
    height: FLASK_H,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tagDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  tagText: { fontSize: 12, color: '#2D1B5C', fontWeight: '600' },

  bottlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  bottleSlot: {
    width: width / 4 - 8,
    alignItems: 'center',
  },
  slotActive: {
    zIndex: 999,
    elevation: 10,
  },
  ghost: {
    position: 'absolute',
    top: 0,
    width: BOTTLE_W,
    height: BOTTLE_W,
    borderRadius: BOTTLE_W / 2,
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  bottleItem: {
    alignItems: 'center',
  },
  bottleImage: { width: BOTTLE_W, height: BOTTLE_H },
  bottleName: { fontSize: 12, marginTop: 6, textAlign: 'center', fontWeight: '600' },

  completeBtn: {
    backgroundColor: '#C8B4E8',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
  },
  completeText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});
