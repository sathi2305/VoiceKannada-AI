import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  Mic,
  Sparkles as SparklesIcon,
  Volume2,
  UserCheck,
  AlertCircle,
  Eye,
  Camera,
  RotateCw,
  Maximize2,
  Activity,
  Check,
  Compass,
  Play
} from 'lucide-react';

export type TutorState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'teaching'
  | 'waving'
  | 'walking'
  | 'success'
  | 'error';

export type CameraViewPreset = 'full' | 'upper' | 'face';

interface RealisticHumanTutor3DProps {
  state?: TutorState | 'processing' | 'blocked';
  size?: number | string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showStatusLabel?: boolean;
  showCameraControls?: boolean;
  showActionControls?: boolean;
  customGlbUrl?: string;
  audioLevel?: number; // 0 to 1 for speech viseme amplitude
  onStateChange?: (state: TutorState) => void;
}

// Procedural Canvas Texture for realistic eye iris with radiating striations
function createIrisTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 128;
    const cy = 128;

    // Dark outer limbal ring
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, 256, 256);

    // Warm deep hazel/amber iris gradient
    const grad = ctx.createRadialGradient(cx, cy, 18, cx, cy, 118);
    grad.addColorStop(0, '#1c0f05');
    grad.addColorStop(0.3, '#4a2810');
    grad.addColorStop(0.65, '#6a3e1c');
    grad.addColorStop(0.9, '#261307');
    grad.addColorStop(1, '#0c0703');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 118, 0, Math.PI * 2);
    ctx.fill();

    // Iris radiating striations
    ctx.strokeStyle = 'rgba(220, 170, 100, 0.28)';
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 90; i++) {
      const angle = (i * Math.PI) / 45;
      const r1 = 28 + (i % 5) * 4;
      const r2 = 114 - (i % 7) * 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
      ctx.stroke();
    }

    // Deep pupil
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fill();

    // Specular corneal glint
    const specGrad = ctx.createRadialGradient(cx - 22, cy - 22, 2, cx - 22, cy - 22, 16);
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    specGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.arc(cx - 22, cy - 22, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Canvas Texture for midnight navy Kurta fabric weave
function createKurtaFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#07182b';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = 'rgba(14, 38, 66, 0.55)';
    for (let x = 0; x < 256; x += 4) {
      ctx.fillRect(x, 0, 2, 256);
    }
    ctx.fillStyle = 'rgba(5, 18, 34, 0.4)';
    for (let y = 0; y < 256; y += 4) {
      ctx.fillRect(0, y, 256, 2);
    }

    ctx.fillStyle = 'rgba(0, 230, 160, 0.04)';
    for (let i = 0; i < 350; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Canvas Texture for Trouser / Churidar fabric
function createTrouserFabricTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#040d18';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let y = 0; y < 128; y += 2) {
      ctx.fillRect(0, y, 128, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Floating Kannada characters in 3D
function createKannadaBillboardTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 128);
    ctx.font = 'bold 56px "Tiro Kannada", "Noto Sans Kannada", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#F1F7FF';
    ctx.fillText(text, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// =========================================================================
// CAMERA RIG MANAGER: Smooth Transitions Between Full-Body, Upper & Face
// =========================================================================
interface CameraRigProps {
  viewPreset: CameraViewPreset;
}

const CameraRig: React.FC<CameraRigProps> = ({ viewPreset }) => {
  const { camera } = useThree();

  const cameraTargets = useMemo(
    () => ({
      full: { pos: new THREE.Vector3(0, 0.82, 2.75), look: new THREE.Vector3(0, 0.8, 0) },
      upper: { pos: new THREE.Vector3(0, 1.2, 1.5), look: new THREE.Vector3(0, 1.2, 0) },
      face: { pos: new THREE.Vector3(0, 1.45, 0.82), look: new THREE.Vector3(0, 1.45, 0) }
    }),
    []
  );

  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.8, 0));

  useFrame((_, delta) => {
    const target = cameraTargets[viewPreset];
    const dampSpeed = 4.5;
    camera.position.lerp(target.pos, Math.min(1, delta * dampSpeed));
    currentLookAt.current.lerp(target.look, Math.min(1, delta * dampSpeed));
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

// =========================================================================
// COMPLETE FULL-BODY HUMAN 3D CHARACTER (HEAD TO TOE)
// =========================================================================
interface FullBodyHumanProps {
  tutorState: TutorState;
  audioLevel: number;
}

const FullBodyHumanCharacter: React.FC<FullBodyHumanProps> = ({ tutorState, audioLevel }) => {
  // Skeletal & Anatomy Node References
  const characterRootRef = useRef<THREE.Group>(null);
  const spineGroupRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const jawMeshRef = useRef<THREE.Mesh>(null);

  // Left Arm Chain
  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftUpperArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);

  // Right Arm Chain
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightUpperArmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  // Left Leg Chain
  const leftThighRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Group>(null);

  // Right Leg Chain
  const rightThighRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);
  const rightFootRef = useRef<THREE.Group>(null);

  // Procedural Textures & Materials
  const irisTexture = useMemo(() => createIrisTexture(), []);
  const kurtaTexture = useMemo(() => createKurtaFabricTexture(), []);
  const trouserTexture = useMemo(() => createTrouserFabricTexture(), []);

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xdfab8a,
        roughness: 0.6,
        metalness: 0.05
      }),
    []
  );

  const hairMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181412,
        roughness: 0.42,
        metalness: 0.15
      }),
    []
  );

  const kurtaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x071d32,
        roughness: 0.68,
        metalness: 0.12,
        map: kurtaTexture
      }),
    [kurtaTexture]
  );

  const trouserMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x051322,
        roughness: 0.75,
        metalness: 0.08,
        map: trouserTexture
      }),
    [trouserTexture]
  );

  const shoeLeatherMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1a0f0a,
        roughness: 0.32,
        metalness: 0.35
      }),
    []
  );

  const emeraldSilkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00e6a0,
        roughness: 0.35,
        metalness: 0.45,
        emissive: 0x004828,
        emissiveIntensity: 0.35
      }),
    []
  );

  const goldTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.88
      }),
    []
  );

  const eyeScleraMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf5f7fb,
        roughness: 0.2,
        metalness: 0.02
      }),
    []
  );

  const irisMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: irisTexture,
        roughness: 0.15,
        metalness: 0.05
      }),
    [irisTexture]
  );

  const lipMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xb96561,
        roughness: 0.48,
        metalness: 0.02
      }),
    []
  );

  // Head Geometry
  const faceGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.24, 32, 32);
    geo.scale(0.92, 1.14, 1.05);
    return geo;
  }, []);

  // Synchronous Face Mesh Instance
  const faceMesh = useMemo(() => {
    const mesh = new THREE.Mesh(faceGeometry, skinMaterial);
    mesh.position.set(0, 0.12, 0);
    mesh.castShadow = true;
    return mesh;
  }, [faceGeometry, skinMaterial]);

  // Animation States & Kinematics
  const blinkState = useRef({ timer: 0, nextBlink: 3.2, isBlinking: false, progress: 0 });
  const speechPhase = useRef(0);
  const walkPhase = useRef(0);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.1);

    // =========================================================================
    // 1. Natural Idle Breathing & Spinal Posture
    // =========================================================================
    if (spineGroupRef.current) {
      const breath = Math.sin(elapsed * 2.2) * 0.012;
      spineGroupRef.current.scale.set(1 + breath * 0.3, 1 + breath, 1 + breath * 0.4);

      // Subtle weight shifting sway
      if (tutorState !== 'walking') {
        const bodySway = Math.sin(elapsed * 0.8) * 0.02;
        spineGroupRef.current.rotation.z = bodySway;
      }
    }

    // =========================================================================
    // 2. Head Tracking & Gaze
    // =========================================================================
    if (headGroupRef.current) {
      const pointer = state.pointer; // normalized [-1, 1]
      let targetRotX = -pointer.y * 0.22;
      let targetRotY = pointer.x * 0.32;
      let targetRotZ = 0;

      if (tutorState === 'listening') {
        targetRotX += 0.08;
        targetRotZ += 0.06;
      } else if (tutorState === 'thinking') {
        targetRotX -= 0.14;
        targetRotY += 0.18;
      } else if (tutorState === 'speaking') {
        targetRotX += Math.sin(elapsed * 6.5) * 0.035;
        targetRotY += Math.cos(elapsed * 3.2) * 0.025;
      } else if (tutorState === 'teaching') {
        targetRotY -= 0.15;
      } else if (tutorState === 'success') {
        targetRotX += 0.1;
      } else if (tutorState === 'error') {
        targetRotZ -= 0.1;
      }

      headGroupRef.current.rotation.x = THREE.MathUtils.damp(headGroupRef.current.rotation.x, targetRotX, 5, clampedDelta);
      headGroupRef.current.rotation.y = THREE.MathUtils.damp(headGroupRef.current.rotation.y, targetRotY, 5, clampedDelta);
      headGroupRef.current.rotation.z = THREE.MathUtils.damp(headGroupRef.current.rotation.z, targetRotZ, 5, clampedDelta);
    }

    // =========================================================================
    // 3. Speech Lip Sync & Jaw Movement
    // =========================================================================
    if (jawMeshRef.current) {
      if (tutorState === 'speaking' || audioLevel > 0.05) {
        speechPhase.current += clampedDelta * 14;
        const visemeWave = Math.sin(speechPhase.current) * 0.5 + 0.5;
        const jawOpen = (visemeWave * 0.03 + audioLevel * 0.035);
        jawMeshRef.current.position.y = -0.012 - jawOpen;
      } else {
        jawMeshRef.current.position.y = THREE.MathUtils.damp(jawMeshRef.current.position.y, -0.012, 10, clampedDelta);
      }
    }

    // =========================================================================
    // 4. Full-Body Arm & Hand Gestures
    // =========================================================================
    if (
      leftUpperArmRef.current &&
      rightUpperArmRef.current &&
      leftForearmRef.current &&
      rightForearmRef.current
    ) {
      if (tutorState === 'success') {
        // Namaskara folded palms salutation at chest level
        leftUpperArmRef.current.rotation.set(-0.7, 0, 0.65);
        rightUpperArmRef.current.rotation.set(-0.7, 0, -0.65);
        leftForearmRef.current.rotation.set(0, 0.9, 0);
        rightForearmRef.current.rotation.set(0, -0.9, 0);
      } else if (tutorState === 'teaching') {
        // Right arm extended pointing toward content on the right, left hand open welcomingly
        rightUpperArmRef.current.rotation.set(-0.4, -0.3, -0.85);
        rightForearmRef.current.rotation.set(0, 0.4, 0);
        leftUpperArmRef.current.rotation.set(0.1, 0, 0.35);
        leftForearmRef.current.rotation.set(0.3, 0, 0);
      } else if (tutorState === 'waving') {
        // Right hand raised waving hello
        const waveAngle = Math.sin(elapsed * 7) * 0.35;
        rightUpperArmRef.current.rotation.set(-1.2, 0, -0.8);
        rightForearmRef.current.rotation.set(0.4, 0, waveAngle);
        leftUpperArmRef.current.rotation.set(0, 0, 0.15);
      } else if (tutorState === 'thinking') {
        // Right hand raised to chin/temple in thoughtful contemplation
        rightUpperArmRef.current.rotation.set(-1.1, 0.2, -0.45);
        rightForearmRef.current.rotation.set(0.7, 0.8, 0);
        leftUpperArmRef.current.rotation.set(0.2, 0, 0.25);
        leftForearmRef.current.rotation.set(0.4, 0, 0);
      } else if (tutorState === 'speaking') {
        // Expressive open conversational hand gestures
        const speakSway = Math.sin(elapsed * 3.5) * 0.12;
        leftUpperArmRef.current.rotation.set(0.2 + speakSway, 0, 0.3);
        rightUpperArmRef.current.rotation.set(0.2 - speakSway, 0, -0.3);
        leftForearmRef.current.rotation.set(0.5, 0, 0);
        rightForearmRef.current.rotation.set(0.5, 0, 0);
      } else if (tutorState === 'listening') {
        // Attentive forward posture with hands gently clasped in front
        leftUpperArmRef.current.rotation.set(0.3, 0, 0.25);
        rightUpperArmRef.current.rotation.set(0.3, 0, -0.25);
        leftForearmRef.current.rotation.set(0.6, 0.3, 0);
        rightForearmRef.current.rotation.set(0.6, -0.3, 0);
      } else if (tutorState === 'walking') {
        // Natural arm swing opposing leg strides
        const stride = Math.sin(walkPhase.current) * 0.4;
        leftUpperArmRef.current.rotation.set(stride, 0, 0.18);
        rightUpperArmRef.current.rotation.set(-stride, 0, -0.18);
        leftForearmRef.current.rotation.set(0.25, 0, 0);
        rightForearmRef.current.rotation.set(0.25, 0, 0);
      } else {
        // Default Natural Standing Idle Pose
        leftUpperArmRef.current.rotation.set(0, 0, 0.16);
        rightUpperArmRef.current.rotation.set(0, 0, -0.16);
        leftForearmRef.current.rotation.set(0.18, 0, 0);
        rightForearmRef.current.rotation.set(0.18, 0, 0);
      }
    }

    // =========================================================================
    // 5. Full-Body Leg & Locomotion Kinematics (Walking & Standing)
    // =========================================================================
    if (
      leftThighRef.current &&
      rightThighRef.current &&
      leftShinRef.current &&
      rightShinRef.current
    ) {
      if (tutorState === 'walking') {
        walkPhase.current += clampedDelta * 4.5;
        const legSwing = Math.sin(walkPhase.current) * 0.45;

        // Left Leg Stride
        leftThighRef.current.rotation.x = -legSwing;
        leftShinRef.current.rotation.x = legSwing > 0 ? legSwing * 0.8 : 0.05;

        // Right Leg Stride (opposing phase)
        rightThighRef.current.rotation.x = legSwing;
        rightShinRef.current.rotation.x = legSwing < 0 ? -legSwing * 0.8 : 0.05;

        // Vertical hip bounce during walk cycle
        if (characterRootRef.current) {
          characterRootRef.current.position.y = Math.abs(Math.sin(walkPhase.current * 2)) * 0.03;
        }
      } else {
        // Standing Grounded Pose: Natural stable stance with slight knee ease
        leftThighRef.current.rotation.set(0, 0, 0.04);
        rightThighRef.current.rotation.set(0, 0, -0.04);
        leftShinRef.current.rotation.set(0.02, 0, 0);
        rightShinRef.current.rotation.set(0.02, 0, 0);

        if (characterRootRef.current) {
          characterRootRef.current.position.y = 0;
        }
      }
    }
  });

  return (
    <group ref={characterRootRef} scale={0.8} position={[0, 0, 0]}>
      {/* =====================================================================
          LOWER BODY: Hips, Thighs, Knees, Calves, Ankles, Feet & Shoes
          Ground level at y = 0
         ===================================================================== */}
      <group position={[0, 0.92, 0]}>
        {/* Pelvis / Waist Band */}
        <mesh position={[0, 0.04, 0]} material={kurtaMaterial}>
          <cylinderGeometry args={[0.26, 0.28, 0.16, 20]} />
        </mesh>
        <mesh position={[0, 0.09, 0]} material={emeraldSilkMaterial}>
          <cylinderGeometry args={[0.27, 0.27, 0.05, 20]} />
        </mesh>

        {/* Kurta Lower Skirt / Drape (extends down toward the knees at y = 0.55) */}
        <mesh position={[0, -0.16, 0]} material={kurtaMaterial} castShadow>
          <cylinderGeometry args={[0.28, 0.35, 0.42, 24, 1, true]} />
        </mesh>

        {/* LEFT LEG CHAIN (Hip -> Thigh -> Knee -> Shin -> Ankle -> Shoe) */}
        <group ref={leftThighRef} position={[-0.14, -0.04, 0]}>
          {/* Upper Leg / Thigh (Churidar Trousers) */}
          <mesh position={[0, -0.2, 0]} material={trouserMaterial} castShadow>
            <cylinderGeometry args={[0.11, 0.09, 0.4, 16]} />
          </mesh>

          {/* Left Knee Joint */}
          <group ref={leftShinRef} position={[0, -0.4, 0]}>
            <mesh position={[0, 0, 0]} material={trouserMaterial}>
              <sphereGeometry args={[0.085, 14, 14]} />
            </mesh>

            {/* Lower Leg / Shin / Calf */}
            <mesh position={[0, -0.22, 0]} material={trouserMaterial} castShadow>
              <cylinderGeometry args={[0.085, 0.07, 0.42, 16]} />
            </mesh>

            {/* Left Foot & Leather Shoe / Mojri (sits flush on ground at y = 0) */}
            <group ref={leftFootRef} position={[0, -0.44, 0.04]}>
              {/* Shoe Body */}
              <mesh position={[0, 0.04, 0.06]} material={shoeLeatherMaterial} castShadow receiveShadow>
                <boxGeometry args={[0.11, 0.07, 0.24]} />
              </mesh>
              {/* Pointed Mojri Toe Curve */}
              <mesh position={[0, 0.045, 0.18]} rotation={[0.2, 0, 0]} material={shoeLeatherMaterial}>
                <coneGeometry args={[0.055, 0.08, 12]} />
              </mesh>
              {/* Gold Mojri Buckle / Trim */}
              <mesh position={[0, 0.075, 0.04]} material={goldTrimMaterial}>
                <boxGeometry args={[0.07, 0.015, 0.02]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* RIGHT LEG CHAIN (Hip -> Thigh -> Knee -> Shin -> Ankle -> Shoe) */}
        <group ref={rightThighRef} position={[0.14, -0.04, 0]}>
          {/* Upper Leg / Thigh (Churidar Trousers) */}
          <mesh position={[0, -0.2, 0]} material={trouserMaterial} castShadow>
            <cylinderGeometry args={[0.11, 0.09, 0.4, 16]} />
          </mesh>

          {/* Right Knee Joint */}
          <group ref={rightShinRef} position={[0, -0.4, 0]}>
            <mesh position={[0, 0, 0]} material={trouserMaterial}>
              <sphereGeometry args={[0.085, 14, 14]} />
            </mesh>

            {/* Lower Leg / Shin / Calf */}
            <mesh position={[0, -0.22, 0]} material={trouserMaterial} castShadow>
              <cylinderGeometry args={[0.085, 0.07, 0.42, 16]} />
            </mesh>

            {/* Right Foot & Leather Shoe / Mojri */}
            <group ref={rightFootRef} position={[0, -0.44, 0.04]}>
              <mesh position={[0, 0.04, 0.06]} material={shoeLeatherMaterial} castShadow receiveShadow>
                <boxGeometry args={[0.11, 0.07, 0.24]} />
              </mesh>
              <mesh position={[0, 0.045, 0.18]} rotation={[0.2, 0, 0]} material={shoeLeatherMaterial}>
                <coneGeometry args={[0.055, 0.08, 12]} />
              </mesh>
              <mesh position={[0, 0.075, 0.04]} material={goldTrimMaterial}>
                <boxGeometry args={[0.07, 0.015, 0.02]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* =====================================================================
          UPPER BODY: Torso, Chest, Shoulders, Arms, Hands with Fingers,
          Neck, Head, Face, Eyes, Jaw, Hair
         ===================================================================== */}
      <group ref={spineGroupRef} position={[0, 1.05, 0]}>
        {/* Main Chest & Kurta Jacket */}
        <mesh position={[0, 0.26, 0]} material={kurtaMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.34, 0.28, 0.56, 24]} />
        </mesh>

        {/* Stand-up Mandarin / Nehru Collar */}
        <mesh position={[0, 0.58, 0]} material={emeraldSilkMaterial}>
          <cylinderGeometry args={[0.17, 0.19, 0.11, 24, 1, true]} />
        </mesh>

        {/* Emerald Silk Placket & Brass Buttons */}
        <mesh position={[0, 0.32, 0.24]} material={emeraldSilkMaterial}>
          <boxGeometry args={[0.042, 0.52, 0.015]} />
        </mesh>
        {[0, 1, 2, 3].map((b) => (
          <mesh key={b} position={[0, 0.48 - b * 0.11, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.008, 16]} />
            <meshStandardMaterial color={0xd4af37} roughness={0.2} metalness={0.88} />
          </mesh>
        ))}

        {/* LEFT ARM & HAND WITH ARTICULATED FINGERS */}
        <group ref={leftShoulderRef} position={[-0.42, 0.5, 0]}>
          <mesh material={kurtaMaterial}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>
          <group ref={leftUpperArmRef} position={[0, 0, 0]}>
            <mesh position={[0, -0.17, 0]} material={kurtaMaterial} castShadow>
              <cylinderGeometry args={[0.085, 0.075, 0.34, 16]} />
            </mesh>

            {/* Left Forearm */}
            <group ref={leftForearmRef} position={[0, -0.34, 0]}>
              <mesh position={[0, -0.15, 0]} material={kurtaMaterial} castShadow>
                <cylinderGeometry args={[0.075, 0.065, 0.32, 16]} />
              </mesh>

              {/* Left Hand & Fingers */}
              <group ref={leftHandRef} position={[0, -0.32, 0]}>
                {/* Palm */}
                <mesh position={[0, -0.04, 0]} material={skinMaterial}>
                  <boxGeometry args={[0.075, 0.08, 0.03]} />
                </mesh>
                {/* Thumb */}
                <mesh position={[0.038, -0.02, 0.01]} rotation={[0, 0, -0.5]} material={skinMaterial}>
                  <capsuleGeometry args={[0.01, 0.035, 4, 8]} />
                </mesh>
                {/* 4 Articulated Fingers */}
                {[-0.025, -0.008, 0.009, 0.026].map((fx, fidx) => (
                  <mesh key={fidx} position={[fx, -0.09, 0]} material={skinMaterial}>
                    <capsuleGeometry args={[0.009, 0.04, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>

        {/* RIGHT ARM & HAND WITH ARTICULATED FINGERS */}
        <group ref={rightShoulderRef} position={[0.42, 0.5, 0]}>
          <mesh material={kurtaMaterial}>
            <sphereGeometry args={[0.13, 16, 16]} />
          </mesh>
          <group ref={rightUpperArmRef} position={[0, 0, 0]}>
            <mesh position={[0, -0.17, 0]} material={kurtaMaterial} castShadow>
              <cylinderGeometry args={[0.085, 0.075, 0.34, 16]} />
            </mesh>

            {/* Right Forearm */}
            <group ref={rightForearmRef} position={[0, -0.34, 0]}>
              <mesh position={[0, -0.15, 0]} material={kurtaMaterial} castShadow>
                <cylinderGeometry args={[0.075, 0.065, 0.32, 16]} />
              </mesh>

              {/* Right Hand & Fingers */}
              <group ref={rightHandRef} position={[0, -0.32, 0]}>
                {/* Palm */}
                <mesh position={[0, -0.04, 0]} material={skinMaterial}>
                  <boxGeometry args={[0.075, 0.08, 0.03]} />
                </mesh>
                {/* Thumb */}
                <mesh position={[-0.038, -0.02, 0.01]} rotation={[0, 0, 0.5]} material={skinMaterial}>
                  <capsuleGeometry args={[0.01, 0.035, 4, 8]} />
                </mesh>
                {/* 4 Articulated Fingers (Index, Middle, Ring, Pinky) */}
                {[-0.026, -0.009, 0.008, 0.025].map((fx, fidx) => (
                  <mesh key={fidx} position={[fx, -0.09, 0]} material={skinMaterial}>
                    <capsuleGeometry args={[0.009, 0.04, 4, 8]} />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.62, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.11, 0.13, 0.18, 20]} />
        </mesh>

        {/* HEAD & FACIAL FEATURES */}
        <group ref={headGroupRef} position={[0, 0.78, 0]}>
          {/* Synchronously instantiated Face Mesh */}
          <primitive object={faceMesh} />

          {/* Chin & Jawline Contour */}
          <mesh position={[0, 0.02, 0.08]} rotation={[Math.PI, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.15, 0.22, 16]} />
          </mesh>

          {/* Cheeks */}
          <mesh position={[-0.13, 0.1, 0.14]} scale={[1, 0.8, 0.7]} material={skinMaterial}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>
          <mesh position={[0.13, 0.1, 0.14]} scale={[1, 0.8, 0.7]} material={skinMaterial}>
            <sphereGeometry args={[0.09, 16, 16]} />
          </mesh>

          {/* Nose */}
          <mesh position={[0, 0.12, 0.25]} rotation={[-0.35, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.045, 0.14, 12]} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.23, 0.12, -0.02]} rotation={[0, -0.25, 0]} scale={[0.35, 1.3, 0.8]} material={skinMaterial}>
            <sphereGeometry args={[0.065, 12, 12]} />
          </mesh>
          <mesh position={[0.23, 0.12, -0.02]} rotation={[0, 0.25, 0]} scale={[0.35, 1.3, 0.8]} material={skinMaterial}>
            <sphereGeometry args={[0.065, 12, 12]} />
          </mesh>

          {/* Professional Hairstyling */}
          <mesh position={[0, 0.18, -0.03]} scale={[0.96, 1.1, 1.12]} material={hairMaterial}>
            <sphereGeometry args={[0.255, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.3, 0.14]} rotation={[Math.PI / 2.3, 0, -0.25]} material={hairMaterial}>
            <torusGeometry args={[0.18, 0.065, 12, 24, Math.PI * 0.9]} />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.085, 0.21, 0.22]} rotation={[0, 0, 0.08]} material={hairMaterial}>
            <boxGeometry args={[0.075, 0.016, 0.02]} />
          </mesh>
          <mesh position={[0.085, 0.21, 0.22]} rotation={[0, 0, -0.08]} material={hairMaterial}>
            <boxGeometry args={[0.075, 0.016, 0.02]} />
          </mesh>

          {/* Eye Assemblies (Left & Right) */}
          <group position={[-0.082, 0.145, 0.195]}>
            <mesh material={eyeScleraMaterial}>
              <sphereGeometry args={[0.038, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.035]} material={irisMaterial}>
              <planeGeometry args={[0.042, 0.042]} />
            </mesh>
          </group>

          <group position={[0.082, 0.145, 0.195]}>
            <mesh material={eyeScleraMaterial}>
              <sphereGeometry args={[0.038, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.035]} material={irisMaterial}>
              <planeGeometry args={[0.042, 0.042]} />
            </mesh>
          </group>

          {/* Articulated Lower Lip / Jaw for Speech Audio Lip Sync */}
          <group position={[0, 0.02, 0.22]}>
            <mesh position={[0, 0.01, 0]} material={lipMaterial}>
              <boxGeometry args={[0.09, 0.018, 0.03]} />
            </mesh>
            <mesh ref={jawMeshRef} position={[0, -0.012, 0]} material={lipMaterial}>
              <boxGeometry args={[0.085, 0.022, 0.03]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// OPTIONAL GLB MODEL LOADER (If /avatar.glb or custom model provided)
// =========================================================================
interface GlbAvatarProps {
  url: string;
  tutorState: TutorState;
  audioLevel: number;
}

const GlbAvatarModel: React.FC<GlbAvatarProps> = ({ url, tutorState, audioLevel }) => {
  const { scene } = useGLTF(url);
  const avatarRef = useRef<THREE.Group>(null);
  const morphMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetInfluences) {
          morphMeshRef.current = child as THREE.Mesh;
        }
      });
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (morphMeshRef.current && morphMeshRef.current.morphTargetInfluences) {
      const dict = morphMeshRef.current.morphTargetDictionary || {};
      const inf = morphMeshRef.current.morphTargetInfluences;

      const mouthIdx = dict['mouthOpen'] ?? dict['jawOpen'] ?? dict['viseme_aa'] ?? 0;

      if (tutorState === 'speaking' || audioLevel > 0.05) {
        const wave = Math.sin(state.clock.getElapsedTime() * 14) * 0.5 + 0.5;
        inf[mouthIdx] = THREE.MathUtils.damp(inf[mouthIdx], wave * 0.8, 12, delta);
      } else {
        inf[mouthIdx] = THREE.MathUtils.damp(inf[mouthIdx], 0, 8, delta);
      }
    }
  });

  return (
    <group ref={avatarRef} scale={1.0} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
};

