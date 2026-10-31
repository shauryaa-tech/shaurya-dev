import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

extend({ OrbitControls });

const TECH = ["Python", "RAG", "LLM", "React", "Node", "AI"];

function Controls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.enablePan = false;
    c.enableZoom = true;
    c.minDistance = 4.2;
    c.maxDistance = 8.5;
    c.autoRotate = true;
    c.autoRotateSpeed = 0.7;
    c.minPolarAngle = Math.PI * 0.28;
    c.maxPolarAngle = Math.PI * 0.72;
    return c;
  }, [camera, gl]);

  useFrame(() => {
    controls.update();
  });

  return null;
}

function Stars({ count = 280 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c8fbff" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function Core() {
  const mesh = useRef();
  const mat = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) mesh.current.rotation.y = t * 0.25;
    if (mat.current) mat.current.emissiveIntensity = 0.55 + Math.sin(t * 2) * 0.2;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.15, 2]} />
      <meshStandardMaterial
        ref={mat}
        color="#0a1a2e"
        emissive="#00e5ff"
        emissiveIntensity={0.65}
        metalness={0.7}
        roughness={0.25}
        wireframe={false}
      />
      <mesh>
        <icosahedronGeometry args={[1.18, 1]} />
        <meshBasicMaterial color="#5ef8ff" wireframe transparent opacity={0.35} />
      </mesh>
    </mesh>
  );
}

function Ring({ radius, speed, color, tilt = 0.4 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0.2, 0]}>
      <torusGeometry args={[radius, 0.018, 12, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

function TechNode({ label, angle, radius, y, speed }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + angle;
    if (!ref.current) return;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = y + Math.sin(t * 1.4) * 0.12;
    ref.current.lookAt(0, 0, 0);
  });

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = "rgba(6, 16, 32, 0.85)";
    roundRect(ctx, 8, 10, 240, 44, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.7)";
    ctx.lineWidth = 3;
    roundRect(ctx, 8, 10, 240, 44, 18);
    ctx.stroke();
    ctx.fillStyle = "#baf8ff";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 34);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, [label]);

  return (
    <sprite ref={ref} scale={[1.15, 0.3, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-3, 2, 2]} intensity={40} color="#00F0FF" distance={18} />
      <pointLight position={[3, -1, -2]} intensity={28} color="#A855F7" distance={16} />
      <fog attach="fog" args={["#030712", 8, 18]} />

      <Stars />
      <Core />
      <Ring radius={1.75} speed={0.35} color="#00e5ff" tilt={0.55} />
      <Ring radius={2.15} speed={-0.22} color="#a78bfa" tilt={-0.35} />
      <Ring radius={2.55} speed={0.16} color="#5ef8ff" tilt={0.15} />

      {TECH.map((label, i) => (
        <TechNode
          key={label}
          label={label}
          angle={(i / TECH.length) * Math.PI * 2}
          radius={2.9}
          y={(i % 3) * 0.35 - 0.35}
          speed={0.18 + (i % 3) * 0.03}
        />
      ))}

      <Controls />
    </>
  );
}

export default function HeroOrbit3D() {
  return (
    <div className="hero-orbit3d" data-testid="hero-orbit3d" data-lenis-prevent>
      <Canvas
        camera={{ position: [0, 0.6, 6.2], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <p className="hero-orbit3d__hint">
        <span className="hero-orbit3d__dot" />
        Drag to explore · scroll to zoom
      </p>
    </div>
  );
}
