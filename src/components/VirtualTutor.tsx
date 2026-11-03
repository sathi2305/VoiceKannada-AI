import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import {
  Mic,
  Sparkles,
  Volume2,
  UserCheck,
  AlertCircle,
  Eye,
  Camera,
  Activity,
  Check
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

export interface VirtualTutorProps {
  state?: TutorState | 'processing' | 'blocked';
  isSpeechPlaying?: boolean;
  audioLevel?: number; // 0 to 1 for speech viseme amplitude
  size?: number | string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showStatusLabel?: boolean;
  showCameraControls?: boolean;
  showActionControls?: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onStateChange?: (state: TutorState) => void;
}

// =========================================================================
// 1. PROCEDURAL FACIAL MORPH GEOMETRY
// Generates standard blendshapes for realistic facial animation:
// Index 0: mouthOpen, Index 1: mouthSmile, Index 2: browRaise,
// Index 3: eyeBlink, Index 4: viseme_oo
// =========================================================================
function createFacialMorphGeometry(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.19, 28, 28);
  const pos = geo.attributes.position;
  const count = pos.count;

  const mouthOpen = new Float32Array(count * 3);
  const mouthSmile = new Float32Array(count * 3);
  const browRaise = new Float32Array(count * 3);
  const eyeBlink = new Float32Array(count * 3);
  const visemeOo = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Default neutral copy
    mouthOpen[i * 3] = x;
    mouthOpen[i * 3 + 1] = y;
    mouthOpen[i * 3 + 2] = z;

    mouthSmile[i * 3] = x;
    mouthSmile[i * 3 + 1] = y;
    mouthSmile[i * 3 + 2] = z;

    browRaise[i * 3] = x;
    browRaise[i * 3 + 1] = y;
    browRaise[i * 3 + 2] = z;

    eyeBlink[i * 3] = x;
    eyeBlink[i * 3 + 1] = y;
    eyeBlink[i * 3 + 2] = z;

    visemeOo[i * 3] = x;
    visemeOo[i * 3 + 1] = y;
    visemeOo[i * 3 + 2] = z;

    // 1. mouthOpen: pull lower mouth vertices down & slight forward
    if (y < 0.04 && y > -0.12 && z > 0.06) {
      const falloff = 1 - Math.min(1, Math.abs(x) / 0.12);
      mouthOpen[i * 3 + 1] = y - 0.045 * falloff;
      mouthOpen[i * 3 + 2] = z + 0.008 * falloff;
    }

    // 2. mouthSmile: pull mouth corners upwards and laterally
    if (y < 0.04 && y > -0.09 && z > 0.08 && Math.abs(x) > 0.02) {
      mouthSmile[i * 3] = x + Math.sign(x) * 0.016;
      mouthSmile[i * 3 + 1] = y + 0.022;
    }

    // 3. browRaise: pull upper forehead & brow vertices up
    if (y > 0.11 && y < 0.22 && z > 0.08) {
      browRaise[i * 3 + 1] = y + 0.035;
    }

    // 4. eyeBlink: pull upper eyelid vertices down toward lower eyelid
    if (y > 0.11 && y < 0.17 && z > 0.11) {
      eyeBlink[i * 3 + 1] = y - 0.028;
    }

    // 5. viseme_oo: mouth vertices pursed forward with narrow aperture
    if (y < 0.04 && y > -0.1 && z > 0.08) {
      visemeOo[i * 3] = x * 0.65;
      visemeOo[i * 3 + 2] = z + 0.025;
    }
  }

  geo.morphAttributes.position = [
    new THREE.BufferAttribute(mouthOpen, 3),
    new THREE.BufferAttribute(mouthSmile, 3),
    new THREE.BufferAttribute(browRaise, 3),
    new THREE.BufferAttribute(eyeBlink, 3),
    new THREE.BufferAttribute(visemeOo, 3)
  ];

  return geo;
}

