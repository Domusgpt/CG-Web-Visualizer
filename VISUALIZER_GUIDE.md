# Crystal Grimoire Visualizer Architecture

This guide explains the technical implementation of the holographic visualizer, the "Bombastic" title transition, and the React Three Fiber (R3F) integration. It is designed to help you refactor or expand this system for other projects.

## 1. Core Architecture: The Hybrid Loop

The application does not use a standard scroll. Instead, it uses a **Virtual Scroll** system driven by **GSAP ScrollTrigger**.

| Component | Responsibility |
|-----------|----------------|
| **HTML/DOM** | Renders the text overlays (`ExpandedSection`) and the Header. |
| **Canvas (R3F)** | Renders the 3D scene (`Scene.tsx`) in a fixed background layer. |
| **State Bridge** | `App.tsx` acts as the bridge. It captures the scroll `progress` (0.0 to 1.0) and passes it to the 3D Scene. |

### The "Bombastic" Title Logic
In `App.tsx`, we calculate a specific animation curve for the header based on the first 10% of the scroll (`progress * 10`).

```typescript
// App.tsx
const titleProgress = Math.min(progress * 10, 1); // 0 -> 1 normalized
const titleScale = 4 - (3 * titleProgress);       // Starts at 4x scale, shrinks to 1x
const titleTop = 50 - (48 * titleProgress);       // Starts at 50% (Center), moves to ~2% (Top)
```
This allows the title to seamlessly transform from a cinematic intro to a standard UI header without React mounting/unmounting components.

---

## 2. The Holographic Shader (`HoloShader.tsx`)

The visual style comes from a custom `ShaderMaterial`. It is NOT a standard Three.js material (like `MeshStandardMaterial`).

### Vertex Shader (Shape Manipulation)
We displace vertices in real-time to create the "Liquid/Organic" growth effect.
*   **Oscillators**: `sin(position.y * 3.0 - uTime)` creates the rising wave.
*   **Noise**: `snoise(position)` adds the gritty, digital texture.
*   **Expansion**: The `uDistortion` uniform (controlled by React) pushes vertices outward during state changes.

### Fragment Shader (Color & Light)
*   **Fresnel Effect**: `dot(viewDir, normal)` makes the edges glow, creating the "ghostly" hologram look.
*   **Scanlines**: `sin(vUv.y * 100.0)` creates the TV-like horizontal lines.
*   **Chromatic Aberration**: We mix `uColorA` and `uColorB` based on height, but add "Hot Spots" (White/Gold) where the vertex displacement is highest.

---

## 3. The Scene Logic (`Scene.tsx`)

The `MorphingCrystal` component handles the 3D transformations.

### Geometry Swapping
To support disparate shapes (Cube -> Sphere -> Torus) without complex vertex mapping, we use **Geometry Swapping**:
```typescript
// Scene.tsx
if (progress < 0.24) {
   targetGeom = geomOcta; // Raw Crystal
} else if (progress < 0.37) {
   targetGeom = geomBox;  // Journal
}
```
Three.js handles geometry swaps efficiently if the geometries are pre-allocated using `useMemo`.

### Smooth Transitions (Lerp)
We use `useFrame` to interpolate values, ensuring the animation is smooth even if the user scrolls quickly.
```typescript
// Smoothly transition the Color uniform
material.uniforms.uColorA.value.lerp(targetColor, 0.05);

// Smoothly transition the Distortion (Glitch effect)
material.uniforms.uDistortion.value = THREE.MathUtils.lerp(current, target, 0.1);
```

---

## 4. Expanding/Refactoring Guide

### How to use in another project
1.  **Copy Files**: You need `HoloShader.tsx` and `Scene.tsx`.
2.  **Dependencies**: Install `three`, `@react-three/fiber`, `gsap`.
3.  **Setup Canvas**:
    ```jsx
    <Canvas>
       <Scene scrollProgress={myScrollValue} expandedSection={null} />
    </Canvas>
    ```

### How to add a new Section
1.  **Update `App.tsx`**: Add your section data to the `SECTIONS` object.
    ```typescript
    NEW_SECTION: { id: 'NEW', color: 'text-pink-500', ... }
    ```
2.  **Update `Scene.tsx`**:
    *   Create a new geometry: `const geomNew = useMemo(() => new THREE.ConeGeometry(...), [])`
    *   Add a logic branch in `useFrame`:
        ```typescript
        else if (progress < 0.95) {
           targetGeom = geomNew;
           colorHexA = '#ff00ff';
        }
        ```

### How to change the "Vibe"
*   **Cyberpunk**: In `HoloShader.tsx`, increase `scanline` intensity and use Neon colors.
*   **Organic**: In `HoloShader.tsx`, reduce `uTime` speed and use softer Noise functions.
*   **Glass**: Enable `depthWrite: true` (with care) or increase opacity calculation.

## 5. Troubleshooting
*   **"R3F: HoloMaterial is not part of the THREE namespace"**: Ensure you call `extend({ HoloMaterial })` in your Scene file.
*   **Performance**: If FPS drops, reduce the segment count in geometries (e.g., `SphereGeometry(1, 32, 32)` instead of `64, 64`).
