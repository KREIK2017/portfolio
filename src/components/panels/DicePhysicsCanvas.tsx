"use client";

import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const FACE_VALUES = [3, 4, 1, 6, 2, 5] as const;
const FACE_NORMALS = [
  new CANNON.Vec3(1, 0, 0),
  new CANNON.Vec3(-1, 0, 0),
  new CANNON.Vec3(0, 1, 0),
  new CANNON.Vec3(0, -1, 0),
  new CANNON.Vec3(0, 0, 1),
  new CANNON.Vec3(0, 0, -1),
];
const PIPS: Record<number, number[]> = {
  1: [5], 2: [1, 9], 3: [1, 5, 9],
  4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
};

function faceTexture(value: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");

  context.fillStyle = "#ead9bb";
  context.fillRect(0, 0, 256, 256);
  context.strokeStyle = "#b89c72";
  context.lineWidth = 7;
  context.strokeRect(7, 7, 242, 242);
  context.fillStyle = "#603c32";
  for (const pip of PIPS[value]) {
    const x = 54 + ((pip - 1) % 3) * 74;
    const y = 54 + Math.floor((pip - 1) / 3) * 74;
    context.beginPath();
    context.arc(x, y, 18, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function tableTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");
  context.fillStyle = "#493732";
  context.fillRect(0, 0, 512, 512);
  // Приглушене сукно: нерівні волокна замість рівної плоскої заливки.
  let seed = 137;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let index = 0; index < 450; index += 1) {
    const y = random() * 512;
    const x = random() * 512;
    context.strokeStyle = random() > 0.5 ? "#916f5e" : "#221b1b";
    context.globalAlpha = 0.035 + random() * 0.1;
    context.lineWidth = 0.5 + random() * 1.2;
    context.beginPath();
    context.moveTo(x, y);
    context.bezierCurveTo(x + 25, y - 3, x + 70, y + 3, x + 105 + random() * 100, y);
    context.stroke();
  }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Значення беремо з фізичної орієнтації тіла, а не з випадково згенерованого фіналу. */
function topFace(body: CANNON.Body): number {
  let bestIndex = 0;
  let bestHeight = -Infinity;
  for (let index = 0; index < FACE_NORMALS.length; index += 1) {
    const height = body.quaternion.vmult(FACE_NORMALS[index]).y;
    if (height > bestHeight) {
      bestHeight = height;
      bestIndex = index;
    }
  }
  return FACE_VALUES[bestIndex];
}

interface DicePhysicsCanvasProps {
  rollToken: number;
  reducedMotion: boolean;
  onReady: () => void;
  onSettled: (dice: [number, number]) => void;
  onUnavailable: () => void;
}

export default function DicePhysicsCanvas({
  rollToken,
  reducedMotion,
  onReady,
  onSettled,
  onUnavailable,
}: DicePhysicsCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const throwRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      onUnavailable();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 4.0, 5.7);
    camera.lookAt(0, 0.55, 0);

    scene.add(new THREE.HemisphereLight(0xffefd3, 0x493729, 1.65));
    const lamp = new THREE.DirectionalLight(0xffddab, 3.1);
    lamp.position.set(-3, 7, 4);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(512, 512);
    lamp.shadow.camera.left = -5;
    lamp.shadow.camera.right = 5;
    lamp.shadow.camera.top = 4;
    lamp.shadow.camera.bottom = -4;
    scene.add(lamp);

    const floorGeometry = new THREE.PlaneGeometry(8, 5.4);
    const wood = tableTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({ map: wood, roughness: 1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x805634, roughness: 0.85 });
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0x947344, metalness: 0.45, roughness: 0.5 });
    const rimGeometry = new THREE.BoxGeometry(7.4, 0.23, 0.13);
    for (const z of [-2.54, 2.54]) {
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      rim.position.set(0, 0.07, z);
      rim.receiveShadow = true;
      scene.add(rim);
    }
    const sideRimGeometry = new THREE.BoxGeometry(0.13, 0.23, 5.1);
    for (const x of [-3.64, 3.64]) {
      const rim = new THREE.Mesh(sideRimGeometry, rimMaterial);
      rim.position.set(x, 0.07, 0);
      rim.receiveShadow = true;
      scene.add(rim);
    }
    const accentGeometry = new THREE.BoxGeometry(7.15, 0.015, 0.02);
    const accent = new THREE.Mesh(accentGeometry, brassMaterial);
    accent.position.set(0, 0.2, 2.47);
    scene.add(accent);

    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -19, 0), allowSleep: true });
    world.defaultContactMaterial.friction = 0.42;
    world.defaultContactMaterial.restitution = 0.26;
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    const addWall = (x: number, z: number, halfX: number, halfZ: number) => {
      world.addBody(new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(halfX, 2.5, halfZ)),
        position: new CANNON.Vec3(x, 2.5, z),
      }));
    };
    addWall(-3.6, 0, 0.1, 2.8);
    addWall(3.6, 0, 0.1, 2.8);
    addWall(0, -2.5, 3.7, 0.1);
    addWall(0, 2.5, 3.7, 0.1);

    const textures = FACE_VALUES.map(faceTexture);
    const materials = textures.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 0.72 }));
    const geometry = new RoundedBoxGeometry(0.86, 0.86, 0.86, 3, 0.09);
    const meshes: THREE.Mesh[] = [];
    const bodies: CANNON.Body[] = [];

    for (let index = 0; index < 2; index += 1) {
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.position.set(index === 0 ? -0.7 : 0.7, 0.43, 0);
      scene.add(mesh);
      meshes.push(mesh);

      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.43, 0.43, 0.43)),
        linearDamping: 0.24,
        angularDamping: 0.3,
        sleepSpeedLimit: 0.22,
        sleepTimeLimit: 0.55,
      });
      body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
      world.addBody(body);
      bodies.push(body);
    }

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frame = 0;
    let rolling = false;
    let start = 0;
    let previous = 0;
    const sync = () => {
      bodies.forEach((body, index) => {
        meshes[index].position.set(body.position.x, body.position.y, body.position.z);
        meshes[index].quaternion.set(body.quaternion.x, body.quaternion.y, body.quaternion.z, body.quaternion.w);
      });
      renderer.render(scene, camera);
    };
    const finish = () => {
      rolling = false;
      for (const body of bodies) body.sleep();
      sync();
      onSettled([topFace(bodies[0]), topFace(bodies[1])]);
    };
    const tick = (now: number) => {
      if (!rolling) return;
      world.step(1 / 60, Math.min((now - previous) / 1000, 0.05), 5);
      previous = now;
      sync();
      if ((bodies.every((body) => body.sleepState === CANNON.Body.SLEEPING) && now - start > 700) || now - start > 6500) {
        finish();
      } else {
        frame = window.requestAnimationFrame(tick);
      }
    };

    throwRef.current = () => {
      window.cancelAnimationFrame(frame);
      bodies.forEach((body, index) => {
        body.position.set(index === 0 ? -1.25 : 1.25, 3.0 + index * 0.35, -0.25);
        body.velocity.set(index === 0 ? 1.9 : -1.9, 0, Math.random() * 2 - 1);
        body.quaternion.setFromEuler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        body.angularVelocity.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 18);
        body.wakeUp();
      });
      rolling = true;
      if (reducedMotion) {
        for (let step = 0; step < 420; step += 1) world.step(1 / 60);
        finish();
        return;
      }
      start = previous = performance.now();
      frame = window.requestAnimationFrame(tick);
    };
    onReady();

    return () => {
      throwRef.current = null;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      geometry.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      wood.dispose();
      rimGeometry.dispose();
      sideRimGeometry.dispose();
      accentGeometry.dispose();
      rimMaterial.dispose();
      brassMaterial.dispose();
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onSettled, onUnavailable, reducedMotion]);

  useEffect(() => {
    if (rollToken > 0) throwRef.current?.();
  }, [rollToken]);

  return <div ref={mountRef} className="dice-physics-canvas" aria-hidden="true" />;
}
