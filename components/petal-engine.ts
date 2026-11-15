import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type PetalEngine = {
  /** Throw petals and gold leaf out from the centre of the screen. */
  burst: (strength?: number) => void;
  dispose: () => void;
};

type Particle = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  scale: number;
  fall: number;
  sway: number;
  swayFreq: number;
  phase: number;
};

const PETAL_COLORS = ["#fffaf0", "#fbefdc", "#f6e2c4", "#f3d9cf", "#efe0bf", "#fff4e0"];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function petalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.2);
  shape.bezierCurveTo(0.2, -0.12, 0.23, 0.12, 0.1, 0.22);
  shape.bezierCurveTo(0.05, 0.25, -0.05, 0.25, -0.1, 0.22);
  shape.bezierCurveTo(-0.23, 0.12, -0.2, -0.12, 0, -0.2);
  const geo = new THREE.ShapeGeometry(shape, 10);

  // Cup the petal and darken its base slightly with vertex colours.
  const pos = geo.attributes.position;
  const colors: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, x * x * 2.2 - (y + 0.2) * 0.12);
    const shade = 0.82 + 0.18 * Math.min(1, (y + 0.2) / 0.42);
    colors.push(shade, shade * 0.985, shade * 0.96);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

function flakeGeometry() {
  const shape = new THREE.Shape();
  const points = 7;
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = 0.06 * rand(0.65, 1.15);
    const x = Math.cos(a) * r * 1.3;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geo = new THREE.ShapeGeometry(shape);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, (Math.random() - 0.5) * 0.02);
  geo.computeVertexNormals();
  return geo;
}

const DUST_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHeight;
  attribute float aSeed;
  varying float vTwinkle;
  void main() {
    vec3 p = position;
    float speed = 0.12 + aSeed * 0.22;
    p.y = mod(p.y + uTime * speed + uHeight * 0.5, uHeight) - uHeight * 0.5;
    p.x += sin(uTime * 0.3 + aSeed * 12.0) * 0.18;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aSeed * 5.0) * uPixelRatio * (14.0 / -mv.z);
    vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (1.1 + aSeed * 2.4) + aSeed * 40.0));
  }
`;

const DUST_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.8);
    gl_FragColor = vec4(uColor, a * vTwinkle * uOpacity);
  }
`;

