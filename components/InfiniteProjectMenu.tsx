"use client";

import { useEffect, useMemo, useRef } from "react";
import { quat, vec3 } from "gl-matrix";
import type { PortfolioCase } from "@/data/site";

type ProjectMenuProps = {
  projects: PortfolioCase[];
  activeProjectId: string | null;
  onSelect: (project: PortfolioCase) => void;
};

type ProjectedProject = {
  index: number;
  x: number;
  y: number;
  radius: number;
  depth: number;
};

const spherePoint = (index: number, count: number) => {
  const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  return vec3.fromValues(
    Math.cos(theta) * Math.sin(phi),
    Math.cos(phi),
    Math.sin(theta) * Math.sin(phi)
  );
};

/**
 * A lightweight, accessible adaptation of ReactBits' Infinite Menu.
 * It keeps the same tactile, rotating image sphere but exposes project
 * selection to the portfolio details panel rather than opening a link.
 */
export function InfiniteProjectMenu({ projects, activeProjectId, onSelect }: ProjectMenuProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectedRef = useRef<ProjectedProject[]>([]);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const orientationRef = useRef(quat.create());
  const pointerRef = useRef({ down: false, x: 0, y: 0, moved: false });

  const projectPoints = useMemo(
    () => projects.map((_, index) => spherePoint(index, Math.max(projects.length, 1))),
    [projects]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || projects.length === 0) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;

    projects.forEach((project) => {
      if (imagesRef.current.has(project.image)) return;
      const image = new Image();
      image.src = project.image;
      image.onload = () => imagesRef.current.set(project.image, image);
      imagesRef.current.set(project.image, image);
    });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = () => {
      context.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.33;
      const activeIndex = projects.findIndex((project) => project.id === activeProjectId);

      const projected = projectPoints
        .map((point, index) => {
          const transformed = vec3.transformQuat(vec3.create(), point, orientationRef.current);
          const perspective = 1 / (2.45 - transformed[2]);
          return {
            index,
            x: cx + transformed[0] * baseRadius * perspective * 1.75,
            y: cy + transformed[1] * baseRadius * perspective * 1.75,
            radius: Math.max(21, Math.min(74, 39 + transformed[2] * 24)),
            depth: transformed[2]
          };
        })
        .sort((a, b) => a.depth - b.depth);

      projectedRef.current = projected;

      projected.forEach((item) => {
        const project = projects[item.index];
        const image = imagesRef.current.get(project.image);
        const isActive = item.index === activeIndex;

        context.save();
        context.globalAlpha = 0.3 + ((item.depth + 1) / 2) * 0.7;
        context.beginPath();
        context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        context.clip();
        if (image?.complete && image.naturalWidth > 0) {
          const scale = Math.max((item.radius * 2) / image.naturalWidth, (item.radius * 2) / image.naturalHeight);
          const drawWidth = image.naturalWidth * scale;
          const drawHeight = image.naturalHeight * scale;
          context.drawImage(image, item.x - drawWidth / 2, item.y - drawHeight / 2, drawWidth, drawHeight);
        } else {
          context.fillStyle = "#6268D9";
          context.fill();
        }
        context.fillStyle = "rgba(35, 3, 67, 0.18)";
        context.fillRect(item.x - item.radius, item.y - item.radius, item.radius * 2, item.radius * 2);
        context.restore();

        context.beginPath();
        context.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        context.lineWidth = isActive ? 3 : 1;
        context.strokeStyle = isActive ? "#F8E44B" : "rgba(255,255,255,0.55)";
        context.stroke();
      });

      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeProjectId, projectPoints, projects]);

  const selectAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    const matching = projectedRef.current
      .map((item) => ({ item, distance: Math.hypot(item.x - x, item.y - y) }))
      .filter(({ item, distance }) => distance <= item.radius)
      .sort((a, b) => a.distance - b.distance)[0];
    if (matching) onSelect(projects[matching.item.index]);
  };

  const cycle = (direction: number) => {
    const currentIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (currentIndex === -1) {
      onSelect(projects[0]);
      return;
    }
    const nextIndex = (currentIndex + direction + projects.length) % projects.length;
    onSelect(projects[nextIndex]);
  };

  return (
    <div className="relative h-[32rem] min-h-[28rem] w-full overflow-hidden bg-black lg:h-full lg:min-h-0">
      <canvas
        ref={canvasRef}
        aria-label="Menu infinito de projetos. Arraste para explorar e toque em um projeto para selecionar."
        role="application"
        tabIndex={0}
        className="h-full w-full cursor-grab touch-none outline-none active:cursor-grabbing"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            cycle(1);
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            cycle(-1);
          }
        }}
        onPointerDown={(event) => {
          pointerRef.current = { down: true, x: event.clientX, y: event.clientY, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!pointerRef.current.down) return;
          const deltaX = event.clientX - pointerRef.current.x;
          const deltaY = event.clientY - pointerRef.current.y;
          if (Math.abs(deltaX) + Math.abs(deltaY) > 4) pointerRef.current.moved = true;
          quat.rotateY(orientationRef.current, orientationRef.current, deltaX * 0.008);
          quat.rotateX(orientationRef.current, orientationRef.current, deltaY * 0.008);
          pointerRef.current.x = event.clientX;
          pointerRef.current.y = event.clientY;
        }}
        onPointerUp={(event) => {
          if (!pointerRef.current.moved) selectAt(event.clientX, event.clientY);
          pointerRef.current.down = false;
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 text-white">
        <p className="text-eyebrow font-bold uppercase tracking-[0.16em] text-move-yellow">Explorar projetos</p>
        <p className="max-w-28 text-right text-xs leading-relaxed text-white/65">Arraste ou escolha uma esfera</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
        <div className="max-w-[12rem] text-white">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-move-mint">Selecionado</p>
          <p className="mt-1 font-serif text-2xl leading-none">{projects.find((project) => project.id === activeProjectId)?.client ?? "Escolha um projeto"}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => cycle(-1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-move-purple active:scale-[0.96]" aria-label="Projeto anterior">←</button>
          <button type="button" onClick={() => cycle(1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-move-purple active:scale-[0.96]" aria-label="Próximo projeto">→</button>
        </div>
      </div>
    </div>
  );
}