// Floating Kannada Billboards
const FloatingKannadaGlyphs: React.FC = () => {
  const glyphs = useMemo(
    () => [
      { char: 'ಅ', pos: [-1.4, 1.4, -0.6] as [number, number, number], col: '#00E6A0' },
      { char: 'ಆ', pos: [1.3, 1.6, -0.8] as [number, number, number], col: '#00D9FF' },
      { char: 'ಕ', pos: [-1.2, 0.7, -0.4] as [number, number, number], col: '#8257FF' },
      { char: 'ಗ', pos: [1.4, 0.8, -0.5] as [number, number, number], col: '#00E6A0' },
      { char: 'ಧ್ವನಿ', pos: [-0.9, 1.8, -1.0] as [number, number, number], col: '#00D9FF' },
      { char: 'ಕನ್ನಡ', pos: [0.9, 1.9, -1.0] as [number, number, number], col: '#8257FF' }
    ],
    []
  );

  return (
    <>
      {glyphs.map((g, idx) => {
        const tex = createKannadaBillboardTexture(g.char, g.col);
        return (
          <Float key={idx} speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={g.pos}>
              <planeGeometry args={[0.34, 0.34]} />
              <meshBasicMaterial map={tex} transparent opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          </Float>
        );
      })}
    </>
  );
};

