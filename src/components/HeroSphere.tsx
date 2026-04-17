"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Rotating dotted sphere — particle geometry rendered as Points.
 * Uses ResizeObserver for reliable canvas sizing at any viewport.
 * Adaptive quality: fewer segments on mobile for performance.
 */
export default function HeroSphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const getSize = () => ({
      w: mount.clientWidth || window.innerWidth,
      h: mount.clientHeight || window.innerHeight,
    });

    let { w, h } = getSize();
    const isMobile = window.innerWidth < 768;

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = isMobile ? 5.5 : 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Adaptive quality
    const SEGMENTS = isMobile ? 52 : 96;
    const RADIUS = 1.4;
    const POINT_SIZE = isMobile ? 0.03 : 0.022;

    const geom = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);

    const positionAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const origPositions = new Float32Array(positionAttr.array);
    const count = positionAttr.count;

    // Per-vertex colour for depth variation
    const colours = new Float32Array(count * 3);
    const BASE = new THREE.Color("#93C63B");
    for (let i = 0; i < count; i++) {
      const shade = 0.55 + Math.random() * 0.45;
      colours[i * 3 + 0] = BASE.r * shade;
      colours[i * 3 + 1] = BASE.g * shade;
      colours[i * 3 + 2] = BASE.b * shade;
    }
    geom.setAttribute("color", new THREE.BufferAttribute(colours, 3));

    const material = new THREE.PointsMaterial({
      size: POINT_SIZE,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geom, material);
    scene.add(points);

    // Faint wireframe glow
    const glowGeom = new THREE.SphereGeometry(RADIUS * 0.995, isMobile ? 20 : 32, isMobile ? 16 : 24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x93c63b,
      wireframe: true,
      transparent: true,
      opacity: 0.035,
    });
    scene.add(new THREE.Mesh(glowGeom, glowMat));

    // Mouse tracking
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    // Touch tracking for mobile
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const r = mount.getBoundingClientRect();
      mouse.tx = ((e.touches[0].clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.touches[0].clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("touchmove", onTouch, { passive: true });

    // ResizeObserver for reliable container-size tracking (works at any viewport)
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        w = width;
        h = height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(mount);

    // Animation loop
    let frame = 0;
    const clock = new THREE.Clock();
    const posArr = positionAttr.array as Float32Array;
    // Skip per-vertex morph on mobile for perf
    const MORPH = !isMobile;

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Ease mouse
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Rotation
      points.rotation.y += 0.0015 + Math.abs(mouse.x) * 0.002;
      points.rotation.x = mouse.y * 0.22 + Math.sin(t * 0.3) * 0.05;

      if (MORPH) {
        const morphAmount = 0.035;
        const breath = 1 + Math.sin(t * 0.8) * 0.012;
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const ox = origPositions[ix];
          const oy = origPositions[ix + 1];
          const oz = origPositions[ix + 2];
          const wave =
            Math.sin(ox * 2 + t) * Math.cos(oy * 2 + t * 0.8) * morphAmount;
          const bulge = 1 + wave + mouse.x * 0.018 * ox + mouse.y * 0.018 * oy;
          posArr[ix] = ox * bulge * breath;
          posArr[ix + 1] = oy * bulge * breath;
          posArr[ix + 2] = oz * bulge * breath;
        }
        positionAttr.needsUpdate = true;
      } else {
        // Simple rotation-only breathing on mobile
        const breath = 1 + Math.sin(t * 0.7) * 0.008;
        points.scale.setScalar(breath);
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      ro.disconnect();
      renderer.dispose();
      geom.dispose();
      material.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
