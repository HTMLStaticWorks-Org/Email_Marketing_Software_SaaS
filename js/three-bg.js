/* ==========================================================================
   MailFlow Three.js Subtle 3D Email-Node Constellation Background
   Respects prefers-reduced-motion and updates dynamically on theme switch.
   ========================================================================== */

(function (window, document) {
  'use strict';

  function initThreeBackground() {
    const canvas = document.getElementById('mf-three-bg');
    if (!canvas || !window.THREE) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const THREE = window.THREE;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (e) {
      return; // Graceful skip if WebGL context unavailable
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    const group = new THREE.Group();
    scene.add(group);

    // Create subtle email-envelope wireframe nodes + floating data particles
    const nodeCount = 58;
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.65
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    group.add(points);

    // Subtle floating envelope-like geometric cards
    const cardGeo = new THREE.PlaneGeometry(1.15, 0.78);
    const cardEdges = new THREE.EdgesGeometry(cardGeo);
    const cardMat = new THREE.LineBasicMaterial({ color: 0xC4B5FD, transparent: true, opacity: 0.25 });

    const cards = [];
    for (let i = 0; i < 8; i++) {
      const wire = new THREE.LineSegments(cardEdges, cardMat);
      wire.position.set(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 6 - 2
      );
      wire.rotation.set(Math.random() * 0.4, Math.random() * 0.5, (Math.random() - 0.5) * 0.3);
      wire.userData = {
        speedY: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2
      };
      group.add(wire);
      cards.push(wire);
    }

    function syncColors() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      pointsMat.color.setHex(isLight ? 0x7C3AED : 0x8B5CF6);
      pointsMat.opacity = isLight ? 0.45 : 0.65;
      cardMat.color.setHex(isLight ? 0x7C3AED : 0xC4B5FD);
      cardMat.opacity = isLight ? 0.18 : 0.26;
    }

    syncColors();
    window.addEventListener('mailflow:appearance', syncColors);

    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 0.6;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    }, { passive: true });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
      return;
    }

    let rafId;
    const clock = new THREE.Clock();

    function animate() {
      const elapsed = clock.getElapsedTime();
      group.rotation.y += (pointerX * 0.18 - group.rotation.y) * 0.03;
      group.rotation.x += (-pointerY * 0.14 - group.rotation.x) * 0.03;
      points.rotation.y = elapsed * 0.02;

      cards.forEach((c) => {
        c.position.y += Math.sin(elapsed * 0.7 + c.userData.phase) * 0.0025;
        c.rotation.z += c.userData.speedY * 0.25;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        animate();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeBackground);
  } else {
    initThreeBackground();
  }
})(window, document);

