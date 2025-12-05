
import * as THREE from 'three';

// -- GLSL UTILS --
const glslNoise = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;
  
  uniform float uTime;
  uniform float uDistortion;
  
  ${glslNoise}

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // OSCILLATOR DISPLACEMENT (Synth Vibe)
    // Create a wave moving up the object
    float wave = sin(position.y * 3.0 - uTime * 2.0);
    
    // Create "digital noise" patches
    float noiseVal = snoise(position.xy * 2.0 + uTime * 0.5);
    
    // Combine for epitaxial growth look
    float displacement = (wave * 0.1 + noiseVal * 0.2) * uDistortion;
    vDisplacement = displacement;

    vec3 newPos = position + normal * displacement;
    
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vDisplacement;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uDistortion;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // 1. FRESNEL (Rim Light)
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 2.5); // Sharper rim

    // 2. SYNTH GRID (Holographic Scanlines)
    // Create horizontal scanlines
    float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.5 + 0.5;
    // Create vertical glitch lines
    float glitch = step(0.98, sin(vUv.x * 20.0 + uTime));
    
    // 3. COLOR SYNTHESIS (Chromatic Aberration feel)
    vec3 colorBase = mix(uColorA, uColorB, vUv.y);
    
    // Add "hot" spots where displacement is high
    vec3 hotColor = vec3(1.0, 0.9, 0.5); // Gold/White heat
    vec3 finalColor = mix(colorBase, hotColor, smoothstep(0.1, 0.3, vDisplacement));

    // Apply Fresnel Glow (Cyan/Magenta shift)
    vec3 rimColor = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), sin(uTime));
    finalColor += rimColor * fresnel * 2.0;

    // Apply Scanlines (Grid) - darken slightly
    finalColor *= (0.8 + 0.2 * scanline);
    
    // Apply Glitch Additive
    finalColor += vec3(1.0) * glitch * uDistortion * 0.5;

    // Holographic transparency alpha
    float alpha = 0.6 + fresnel * 0.4;
    
    // Distance fade at edges to look like a hologram projection
    alpha *= smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export class HoloMaterial extends THREE.ShaderMaterial {
  // Explicitly declare uniforms for TypeScript access
  declare uniforms: { [uniform: string]: THREE.IUniform };

  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#1a103c') }, // Deep Mystic
        uColorB: { value: new THREE.Color('#a5f3fc') }, // Crystal Cyan
        uDistortion: { value: 0.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, // "Hologram" feel
      depthWrite: false, // Prevents z-fighting for transparent internal faces
    });
  }
}

// Module augmentation for @react-three/fiber replaced with Global JSX augmentation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      holoMaterial: any;
    }
  }
}
