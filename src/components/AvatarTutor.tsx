import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Mic, Sparkles, Volume2, UserCheck, RefreshCw, Upload, Play, Info } from 'lucide-react';

export type AvatarAnimationState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface AvatarTutorProps {
  state?: AvatarAnimationState;
  modelUrl?: string;
  size?: number | string;
  className?: string;
  interactive?: boolean;
  onStateChange?: (state: AvatarAnimationState) => void;
  showControls?: boolean;
  audioLevel?: number;
}

// =========================================================================
// HELPER: Generate Procedural Animation Clips for Three.js AnimationMixer
// Full-body tracks for spine, head, arms, legs, and jaw
// =========================================================================
function createProceduralClips(): Record<AvatarAnimationState, THREE.AnimationClip> {
  // 1. Idle Clip: Gentle natural breathing, arm micro-motion, and organic head sway (4s loop)
  const idleDuration = 4.0;
  const idleTimes = [0, 1.0, 2.0, 3.0, 4.0];

  const spineRotations = [
    0, 0, 0, 1,
    0.015, 0, 0, 0.9998,
    0, 0, 0, 1,
    -0.01, 0, 0, 0.9999,
    0, 0, 0, 1
  ];

  const headRotations = [
    0, 0, 0, 1,
    0.012, 0.018, 0, 0.9997,
    0, 0, 0, 1,
    -0.01, -0.015, 0, 0.9998,
    0, 0, 0, 1
  ];

  const armLRotations = [
    0, 0, 0, 1,
    0.02, 0, 0.015, 0.9996,
    0, 0, 0, 1,
    -0.015, 0, -0.01, 0.9998,
    0, 0, 0, 1
  ];

  const armRRotations = [
    0, 0, 0, 1,
    0.02, 0, -0.015, 0.9996,
    0, 0, 0, 1,
    -0.015, 0, 0.01, 0.9998,
    0, 0, 0, 1
  ];

  const idleSpineTrack = new THREE.QuaternionKeyframeTrack('spine.quaternion', idleTimes, spineRotations);
  const idleHeadTrack = new THREE.QuaternionKeyframeTrack('head.quaternion', idleTimes, headRotations);
  const idleArmLTrack = new THREE.QuaternionKeyframeTrack('armL.quaternion', idleTimes, armLRotations);
  const idleArmRTrack = new THREE.QuaternionKeyframeTrack('armR.quaternion', idleTimes, armRRotations);
  const idleClip = new THREE.AnimationClip('idle', idleDuration, [idleSpineTrack, idleHeadTrack, idleArmLTrack, idleArmRTrack]);

  // 2. Listening Clip: Attentive forward lean, head tilted slightly, focused posture (2s loop)
  const listeningDuration = 2.0;
  const listeningTimes = [0, 1.0, 2.0];
  const listeningSpine = [
    0.04, 0, 0, 0.999,
    0.045, 0, 0, 0.9989,
    0.04, 0, 0, 0.999
  ];
  const listeningHead = [
    0.05, 0.04, 0.03, 0.997,
    0.06, 0.035, 0.035, 0.996,
    0.05, 0.04, 0.03, 0.997
  ];
  const listenSpineTrack = new THREE.QuaternionKeyframeTrack('spine.quaternion', listeningTimes, listeningSpine);
  const listenHeadTrack = new THREE.QuaternionKeyframeTrack('head.quaternion', listeningTimes, listeningHead);
  const listeningClip = new THREE.AnimationClip('listening', listeningDuration, [listenSpineTrack, listenHeadTrack]);

  // 3. Thinking Clip: Reflective upward & sideways glance, subtle chin raise, thoughtful arm pose (3s loop)
  const thinkingDuration = 3.0;
  const thinkingTimes = [0, 1.5, 3.0];
  const thinkingSpine = [
    -0.02, 0, 0, 0.9997,
    -0.025, 0.01, 0, 0.9996,
    -0.02, 0, 0, 0.9997
  ];
  const thinkingHead = [
    -0.08, 0.12, 0.02, 0.99,
    -0.1, 0.14, 0.03, 0.988,
    -0.08, 0.12, 0.02, 0.99
  ];
  const thinkingArmR = [
    0.15, -0.1, 0.25, 0.95,
    0.2, -0.12, 0.3, 0.92,
    0.15, -0.1, 0.25, 0.95
  ];
  const thinkSpineTrack = new THREE.QuaternionKeyframeTrack('spine.quaternion', thinkingTimes, thinkingSpine);
  const thinkHeadTrack = new THREE.QuaternionKeyframeTrack('head.quaternion', thinkingTimes, thinkingHead);
  const thinkArmRTrack = new THREE.QuaternionKeyframeTrack('armR.quaternion', thinkingTimes, thinkingArmR);
  const thinkingClip = new THREE.AnimationClip('thinking', thinkingDuration, [thinkSpineTrack, thinkHeadTrack, thinkArmRTrack]);

  // 4. Speaking Clip: Dynamic conversational head nods, explanatory arm motion, and jaw rhythm (1.5s loop)
  const speakingDuration = 1.5;
  const speakingTimes = [0, 0.35, 0.75, 1.1, 1.5];
  const speakingHead = [
    0, 0, 0, 1,
    0.04, 0.02, 0, 0.999,
    -0.02, -0.01, 0, 0.9997,
    0.03, 0.01, 0, 0.9995,
    0, 0, 0, 1
  ];
  const speakingSpine = [
    0, 0, 0, 1,
    0.015, 0, 0, 0.9998,
    -0.01, 0, 0, 0.9999,
    0.01, 0, 0, 0.9999,
    0, 0, 0, 1
  ];
  const speakingArmR = [
    0.1, 0, 0.1, 0.99,
    0.3, -0.1, 0.25, 0.92,
    0.15, -0.05, 0.15, 0.97,
    0.32, -0.08, 0.22, 0.92,
    0.1, 0, 0.1, 0.99
  ];
  const jawPositions = [
    0, -0.012, 0.22,
    0, -0.038, 0.22,
    0, -0.015, 0.22,
    0, -0.042, 0.22,
    0, -0.012, 0.22
  ];
  const speakHeadTrack = new THREE.QuaternionKeyframeTrack('head.quaternion', speakingTimes, speakingHead);
  const speakSpineTrack = new THREE.QuaternionKeyframeTrack('spine.quaternion', speakingTimes, speakingSpine);
  const speakArmRTrack = new THREE.QuaternionKeyframeTrack('armR.quaternion', speakingTimes, speakingArmR);
  const speakJawTrack = new THREE.VectorKeyframeTrack('jaw.position', speakingTimes, jawPositions);
  const speakingClip = new THREE.AnimationClip('speaking', speakingDuration, [
    speakHeadTrack,
    speakSpineTrack,
    speakArmRTrack,
    speakJawTrack
  ]);

  return {
    idle: idleClip,
    listening: listeningClip,
    thinking: thinkingClip,
    speaking: speakingClip
  };
}

