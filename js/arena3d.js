// Optional WebGL battle scene (lazy-loaded when "3D battle mode" is toggled on).
// The enemy kanji becomes a thick, glowing 3D tile with a neon ring, ground glow
// and ember particles. Falls back silently when WebGL is unavailable.
import * as THREE from '../vendor/three/three.module.min.js';

let renderer, scene, camera, tile, ring, particles, glow, flash, raf = null, container = null;
let hitImpulse = 0;

function drawSpriteTexture(char) {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    // deep gradient tile face
    const bg = g.createLinearGradient(0, 0, 512, 512);
    bg.addColorStop(0, '#2a1530');
    bg.addColorStop(0.5, '#16101f');
    bg.addColorStop(1, '#0d1b22');
    g.fillStyle = bg;
    g.beginPath();
    g.roundRect(10, 10, 492, 492, 56);
    g.fill();
    // neon border
    g.strokeStyle = 'rgba(255, 107, 139, 0.95)';
    g.lineWidth = 10;
    g.shadowColor = '#ff6b8b';
    g.shadowBlur = 34;
    g.stroke();
    // glowing kanji
    g.shadowColor = '#ff6b8b';
    g.shadowBlur = 46;
    g.fillStyle = '#ffffff';
    g.font = '900 300px "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(char, 256, 278);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
}

function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const rad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
    rad.addColorStop(0, 'rgba(255, 107, 139, 0.85)');
    rad.addColorStop(0.45, 'rgba(165, 94, 234, 0.30)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = rad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
}

export function init(el, spriteChar) {
    try {
        const test = document.createElement('canvas');
        if (!(test.getContext('webgl2') || test.getContext('webgl'))) return false;

        container = el;
        container.textContent = '';
        container.classList.add('arena3d-on');
        const w = container.clientWidth || 300;
        const h = Math.max(container.clientHeight, 280);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
        camera.position.set(0, 1.1, 6.2);
        camera.lookAt(0, 0.1, 0);

        // Thick glowing tile with the kanji on both faces
        const faceTex = drawSpriteTexture(spriteChar);
        const face = new THREE.MeshStandardMaterial({ map: faceTex, transparent: true, roughness: 0.35, metalness: 0.15 });
        const edge = new THREE.MeshStandardMaterial({ color: 0xff6b8b, emissive: 0xff2e63, emissiveIntensity: 1.6, roughness: 0.3 });
        tile = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.9, 0.28), [edge, edge, edge, edge, face, face]);
        tile.position.y = 0.25;
        scene.add(tile);

        // Neon ring orbiting the tile
        ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.35, 0.035, 12, 90),
            new THREE.MeshStandardMaterial({ color: 0x2ed573, emissive: 0x2ed573, emissiveIntensity: 2.2 })
        );
        ring.rotation.x = Math.PI / 2.4;
        ring.position.y = 0.25;
        scene.add(ring);

        // Ground glow disc
        glow = new THREE.Mesh(
            new THREE.PlaneGeometry(5.2, 5.2),
            new THREE.MeshBasicMaterial({ map: makeGlowTexture(), transparent: true, depthWrite: false })
        );
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = -1.65;
        scene.add(glow);

        // Lights: strong theme-colored rig + a white flash light for hits
        const pink = new THREE.PointLight(0xff6b8b, 140);
        pink.position.set(3.5, 3, 4);
        const teal = new THREE.PointLight(0x2ed573, 90);
        teal.position.set(-3.5, -1, 3.5);
        const purple = new THREE.PointLight(0xa55eea, 70);
        purple.position.set(0, 4, -3);
        flash = new THREE.PointLight(0xffffff, 0);
        flash.position.set(0, 1, 3);
        scene.add(pink, teal, purple, flash, new THREE.AmbientLight(0xffffff, 0.7));

        // Ember particles: two colors, visible, twinkling
        const N = 170;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 9;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
        }
        const pgeo = new THREE.BufferGeometry();
        pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        particles = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: 0xffb3c2, size: 0.09, transparent: true, opacity: 0.9, sizeAttenuation: true }));
        scene.add(particles);

        const t0 = performance.now();
        const loop = (t) => {
            raf = requestAnimationFrame(loop);
            const s = (t - t0) / 1000;
            tile.rotation.y = Math.sin(s * 0.7) * 0.45 + hitImpulse * Math.sin(s * 42) * 0.5;
            tile.position.y = 0.25 + Math.sin(s * 1.5) * 0.18;
            tile.rotation.z = hitImpulse * 0.18 * Math.sin(s * 33);
            ring.rotation.z = s * 0.6;
            ring.position.y = tile.position.y;
            particles.rotation.y = s * 0.06;
            particles.material.opacity = 0.65 + Math.sin(s * 2.2) * 0.25;
            glow.material.opacity = 0.75 + Math.sin(s * 1.5) * 0.2;
            flash.intensity = hitImpulse * 260;
            if (hitImpulse > 0) hitImpulse = Math.max(0, hitImpulse - 0.035);
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(loop);

        window.arena3d = { active: true, setSprite, hit, destroy };
        return true;
    } catch (e) {
        console.log('arena3d init failed:', e);
        destroy();
        return false;
    }
}

export function setSprite(char) {
    if (!tile) return;
    const mats = tile.material;
    const old = mats[4].map;
    const tex = drawSpriteTexture(char);
    mats[4].map = tex;
    mats[5].map = tex;
    mats[4].needsUpdate = mats[5].needsUpdate = true;
    if (old) old.dispose();
}

export function hit() {
    hitImpulse = 1;
}

export function destroy() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.remove();
    }
    if (container) container.classList.remove('arena3d-on');
    renderer = scene = camera = tile = ring = particles = glow = flash = null;
    if (window.arena3d) window.arena3d.active = false;
}
