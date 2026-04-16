"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDetectGPU } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

function parseRgbTriplet(input: string): [number, number, number] | null {
  const cleaned = input.trim().replaceAll(",", " ");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length < 3) return null;
  const r = Number(parts[0]);
  const g = Number(parts[1]);
  const b = Number(parts[2]);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

function readCssRgbVar(
  varName: string,
  fallback: [number, number, number],
): [number, number, number] {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  return parseRgbTriplet(raw) ?? fallback;
}

function FluidPlane({
  frozen,
  palette,
}: {
  frozen: boolean;
  palette: {
    a: [number, number, number];
    b: [number, number, number];
    c: [number, number, number];
  };
}) {
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const pointer = React.useRef(new THREE.Vector2(0.5, 0.5));
  const time = React.useRef(0);
  const { size } = useThree();

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color(0x2184ff) },
      uColorB: { value: new THREE.Color(0xff4a8d) },
      uColorC: { value: new THREE.Color(0xffc43d) },
    }),
    [],
  );

  React.useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uColorA.value.setRGB(
      palette.a[0] / 255,
      palette.a[1] / 255,
      palette.a[2] / 255,
    );
    mat.uniforms.uColorB.value.setRGB(
      palette.b[0] / 255,
      palette.b[1] / 255,
      palette.b[2] / 255,
    );
    mat.uniforms.uColorC.value.setRGB(
      palette.c[0] / 255,
      palette.c[1] / 255,
      palette.c[2] / 255,
    );
  }, [palette]);

  React.useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const x = e.clientX / Math.max(1, window.innerWidth);
      const y = 1 - e.clientY / Math.max(1, window.innerHeight);
      pointer.current.set(x, y);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((_state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uPointer.value.lerp(pointer.current, 0.12);

    if (!frozen) {
      time.current += delta;
      mat.uniforms.uTime.value = time.current;
    } else {
      mat.uniforms.uTime.value = 0;
    }
  });

  const vertexShader = React.useMemo(
    () => `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    [],
  );

  const fragmentShader = React.useMemo(
    () => `
    precision highp float;

    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    float hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p.x + p.y) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 st = vUv * 2.0 - 1.0;
      float aspect = uResolution.x / max(1.0, uResolution.y);
      st.x *= aspect;

      float t = uTime * 0.10;

      // Domain warp
      vec2 q = vec2(fbm(st + vec2(0.0, t)), fbm(st + vec2(4.0, -t)));
      vec2 r = vec2(fbm(st + 1.6 * q + vec2(1.7, 9.2) + t), fbm(st + 1.2 * q + vec2(8.3, 2.8) - t));
      float f = fbm(st + r * 1.35);

      float m1 = smoothstep(0.15, 0.85, f);
      float m2 = smoothstep(0.10, 0.80, fbm(st * 1.3 - q + t));

      vec3 col = mix(uColorA, uColorB, m1);
      col = mix(col, uColorC, m2 * 0.75);

      // Pointer bloom
      vec2 p = uPointer * 2.0 - 1.0;
      p.x *= aspect;
      float d = length(st - p);
      col += 0.22 * exp(-d * 3.2);

      // Vignette
      float v = smoothstep(1.25, 0.25, length(st));
      col *= v;

      // Mild filmic curve
      col = pow(col, vec3(0.96));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
    [],
  );

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

export function FluidBackground() {
  const reducedMotion = useReducedMotion();
  const gpu = useDetectGPU();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLowEnd =
    gpu.type === "WEBGL_UNSUPPORTED" ||
    gpu.type === "BLOCKLISTED" ||
    gpu.type === "FALLBACK" ||
    gpu.tier <= 1;

  const shouldRenderWebGL = mounted && !isLowEnd && !reducedMotion;

  const [palette, setPalette] = React.useState(() => ({
    a: [33, 132, 255] as [number, number, number],
    b: [255, 74, 141] as [number, number, number],
    c: [255, 196, 61] as [number, number, number],
  }));

  React.useEffect(() => {
    const a = readCssRgbVar("--shader-a", palette.a);
    const b = readCssRgbVar("--shader-b", palette.b);
    const c = readCssRgbVar("--shader-c", palette.c);
    setPalette({ a, b, c });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* CSS fallback / base layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: [
            "radial-gradient(70% 60% at 15% 10%, rgb(var(--shader-b) / 0.40) 0%, transparent 60%)",
            "radial-gradient(65% 55% at 85% 18%, rgb(var(--shader-a) / 0.34) 0%, transparent 58%)",
            "radial-gradient(75% 70% at 55% 92%, rgb(var(--shader-c) / 0.28) 0%, transparent 62%)",
          ].join(", "),
        }}
      />

      {shouldRenderWebGL && (
        <Canvas
          dpr={[1, 1.5]}
          frameloop="always"
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <FluidPlane frozen={false} palette={palette} />
        </Canvas>
      )}
    </div>
  );
}
