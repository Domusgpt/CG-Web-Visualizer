
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HoloMaterial } from './HoloShader';

// Register material globally
extend({ HoloMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      holoMaterial: any;
    }
  }
}

interface SceneProps {
  scrollProgress: number; // 0 to 1
  expandedSection: string | null;
}

const MorphingCrystal: React.FC<{ progress: number; expandedSection: string | null }> = ({ progress, expandedSection }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  // -- GEOMETRIES --
  // Intro: Complex Icosa
  const geomIcosa = useMemo(() => new THREE.IcosahedronGeometry(1.5, 2), []);
  // ID: Sharp Octahedron
  const geomOcta = useMemo(() => new THREE.OctahedronGeometry(1.5, 0), []); 
  // Journal: Box (Cube) - Represents the "Book" or "Collection"
  const geomBox = useMemo(() => {
    const g = new THREE.BoxGeometry(2, 2.5, 0.5, 10, 10, 2);
    // Add some noise to vertices to make it look organic? No, keep it digital.
    return g;
  }, []);
  // Guru: Sphere
  const geomSphere = useMemo(() => new THREE.SphereGeometry(1.5, 64, 64), []); 
  // Moon: Icosahedron (High res)
  const geomMoon = useMemo(() => new THREE.IcosahedronGeometry(1.5, 10), []);
  // Healing: Torus Knot
  const geomTorus = useMemo(() => new THREE.TorusKnotGeometry(1, 0.35, 150, 32), []); 
  // Market: Cylinder (Pillar)
  const geomCylinder = useMemo(() => new THREE.CylinderGeometry(0.8, 0.8, 3.5, 6, 20), []);

  // -- WIREFRAMES (Low Poly) --
  const wireIcosa = useMemo(() => new THREE.IcosahedronGeometry(1.6, 1), []);
  const wireOcta = useMemo(() => new THREE.OctahedronGeometry(1.6, 0), []);
  const wireBox = useMemo(() => new THREE.BoxGeometry(2.1, 2.6, 0.6, 2, 2, 1), []);
  const wireSphere = useMemo(() => new THREE.SphereGeometry(1.6, 12, 12), []);
  const wireTorus = useMemo(() => new THREE.TorusKnotGeometry(1.1, 0.4, 64, 8), []);
  const wireCylinder = useMemo(() => new THREE.CylinderGeometry(0.9, 0.9, 3.6, 6, 4), []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current || !materialRef.current.uniforms) return;

    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    
    // Rotation
    // If expanded, rotate slower
    const rotSpeed = expandedSection ? 0.05 : (0.2 + progress * 0.5);
    meshRef.current.rotation.y += 0.01; // Continuous spin
    meshRef.current.rotation.y = time * rotSpeed;
    meshRef.current.rotation.x = expandedSection 
        ? THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.05) 
        : (progress * Math.PI + Math.sin(time * 0.5) * 0.1);

    if (wireframeRef.current) {
        wireframeRef.current.rotation.copy(meshRef.current.rotation);
    }

    // -- SECTIONS LOGIC --
    // We map progress ranges to shapes and colors
    // 0.0 - 0.12: Intro
    // 0.12 - 0.23: ID (Octa - Cyan)
    // 0.25 - 0.36: Journal (Box - Indigo)
    // 0.38 - 0.49: Guru (Sphere - Accent/Purple)
    // 0.51 - 0.62: Moon (Moon - White)
    // 0.64 - 0.75: Healing (Torus - Gold)
    // 0.77 - 0.88: Market (Cylinder - Emerald)
    
    let targetGeom: THREE.BufferGeometry = geomIcosa;
    let targetWire: THREE.BufferGeometry = wireIcosa;
    let colorHexA = '#1a103c'; // Mystic
    let colorHexB = '#a5f3fc'; // Crystal
    let distortionBase = 0.2;

    if (progress < 0.12) {
       // Intro
       targetGeom = geomIcosa; targetWire = wireIcosa;
       distortionBase = 2.0 * (1-progress*8); // High distortion at very start
    } else if (progress < 0.24) {
       // ID
       targetGeom = geomOcta; targetWire = wireOcta;
       colorHexA = '#020204'; colorHexB = '#a5f3fc'; // Cyan
       distortionBase = 0.8;
    } else if (progress < 0.37) {
       // Journal
       targetGeom = geomBox; targetWire = wireBox;
       colorHexA = '#1e1b4b'; colorHexB = '#818cf8'; // Indigo
       distortionBase = 0.1;
    } else if (progress < 0.50) {
       // Guru
       targetGeom = geomSphere; targetWire = wireSphere;
       colorHexA = '#2e0236'; colorHexB = '#d8b4fe'; // Purple
       distortionBase = 0.3;
    } else if (progress < 0.63) {
       // Moon
       targetGeom = geomMoon; targetWire = wireSphere; // Use sphere wire for moon
       colorHexA = '#111827'; colorHexB = '#f3f4f6'; // White/Silver
       distortionBase = 0.05; // Very clean
    } else if (progress < 0.76) {
       // Healing
       targetGeom = geomTorus; targetWire = wireTorus;
       colorHexA = '#451a03'; colorHexB = '#fbbf24'; // Amber/Gold
       distortionBase = 1.0 + Math.sin(time * 8) * 0.1; // Vibrating
    } else if (progress < 0.89) {
       // Market
       targetGeom = geomCylinder; targetWire = wireCylinder;
       colorHexA = '#064e3b'; colorHexB = '#34d399'; // Emerald
       distortionBase = 0.4;
    } else {
       // Outro
       targetGeom = geomIcosa; targetWire = wireIcosa;
       colorHexA = '#000000'; colorHexB = '#ffffff';
       distortionBase = 2.0;
    }

    // IF EXPANDED: Override Uniforms for "Focus Mode"
    if (expandedSection) {
        distortionBase = 0.02; // Super clean when reading
        // Colors might shift slightly to be brighter/darker? Keep them for identity.
    }

    // Lerp Colors
    const cA = new THREE.Color(colorHexA);
    const cB = new THREE.Color(colorHexB);
    
    if (materialRef.current.uniforms.uColorA.value) materialRef.current.uniforms.uColorA.value.lerp(cA, 0.05);
    if (materialRef.current.uniforms.uColorB.value) materialRef.current.uniforms.uColorB.value.lerp(cB, 0.05);
    
    // Lerp Distortion
    // Add a "pop" when expansion changes
    const currentDist = materialRef.current.uniforms.uDistortion.value;
    materialRef.current.uniforms.uDistortion.value = THREE.MathUtils.lerp(currentDist, distortionBase, 0.1);

    // Swap Geometry
    if (meshRef.current.geometry !== targetGeom) {
       meshRef.current.geometry = targetGeom;
    }
    if (wireframeRef.current && wireframeRef.current.geometry !== targetWire) {
        wireframeRef.current.geometry = targetWire;
    }
  });

  return (
    <group>
        <mesh ref={meshRef} scale={1.2}>
            <primitive object={geomIcosa} attach="geometry" />
            <holoMaterial ref={materialRef} />
        </mesh>
        
        <mesh ref={wireframeRef} scale={1.25}>
            <primitive object={wireIcosa} attach="geometry" />
            <meshBasicMaterial 
                color="#ffffff" 
                wireframe 
                transparent 
                opacity={0.05} 
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    </group>
  );
};

