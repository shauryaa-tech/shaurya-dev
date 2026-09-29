import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

extend({ OrbitControls });

function Controls() {
  const { camera, gl } = useThree();
  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableZoom = false;
    c.enablePan = false;
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.autoRotate = true;
    c.autoRotateSpeed = 1.6;
    c.minPolarAngle = Math.PI / 2.7;
    c.maxPolarAngle = Math.PI / 1.7;
    return c;
  }, [camera, gl]);
  useEffect(() => () => controls.dispose(), [controls]);
  useFrame(() => controls.update());
  return null;
}

function Robot({ src }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, src);
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf]);
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    return { scale: 2.7 / size.y, center };
  }, [gltf]);

  useEffect(() => {
    if (!gltf.animations.length) return undefined;
    const idleClip = gltf.animations.find((c) => c.name === "Idle") || gltf.animations[0];
    const waveClip = gltf.animations.find((c) => c.name === "Wave");
    const idle = mixer.clipAction(idleClip);
    idle.play();
    let iv;
    if (waveClip) {
      const wave = mixer.clipAction(waveClip);
      wave.setLoop(THREE.LoopOnce, 1);
      mixer.addEventListener("finished", () => idle.reset().fadeIn(0.4).play());
      iv = setInterval(() => {
        idle.fadeOut(0.3);
        wave.reset().fadeIn(0.3).play();
      }, 9000);
      wave.play();
    }
    return () => {
      if (iv) clearInterval(iv);
      mixer.stopAllAction();
    };
  }, [gltf, mixer]);

  useFrame((state, delta) => {
    mixer.update(delta);
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
    }
  });

  return (
    <group ref={group} scale={fit.scale}>
      <primitive
        object={gltf.scene}
        position={[-fit.center.x, -fit.center.y, -fit.center.z]}
      />
    </group>
  );
}

export default function Robot3D({ src = "/models/robot.glb" }) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7.2], fov: 36 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <pointLight position={[-3, 1.5, 2]} intensity={60} color="#00F0FF" distance={16} />
      <pointLight position={[3, -0.5, -2]} intensity={50} color="#A855F7" distance={16} />
      <Robot key={src} src={src} />
      <Controls />
    </Canvas>
  );
}