export function createPetalEngine(host: HTMLElement): PetalEngine {
  // Phones get a lighter scene: fewer particles, no MSAA, ~1.25x resolution
  // and 30 fps. The petals are soft and slow, so it reads the same.
  const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !small,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.75));
  let width = host.clientWidth;
  let height = host.clientHeight;
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.HemisphereLight(0xfff7e8, 0xcdb88e, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 6, 8);
  scene.add(key);

  // Petals
  const petalGeo = petalGeometry();
  // Matte petals don't need PBR; Lambert is much cheaper per pixel.
  const petalMat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.86,
  });
  const PETALS = small ? 12 : 30;
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETALS);
  petals.frustumCulled = false;
  const color = new THREE.Color();
  for (let i = 0; i < PETALS; i++) {
    petals.setColorAt(i, color.set(PETAL_COLORS[i % PETAL_COLORS.length]));
  }
  scene.add(petals);

  // Gold leaf
  const flakeGeo = flakeGeometry();
  const flakeMat = new THREE.MeshStandardMaterial({
    color: 0xe3be66,
    emissive: 0x7a5716,
    emissiveIntensity: 0.35,
    metalness: 1,
    roughness: 0.3,
    side: THREE.DoubleSide,
    envMapIntensity: 1.9,
  });
  const FLAKES = small ? 10 : 30;
  const flakes = new THREE.InstancedMesh(flakeGeo, flakeMat, FLAKES);
  flakes.frustumCulled = false;
  scene.add(flakes);

  // Gold dust
  const viewHeight = () => 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const DUST = small ? 45 : 140;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST * 3);
  const dustSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = rand(-1, 1) * 9;
    dustPos[i * 3 + 1] = rand(-0.5, 0.5) * 12;
    dustPos[i * 3 + 2] = rand(-5, 3);
    dustSeed[i] = Math.random();
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
  const dustMat = new THREE.ShaderMaterial({
    vertexShader: DUST_VERTEX,
    fragmentShader: DUST_FRAGMENT,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uHeight: { value: 12 },
      uColor: { value: new THREE.Color("#c99f4c") },
      uOpacity: { value: 0 },
    },
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  const makeParticle = (fallMin: number, fallMax: number, scaleMin: number, scaleMax: number): Particle => ({
    pos: new THREE.Vector3(0, 100, 0),
    vel: new THREE.Vector3(),
    rot: new THREE.Euler(rand(0, Math.PI * 2), rand(0, Math.PI * 2), rand(0, Math.PI * 2)),
    spin: new THREE.Vector3(rand(-1.6, 1.6), rand(-1.2, 1.2), rand(-1.8, 1.8)),
    scale: rand(scaleMin, scaleMax),
    fall: rand(fallMin, fallMax),
    sway: rand(0.25, 0.7),
    swayFreq: rand(0.6, 1.3),
    phase: rand(0, Math.PI * 2),
  });

  const petalState = Array.from({ length: PETALS }, () => makeParticle(0.35, 0.7, 0.75, 1.25));
  const flakeState = Array.from({ length: FLAKES }, () => makeParticle(0.25, 0.55, 0.7, 1.5));

  const bounds = () => {
    const h = viewHeight();
    return { h, w: h * camera.aspect };
  };

  const spawnTop = (p: Particle, b: { w: number; h: number }) => {
    p.pos.set(rand(-b.w / 2, b.w / 2), b.h / 2 + rand(0.4, 3), rand(-3, 2.5));
    p.vel.set(0, -p.fall, 0);
  };

  const scatter = (p: Particle, b: { w: number; h: number }) => {
    p.pos.set(rand(-b.w / 2, b.w / 2), rand(-b.h / 2, b.h / 2 + 2), rand(-3, 2.5));
    p.vel.set(0, -p.fall, 0);
  };

  let started = false;
  let ready = false;
  let disposed = false;
  let queuedBurst = 0;
  let dustTarget = 0;
  const dummy = new THREE.Object3D();
  const timer = new THREE.Timer();
  timer.connect(document);
  // Cached from events: reading scrollY/innerHeight inside the frame loop
  // forces a style + layout pass every frame while CSS animations run.
  let scrollY = window.scrollY;
  let viewportH = window.innerHeight;
  let lastScroll = scrollY;
  const onScroll = () => {
    scrollY = window.scrollY;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  /** Minimum seconds between frames (≈30 fps on phones, uncapped elsewhere). */
  const minFrame = small ? 1 / 31 : 0;
  let pendingTime = 0;

  const stepGroup = (mesh: THREE.InstancedMesh, state: Particle[], dt: number, t: number, scrollShift: number) => {
    const b = bounds();
    const relax = 1 - Math.exp(-dt * 1.05);
    for (let i = 0; i < state.length; i++) {
      const p = state[i];
      const idleX = Math.sin(t * p.swayFreq + p.phase) * p.sway;
      p.vel.x += (idleX - p.vel.x) * relax;
      p.vel.y += (-p.fall - p.vel.y) * relax;
      p.vel.z += -p.vel.z * relax;
      p.pos.addScaledVector(p.vel, dt);
      p.pos.y += scrollShift * (0.7 + (p.pos.z + 3) * 0.12);
      p.rot.x += p.spin.x * dt;
      p.rot.y += p.spin.y * dt;
      p.rot.z += p.spin.z * dt;

      if (p.pos.y < -b.h / 2 - 1 || p.pos.y > b.h / 2 + 5 || Math.abs(p.pos.x) > b.w / 2 + 2.5) {
        spawnTop(p, b);
      }

      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  const render = (time: number) => {
    timer.update(time);
    pendingTime += timer.getDelta();
    if (pendingTime < minFrame) return; // keep showing the previous frame
    const dt = Math.min(pendingTime, 1 / 20);
    pendingTime = 0;
    const t = timer.getElapsed();
    const b = bounds();

    // Phones redraw at 30 fps while the page scrolls at 60: tying petals to the
    // scroll there makes them step against the content. They just drift.
    const scrollShift = small ? 0 : ((scrollY - lastScroll) / viewportH) * b.h * 0.35;
    lastScroll = scrollY;

    stepGroup(petals, petalState, dt, t, scrollShift);
    stepGroup(flakes, flakeState, dt, t, scrollShift);

    dustMat.uniforms.uTime.value = t;
    dustMat.uniforms.uHeight.value = b.h + 2;
    const opacity = dustMat.uniforms.uOpacity.value as number;
    dustMat.uniforms.uOpacity.value = opacity + (dustTarget - opacity) * Math.min(1, dt * 1.5);

    renderer.render(scene, camera);
  };

  const hideAll = () => {
    for (const [mesh, state] of [
      [petals, petalState],
      [flakes, flakeState],
    ] as const) {
      state.forEach((p, i) => {
        dummy.position.set(0, 1000, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        p.pos.set(0, 1000, 0);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
  hideAll();

  const start = () => {
    if (started) return;
    started = true;
    timer.reset();
    pendingTime = 0;
    lastScroll = scrollY;
    renderer.setAnimationLoop(render);
  };

  const burst = (strength = 1) => {
    if (!ready) {
      queuedBurst = Math.max(queuedBurst, strength);
      return;
    }
    const b = bounds();
    const throwOut = (p: Particle) => {
      p.pos.set(rand(-0.4, 0.4), rand(-0.6, 0.6), rand(-1.5, 1.5));
      const a = rand(0, Math.PI * 2);
      const s = rand(0.45, 1.05) * strength;
      p.vel.set(
        Math.cos(a) * s * b.w * 1.05,
        Math.sin(a) * s * b.h * 0.75 + b.h * 0.18 * strength,
        rand(-2.5, 2.5),
      );
    };
    // On the first burst, also scatter a few so the screen never looks empty.
    petalState.forEach((p, i) => (i % 4 === 3 && !started ? scatter(p, b) : throwOut(p)));
    flakeState.forEach((p, i) => (i % 4 === 3 && !started ? scatter(p, b) : throwOut(p)));
    dustTarget = 0.85;
    start();
  };

  // Compile every shader program up front (off the critical path) and draw one
  // frame with everything parked off-screen, so the first visible frame —
  // mid door-swing — doesn't stall on compilation.
  const compiled = renderer.extensions.has("KHR_parallel_shader_compile")
    ? renderer.compileAsync(scene, camera)
    : Promise.resolve(renderer.compile(scene, camera)); // no async support: compile now, once
  compiled
    .catch(() => undefined)
    .then(() => {
      if (disposed) return;
      renderer.render(scene, camera);
      ready = true;
      if (queuedBurst) {
        const strength = queuedBurst;
        queuedBurst = 0;
        burst(strength);
      }
    });

  const onResize = () => {
    viewportH = window.innerHeight;
    const w = host.clientWidth;
    const h = host.clientHeight;
    // Phone address bars change the height while scrolling. Reallocating the
    // GL buffer for that causes a hitch, and a few % of stretch is invisible.
    if (small && w === width && Math.abs(h - height) < 200) return;
    width = w;
    height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener("resize", onResize);

  const onVisibility = () => {
    if (!started) return;
    renderer.setAnimationLoop(document.hidden ? null : render);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    burst,
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      timer.dispose();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      petalGeo.dispose();
      petalMat.dispose();
      flakeGeo.dispose();
      flakeMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