// Controls the Camera movement based on state
const CameraController: React.FC<{ expandedSection: string | null }> = ({ expandedSection }) => {
    const { camera } = useThree();
    const vec = new THREE.Vector3();

    useFrame((state) => {
        // Default position: [0, 0, 6]
        // Expanded position: [3, 0, 9] (Pan right, zoom out) to make room for content on left
        // Or alternate based on section? For now, let's just create space on the side.
        
        let targetPos = new THREE.Vector3(0, 0, 6);
        let targetLookAt = new THREE.Vector3(0, 0, 0);

        if (expandedSection) {
            // Check alignment. 
            // In App.tsx: ID(Left), Journal(Right), Guru(Left), Moon(Right)...
            // If Text is Left, Image is Right. We want Crystal to move to Image side? 
            // Actually, expanded view covers whole screen. 
            // Let's move crystal to the far right [4, 0, 8] so text can be on left.
            targetPos.set(4, 0, 9);
            targetLookAt.set(2, 0, 0);
        }

        // Smooth Camera Move
        camera.position.lerp(targetPos, 0.05);
        // We can't easily lerp lookAt directly on the camera object without updating matrices manually 
        // or using OrbitControls target. 
        // Simple "look slightly off center" approach:
        const currentLook = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion).add(camera.position);
        const nextLook = currentLook.lerp(targetLookAt, 0.05);
        camera.lookAt(nextLook);
    });

    return null;
}

const Particles: React.FC<{ progress: number }> = ({ progress }) => {
   const groupRef = useRef<THREE.Group>(null);
   useFrame((state) => {
     if (groupRef.current) {
       groupRef.current.rotation.y = -state.clock.getElapsedTime() * 0.05;
       const scale = 1 + progress * 2;
       groupRef.current.scale.setScalar(scale);
     }
   });
   const particlesData = useMemo(() => {
     const temp = [];
     for(let i=0; i<150; i++) {
        temp.push({
            x: (Math.random() - 0.5) * 25,
            y: (Math.random() - 0.5) * 25,
            z: (Math.random() - 0.5) * 15,
            size: Math.random() * 0.06,
            key: i
        });
     }
     return temp;
   }, []);

   return (
    <group ref={groupRef}>
        {particlesData.map(p => (
            <mesh key={p.key} position={[p.x, p.y, p.z]}>
                <icosahedronGeometry args={[p.size, 0]} />
                <meshBasicMaterial color="#a5f3fc" transparent opacity={0.3} blending={THREE.AdditiveBlending}/>
            </mesh>
        ))}
    </group>
   );
};

const Scene: React.FC<SceneProps> = ({ scrollProgress, expandedSection }) => {
  return (
    <>
      <CameraController expandedSection={expandedSection} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a5f3fc" />
      <MorphingCrystal progress={scrollProgress} expandedSection={expandedSection} />
      <Particles progress={scrollProgress} />
    </>
  );
};

export default Scene;
