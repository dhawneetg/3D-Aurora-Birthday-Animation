// ---------- Get Name from URL ----------
const params = new URLSearchParams(window.location.search);
const name = params.get("name") || "Friend";
document.getElementById("title").textContent = `HAPPY BIRTHDAY ${name.toUpperCase()} 🎉`;

// ---------- Share Button ----------
document.getElementById("shareBtn").onclick = async () => {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({
        title: "Birthday Wish 🎂",
        text: `Send birthday wishes to ${name}! 🎉`,
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied! 🎉");
    }
  } catch {}
};

// ---------- THREE.JS BACKGROUND ----------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Aurora particles
const count = 7000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 40;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.13,
  color: 0x00f2fe,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 22;

// 🎆 Firecracker
function firecracker() {
  for (let i = 0; i < 80; i++) {
    const spark = document.createElement("div");
    spark.style.position = "fixed";
    spark.style.left = "50%";
    spark.style.top = "50%";
    spark.style.width = "6px";
    spark.style.height = "6px";
    spark.style.borderRadius = "50%";
    spark.style.background = `hsl(${Math.random() * 360},100%,70%)`;
    spark.style.pointerEvents = "none";
    spark.style.zIndex = 30;
    document.body.appendChild(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;

    spark.animate([
      { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
      { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
    ], { duration: 900, easing: "ease-out" });

    setTimeout(() => spark.remove(), 900);
  }
}

// 🎈 Balloons
function spawnBalloon() {
  const balloon = document.createElement("div");
  balloon.className = "balloon";
  balloon.style.left = Math.random() * 100 + "vw";
  balloon.style.background = `hsl(${Math.random() * 360},80%,60%)`;
  balloon.style.animationDuration = 6 + Math.random() * 4 + "s";
  document.body.appendChild(balloon);
  setTimeout(() => balloon.remove(), 10000);
}

// Trigger effects after text fade-in
setTimeout(() => {
  firecracker();
  for (let i = 0; i < 12; i++) setTimeout(spawnBalloon, i * 300);
}, 1000);

// Aurora animation
function animate() {
  requestAnimationFrame(animate);
  const t = Date.now() * 0.001;
  const pos = geometry.attributes.position.array;

  for (let i = 0; i < count; i++) {
    const x = pos[i * 3];
    const y = pos[i * 3 + 1];
    pos[i * 3 + 2] = Math.sin(x * 0.35 + t) * Math.cos(y * 0.35 + t) * 3;
  }

  geometry.attributes.position.needsUpdate = true;
  points.rotation.z += 0.0012;

  camera.position.x = Math.sin(t * 0.4) * 1.5;
  camera.position.y = Math.cos(t * 0.3) * 1;
  camera.lookAt(scene.position);

  material.color.setHSL((t * 0.08) % 1, 1, 0.6);
  renderer.render(scene, camera);
}

animate();