// Dynamic Studio Lighting based on state
const DynamicStudioLighting: React.FC<{ tutorState: TutorState }> = ({ tutorState }) => {
  const rimLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (rimLightRef.current) {
      if (tutorState === 'listening') {
        rimLightRef.current.color.setHex(0x00e6a0); // Emerald
        rimLightRef.current.intensity = 3.2;
      } else if (tutorState === 'thinking') {
        rimLightRef.current.color.setHex(0x8257ff); // Royal Violet
        rimLightRef.current.intensity = 2.8;
      } else if (tutorState === 'speaking') {
        rimLightRef.current.color.setHex(0x00d9ff); // Electric Cyan
        rimLightRef.current.intensity = 3.4;
      } else if (tutorState === 'success') {
        rimLightRef.current.color.setHex(0xd4af37); // Gold
        rimLightRef.current.intensity = 3.6;
      } else if (tutorState === 'teaching') {
        rimLightRef.current.color.setHex(0x00e6a0);
        rimLightRef.current.intensity = 3.0;
      } else if (tutorState === 'error') {
        rimLightRef.current.color.setHex(0xff5268);
        rimLightRef.current.intensity = 2.2;
      } else {
        rimLightRef.current.color.setHex(0x00e6a0);
        rimLightRef.current.intensity = 2.2;
      }
    }
  });

  return (
    <>
      {/* Warm Key Light */}
      <directionalLight position={[2.2, 3.8, 2.5]} intensity={2.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      {/* Cool Fill Light */}
      <directionalLight position={[-2.4, 2.0, 1.8]} intensity={1.3} color="#7ed0ff" />
      {/* Dynamic State Rim Light */}
      <directionalLight ref={rimLightRef} position={[0, 2.8, -2.5]} intensity={2.6} color="#00e6a0" />
      {/* Ground Fill Light to illuminate shoes and trousers */}
      <directionalLight position={[0, 0.4, 1.5]} intensity={0.6} color="#4a709c" />
      {/* Ambient Hemisphere */}
      <hemisphereLight args={['#0d2847', '#04111f', 0.85]} />
    </>
  );
};

