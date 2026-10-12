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

  const ivory = context.createLinearGradient(0, 0, 256, 256);
  ivory.addColorStop(0, "#f4e6ca");
  ivory.addColorStop(0.5, "#e6d2ad");
  ivory.addColorStop(1, "#cbb38e");
  context.fillStyle = ivory;
  context.fillRect(0, 0, 256, 256);

  // Нерівності кістки: текстура генерується один раз для кожної грані.
  let seed = value * 997 + 31;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let index = 0; index < 1100; index += 1) {
    context.fillStyle = random() > 0.5 ? "rgba(92, 68, 44, 0.055)" : "rgba(255, 248, 225, 0.11)";
    const size = 0.5 + random() * 2;
    context.fillRect(random() * 256, random() * 256, size, size);
  }
  context.strokeStyle = "rgba(120, 91, 56, 0.22)";
  context.lineWidth = 3;
  context.strokeRect(7, 7, 242, 242);
  for (const pip of PIPS[value]) {
    const x = 54 + ((pip - 1) % 3) * 74;
    const y = 54 + Math.floor((pip - 1) / 3) * 74;
    context.fillStyle = "rgba(255, 242, 205, 0.8)";
    context.beginPath();
    context.arc(x + 1, y + 2, 20, 0, Math.PI * 2);
    context.fill();
    const inset = context.createRadialGradient(x - 4, y - 5, 2, x, y, 18);
    inset.addColorStop(0, "#291e1a");
    inset.addColorStop(0.72, "#4b3029");
    inset.addColorStop(1, "#89684a");
    context.fillStyle = inset;
    context.beginPath();
    context.arc(x, y, 17, 0, Math.PI * 2);
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
  context.fillStyle = "#354039";
  context.fillRect(0, 0, 512, 512);
  // Потерте сукно з м'якими плямами та короткими волокнами.
  let seed = 137;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let index = 0; index < 75; index += 1) {
    const x = random() * 512;
    const y = random() * 512;
    const radius = 18 + random() * 75;
    const stain = context.createRadialGradient(x, y, 0, x, y, radius);
    stain.addColorStop(0, random() > 0.5 ? "rgba(162, 139, 95, 0.055)" : "rgba(10, 18, 15, 0.09)");
    stain.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = stain;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  for (let index = 0; index < 1400; index += 1) {
    const y = random() * 512;
    const x = random() * 512;
    context.strokeStyle = random() > 0.5 ? "#b1a07a" : "#121c1a";
    context.globalAlpha = 0.055 + random() * 0.12;
    context.lineWidth = 0.4 + random() * 0.8;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 2 + random() * 8, y + random() * 2 - 1);
    context.stroke();
  }
  context.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function rimTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D unavailable");
  context.fillStyle = "#57351f";
  context.fillRect(0, 0, 512, 512);
  let seed = 721;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let index = 0; index < 110; index += 1) {
    const y = random() * 512;
    context.strokeStyle = random() > 0.5 ? "rgba(210, 146, 79, 0.24)" : "rgba(24, 12, 7, 0.23)";
    context.lineWidth = 0.6 + random() * 3;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(150, y + random() * 12, 350, y - random() * 12, 512, y + random() * 6);
    context.stroke();
  }
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

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.set(0, 5.7, 7.3);
    camera.lookAt(0, 0.1, 0);

    scene.add(new THREE.HemisphereLight(0xffe4bc, 0x222b24, 1.15));
    const lamp = new THREE.DirectionalLight(0xffc782, 3.1);
    lamp.position.set(-4, 7, 5);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(coarsePointer ? 512 : 1024, coarsePointer ? 512 : 1024);
    lamp.shadow.camera.left = -5;
    lamp.shadow.camera.right = 5;
    lamp.shadow.camera.top = 4;
    lamp.shadow.camera.bottom = -4;
    scene.add(lamp);

    const felt = tableTexture();
    const wood = rimTexture();
    const feltMaterial = new THREE.MeshStandardMaterial({ map: felt, roughness: 1 });
    const rimMaterial = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.82 });
    const baseGeometry = new THREE.CylinderGeometry(2.8, 2.87, 0.24, 64);
    const base = new THREE.Mesh(baseGeometry, rimMaterial);
    base.position.y = -0.13;
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    const feltGeometry = new THREE.CircleGeometry(2.57, 64);
    const feltSurface = new THREE.Mesh(feltGeometry, feltMaterial);
    feltSurface.rotation.x = -Math.PI / 2;
    feltSurface.position.y = 0.005;
    feltSurface.receiveShadow = true;
    scene.add(feltSurface);
    const rimGeometry = new THREE.TorusGeometry(2.65, 0.2, 12, 80);
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.13;
    rim.castShadow = true;
    rim.receiveShadow = true;
    scene.add(rim);

    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -19, 0), allowSleep: true });
    world.defaultContactMaterial.friction = 0.42;
    world.defaultContactMaterial.restitution = 0.26;
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // Сегменти повторюють округлий дерев'яний край, тому кубики не проходять крізь лоток.
    for (let index = 0; index < 20; index += 1) {
      const angle = (index / 20) * Math.PI * 2;
      const wall = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(0.45, 1.6, 0.18)),
        position: new CANNON.Vec3(Math.sin(angle) * 2.55, 1.6, Math.cos(angle) * 2.55),
      });
      wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), angle);
      world.addBody(wall);
    }

    const textures = FACE_VALUES.map(faceTexture);
    const materials = textures.map((map) => new THREE.MeshStandardMaterial({ map, roughness: 0.68 }));
    const geometry = new RoundedBoxGeometry(1.06, 1.06, 1.06, 4, 0.16);
    const meshes: THREE.Mesh[] = [];
    const bodies: CANNON.Body[] = [];

    for (let index = 0; index < 2; index += 1) {
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.position.set(index === 0 ? -0.79 : 0.79, 0.53, 0.25);
      scene.add(mesh);
      meshes.push(mesh);

      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.53, 0.53, 0.53)),
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
      camera.position.z = camera.aspect < 1.15 ? 9.2 : 7.3;
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
        body.position.set(index === 0 ? -1.15 : 1.15, 3.0 + index * 0.35, -0.25);
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
      baseGeometry.dispose();
      feltGeometry.dispose();
      feltMaterial.dispose();
      felt.dispose();
      wood.dispose();
      rimGeometry.dispose();
      rimMaterial.dispose();
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
