import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface KannadaVoiceCore3DProps {
  state?: 'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked';
  audioLevel?: number; // 0.0 to 1.0
  size?: number | string; // e.g. 320, '100%'
  interactive?: boolean;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

export const KannadaVoiceCore3D: React.FC<KannadaVoiceCore3DProps> = ({
  state = 'idle',
  audioLevel = 0,
  size = 340,
  interactive = true,
  onClick,
  showStatusLabel = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References to keep state in animation loop without re-instantiating scene
  const stateRef = useRef(state);
  const audioLevelRef = useRef(audioLevel);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      setWebglSupported(false);
      return;
    }

    // Colors matching "Kannada AI Universe" palette
    const emeraldColor = new THREE.Color(0x00e6a0);
    const cyanColor = new THREE.Color(0x00d9ff);
    const violetColor = new THREE.Color(0x8257ff);
    const deepBlueColor = new THREE.Color(0x071d32);

    // Root Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 2. Central Core: Inner Luminous Nucleus
    const innerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x04111f,
      emissive: cyanColor,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: 0.95
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // 3. Middle Faceted Energy Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.65, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: emeraldColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: emeraldColor,
      emissiveIntensity: 0.4
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // 4. Outer Translucent Glass Halo
    const outerGeo = new THREE.SphereGeometry(1.9, 32, 32);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x071d32,
      emissive: cyanColor,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.4
    });
    const outerSphere = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerSphere);

    // 5. Concentric Orbital Rings
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    const rings: THREE.Mesh[] = [];
    const ringRadii = [2.25, 2.7, 3.15];
    const ringColors = [cyanColor, emeraldColor, violetColor];

    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 96);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[i],
        emissive: ringColors[i],
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.75,
        roughness: 0.3
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = (Math.PI / 4) * (i + 1);
      ringMesh.rotation.y = (Math.PI / 6) * (i + 1);
      ringGroup.add(ringMesh);
      rings.push(ringMesh);

      // Add a tiny luminous satellite node orbiting on ring
      const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(radius, 0, 0);
      ringMesh.add(nodeMesh);
    });

    // 6. Ambient Celestial Star/Particle Cloud
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.6 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixVal = Math.random();
      const pColor = mixVal > 0.5 ? emeraldColor : cyanColor;
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x071d32, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(cyanColor, 3, 12);
    cyanLight.position.set(3, 3, 3);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(emeraldColor, 3, 12);
    emeraldLight.position.set(-3, -2, 2);
    scene.add(emeraldLight);

    const violetLight = new THREE.PointLight(violetColor, 2.5, 10);
    violetLight.position.set(0, 4, -2);
    scene.add(violetLight);

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.45;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const curState = stateRef.current;
      const curAudio = audioLevelRef.current;

      // Mouse lerp tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      coreGroup.rotation.y = mouseRef.current.x * 0.8 + time * 0.15;
      coreGroup.rotation.x = -mouseRef.current.y * 0.6 + Math.sin(time * 0.4) * 0.05;

      // Ambient particles rotation
      particles.rotation.y = time * 0.04;
      particles.rotation.x = time * 0.02;

      // State-driven dynamics
      let speedFactor = 1.0;
      let targetScale = 1.0;
      let emissiveIntensity = 0.8;
      let emissiveColor = cyanColor;

      if (curState === 'listening') {
        speedFactor = 2.2;
        targetScale = 1.08 + Math.sin(time * 6) * 0.08 + curAudio * 0.25;
        emissiveColor = emeraldColor;
        emissiveIntensity = 1.6 + Math.sin(time * 8) * 0.4;
      } else if (curState === 'processing') {
        speedFactor = 3.5;
        targetScale = 0.96 + Math.sin(time * 10) * 0.06;
        emissiveColor = violetColor;
        emissiveIntensity = 1.8;
      } else if (curState === 'speaking') {
        speedFactor = 1.8;
        targetScale = 1.05 + Math.sin(time * 8) * 0.12 + curAudio * 0.35;
        emissiveColor = emeraldColor;
        emissiveIntensity = 1.5 + Math.sin(time * 5) * 0.3;
      } else if (curState === 'error') {
        speedFactor = 0.5;
        targetScale = 0.95;
        emissiveColor = new THREE.Color(0xff5268);
        emissiveIntensity = 1.2;
      } else {
        // Idle
        speedFactor = 1.0;
        targetScale = 1.0 + Math.sin(time * 1.5) * 0.04;
        emissiveColor = cyanColor;
        emissiveIntensity = 0.85 + Math.sin(time * 2) * 0.2;
      }

      // Smooth scale interpolation
      coreGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Rotate individual orbital rings
      rings.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += delta * (0.4 + idx * 0.18) * speedFactor * dir;
        ring.rotation.x += delta * (0.2 + idx * 0.12) * speedFactor;
      });

      // Cage rotation & breathing
      cageMesh.rotation.y -= delta * 0.3 * speedFactor;
      cageMesh.rotation.z += delta * 0.2 * speedFactor;

      // Update inner sphere emissive color & intensity
      innerMat.emissive.lerp(emissiveColor, 0.08);
      innerMat.emissiveIntensity = emissiveIntensity;
      cageMat.emissive.lerp(emissiveColor, 0.08);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);

      // Dispose Three.js objects
      innerGeo.dispose();
      innerMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        if (Array.isArray(r.material)) {
          r.material.forEach((m) => m.dispose());
        } else {
          r.material.dispose();
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  // Text label helper for state
  const getStatusBadge = () => {
    switch (state) {
      case 'listening':
        return {
          label: 'Listening...',
          labelKannada: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...',
          color: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/60 shadow-[0_0_15px_rgba(0,230,160,0.4)]',
          dot: 'bg-emerald-400 animate-ping'
        };
      case 'processing':
        return {
          label: 'Processing AI Response...',
          labelKannada: 'ಆಲೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
          color: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/60 shadow-[0_0_15px_rgba(0,217,255,0.4)]',
          dot: 'bg-cyan-400 animate-spin'
        };
      case 'speaking':
        return {
          label: 'Voice Output Active',
          labelKannada: 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...',
          color: 'text-teal-300 border-teal-500/50 bg-teal-950/60 shadow-[0_0_15px_rgba(20,184,166,0.4)]',
          dot: 'bg-teal-400 animate-pulse'
        };
      case 'error':
      case 'blocked':
        return {
          label: state === 'blocked' ? 'Mic Access Blocked' : 'Attention Needed',
          labelKannada: state === 'blocked' ? 'ಮೈಕ್ ಅನುಮತಿ ಇಲ್ಲ' : 'ಗಮನಿಸಿ',
          color: 'text-rose-400 border-rose-500/50 bg-rose-950/60',
          dot: 'bg-rose-400'
        };
      default:
        return {
          label: 'Kannada Voice Core · Ready',
          labelKannada: 'ಕನ್ನಡ ಧ್ವನಿ ಸಿದ್ಧವಾಗಿದೆ',
          color: 'text-slate-300 border-slate-700/70 bg-[#071D32]/60 hover:border-emerald-500/40',
          dot: 'bg-emerald-400 animate-pulse'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      className={`relative flex flex-col items-center justify-center transition-transform select-none ${
        interactive ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={interactive ? 'button' : 'figure'}
      tabIndex={interactive ? 0 : -1}
      aria-label={`Kannada AI Voice Core: ${status.label} (${status.labelKannada})`}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* 3D WebGL Canvas Container */}
      {webglSupported ? (
        <div ref={containerRef} className="w-full h-full relative z-10" />
      ) : (
        /* Graceful High-Fidelity CSS/SVG Fallback */
        <div className="w-full h-full flex items-center justify-center relative z-10">
          <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
            {/* Pulsing outer rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping opacity-60" />
            <div className="absolute -inset-4 rounded-full border border-emerald-400/20 animate-spin" style={{ animationDuration: '14s' }} />
            <div className="absolute -inset-8 rounded-full border border-violet-500/20 animate-spin" style={{ animationDuration: '22s', animationDirection: 'reverse' }} />
            {/* Glowing core */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#00E6A0] via-[#00D9FF] to-[#8257FF] shadow-[0_0_50px_rgba(0,217,255,0.6)] animate-pulse flex items-center justify-center text-slate-950 font-kannada font-bold text-3xl">
              ಕ
            </div>
          </div>
        </div>
      )}

      {/* Atmospheric Radial Glow behind orb */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-full blur-3xl transition-opacity duration-700 ${
          state === 'listening'
            ? 'bg-emerald-500/25 opacity-100'
            : state === 'processing'
            ? 'bg-violet-600/25 opacity-100'
            : state === 'speaking'
            ? 'bg-teal-500/25 opacity-100'
            : isHovered
            ? 'bg-cyan-500/20 opacity-80'
            : 'bg-cyan-500/10 opacity-50'
        }`}
      />

      {/* Accessible Interactive Status Label */}
      {showStatusLabel && (
        <div className="absolute -bottom-2 z-20 transition-all duration-300">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium backdrop-blur-md transition-all ${status.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className="font-medium tracking-wide">{status.label}</span>
            <span className="text-slate-400">·</span>
            <span className="font-kannada text-[11px] opacity-90">{status.labelKannada}</span>
          </div>
        </div>
      )}
    </div>
  );
};
