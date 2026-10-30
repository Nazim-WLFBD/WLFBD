'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const R = 2;
const DEG = Math.PI / 180; // degrees → radians

const CITIES = [
  { code: 'DAC', name: 'Dhaka', lat: 23.81, lon: 90.41, color: '#1b9c6b' },
  { code: 'PAR', name: 'Paris', lat: 48.86, lon: 2.35, color: '#5b7cff' },
  { code: 'YYZ', name: 'Toronto', lat: 43.65, lon: -79.38, color: '#ff3b4f' },
];

function toVec(lat: number, lon: number, r = R) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function arcPoints(a: THREE.Vector3, b: THREE.Vector3, lift = 0.55, n = 80) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = a.clone().lerp(b, t).normalize();
    pts.push(p.multiplyScalar(R + Math.sin(Math.PI * t) * lift));
  }
  return pts;
}

function DotSphere() {
  const geo = useMemo(() => {
    const count = 5200;
    const pos = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.034} color="#a9bcff" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Atmosphere() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color('#3d5cff') } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.72 - dot(vN, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(c, 1.0) * i; }`,
      }),
    [],
  );
  return (
    <mesh material={mat} scale={1.18}>
      <sphereGeometry args={[R, 64, 64]} />
    </mesh>
  );
}

function City({ code, lat, lon, color }: (typeof CITIES)[number]) {
  const p = useMemo(() => toVec(lat, lon, R + 0.01), [lat, lon]);
  const ring = useRef<THREE.Mesh>(null);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize()), [p]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = 1 + ((clock.elapsedTime * 0.8) % 1) * 2.4;
    ring.current.scale.setScalar(s);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - ((clock.elapsedTime * 0.8) % 1));
  });
  return (
    <group position={p} quaternion={q}>
      <mesh>
        <circleGeometry args={[0.045, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>
      <Label text={code} />
    </group>
  );
}

/** City code drawn to a canvas texture and shown as a camera-facing sprite. */
function Label({ text }: { text: string }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 56;
    const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(10,18,48,.88)';
    g.beginPath();
    g.roundRect(4, 4, 120, 48, 12);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.25)';
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = '#fff';
    g.font = 'bold 28px ui-monospace, monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(text, 64, 30);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text]);
  return (
    <sprite position={[0, 0.2, 0.06]} scale={[0.36, 0.16, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} />
    </sprite>
  );
}

function FlightArc({ from, to, color, delay }: { from: THREE.Vector3; to: THREE.Vector3; color: string; delay: number }) {
  const pts = useMemo(() => arcPoints(from, to), [from, to]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(pts), [pts]);
  const plane = useRef<THREE.Mesh>(null);
  // drei's Line forwards a ref to the underlying Line2
  const line = useRef<{ material: { dashOffset: number } } | null>(null);

  useFrame(({ clock }, dt) => {
    if (line.current) line.current.material.dashOffset -= dt * 0.35;
    if (plane.current) {
      const t = ((clock.elapsedTime * 0.12 + delay) % 1 + 1) % 1;
      plane.current.position.copy(curve.getPointAt(t));
      const s = Math.sin(Math.PI * t);
      plane.current.scale.setScalar(0.6 + s * 0.6);
    }
  });

  return (
    <group>
      <Line points={pts} color={color} lineWidth={1.2} transparent opacity={0.35} />
      <Line
        ref={line as never}
        points={pts}
        color={color}
        lineWidth={2.2}
        dashed
        dashSize={0.12}
        gapSize={0.18}
        transparent
        opacity={0.95}
      />
      <mesh ref={plane}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
}

/** Maple-leaf outline as a THREE.Shape (same path as the SVG icon). */
function mapleShape() {
  const raw =
    '50 2 58 20 66 14 64 38 78 26 82 34 96 32 90 46 98 50 74 68 78 78 54 74 55 98 45 98 46 74 22 78 26 68 2 50 10 46 4 32 18 34 22 26 36 38 34 14 42 20';
  const n = raw.split(' ').map(Number);
  const s = new THREE.Shape();
  for (let i = 0; i < n.length; i += 2) {
    const x = (n[i] - 50) / 100;
    const y = -(n[i + 1] - 50) / 100;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return s;
}

function Leaves({ count }: { count: number }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(mapleShape()), []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (Math.random() - 0.5) * 8,
        z: 0.5 + Math.random() * 2.2,
        speed: 0.18 + Math.random() * 0.22,
        sway: 0.4 + Math.random() * 0.6,
        spin: (Math.random() - 0.5) * 2,
        offset: i / count + Math.random() * 0.2,
        scale: 0.12 + Math.random() * 0.14,
      })),
    [count],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const k = ((t * s.speed * 0.25 + s.offset) % 1 + 1) % 1;
      dummy.position.set(s.x + Math.sin(t * s.sway + i) * 0.5, 3.4 - k * 7, s.z);
      dummy.rotation.set(t * s.spin * 0.6, t * s.spin, Math.sin(t + i) * 0.8);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshBasicMaterial color="#e0243a" side={THREE.DoubleSide} transparent opacity={0.85} />
    </instancedMesh>
  );
}

function Globe({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const tilt = useRef<THREE.Group>(null);
  const sway = useRef<THREE.Group>(null);
  const [dac, par, yyz] = useMemo(() => CITIES.map((c) => toVec(c.lat, c.lon)), []);

  // Turn the globe so the centroid of the three cities faces the camera,
  // which keeps Dhaka, Paris and Toronto (and both arcs) on the visible side.
  const base = useMemo(() => {
    const center = dac.clone().add(par).add(yyz).normalize();
    const align = new THREE.Quaternion().setFromUnitVectors(center, new THREE.Vector3(0, 0, 1));
    // Roll around the view axis so the route reads left→right: Toronto … Paris … Dhaka
    const d = dac.clone().applyQuaternion(align);
    const t = yyz.clone().applyQuaternion(align);
    const roll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.atan2(d.y - t.y, d.x - t.x));
    // Then tip the route up into the top half of the globe, clear of the hero card
    const lift = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.32);
    return lift.multiply(roll).multiply(align);
  }, [dac, par, yyz]);

  useFrame(({ clock }, dt) => {
    const p = pointer.current ?? { x: 0, y: 0 };
    if (tilt.current) {
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, p.y * 0.16, dt * 2.5);
      tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, p.x * -0.06, dt * 2.5);
    }
    if (sway.current) {
      sway.current.rotation.y = Math.sin(clock.elapsedTime * 0.15) * 0.22 + p.x * 0.3;
    }
  });

  return (
    <group ref={tilt} position={[-0.25, 0.3, 0]}>
      <group ref={sway}>
      <group quaternion={base}>
        <mesh>
          <sphereGeometry args={[R * 0.985, 64, 64]} />
          <meshBasicMaterial color="#0c1640" transparent opacity={0.92} />
        </mesh>
        <DotSphere />
        {CITIES.map((c) => (
          <City key={c.code} {...c} />
        ))}
        <FlightArc from={dac} to={par} color="#e8b64a" delay={0} />
        <FlightArc from={par} to={yyz} color="#ff3b4f" delay={0.5} />
      </group>
      </group>
      <Atmosphere />
    </group>
  );
}

export default function HeroGlobe() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [leafCount] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 10));

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Globe pointer={pointer} />
        <Leaves count={leafCount} />
      </Canvas>
    </div>
  );
}