// =========================================================================
// 2. PROCEDURAL SKELETAL ANIMATION CLIPS GENERATOR
// Produces complete Three.js AnimationClips with keyframes for the full skeleton
// =========================================================================
function createFullBodyAnimationClips(): Record<TutorState, THREE.AnimationClip> {
  // 1. Idle: Organic breathing & sway (4s loop)
  const idleTimes = [0, 1.0, 2.0, 3.0, 4.0];
  const idleSpine = [
    0, 0, 0, 1,
    0.012, 0, 0, 0.9999,
    0, 0, 0, 1,
    -0.008, 0, 0, 0.9999,
    0, 0, 0, 1
  ];
  const idleHead = [
    0, 0, 0, 1,
    0.01, 0.015, 0, 0.9998,
    0, 0, 0, 1,
    -0.008, -0.012, 0, 0.9999,
    0, 0, 0, 1
  ];
  const idleArmL = [
    0, 0, 0.08, 0.996,
    0.015, 0, 0.09, 0.995,
    0, 0, 0.08, 0.996,
    -0.01, 0, 0.075, 0.997,
    0, 0, 0.08, 0.996
  ];
  const idleArmR = [
    0, 0, -0.08, 0.996,
    0.015, 0, -0.09, 0.995,
    0, 0, -0.08, 0.996,
    -0.01, 0, -0.075, 0.997,
    0, 0, -0.08, 0.996
  ];
  const idleClip = new THREE.AnimationClip('idle', 4.0, [
    new THREE.QuaternionKeyframeTrack('spine.quaternion', idleTimes, idleSpine),
    new THREE.QuaternionKeyframeTrack('head.quaternion', idleTimes, idleHead),
    new THREE.QuaternionKeyframeTrack('armL.quaternion', idleTimes, idleArmL),
    new THREE.QuaternionKeyframeTrack('armR.quaternion', idleTimes, idleArmR)
  ]);

  // 2. Listening: Attentive forward lean (2s loop)
  const listenTimes = [0, 1.0, 2.0];
  const listenSpine = [
    0.035, 0, 0, 0.999,
    0.042, 0, 0, 0.999,
    0.035, 0, 0, 0.999
  ];
  const listenHead = [
    0.045, 0.03, 0.02, 0.998,
    0.055, 0.025, 0.025, 0.997,
    0.045, 0.03, 0.02, 0.998
  ];
  const listenClip = new THREE.AnimationClip('listening', 2.0, [
    new THREE.QuaternionKeyframeTrack('spine.quaternion', listenTimes, listenSpine),
    new THREE.QuaternionKeyframeTrack('head.quaternion', listenTimes, listenHead)
  ]);

  // 3. Thinking: Reflective chin-raise and right arm contemplative pose (3s loop)
  const thinkTimes = [0, 1.5, 3.0];
  const thinkSpine = [
    -0.02, 0, 0, 0.9997,
    -0.025, 0.01, 0, 0.9996,
    -0.02, 0, 0, 0.9997
  ];
  const thinkHead = [
    -0.07, 0.1, 0.02, 0.992,
    -0.09, 0.12, 0.03, 0.99,
    -0.07, 0.1, 0.02, 0.992
  ];
  const thinkArmR = [
    0.2, -0.15, 0.35, 0.9,
    0.24, -0.18, 0.4, 0.86,
    0.2, -0.15, 0.35, 0.9
  ];
  const thinkClip = new THREE.AnimationClip('thinking', 3.0, [
    new THREE.QuaternionKeyframeTrack('spine.quaternion', thinkTimes, thinkSpine),
    new THREE.QuaternionKeyframeTrack('head.quaternion', thinkTimes, thinkHead),
    new THREE.QuaternionKeyframeTrack('armR.quaternion', thinkTimes, thinkArmR)
  ]);

  // 4. Speaking: Dynamic head accents & conversational gesturing (1.6s loop)
  const speakTimes = [0, 0.4, 0.8, 1.2, 1.6];
  const speakHead = [
    0, 0, 0, 1,
    0.035, 0.02, 0, 0.999,
    -0.02, -0.015, 0, 0.9996,
    0.03, 0.01, 0, 0.9995,
    0, 0, 0, 1
  ];
  const speakSpine = [
    0, 0, 0, 1,
    0.015, 0, 0, 0.9998,
    -0.01, 0, 0, 0.9999,
    0.01, 0, 0, 0.9999,
    0, 0, 0, 1
  ];
  const speakArmR = [
    0.15, 0, 0.15, 0.97,
    0.35, -0.1, 0.3, 0.88,
    0.18, -0.05, 0.2, 0.96,
    0.38, -0.08, 0.28, 0.87,
    0.15, 0, 0.15, 0.97
  ];
  const speakClip = new THREE.AnimationClip('speaking', 1.6, [
    new THREE.QuaternionKeyframeTrack('head.quaternion', speakTimes, speakHead),
    new THREE.QuaternionKeyframeTrack('spine.quaternion', speakTimes, speakSpine),
    new THREE.QuaternionKeyframeTrack('armR.quaternion', speakTimes, speakArmR)
  ]);

  // 5. Teaching: Right arm pointing toward instructional content (2.4s loop)
  const teachTimes = [0, 1.2, 2.4];
  const teachArmR = [
    0.45, -0.2, 0.35, 0.79,
    0.5, -0.22, 0.38, 0.74,
    0.45, -0.2, 0.35, 0.79
  ];
  const teachHead = [
    0.02, -0.08, 0, 0.996,
    0.03, -0.07, 0, 0.996,
    0.02, -0.08, 0, 0.996
  ];
  const teachClip = new THREE.AnimationClip('teaching', 2.4, [
    new THREE.QuaternionKeyframeTrack('armR.quaternion', teachTimes, teachArmR),
    new THREE.QuaternionKeyframeTrack('head.quaternion', teachTimes, teachHead)
  ]);

  // 6. Waving: Friendly Kannada Namaskara greeting wave (2.0s loop)
  const waveTimes = [0, 0.5, 1.0, 1.5, 2.0];
  const waveArmR = [
    0.5, 0, 0.5, 0.7,
    0.55, 0.1, 0.6, 0.57,
    0.5, -0.1, 0.45, 0.73,
    0.55, 0.1, 0.6, 0.57,
    0.5, 0, 0.5, 0.7
  ];
  const waveClip = new THREE.AnimationClip('waving', 2.0, [
    new THREE.QuaternionKeyframeTrack('armR.quaternion', waveTimes, waveArmR)
  ]);

  // 7. Walking: Bipedal locomotion with leg & arm opposition (1.2s loop)
  const walkTimes = [0, 0.3, 0.6, 0.9, 1.2];
  const walkLegL = [
    0.25, 0, 0, 0.968,
    0, 0, 0, 1,
    -0.25, 0, 0, 0.968,
    0, 0, 0, 1,
    0.25, 0, 0, 0.968
  ];
  const walkLegR = [
    -0.25, 0, 0, 0.968,
    0, 0, 0, 1,
    0.25, 0, 0, 0.968,
    0, 0, 0, 1,
    -0.25, 0, 0, 0.968
  ];
  const walkArmL = [
    -0.2, 0, 0, 0.979,
    0, 0, 0, 1,
    0.2, 0, 0, 0.979,
    0, 0, 0, 1,
    -0.2, 0, 0, 0.979
  ];
  const walkArmR = [
    0.2, 0, 0, 0.979,
    0, 0, 0, 1,
    -0.2, 0, 0, 0.979,
    0, 0, 0, 1,
    0.2, 0, 0, 0.979
  ];
  const walkClip = new THREE.AnimationClip('walking', 1.2, [
    new THREE.QuaternionKeyframeTrack('legL.quaternion', walkTimes, walkLegL),
    new THREE.QuaternionKeyframeTrack('legR.quaternion', walkTimes, walkLegR),
    new THREE.QuaternionKeyframeTrack('armL.quaternion', walkTimes, walkArmL),
    new THREE.QuaternionKeyframeTrack('armR.quaternion', walkTimes, walkArmR)
  ]);

  // 8. Success: Namaskara celebration pose (2.4s loop)
  const successTimes = [0, 1.2, 2.4];
  const successArmL = [
    0.3, 0.15, -0.4, 0.85,
    0.32, 0.16, -0.42, 0.83,
    0.3, 0.15, -0.4, 0.85
  ];
  const successArmR = [
    0.3, -0.15, 0.4, 0.85,
    0.32, -0.16, 0.42, 0.83,
    0.3, -0.15, 0.4, 0.85
  ];
  const successClip = new THREE.AnimationClip('success', 2.4, [
    new THREE.QuaternionKeyframeTrack('armL.quaternion', successTimes, successArmL),
    new THREE.QuaternionKeyframeTrack('armR.quaternion', successTimes, successArmR)
  ]);

  // 9. Error: Empathetic head tilt and open palms (2.0s loop)
  const errorTimes = [0, 1.0, 2.0];
  const errorHead = [
    0, 0, 0.05, 0.998,
    0, 0, -0.05, 0.998,
    0, 0, 0.05, 0.998
  ];
  const errorClip = new THREE.AnimationClip('error', 2.0, [
    new THREE.QuaternionKeyframeTrack('head.quaternion', errorTimes, errorHead)
  ]);

  return {
    idle: idleClip,
    listening: listenClip,
    thinking: thinkClip,
    speaking: speakClip,
    teaching: teachClip,
    waving: waveClip,
    walking: walkClip,
    success: successClip,
    error: errorClip
  };
}