// =========================================================================
// MAIN COMPONENT EXPORT: RealisticHumanTutor3D (Full-Body 3D Virtual Teacher)
// =========================================================================
export const RealisticHumanTutor3D: React.FC<RealisticHumanTutor3DProps> = ({
  state: rawState = 'idle',
  size = 460,
  className = '',
  interactive = true,
  onClick,
  showStatusLabel = true,
  showCameraControls = true,
  showActionControls = true,
  customGlbUrl,
  audioLevel = 0,
  onStateChange
}) => {
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('full');
  const [loadError, setLoadError] = useState<string | null>(null);

  const tutorState: TutorState = useMemo(() => {
    if (rawState === 'processing') return 'thinking';
    if (rawState === 'blocked') return 'error';
    return rawState;
  }, [rawState]);

  const getStatusBadge = () => {
    switch (tutorState) {
      case 'listening':
        return {
          icon: <Mic className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Listening to you...',
          kannada: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
          color: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'thinking':
        return {
          icon: <SparklesIcon className="w-3.5 h-3.5 text-[#8257FF]" />,
          text: 'Thinking in Kannada...',
          kannada: 'ಆಲೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
          color: 'border-[#8257FF]/40 text-[#8257FF] bg-[#8257FF]/10'
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
          text: 'Speaking in Kannada',
          kannada: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ',
          color: 'border-[#00D9FF]/40 text-[#00D9FF] bg-[#00D9FF]/10'
        };
      case 'teaching':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Teaching Kannada Lesson',
          kannada: 'ಪಾಠ ಹೇಳಿಕೊಡುತ್ತಿದ್ದೇನೆ',
          color: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'waving':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#00D9FF]" />,
          text: 'Namaskara! Welcome!',
          kannada: 'ನಮಸ್ಕಾರ! ಸುಸ್ವಾಗತ!',
          color: 'border-[#00D9FF]/40 text-[#00D9FF] bg-[#00D9FF]/10'
        };
      case 'walking':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Walking / Active Practice',
          kannada: 'ನಡಿಗೆ ಅಭ್ಯಾಸ',
          color: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'success':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Namaskara! Well done!',
          kannada: 'ನಮಸ್ಕಾರ! ಅದ್ಭುತ ಸಾಧನೆ!',
          color: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-[#FF5268]" />,
          text: 'Let us try again',
          kannada: 'ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸೋಣ',
          color: 'border-[#FF5268]/40 text-[#FF5268] bg-[#FF5268]/10'
        };
      default:
        return {
          icon: <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />,
          text: 'Full-Body 3D Tutor Ready',
          kannada: 'ಕನ್ನಡ ಗುರು ಪೂರ್ಣ ಸಿದ್ಧರಾಗಿದ್ದಾರೆ',
          color: 'border-[#00D9FF]/30 text-[#F1F7FF] bg-[#071D32]/80'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size
      }}
    >
      {/* 3D WebGL Canvas */}
      <div
        onClick={interactive ? onClick : undefined}
        className={`w-full h-full relative cursor-pointer focus:outline-none rounded-3xl overflow-hidden ${
          interactive ? 'hover:scale-[1.005] transition-transform' : ''
        }`}
        role="region"
        aria-label="Full-Body 3D Kannada Human Virtual Teacher"
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.95, 2.95], fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15
          }}
          onError={() => setLoadError('Could not initialize 3D canvas')}
        >
          {/* Camera Rig that smoothly animates between Full-Body, Upper-Body, and Face Close-Up */}
          <CameraRig viewPreset={cameraPreset} />

          {/* Dynamic Studio Lighting Rig with Floor Fill */}
          <DynamicStudioLighting tutorState={tutorState} />

          {/* Floating Atmospheric Sparkles */}
          {(tutorState === 'thinking' || tutorState === 'speaking' || tutorState === 'success') && (
            <Sparkles count={35} scale={2.8} size={2.5} speed={0.6} color={tutorState === 'thinking' ? '#8257FF' : '#00E6A0'} />
          )}

          {/* Full-Body Character: Loads custom GLB if available, otherwise procedural rigged full-body character */}
          <Suspense fallback={null}>
            {customGlbUrl ? (
              <GlbAvatarModel url={customGlbUrl} tutorState={tutorState} audioLevel={audioLevel} />
            ) : (
              <FullBodyHumanCharacter tutorState={tutorState} audioLevel={audioLevel} />
            )}
          </Suspense>

          {/* Contact Shadows grounding the feet at y = 0 */}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.65} scale={2.5} blur={1.4} far={1.6} color="#04111F" />

          {/* OrbitControls with constrained rotation */}
          <OrbitControls
            target={[0, 0.9, 0]}
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.05}
            minPolarAngle={Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
            dampingFactor={0.05}
          />
        </Canvas>

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#071D32] border border-[#FF5268]/30 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-[#FF5268] mb-2" />
            <p className="text-sm font-semibold text-[#F1F7FF]">3D View Unavailable</p>
            <p className="text-xs text-[#9BB1C8] mt-1">{loadError}</p>
          </div>
        )}
      </div>

      {/* Camera View Switcher Buttons (Full-Body / Upper-Body / Face Close-Up) */}
      {showCameraControls && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 bg-[#04111F]/80 border border-[#00D9FF]/20 rounded-xl backdrop-blur-md text-xs shadow-lg">
          <button
            onClick={() => setCameraPreset('full')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              cameraPreset === 'full'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold border border-[#00E6A0]/40'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Full-Body View (Head to Toe)"
          >
            Full-Body
          </button>
          <button
            onClick={() => setCameraPreset('upper')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              cameraPreset === 'upper'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-bold border border-[#00D9FF]/40'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Upper-Body View"
          >
            Upper
          </button>
          <button
            onClick={() => setCameraPreset('face')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              cameraPreset === 'face'
                ? 'bg-[#8257FF]/20 text-[#8257FF] font-bold border border-[#8257FF]/40'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Face Close-Up"
          >
            Face
          </button>
        </div>
      )}

      {/* Action Mode Switcher (Teaching, Waving, Walking, Idle) */}
      {showActionControls && onStateChange && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 p-1 bg-[#04111F]/80 border border-[#00D9FF]/20 rounded-xl backdrop-blur-md text-xs shadow-lg">
          <button
            onClick={() => onStateChange('teaching')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'teaching'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Point to Lesson Content"
          >
            Teach
          </button>
          <button
            onClick={() => onStateChange('waving')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'waving'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Wave Greeting"
          >
            Wave
          </button>
          <button
            onClick={() => onStateChange('walking')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'walking'
                ? 'bg-[#8257FF]/20 text-[#8257FF] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Walk Practice"
          >
            Walk
          </button>
          <button
            onClick={() => onStateChange('idle')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'idle'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Stand Idle"
          >
            Idle
          </button>
        </div>
      )}

      {/* Accessible Human Tutor Status Badge */}
      {showStatusLabel && (
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md shadow-lg pointer-events-none transition-all duration-300 ${badge.color}`}
        >
          {badge.icon}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-wide leading-none">{badge.text}</span>
            <span className="text-[10px] font-kannada text-[#9BB1C8] leading-none mt-0.5">{badge.kannada}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { VirtualTutor, AnimationController } from './VirtualTutor';

