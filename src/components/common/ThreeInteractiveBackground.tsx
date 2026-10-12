import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeInteractiveBackgroundProps {
  theme?: 'emerald' | 'blue' | 'purple' | 'amber';
  density?: 'compact' | 'balanced' | 'spacious';
  autoRotate?: boolean;
  sensitivity?: number;
  interactive?: boolean;
}

export const ThreeInteractiveBackground: React.FC<ThreeInteractiveBackgroundProps> = ({
  theme = 'emerald',
  density = 'balanced',
  autoRotate = true,
  sensitivity = 1.0,
  interactive = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Tentukan Jumlah Partikel Berdasarkan Density
    let count = 120;
    if (density === 'compact') count = 200;
    if (density === 'spacious') count = 60;

    // Tentukan Warna Berdasarkan Theme
    let mainColor = 0x10b981; // Emerald
    if (theme === 'blue') mainColor = 0x3b82f6;
    if (theme === 'purple') mainColor = 0x8b5cf6;
    if (theme === 'amber') mainColor = 0xf59e0b;

    // Geometry Partikel
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      scales[i] = Math.random() * 0.5 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: mainColor,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      mouseX = (event.clientX / window.innerWidth - 0.5) * sensitivity;
      mouseY = (event.clientY / window.innerHeight - 0.5) * sensitivity;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Menggunakan elapsed time sederhana tanpa menggunakan THREE.Clock Deprecated
    let animationFrameId: number;
    let startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      if (autoRotate) {
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = elapsedTime * 0.025;
      }

      if (interactive) {
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme, density, autoRotate, sensitivity, interactive]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};