// =========================================================================
// 3. ANIMATION CONTROLLER (CLASS & HOOK)
// Maps application events (speech playback start/end, AI state, audio levels)
// to skeletal animations and facial morph targets using Three.js AnimationMixer
// =========================================================================
export interface AnimationControllerConfig {
  root: THREE.Object3D;
  faceMesh?: THREE.Mesh | null;
  onClipChange?: (state: TutorState) => void;
}

export class AnimationController {
  private mixer: THREE.AnimationMixer;
  private actions: Map<TutorState, THREE.AnimationAction> = new Map();
  private currentAction: THREE.AnimationAction | null = null;
  private currentState: TutorState = 'idle';
  private faceMesh: THREE.Mesh | null = null;

  // Speech & viseme tracking
  private isSpeechActive: boolean = false;
  private audioLevel: number = 0;

  // Natural biological eye blink timing
  private blinkTimer: number = 0;
  private nextBlinkInterval: number = 3.2;
  private isBlinking: boolean = false;
  private blinkDuration: number = 0.15;
  private blinkElapsed: number = 0;

  // Target morph influences [mouthOpen, mouthSmile, browRaise, eyeBlink, viseme_oo]
  private targetMorphs: number[] = [0, 0, 0, 0, 0];

  constructor(config: AnimationControllerConfig) {
    this.mixer = new THREE.AnimationMixer(config.root);
    if (config.faceMesh) {
      this.faceMesh = config.faceMesh;
    }

    // Register all procedural skeletal animation clips
    const clips = createFullBodyAnimationClips();
    (Object.keys(clips) as TutorState[]).forEach((stateKey) => {
      const action = this.mixer.clipAction(clips[stateKey]);
      this.actions.set(stateKey, action);
    });

    // Start in initial Idle pose
    const initialAction = this.actions.get('idle');
    if (initialAction) {
      initialAction.play();
      this.currentAction = initialAction;
    }
  }