// =========================================================================
// GLB MODEL WITH ANIMATION MIXER MANAGER
// =========================================================================
interface GlbModelWithMixerProps {
  url: string;
  activeState: AvatarAnimationState;
}

const GlbModelWithMixer: React.FC<GlbModelWithMixerProps> = ({ url, activeState }) => {
  const { scene, animations } = useGLTF(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentActionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    if (!scene) return;
    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [scene]);

  useEffect(() => {
    const mixer = mixerRef.current;
    if (!mixer || !animations || animations.length === 0) return;

    const stateNameLower = activeState.toLowerCase();
    const targetClip =
      animations.find((c) => c.name.toLowerCase().includes(stateNameLower)) ||
      (activeState === 'speaking' ? animations.find((c) => c.name.toLowerCase().includes('talk')) : null) ||
      animations[0];

    if (!targetClip) return;

    const nextAction = mixer.clipAction(targetClip);
    nextAction.reset();

    if (currentActionRef.current && currentActionRef.current !== nextAction) {
      currentActionRef.current.fadeOut(0.35);
      nextAction.fadeIn(0.35);
    } else {
      nextAction.fadeIn(0.2);
    }

    nextAction.play();
    currentActionRef.current = nextAction;
  }, [activeState, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return <primitive object={scene} scale={1.0} position={[0, 0, 0]} />;
};

// =========================================================================
// PROCEDURAL FULL-BODY RIGGED CHARACTER WITH ANIMATION MIXER
// Anatomically complete from head to toe:
// - Head, facial features, eyes, jaw
// - Neck, mandarin collar, kurta with emerald trim
// - Shoulders, upper arms, forearms, hands with articulated fingers
// - Pelvis, lower kurta drape
// - Thighs, knees, calves, ankles, feet, and traditional mojri shoes
// =========================================================================
interface ProceduralRiggedCharacterProps {
  activeState: AvatarAnimationState;
  audioLevel?: number;
}

const ProceduralRiggedCharacter: React.FC<ProceduralRiggedCharacterProps> = ({ activeState, audioLevel = 0 }) => {
  const modelRootRef = useRef<THREE.Group>(null);
  const spineNodeRef = useRef<THREE.Group>(null);
  const headNodeRef = useRef<THREE.Group>(null);
  const armLNodeRef = useRef<THREE.Group>(null);
  const armRNodeRef = useRef<THREE.Group>(null);
  const jawNodeRef = useRef<THREE.Mesh>(null);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<AvatarAnimationState, THREE.AnimationAction> | null>(null);
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);

  // Initialize AnimationMixer with procedural clips
  useEffect(() => {
    const root = modelRootRef.current;
    if (!root) return;

    const mixer = new THREE.AnimationMixer(root);
    mixerRef.current = mixer;

    const clips = createProceduralClips();
    const actions = {
      idle: mixer.clipAction(clips.idle),
      listening: mixer.clipAction(clips.listening),
      thinking: mixer.clipAction(clips.thinking),
      speaking: mixer.clipAction(clips.speaking)
    };
    actionsRef.current = actions;

    const initialAction = actions[activeState] || actions.idle;
    initialAction.play();
    activeActionRef.current = initialAction;

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(root);
    };
  }, []);

  // State-based animation switching with smooth cross-fading
  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) return;

    const nextAction = actions[activeState];
    const prevAction = activeActionRef.current;

    if (nextAction && nextAction !== prevAction) {
      nextAction.reset();

      if (prevAction) {
        prevAction.fadeOut(0.4);
        nextAction.fadeIn(0.4);
      } else {
        nextAction.fadeIn(0.2);
      }

      nextAction.play();
      activeActionRef.current = nextAction;
    }
  }, [activeState]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (activeState === 'speaking' && jawNodeRef.current && audioLevel > 0.05) {
      jawNodeRef.current.position.y = -0.012 - audioLevel * 0.04;
    }
  });

  // Materials
  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xdfab8a, roughness: 0.6, metalness: 0.05 }),
    []
  );
  const hairMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x181412, roughness: 0.4, metalness: 0.15 }),
    []
  );
  const kurtaMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x071d32, roughness: 0.65, metalness: 0.1 }),
    []
  );
  const trimMat = useMemo(
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
  const trouserMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x040d18, roughness: 0.8, metalness: 0.05 }),
    []
  );
  const shoeLeatherMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x221308, roughness: 0.4, metalness: 0.2 }),
    []
  );
  const shoeGoldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.3,
        metalness: 0.85,
        emissive: 0x3d2b00,
        emissiveIntensity: 0.3
      }),
    []
  );

  return (
    <group ref={modelRootRef} scale={0.8} position={[0, 0, 0]}>
      {/* ===================================================================
          1. LOWER BODY: Pelvis, Legs, Knees, Shins, Ankles, Mojri Shoes
         =================================================================== */}
      <group position={[0, 0.95, 0]}>
        {/* Pelvis & Waistband */}
        <mesh position={[0, -0.05, 0]} material={kurtaMat} castShadow>
          <cylinderGeometry args={[0.24, 0.22, 0.15, 24]} />
        </mesh>

        {/* Lower Kurta Skirt Drape */}
        <mesh position={[0, -0.25, 0]} material={kurtaMat} castShadow>
          <cylinderGeometry args={[0.23, 0.29, 0.35, 24, 1, true]} />
        </mesh>
        {/* Kurta bottom emerald hem */}
        <mesh position={[0, -0.42, 0]} material={trimMat}>
          <torusGeometry args={[0.29, 0.012, 10, 28]} />
        </mesh>

        {/* Left Leg: Thigh, Knee, Calf, Ankle, Foot */}
        <group position={[-0.11, -0.15, 0]}>
          <mesh position={[0, -0.22, 0]} material={trouserMat} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0.005]} material={trouserMat}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} material={trouserMat} castShadow>
            <cylinderGeometry args={[0.062, 0.052, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.83, 0]} material={skinMat}>
            <cylinderGeometry args={[0.048, 0.048, 0.06, 14]} />
          </mesh>

          {/* Left Mojri Shoe */}
          <group position={[0, -0.89, 0.05]}>
            <mesh position={[0, 0.03, 0.02]} scale={[1, 0.65, 1.45]} material={shoeLeatherMat} castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
            </mesh>
            {/* Upturned Mojri Toe */}
            <mesh position={[0, 0.04, 0.14]} rotation={[0.45, 0, 0]} material={shoeLeatherMat}>
              <coneGeometry args={[0.032, 0.08, 12]} />
            </mesh>
            {/* Gold Trim Piping */}
            <mesh position={[0, 0.048, 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={shoeGoldMat}>
              <torusGeometry args={[0.055, 0.008, 8, 20]} />
            </mesh>
            <mesh position={[0, 0.005, 0]} material={shoeLeatherMat}>
              <boxGeometry args={[0.11, 0.02, 0.24]} />
            </mesh>
          </group>
        </group>

        {/* Right Leg: Thigh, Knee, Calf, Ankle, Foot */}
        <group position={[0.11, -0.15, 0]}>
          <mesh position={[0, -0.22, 0]} material={trouserMat} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0.005]} material={trouserMat}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <mesh position={[0, -0.62, 0]} material={trouserMat} castShadow>
            <cylinderGeometry args={[0.062, 0.052, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.83, 0]} material={skinMat}>
            <cylinderGeometry args={[0.048, 0.048, 0.06, 14]} />
          </mesh>

          {/* Right Mojri Shoe */}
          <group position={[0, -0.89, 0.05]}>
            <mesh position={[0, 0.03, 0.02]} scale={[1, 0.65, 1.45]} material={shoeLeatherMat} castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
            </mesh>
            {/* Upturned Mojri Toe */}
            <mesh position={[0, 0.04, 0.14]} rotation={[0.45, 0, 0]} material={shoeLeatherMat}>
              <coneGeometry args={[0.032, 0.08, 12]} />
            </mesh>
            {/* Gold Trim Piping */}
            <mesh position={[0, 0.048, 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={shoeGoldMat}>
              <torusGeometry args={[0.055, 0.008, 8, 20]} />
            </mesh>
            <mesh position={[0, 0.005, 0]} material={shoeLeatherMat}>
              <boxGeometry args={[0.11, 0.02, 0.24]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ===================================================================
          2. UPPER BODY & TORSO (Spine Node for AnimationMixer)
         =================================================================== */}
      <group ref={spineNodeRef} name="spine" position={[0, 0.95, 0]}>
        {/* Chest & Kurta Jacket */}
        <mesh position={[0, 0.25, 0]} material={kurtaMat} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.23, 0.46, 24]} />
        </mesh>

        {/* Mandarin Collar */}
        <mesh position={[0, 0.52, 0]} material={trimMat}>
          <cylinderGeometry args={[0.13, 0.14, 0.09, 24, 1, true]} />
        </mesh>

        {/* Front Emerald Placket & Gold Buttons */}
        <mesh position={[0, 0.28, 0.235]} material={trimMat}>
          <boxGeometry args={[0.032, 0.44, 0.012]} />
        </mesh>
        {[-0.1, 0, 0.1, 0.2].map((yOffset, idx) => (
          <mesh key={idx} position={[0, 0.22 + yOffset * 0.7, 0.243]} material={shoeGoldMat}>
            <sphereGeometry args={[0.007, 10, 10]} />
          </mesh>
        ))}

        {/* Left Arm & Hand with Articulated Fingers */}
        <group ref={armLNodeRef} name="armL" position={[-0.34, 0.45, 0]}>
          <mesh position={[0, 0, 0]} material={kurtaMat}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[-0.04, -0.16, 0]} rotation={[0, 0, 0.15]} material={kurtaMat}>
            <cylinderGeometry args={[0.07, 0.06, 0.28, 16]} />
          </mesh>
          {/* Elbow & Forearm */}
          <group position={[-0.08, -0.32, 0]}>
            <mesh position={[0, 0, 0]} material={kurtaMat}>
              <sphereGeometry args={[0.06, 14, 14]} />
            </mesh>
            <mesh position={[0, -0.15, 0.02]} rotation={[0.1, 0, 0]} material={skinMat}>
              <cylinderGeometry args={[0.052, 0.045, 0.26, 16]} />
            </mesh>
            {/* Hand & Articulated Fingers */}
            <group position={[0, -0.3, 0.02]}>
              <mesh material={skinMat}>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
              {/* Thumb */}
              <mesh position={[0.038, 0.01, 0.01]} rotation={[0, 0, -0.45]} material={skinMat}>
                <cylinderGeometry args={[0.01, 0.008, 0.045, 10]} />
              </mesh>
              {/* 4 Fingers */}
              {[-0.022, -0.007, 0.007, 0.022].map((xOffset, fIdx) => (
                <mesh key={fIdx} position={[xOffset, -0.055, 0]} material={skinMat}>
                  <cylinderGeometry args={[0.009, 0.008, 0.05, 10]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>

        {/* Right Arm & Hand with Articulated Fingers */}
        <group ref={armRNodeRef} name="armR" position={[0.34, 0.45, 0]}>
          <mesh position={[0, 0, 0]} material={kurtaMat}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[0.04, -0.16, 0]} rotation={[0, 0, -0.15]} material={kurtaMat}>
            <cylinderGeometry args={[0.07, 0.06, 0.28, 16]} />
          </mesh>
          {/* Elbow & Forearm */}
          <group position={[0.08, -0.32, 0]}>
            <mesh position={[0, 0, 0]} material={kurtaMat}>
              <sphereGeometry args={[0.06, 14, 14]} />
            </mesh>
            <mesh position={[0, -0.15, 0.02]} rotation={[0.1, 0, 0]} material={skinMat}>
              <cylinderGeometry args={[0.052, 0.045, 0.26, 16]} />
            </mesh>
            {/* Hand & Articulated Fingers */}
            <group position={[0, -0.3, 0.02]}>
              <mesh material={skinMat}>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
              {/* Thumb */}
              <mesh position={[-0.038, 0.01, 0.01]} rotation={[0, 0, 0.45]} material={skinMat}>
                <cylinderGeometry args={[0.01, 0.008, 0.045, 10]} />
              </mesh>
              {/* 4 Fingers */}
              {[-0.022, -0.007, 0.007, 0.022].map((xOffset, fIdx) => (
                <mesh key={fIdx} position={[xOffset, -0.055, 0]} material={skinMat}>
                  <cylinderGeometry args={[0.009, 0.008, 0.05, 10]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.55, 0]} material={skinMat}>
          <cylinderGeometry args={[0.09, 0.1, 0.14, 20]} />
        </mesh>

        {/* ===================================================================
            3. HEAD NODE (Target of AnimationMixer: 'head.quaternion')
           =================================================================== */}
        <group ref={headNodeRef} name="head" position={[0, 0.68, 0]}>
          {/* Cranium & Facial Structure */}
          <mesh position={[0, 0.12, 0]} scale={[0.92, 1.14, 1.05]} material={skinMat} castShadow>
            <sphereGeometry args={[0.2, 28, 28]} />
          </mesh>

          {/* Hair Sculpt */}
          <mesh position={[0, 0.18, -0.025]} scale={[0.96, 1.1, 1.1]} material={hairMat}>
            <sphereGeometry args={[0.21, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.28, 0.11]} rotation={[Math.PI / 2.3, 0, -0.2]} material={hairMat}>
            <torusGeometry args={[0.15, 0.05, 12, 24, Math.PI * 0.9]} />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.075, 0.19, 0.18]} rotation={[0, 0, 0.08]} material={hairMat}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
          </mesh>
          <mesh position={[0.075, 0.19, 0.18]} rotation={[0, 0, -0.08]} material={hairMat}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
          </mesh>

          {/* Eyes (Left & Right) */}
          <group position={[-0.072, 0.13, 0.17]}>
            <mesh material={skinMat}>
              <sphereGeometry args={[0.03, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.026]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#30180a" />
            </mesh>
          </group>

          <group position={[0.072, 0.13, 0.17]}>
            <mesh material={skinMat}>
              <sphereGeometry args={[0.03, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.026]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#30180a" />
            </mesh>
          </group>

          {/* Nose */}
          <mesh position={[0, 0.11, 0.21]} rotation={[-0.35, 0, 0]} material={skinMat}>
            <coneGeometry args={[0.038, 0.12, 12]} />
          </mesh>

          {/* Articulated Jaw (Target of AnimationMixer: 'jaw.position') */}
          <group position={[0, 0.02, 0.18]}>
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.075, 0.014, 0.022]} />
              <meshStandardMaterial color="#b96561" roughness={0.5} />
            </mesh>
            <mesh ref={jawNodeRef} name="jaw" position={[0, -0.012, 0]}>
              <boxGeometry args={[0.07, 0.018, 0.022]} />
              <meshStandardMaterial color="#b96561" roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// AVATAR TUTOR COMPONENT EXPORT
// =========================================================================
export const AvatarTutor: React.FC<AvatarTutorProps> = ({
  state = 'idle',
  modelUrl,
  size = 360,
  className = '',
  interactive = true,
  onStateChange,
  showControls = true,
  audioLevel = 0
}) => {
  const [internalState, setInternalState] = useState<AvatarAnimationState>(state);
  const [hasGlbError, setHasGlbError] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'full' | 'upper' | 'face'>('full');

  useEffect(() => {
    setInternalState(state);
  }, [state]);

  const handleStateSelect = (newState: AvatarAnimationState) => {
    setInternalState(newState);
    onStateChange?.(newState);
  };

  const getStateInfo = () => {
    switch (internalState) {
      case 'listening':
        return {
          icon: <Mic className="w-3.5 h-3.5 text-[#00E6A0]" />,
          label: 'Listening',
          kannada: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'thinking':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#8257FF]" />,
          label: 'Thinking',
          kannada: 'ಆಲೋಚಿಸುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#8257FF]/40 text-[#8257FF] bg-[#8257FF]/10'
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-[#00D9FF]" />,
          label: 'Speaking',
          kannada: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#00D9FF]/40 text-[#00D9FF] bg-[#00D9FF]/10'
        };
      default:
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#00D9FF]" />,
          label: 'Idle (Ready)',
          kannada: 'ಸಿದ್ಧರಾಗಿದ್ದಾರೆ',
          badgeClass: 'border-[#00D9FF]/30 text-[#F1F7FF] bg-[#071D32]/80'
        };
    }
  };

  const currentInfo = getStateInfo();

  // Dynamic Camera coordinates based on preset:
  // 'full': frames head-to-toe from y=0 (shoes) to y=1.65 (hair) with comfortable padding
  const cameraPosition: [number, number, number] =
    cameraPreset === 'full' ? [0, 0.82, 2.75] : cameraPreset === 'upper' ? [0, 1.2, 1.5] : [0, 1.45, 0.82];

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size
      }}
    >
      {/* 3D Canvas with React Three Fiber */}
      <div
        className="w-full h-full relative rounded-3xl overflow-hidden focus:outline-none"
        role="region"
        aria-label="Full-Body Avatar Tutor 3D Canvas"
      >
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15
          }}
        >
          {/* Studio Lights */}
          <directionalLight position={[1.8, 3.2, 2.2]} intensity={2.5} castShadow />
          <directionalLight position={[-2.2, 1.8, 1.5]} intensity={1.2} color="#7ed0ff" />
          <directionalLight
            position={[0, 2.5, -2.4]}
            intensity={2.8}
            color={
              internalState === 'thinking'
                ? '#8257FF'
                : internalState === 'speaking'
                ? '#00D9FF'
                : '#00E6A0'
            }
          />
          <hemisphereLight args={['#0d2847', '#04111f', 0.8]} />

          {/* Model with AnimationMixer */}
          <Suspense
            fallback={
              <mesh position={[0, 0.9, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#00D9FF" wireframe />
              </mesh>
            }
          >
            {modelUrl && !hasGlbError ? (
              <GlbModelWithMixer url={modelUrl} activeState={internalState} />
            ) : (
              <ProceduralRiggedCharacter activeState={internalState} audioLevel={audioLevel} />
            )}
          </Suspense>

          {/* Ground Contact Shadows for Mojri Shoes */}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.65} scale={2.6} blur={1.5} far={1.5} color="#04111F" />

          {/* OrbitControls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 + 0.05}
            minPolarAngle={Math.PI / 3.5}
            maxAzimuthAngle={Math.PI / 4}
            minAzimuthAngle={-Math.PI / 4}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* Floating Status Indicator */}
      <div
        className={`absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-md text-xs font-semibold ${currentInfo.badgeClass}`}
      >
        {currentInfo.icon}
        <span className="leading-none">{currentInfo.label}</span>
        <span className="text-[10px] font-kannada text-[#9BB1C8] leading-none">· {currentInfo.kannada}</span>
      </div>

      {/* Camera View Switcher (Full-Body / Upper / Face) */}
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

      {/* State-Based Animation Controls Switcher */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1 bg-[#04111F]/80 border border-[#00D9FF]/20 rounded-2xl backdrop-blur-md shadow-lg text-xs">
          <button
            onClick={() => handleStateSelect('idle')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              internalState === 'idle'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 font-bold'
                : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
            }`}
          >
            Idle
          </button>
          <button
            onClick={() => handleStateSelect('listening')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              internalState === 'listening'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] border border-[#00E6A0]/40 font-bold'
                : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
            }`}
          >
            Listening
          </button>
          <button
            onClick={() => handleStateSelect('thinking')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              internalState === 'thinking'
                ? 'bg-[#8257FF]/20 text-[#8257FF] border border-[#8257FF]/40 font-bold'
                : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
            }`}
          >
            Thinking
          </button>
          <button
            onClick={() => handleStateSelect('speaking')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
              internalState === 'speaking'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40 font-bold'
                : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
            }`}
          >
            Speaking
          </button>
        </div>
      )}
    </div>
  );
};

export { VirtualTutor, AnimationController } from './VirtualTutor';

