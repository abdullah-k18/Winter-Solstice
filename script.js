const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enableRotate = true;

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load("textures/bg.jpg");
const backgroundGeometry = new THREE.SphereGeometry(100, 500, 0);
const backgroundMaterial = new THREE.MeshBasicMaterial({
  map: backgroundTexture,
  side: THREE.BackSide,
});
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundMesh);

const sunTexture = textureLoader.load("textures/sun.jpg");
const earthTexture = textureLoader.load("textures/earth.jpg");

function createTexturedPlanet(size, texture, position) {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(position, 0, 0);

  const orbit = new THREE.Object3D();
  orbit.add(planet);
  scene.add(orbit);

  return { planet, orbit };
}

function createEllipsoidPlanet(sizeX, sizeY, sizeZ, texture, position) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  geometry.scale(sizeX, sizeY, sizeZ);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(position, 0, 0);

  const orbit = new THREE.Object3D();
  orbit.add(planet);
  scene.add(orbit);

  return { planet, orbit };
}

const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const sunPositionXOffset = 1;
sun.position.set(sunPositionXOffset, 0, 0);

const earthOrbitOffset = 0.5;

const earth = createTexturedPlanet(1.0, earthTexture, 8 + earthOrbitOffset);

function createOrbit(radius, planetName) {
  const orbitGeometry = new THREE.RingGeometry(
    radius - 0.05,
    radius + 0.05,
    64
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  orbit.userData = { name: planetName };
  scene.add(orbit);
  return orbit;
}

const orbits = [];
orbits.push(createOrbit(8 + earthOrbitOffset));

const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.set(0, 20, 0);
camera.lookAt(0, 0, 0);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const celestialBodies = [sun, earth.planet];

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

function animate() {
  requestAnimationFrame(animate);

  earth.orbit.rotation.y += 0.01;
  earth.planet.rotation.y += 0.03;

  controls.update();
  renderer.render(scene, camera);
}

animate();