  public setFaceMesh(mesh: THREE.Mesh | null) {
    this.faceMesh = mesh;
  }

  /**
   * Application Event: Map AI state transition to skeletal animation crossfade
   */
  public setAiState(nextState: TutorState) {
    if (this.currentState === nextState && this.currentAction) return;

    const nextAction = this.actions.get(nextState);
    if (!nextAction) return;

    nextAction.reset();

    if (this.currentAction && this.currentAction !== nextAction) {
      // Smooth cross-fade over 0.28 seconds
      this.currentAction.fadeOut(0.28);
      nextAction.fadeIn(0.28);
    } else {
      nextAction.fadeIn(0.2);
    }

    nextAction.play();
    this.currentAction = nextAction;
    this.currentState = nextState;
  }

  /**
   * Application Event: Speech Playback Started
   * Automatically switches skeletal posture to conversational speaking
   * and engages dynamic mouth & viseme blendshapes.
   */
  public handleSpeechStart() {
    this.isSpeechActive = true;
    if (this.currentState !== 'teaching' && this.currentState !== 'waving') {
      this.setAiState('speaking');
    }
  }

  /**
   * Application Event: Speech Playback Ended
   * Smoothly crossfades back to attentive listening or ready idle posture
   * and smoothly closes facial morph targets.
   */
  public handleSpeechEnd() {
    this.isSpeechActive = false;
    this.targetMorphs[0] = 0; // mouthOpen -> 0
    this.targetMorphs[4] = 0; // viseme_oo -> 0
    if (this.currentState === 'speaking') {
      this.setAiState('idle');
    }
  }

