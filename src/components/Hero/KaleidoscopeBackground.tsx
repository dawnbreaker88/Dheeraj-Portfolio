import { useRef } from 'react'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { MousePosition } from '../../hooks/useMousePosition'

// Custom Shader Material definition for Liquid Noise Flow
class LiquidFlowMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        varying vec2 vUv;

        // Visual noise generator for fluid waves
        float noise(in vec2 p) {
          return sin(p.x) * sin(p.y);
        }

        // Fractional Brownian Motion for liquid distortion
        float fbm(in vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          // Rotate to reduce axial bias
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 4; ++i) {
            v += a * noise(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / uResolution.y;
          vec2 p = (uv - 0.5) * 2.0;
          p.x *= aspect;

          // Gentle mouse coordinates displacement
          vec2 mouseDisplace = (uMouse - 0.5) * 0.15;
          p -= mouseDisplace;

          // Slow organic liquid coordinate warping (domain warping)
          float slowTime = uTime * 0.08;
          
          vec2 q = vec2(
            fbm(p + vec2(0.0, 0.0) + slowTime * 0.5),
            fbm(p + vec2(5.2, 1.3) + slowTime * 0.3)
          );

          vec2 r = vec2(
            fbm(p + 4.0 * q + vec2(1.7, 9.2) + slowTime * 0.15),
            fbm(p + 4.0 * q + vec2(8.3, 2.8) + slowTime * 0.25)
          );

          float f = fbm(p + 4.0 * r);

          // Liquid theme color mapping
          vec3 baseBg = vec3(0.03, 0.03, 0.04);             // Deep midnight black/gray
          vec3 redGlow = vec3(0.45, 0.06, 0.10);             // Sleek dark crimson
          vec3 redAccent = vec3(0.98, 0.18, 0.25);           // Signature cinematic red (#ff334b)
          vec3 warmAccent = vec3(0.75, 0.10, 0.15);          // Deep ruby

          // Mix colors based on noise flow fields
          vec3 color = mix(baseBg, redGlow, clamp(f * 2.2, 0.0, 1.0));
          color = mix(color, redAccent, clamp(length(q), 0.0, 1.0) * 0.35);
          color = mix(color, warmAccent, clamp(length(r.x), 0.0, 1.0) * 0.12);

          // Subtle contrast and brightness boost
          color = pow(color, vec3(0.85)) * 1.15;

          // Vignette fade towards edges to bleed into background black
          float dist = length((uv - 0.5) * 2.0);
          float vignette = smoothstep(1.4, 0.4, dist);
          color *= vignette;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })
  }
}

// Extend to make custom element available in JSX
extend({ LiquidFlowMaterial })

// Declare type for TypeScript compiler
declare global {
  namespace JSX {
    interface IntrinsicElements {
      liquidFlowMaterial: any
    }
  }
}

interface KaleidoscopeProps {
  mousePosition: React.RefObject<MousePosition>
}

export default function KaleidoscopeBackground({ mousePosition }: KaleidoscopeProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (!materialRef.current) return
    
    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    
    const mx = mousePosition.current?.x ?? 0.5
    const my = mousePosition.current?.y ?? 0.5
    materialRef.current.uniforms.uMouse.value.set(mx, my)

    const { width, height } = state.size
    materialRef.current.uniforms.uResolution.value.set(width, height)
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <liquidFlowMaterial ref={materialRef} />
    </mesh>
  )
}