  /**
   * Application Event: Real-time audio waveform / viseme amplitude (0 to 1)
   */
  public setAudioLevel(level: number) {
    this.audioLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Frame Update: Called inside requestAnimationFrame / useFrame
   * Updates Three.js AnimationMixer and calculates facial morph target influences.
   */
  public update(delta: number, elapsedTime: number) {
    // 1. Advance Skeletal AnimationMixer
    this.mixer.update(delta);

    // 2. Compute Facial Morph Targets based on state & speech playback
    const isSpeakingNow = this.isSpeechActive || this.currentState === 'speaking';

    if (isSpeakingNow) {
      // Mouth opening modulated by audio level and conversational syllable oscillation
      const syllableWave = Math.sin(elapsedTime * 14) * 0.5 + 0.5;
      const amplitude = Math.max(0.35, this.audioLevel * 1.2);
      this.targetMorphs[0] = Math.min(1.0, syllableWave * amplitude);

      // Alternating vowel viseme (viseme_oo)
      this.targetMorphs[4] = Math.max(0, Math.sin(elapsedTime * 9) * 0.4);

      // Gentle smile during speech
      this.targetMorphs[1] = 0.3;
    } else {
      this.targetMorphs[0] = 0;
      this.targetMorphs[4] = 0;
      this.targetMorphs[1] =
        this.currentState === 'waving'
          ? 0.65
          : this.currentState === 'success'
          ? 0.85
          : 0.1;
    }

    // Eyebrow raise (attentive listening or reflective thinking)
    this.targetMorphs[2] =
      this.currentState === 'thinking'
        ? 0.75
        : this.currentState === 'listening'
        ? 0.45
        : this.currentState === 'error'
        ? 0.35
        : 0.05;

    // 3. Periodic natural biological eye blink
    this.blinkTimer += delta;
    if (!this.isBlinking && this.blinkTimer >= this.nextBlinkInterval) {
      this.isBlinking = true;
      this.blinkElapsed = 0;
      this.nextBlinkInterval = 2.5 + Math.random() * 2.5; // Random interval between 2.5s and 5.0s
    }

    if (this.isBlinking) {
      this.blinkElapsed += delta;
      // Parabolic blink curve: 0 -> 1 -> 0 over 0.15s
      const blinkProgress = this.blinkElapsed / this.blinkDuration;
      if (blinkProgress >= 1.0) {
        this.isBlinking = false;
        this.blinkTimer = 0;
        this.targetMorphs[3] = 0;
      } else {
        this.targetMorphs[3] = Math.sin(blinkProgress * Math.PI);
      }
    } else {
      this.targetMorphs[3] = 0;
    }

    // 4. Apply morph target influences to facial mesh with smooth damping
    if (this.faceMesh && this.faceMesh.morphTargetInfluences) {
      const influences = this.faceMesh.morphTargetInfluences;
      const dampSpeed = 16;
      for (let i = 0; i < 5; i++) {
        influences[i] = THREE.MathUtils.damp(
          influences[i] || 0,
          this.targetMorphs[i] || 0,
          dampSpeed,
          delta
        );
      }
    }
  }

  public dispose() {
    this.mixer.stopAllAction();
  }
}

// =========================================================================
// 4. PROCEDURAL FULL-BODY RIGGED 3D CHARACTER
// Reduced scale (0.8) so it fits with ample margin and never gets blocked
// =========================================================================
interface FullBodyRigProps {
  controllerRef: React.MutableRefObject<AnimationController | null>;
  tutorState: TutorState;
}

const FullBodyRig: React.FC<FullBodyRigProps> = ({ controllerRef }) => {
  const rootRef = useRef<THREE.Group>(null);
  const faceMeshRef = useRef<THREE.Mesh | null>(null);

  // Synchronously construct facial geometry with morph targets
  const faceGeometry = useMemo(() => createFacialMorphGeometry(), []);

  // Standard PBR Materials
  const skinMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xdfab8a, roughness: 0.58, metalness: 0.05 }),
    []
  );
  const hairMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x181412, roughness: 0.4, metalness: 0.15 }),
    []
  );
  const kurtaMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x071d32, roughness: 0.65, metalness: 0.1 }),
    []
  );
  const trouserMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x040d18, roughness: 0.8, metalness: 0.05 }),
    []
  );
  const trimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x00e6a0,
        roughness: 0.35,
        metalness: 0.4,
        emissive: 0x004828,
        emissiveIntensity: 0.35
      }),
    []
  );
  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.28,
        metalness: 0.85,
        emissive: 0x3d2b00,
        emissiveIntensity: 0.3
      }),
    []
  );
  const shoeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x221308, roughness: 0.45, metalness: 0.18 }),
    []
  );

  // Synchronously instantiate facial mesh with morph targets
  const facialMorphMesh = useMemo(() => {
    const mesh = new THREE.Mesh(faceGeometry, skinMaterial);
    mesh.castShadow = true;
    mesh.position.set(0, 0.12, 0);
    mesh.scale.set(0.92, 1.14, 1.05);
    mesh.updateMorphTargets();
    return mesh;
  }, [faceGeometry, skinMaterial]);

  // Bind AnimationController to this character root
  useEffect(() => {
    if (!rootRef.current) return;

    const controller = new AnimationController({
      root: rootRef.current,
      faceMesh: facialMorphMesh
    });
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [facialMorphMesh]);

  return (
    // Reduced 3D model scale to 0.8 so the 3D space is clear, elegant, and never obscured
    <group ref={rootRef} scale={0.8} position={[0, 0, 0]}>
      {/* ===================================================================
          1. LOWER BODY: Pelvis, Legs, Knees, Calves, Mojri Shoes
         =================================================================== */}
      <group position={[0, 0.95, 0]}>
        {/* Pelvis & Waistband */}
        <mesh position={[0, -0.05, 0]} material={kurtaMaterial} castShadow>
          <cylinderGeometry args={[0.24, 0.22, 0.15, 24]} />
        </mesh>

        {/* Lower Kurta Skirt Drape */}
        <mesh position={[0, -0.25, 0]} material={kurtaMaterial} castShadow>
          <cylinderGeometry args={[0.23, 0.29, 0.35, 24, 1, true]} />
        </mesh>
        <mesh position={[0, -0.42, 0]} material={trimMaterial}>
          <torusGeometry args={[0.29, 0.012, 10, 28]} />
        </mesh>

        {/* Left Leg: Thigh, Knee, Calf, Mojri Shoe */}
        <group name="legL" position={[-0.11, -0.15, 0]}>
          <mesh position={[0, -0.22, 0]} material={trouserMaterial} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0]} material={trouserMaterial}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <group name="kneeL" position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} material={trouserMaterial} castShadow>
              <cylinderGeometry args={[0.062, 0.052, 0.38, 16]} />
            </mesh>
            {/* Left Mojri Shoe */}
            <group position={[0, -0.47, 0.05]}>
              <mesh position={[0, 0.03, 0.02]} scale={[1, 0.65, 1.45]} material={shoeMaterial} castShadow>
                <sphereGeometry args={[0.075, 16, 16]} />
              </mesh>
              {/* Upturned Mojri Toe */}
              <mesh position={[0, 0.04, 0.14]} rotation={[0.45, 0, 0]} material={shoeMaterial}>
                <coneGeometry args={[0.032, 0.08, 12]} />
              </mesh>
              <mesh position={[0, 0.048, 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={goldMaterial}>
                <torusGeometry args={[0.055, 0.008, 8, 20]} />
              </mesh>
              <mesh position={[0, 0.005, 0]} material={shoeMaterial}>
                <boxGeometry args={[0.11, 0.02, 0.24]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg: Thigh, Knee, Calf, Mojri Shoe */}
        <group name="legR" position={[0.11, -0.15, 0]}>
          <mesh position={[0, -0.22, 0]} material={trouserMaterial} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.42, 0]} material={trouserMaterial}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>
          <group name="kneeR" position={[0, -0.42, 0]}>
            <mesh position={[0, -0.2, 0]} material={trouserMaterial} castShadow>
              <cylinderGeometry args={[0.062, 0.052, 0.38, 16]} />
            </mesh>
            {/* Right Mojri Shoe */}
            <group position={[0, -0.47, 0.05]}>
              <mesh position={[0, 0.03, 0.02]} scale={[1, 0.65, 1.45]} material={shoeMaterial} castShadow>
                <sphereGeometry args={[0.075, 16, 16]} />
              </mesh>
              {/* Upturned Mojri Toe */}
              <mesh position={[0, 0.04, 0.14]} rotation={[0.45, 0, 0]} material={shoeMaterial}>
                <coneGeometry args={[0.032, 0.08, 12]} />
              </mesh>
              <mesh position={[0, 0.048, 0.01]} rotation={[-Math.PI / 2, 0, 0]} material={goldMaterial}>
                <torusGeometry args={[0.055, 0.008, 8, 20]} />
              </mesh>
              <mesh position={[0, 0.005, 0]} material={shoeMaterial}>
                <boxGeometry args={[0.11, 0.02, 0.24]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ===================================================================
          2. UPPER BODY & SKELETAL TORSO (Target: 'spine.quaternion')
         =================================================================== */}
      <group name="spine" position={[0, 0.95, 0]}>
        {/* Tailored Kurta Chest */}
        <mesh position={[0, 0.25, 0]} material={kurtaMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.23, 0.46, 24]} />
        </mesh>

        {/* Mandarin Collar */}
        <mesh position={[0, 0.52, 0]} material={trimMaterial}>
          <cylinderGeometry args={[0.13, 0.14, 0.09, 24, 1, true]} />
        </mesh>

        {/* Emerald Placket & Gold Buttons */}
        <mesh position={[0, 0.28, 0.235]} material={trimMaterial}>
          <boxGeometry args={[0.032, 0.44, 0.012]} />
        </mesh>
        {[-0.08, 0, 0.08, 0.16].map((yOffset, bIdx) => (
          <mesh key={bIdx} position={[0, 0.22 + yOffset, 0.243]} material={goldMaterial}>
            <sphereGeometry args={[0.007, 10, 10]} />
          </mesh>
        ))}

        {/* Left Arm & Articulated Hand (Target: 'armL.quaternion') */}
        <group name="armL" position={[-0.34, 0.45, 0]}>
          <mesh material={kurtaMaterial}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[-0.04, -0.16, 0]} rotation={[0, 0, 0.15]} material={kurtaMaterial}>
            <cylinderGeometry args={[0.07, 0.06, 0.28, 16]} />
          </mesh>
          {/* Left Elbow & Forearm */}
          <group name="elbowL" position={[-0.08, -0.32, 0]}>
            <mesh material={kurtaMaterial}>
              <sphereGeometry args={[0.06, 14, 14]} />
            </mesh>
            <mesh position={[0, -0.15, 0.02]} rotation={[0.1, 0, 0]} material={skinMaterial}>
              <cylinderGeometry args={[0.052, 0.045, 0.26, 16]} />
            </mesh>
            {/* Left Hand with 5 Articulated Fingers */}
            <group position={[0, -0.3, 0.02]}>
              <mesh material={skinMaterial}>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
              <mesh position={[0.038, 0.01, 0.01]} rotation={[0, 0, -0.45]} material={skinMaterial}>
                <cylinderGeometry args={[0.01, 0.008, 0.045, 10]} />
              </mesh>
              {[-0.022, -0.007, 0.007, 0.022].map((fX, fIdx) => (
                <mesh key={fIdx} position={[fX, -0.055, 0]} material={skinMaterial}>
                  <cylinderGeometry args={[0.009, 0.008, 0.05, 10]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>

        {/* Right Arm & Articulated Hand (Target: 'armR.quaternion') */}
        <group name="armR" position={[0.34, 0.45, 0]}>
          <mesh material={kurtaMaterial}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
          <mesh position={[0.04, -0.16, 0]} rotation={[0, 0, -0.15]} material={kurtaMaterial}>
            <cylinderGeometry args={[0.07, 0.06, 0.28, 16]} />
          </mesh>
          {/* Right Elbow & Forearm */}
          <group name="elbowR" position={[0.08, -0.32, 0]}>
            <mesh material={kurtaMaterial}>
              <sphereGeometry args={[0.06, 14, 14]} />
            </mesh>
            <mesh position={[0, -0.15, 0.02]} rotation={[0.1, 0, 0]} material={skinMaterial}>
              <cylinderGeometry args={[0.052, 0.045, 0.26, 16]} />
            </mesh>
            {/* Right Hand with 5 Articulated Fingers */}
            <group position={[0, -0.3, 0.02]}>
              <mesh material={skinMaterial}>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
              <mesh position={[-0.038, 0.01, 0.01]} rotation={[0, 0, 0.45]} material={skinMaterial}>
                <cylinderGeometry args={[0.01, 0.008, 0.045, 10]} />
              </mesh>
              {[-0.022, -0.007, 0.007, 0.022].map((fX, fIdx) => (
                <mesh key={fIdx} position={[fX, -0.055, 0]} material={skinMaterial}>
                  <cylinderGeometry args={[0.009, 0.008, 0.05, 10]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.55, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.09, 0.1, 0.14, 20]} />
        </mesh>

        {/* ===================================================================
            3. HEAD NODE WITH MORPH TARGET FACIAL MESH (Target: 'head.quaternion')
           =================================================================== */}
        <group name="head" position={[0, 0.68, 0]}>
          {/* Dynamic Facial Mesh with Morph Targets mounted via primitive */}
          <primitive object={facialMorphMesh} />

          {/* Hair Sculpt */}
          <mesh position={[0, 0.18, -0.025]} scale={[0.96, 1.1, 1.1]} material={hairMaterial}>
            <sphereGeometry args={[0.205, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.28, 0.11]} rotation={[Math.PI / 2.3, 0, -0.2]} material={hairMaterial}>
            <torusGeometry args={[0.15, 0.05, 12, 24, Math.PI * 0.9]} />
          </mesh>

          {/* Eyebrows */}
          <mesh position={[-0.075, 0.19, 0.18]} rotation={[0, 0, 0.08]} material={hairMaterial}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
          </mesh>
          <mesh position={[0.075, 0.19, 0.18]} rotation={[0, 0, -0.08]} material={hairMaterial}>
            <boxGeometry args={[0.065, 0.014, 0.02]} />
          </mesh>

          {/* Eyes (Left & Right) with Hazel Iris */}
          <group position={[-0.072, 0.13, 0.17]}>
            <mesh material={skinMaterial}>
              <sphereGeometry args={[0.03, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.026]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#30180a" />
            </mesh>
          </group>
          <group position={[0.072, 0.13, 0.17]}>
            <mesh material={skinMaterial}>
              <sphereGeometry args={[0.03, 16, 16]} />
            </mesh>
            <mesh position={[0, 0, 0.026]}>
              <circleGeometry args={[0.015, 16]} />
              <meshBasicMaterial color="#30180a" />
            </mesh>
          </group>

          {/* Nose */}
          <mesh position={[0, 0.11, 0.21]} rotation={[-0.35, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.038, 0.12, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// =========================================================================
// 5. CAMERA RIG MANAGER: Smooth Transitions Between Presets
// =========================================================================
const CameraRig: React.FC<{ viewPreset: CameraViewPreset }> = ({ viewPreset }) => {
  const { camera } = useThree();

  const cameraTargets = useMemo(
    () => ({
      // Full-body view framing head-to-toe with generous margin (y=0 to y=1.65)
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
// 6. MAIN VIRTUAL TUTOR COMPONENT EXPORT
// =========================================================================
export const VirtualTutor: React.FC<VirtualTutorProps> = ({
  state = 'idle',
  isSpeechPlaying = false,
  audioLevel = 0,
  size = 320,
  className = '',
  interactive = true,
  onClick,
  showStatusLabel = true,
  showCameraControls = true,
  showActionControls = true,
  onSpeechStart,
  onSpeechEnd,
  onStateChange
}) => {
  const normalizedState: TutorState =
    state === 'processing' ? 'thinking' : state === 'blocked' ? 'error' : state;

  const [tutorState, setTutorState] = useState<TutorState>(normalizedState);
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('full');
  const controllerRef = useRef<AnimationController | null>(null);

  // Sync external state changes with AnimationController
  useEffect(() => {
    setTutorState(normalizedState);
    if (controllerRef.current) {
      controllerRef.current.setAiState(normalizedState);
    }
  }, [normalizedState]);

  // Sync speech playback application event
  useEffect(() => {
    if (!controllerRef.current) return;
    if (isSpeechPlaying) {
      controllerRef.current.handleSpeechStart();
      onSpeechStart?.();
    } else {
      controllerRef.current.handleSpeechEnd();
      onSpeechEnd?.();
    }
  }, [isSpeechPlaying]);

  // Sync real-time audio viseme amplitude
  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.setAudioLevel(audioLevel);
    }
  }, [audioLevel]);

  const handleActionSelect = (action: TutorState) => {
    setTutorState(action);
    if (controllerRef.current) {
      controllerRef.current.setAiState(action);
    }
    onStateChange?.(action);
  };

  // Status Badge Metadata
  const getBadgeInfo = () => {
    switch (tutorState) {
      case 'listening':
        return {
          icon: <Mic className="w-3.5 h-3.5 text-[#00E6A0] animate-pulse" />,
          text: 'Listening...',
          kannada: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'thinking':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#8257FF] animate-spin" />,
          text: 'Thinking...',
          kannada: 'ಆಲೋಚಿಸುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#8257FF]/40 text-[#8257FF] bg-[#8257FF]/10'
        };
      case 'speaking':
        return {
          icon: <Volume2 className="w-3.5 h-3.5 text-[#00D9FF] animate-bounce" />,
          text: 'Speaking',
          kannada: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#00D9FF]/40 text-[#00D9FF] bg-[#00D9FF]/10'
        };
      case 'teaching':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Teaching Lesson',
          kannada: 'ಪಾಠ ಹೇಳಿಕೊಡುತ್ತಿದ್ದೇನೆ',
          badgeClass: 'border-[#00E6A0]/40 text-[#00E6A0] bg-[#00E6A0]/10'
        };
      case 'waving':
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#00D9FF]" />,
          text: 'Namaskara!',
          kannada: 'ನಮಸ್ಕಾರ!',
          badgeClass: 'border-[#00D9FF]/40 text-[#00D9FF] bg-[#00D9FF]/10'
        };
      case 'walking':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-[#8257FF]" />,
          text: 'Walking Practice',
          kannada: 'ನಡಿಗೆ ಅಭ್ಯಾಸ',
          badgeClass: 'border-[#8257FF]/40 text-[#8257FF] bg-[#8257FF]/10'
        };
      case 'success':
        return {
          icon: <Check className="w-3.5 h-3.5 text-[#00E6A0]" />,
          text: 'Excellent! ಸಾಧನೆ',
          kannada: 'ಉತ್ತಮ ಸಾಧನೆ!',
          badgeClass: 'border-[#00E6A0]/50 text-[#00E6A0] bg-[#00E6A0]/20'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-[#FF5268]" />,
          text: 'Retry Needed',
          kannada: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
          badgeClass: 'border-[#FF5268]/40 text-[#FF5268] bg-[#FF5268]/10'
        };
      default:
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-[#00D9FF]" />,
          text: 'Ready to Teach',
          kannada: 'ಕಲಿಯಲು ಸಿದ್ಧರಾಗಿ',
          badgeClass: 'border-[#00D9FF]/30 text-[#F1F7FF] bg-[#071D32]/80'
        };
    }
  };

  const badge = getBadgeInfo();

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
        className="w-full h-full relative cursor-pointer focus:outline-none rounded-3xl overflow-hidden"
        role="region"
        aria-label="Full-Body Virtual Tutor 3D Canvas"
      >
        <Canvas
          shadows
          camera={{ position: [0, 0.82, 2.75], fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15
          }}
        >
          {/* Smooth camera animation between full-body, upper, and face presets */}
          <CameraRig viewPreset={cameraPreset} />

          {/* Three-Point Studio Lighting */}
          <directionalLight position={[1.8, 3.2, 2.2]} intensity={2.6} castShadow />
          <directionalLight position={[-2.2, 1.8, 1.5]} intensity={1.2} color="#7ed0ff" />
          <directionalLight
            position={[0, 2.5, -2.4]}
            intensity={2.8}
            color={
              tutorState === 'thinking'
                ? '#8257FF'
                : tutorState === 'speaking'
                ? '#00D9FF'
                : '#00E6A0'
            }
          />
          <hemisphereLight args={['#0d2847', '#04111f', 0.8]} />

          {/* Full-Body Procedural Rigged Model */}
          <Suspense fallback={null}>
            <FullBodyRig controllerRef={controllerRef} tutorState={tutorState} />
          </Suspense>

          {/* Frame update runner for AnimationController */}
          <FrameUpdater controllerRef={controllerRef} />

          {/* Ground Contact Shadow */}
          <ContactShadows position={[0, 0.01, 0]} opacity={0.65} scale={2.4} blur={1.4} far={1.6} color="#04111F" />

          {/* OrbitControls with constrained rotation */}
          <OrbitControls
            target={[0, 0.8, 0]}
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

      {/* Camera View Switcher Buttons (Full-Body / Upper / Face) */}
      {showCameraControls && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 p-1 bg-[#04111F]/80 border border-[#00D9FF]/20 rounded-xl backdrop-blur-md text-[11px] shadow-lg">
          <button
            onClick={() => setCameraPreset('full')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
              cameraPreset === 'full'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold border border-[#00E6A0]/40'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
            title="Full-Body View"
          >
            Full-Body
          </button>
          <button
            onClick={() => setCameraPreset('upper')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
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
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
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

      {/* Action Pose Switcher (Teach / Wave / Walk / Idle) */}
      {showActionControls && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 p-1 bg-[#04111F]/80 border border-[#00D9FF]/20 rounded-xl backdrop-blur-md text-[11px] shadow-lg">
          <button
            onClick={() => handleActionSelect('teaching')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'teaching'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
          >
            Teach
          </button>
          <button
            onClick={() => handleActionSelect('waving')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'waving'
                ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
          >
            Wave
          </button>
          <button
            onClick={() => handleActionSelect('walking')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'walking'
                ? 'bg-[#8257FF]/20 text-[#8257FF] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
          >
            Walk
          </button>
          <button
            onClick={() => handleActionSelect('idle')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
              tutorState === 'idle'
                ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold'
                : 'text-[#9BB1C8] hover:text-white'
            }`}
          >
            Idle
          </button>
        </div>
      )}

      {/* Status Label Badge */}
      {showStatusLabel && (
        <div
          className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md shadow-lg pointer-events-none transition-all duration-300 ${badge.badgeClass}`}
        >
          {badge.icon}
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold tracking-wide leading-none">{badge.text}</span>
            <span className="text-[9px] font-kannada text-[#9BB1C8] leading-none mt-0.5">{badge.kannada}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper inside Canvas to call AnimationController.update on every frame
const FrameUpdater: React.FC<{ controllerRef: React.MutableRefObject<AnimationController | null> }> = ({
  controllerRef
}) => {
  useFrame((state, delta) => {
    if (controllerRef.current) {
      controllerRef.current.update(delta, state.clock.getElapsedTime());
    }
  });
  return null;
};
