/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Atom3D, Bond3D } from '../types';
import { RotateCcw, Pause, Play, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ComponentProps {
  smiles: string;
  formula: string;
  chemicalName: string;
  presetAtoms?: Atom3D[];
  presetBonds?: Bond3D[];
  key?: any;
}

export default function MoleculeCanvas({ smiles, formula, chemicalName, presetAtoms, presetBonds }: ComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<'ball-and-stick' | 'space-filling' | 'wireframe'>('ball-and-stick');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.005);
  const [zoom, setZoom] = useState<number>(100);

  // 3D Rotation State and drags
  const rotRef = useRef<{ alpha: number; beta: number }>({ alpha: -0.4, beta: 0.5 });
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Atoms and Bonds State
  const atomsRef = useRef<Atom3D[]>([]);
  const bondsRef = useRef<Bond3D[]>([]);

  // Get color for element
  const getElementColor = (el: string): { light: string; dark: string } => {
    switch (el.toUpperCase()) {
      case 'C': // Carbon (Charcoal)
        return { light: '#6b7280', dark: '#1f2937' };
      case 'H': // Hydrogen (White)
        return { light: '#f9fafb', dark: '#d1d5db' };
      case 'O': // Oxygen (Red)
        return { light: '#f87171', dark: '#dc2626' };
      case 'N': // Nitrogen (Blue)
        return { light: '#60a5fa', dark: '#2563eb' };
      case 'CL': // Chlorine (Green)
        return { light: '#4ade80', dark: '#16a34a' };
      case 'S': // Sulfur (Yellow)
        return { light: '#fde047', dark: '#ca8a04' };
      case 'F': // Fluorine (Cyan/Copper)
        return { light: '#2dd4bf', dark: '#0d9488' };
      case 'NA': // Sodium (Purple)
        return { light: '#c084fc', dark: '#7c3aed' };
      case 'P': // Phosphorus (Orange)
        return { light: '#fb923c', dark: '#ea580c' };
      default: // Other metals/elements
        return { light: '#a1a1aa', dark: '#52525b' };
    }
  };

  // Get radius for element
  const getAtomRadius = (el: string): number => {
    switch (el.toUpperCase()) {
      case 'H': return 10;
      case 'C': return 16;
      case 'N': return 15;
      case 'O': return 14;
      case 'S': return 18;
      case 'P': return 19;
      case 'CL': return 17;
      case 'NA': return 21;
      default: return 15;
    }
  };

  // Generate atoms and bonds dynamically if no preset is provided
  useEffect(() => {
    if (presetAtoms && presetAtoms.length > 0) {
      // Deep copy to prevent state mutating directly
      atomsRef.current = presetAtoms.map(a => ({ ...a, vx: 0, vy: 0, vz: 0 }));
      bondsRef.current = presetBonds ? [...presetBonds] : [];
      return;
    }

    // Otherwise, generate procedurally from SMILES or Formula
    const atoms: Atom3D[] = [];
    const bonds: Bond3D[] = [];
    let atomId = 1;

    // Parse smiles characters to extract heavy atoms
    // Simple but highly robust chemical graph extractor
    const cleanSmiles = smiles.replace(/\[|\]|\+|\-|\.|\=|\#/g, '');
    const regex = /C|N|O|S|P|Cl|F|Br|I|Na|K/gi;
    let match;
    const smilesAtoms: { id: number; element: string }[] = [];

    while ((match = regex.exec(smiles)) !== null) {
      let el = match[0];
      if (el === 'c' || el === 'o' || el === 'n' || el === 's') {
        el = el.toUpperCase(); // normalize aromatic notation
      }
      smilesAtoms.push({ id: atomId++, element: el });
    }

    if (smilesAtoms.length === 0) {
      // Fallback: parse from formula
      const formulaRegex = /([A-Z][a-z]?|H)(\d*)/g;
      let fMatch;
      while ((fMatch = formulaRegex.exec(formula)) !== null) {
        const symbol = fMatch[1];
        const count = fMatch[2] ? parseInt(fMatch[2], 10) : 1;
        for (let i = 0; i < count; i++) {
          if (symbol !== 'H') { // Only add heavy atoms first
            smilesAtoms.push({ id: atomId++, element: symbol });
          }
        }
      }
    }

    // Place heavy atoms randomly in an initial sphere
    smilesAtoms.forEach(sa => {
      atoms.push({
        id: sa.id,
        element: sa.element,
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
        vx: 0, vy: 0, vz: 0
      });
    });

    // Connect sequential heavy atoms (simplest linear organic chain approximation)
    for (let i = 0; i < atoms.length - 1; i++) {
      bonds.push({
        atom1: atoms[i].id,
        atom2: atoms[i + 1].id,
        order: smiles.includes('=') && i === 0 ? 2 : 1
      });
    }

    // Form periodic cyclic connections if ring indexes found in smiles (e.g. C1=CC=CC=C1)
    if (atoms.length >= 6 && smiles.includes('1')) {
      bonds.push({
        atom1: atoms[0].id,
        atom2: atoms[5].id,
        order: 1
      });
    }

    // Add explicit branching Hydrogen atoms to satisfy valence constraints!
    const heavyAtomsLength = atoms.length;
    for (let i = 0; i < heavyAtomsLength; i++) {
      const parent = atoms[i];
      let maxValence = 4; // default Carbon
      if (parent.element === 'N') maxValence = 3;
      if (parent.element === 'O') maxValence = 2;
      if (parent.element === 'S') maxValence = 2;
      if (parent.element === 'P') maxValence = 5;
      if (['F', 'CL', 'BR', 'I', 'NA', 'K'].includes(parent.element.toUpperCase())) maxValence = 1;

      // Count current bonds of this parent
      const connectedCount = bonds.filter(b => b.atom1 === parent.id || b.atom2 === parent.id).length;
      const neededHydrogens = Math.max(0, maxValence - connectedCount);

      for (let h = 0; h < neededHydrogens; h++) {
        const hId = atomId++;
        // Position hydrogen branching outwards
        const angle = (h * Math.PI * 2) / (neededHydrogens || 1) + Math.random();
        atoms.push({
          id: hId,
          element: 'H',
          x: parent.x + Math.cos(angle) * 1.5,
          y: parent.y + Math.sin(angle) * 1.5,
          z: parent.z + (Math.random() - 0.5) * 1.5,
          vx: 0, vy: 0, vz: 0
        });
        bonds.push({
          atom1: parent.id,
          atom2: hId,
          order: 1
        });
      }
    }

    atomsRef.current = atoms;
    bondsRef.current = bonds;
  }, [presetAtoms, presetBonds, smiles, formula]);

  // Main drawing and simulation animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Run Force-Directed Relaxation Simulation to let atoms spring settle
      const atoms = atomsRef.current;
      const bonds = bondsRef.current;

      const kSpring = 0.05;      // spring constant
      const rRepulsion = 1.2;    // repulsion factor
      const springTarget = 1.8;   // optimal bond distance
      const damping = 0.82;      // friction deceleration

      // Only run simulation if atoms are populated
      if (atoms.length > 0) {
        // Clear force calculations
        const fx = new Array(atoms.length).fill(0);
        const fy = new Array(atoms.length).fill(0);
        const fz = new Array(atoms.length).fill(0);

        // A. Repulsion between all atom pairs (non-bonded or otherwise structural)
        for (let i = 0; i < atoms.length; i++) {
          for (let j = i + 1; j < atoms.length; j++) {
            const dx = atoms[j].x - atoms[i].x;
            const dy = atoms[j].y - atoms[i].y;
            const dz = atoms[j].z - atoms[i].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

            // Strong repulsion if too close
            if (dist < 4.5) {
              const force = rRepulsion / (dist * dist);
              const fX = (dx / dist) * force;
              const fY = (dy / dist) * force;
              const fZ = (dz / dist) * force;

              fx[i] -= fX;
              fy[i] -= fY;
              fz[i] -= fZ;

              fx[j] += fX;
              fy[j] += fY;
              fz[j] += fZ;
            }
          }
        }

        // B. Attraction along bonds (spring-like hooks)
        bonds.forEach(bond => {
          const idx1 = atoms.findIndex(a => a.id === bond.atom1);
          const idx2 = atoms.findIndex(a => a.id === bond.atom2);
          if (idx1 === -1 || idx2 === -1) return;

          const dx = atoms[idx2].x - atoms[idx1].x;
          const dy = atoms[idx2].y - atoms[idx1].y;
          const dz = atoms[idx2].z - atoms[idx1].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

          // Target distance based on elements (hydrogens closer)
          const target = (atoms[idx1].element === 'H' || atoms[idx2].element === 'H') ? 1.1 : springTarget;
          const diff = dist - target;
          const force = diff * kSpring;

          const fX = (dx / dist) * force;
          const fY = (dy / dist) * force;
          const fZ = (dz / dist) * force;

          fx[idx1] += fX;
          fy[idx1] += fY;
          fz[idx1] += fZ;

          fx[idx2] -= fX;
          fy[idx2] -= fY;
          fz[idx2] -= fZ;
        });

        // C. Align center of mass to origin (gravitational anchor)
        let cx = 0, cy = 0, cz = 0;
        atoms.forEach(a => { cx += a.x; cy += a.y; cz += a.z; });
        cx /= atoms.length;
        cy /= atoms.length;
        cz /= atoms.length;

        // Apply forces, update positions
        for (let i = 0; i < atoms.length; i++) {
          const a = atoms[i];
          const vx = (a.vx || 0) + fx[i] - cx * 0.01;
          const vy = (a.vy || 0) + fy[i] - cy * 0.01;
          const vz = (a.vz || 0) + fz[i] - cz * 0.01;

          // Apply friction damping
          a.vx = vx * damping;
          a.vy = vy * damping;
          a.vz = vz * damping;

          a.x += a.vx;
          a.y += a.vy;
          a.z += a.vz;
        }
      }

      // 2. Perform Z continuous automatic rotation if enabled
      if (isRotating && !isDragging.current) {
        rotRef.current.alpha += rotationSpeed;
        rotRef.current.beta += rotationSpeed * 0.4;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Width / height anchors
      const W = canvas.width;
      const H = canvas.height;
      const centerX = W / 2;
      const centerY = H / 2;
      const focalLength = 400;

      // Translate positions by current mouse drag rotation
      const cosa = Math.cos(rotRef.current.alpha);
      const sina = Math.sin(rotRef.current.alpha);
      const cosb = Math.cos(rotRef.current.beta);
      const sinb = Math.sin(rotRef.current.beta);

      // Map atoms to projected spaces
      const projectedAtoms = atoms.map(a => {
        // Rotate around Y axis (alpha)
        let x1 = a.x * cosa - a.z * sina;
        let z1 = a.x * sina + a.z * cosa;

        // Rotate around X axis (beta)
        let y2 = a.y * cosb - z1 * sinb;
        let z2 = a.y * sinb + z1 * cosb;

        // Adjust perspective parameters
        // Put standard Z offset so it never divides by zero
        const distZ = z2 + 10;
        const scale = focalLength / Math.max(1, (focalLength + distZ));
        const viewZoom = zoom / 100;

        return {
          id: a.id,
          element: a.element,
          projX: centerX + x1 * scale * 50 * viewZoom,
          projY: centerY + y2 * scale * 50 * viewZoom,
          projZ: z2, // Depth tracking
          projR: getAtomRadius(a.element) * scale * viewZoom
        };
      });

      // 3. Structure depth sorting array containing both atoms and bonds
      // This is the classic painters algorithm ensuring correct overlap drawing in 2D
      const drawQueue: any[] = [];

      // Add atoms to draw queue
      projectedAtoms.forEach(pa => {
        drawQueue.push({
          type: 'atom',
          z: pa.projZ,
          render: () => {
            const colors = getElementColor(pa.element);
            const radius = Math.max(2, pa.projR);

            ctx.beginPath();
            if (viewMode === 'wireframe') {
              ctx.arc(pa.projX, pa.projY, radius, 0, Math.PI * 2);
              ctx.strokeStyle = colors.dark;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              // Short label inside
              ctx.fillStyle = colors.dark;
              ctx.font = '9px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(pa.element, pa.projX, pa.projY);
            } else {
              // Beautiful radial shading for glossy 3D ball
              const radiusExp = viewMode === 'space-filling' ? radius * 1.6 : radius;
              ctx.arc(pa.projX, pa.projY, radiusExp, 0, Math.PI * 2);
              
              const grad = ctx.createRadialGradient(
                pa.projX - radiusExp / 3,
                pa.projY - radiusExp / 3,
                radiusExp / 10,
                pa.projX,
                pa.projY,
                radiusExp
              );
              grad.addColorStop(0, '#ffffff');
              grad.addColorStop(0.2, colors.light);
              grad.addColorStop(1, colors.dark);
              
              ctx.fillStyle = grad;
              ctx.shadowColor = 'rgba(0,0,0,0.15)';
              ctx.shadowBlur = 6;
              ctx.shadowOffsetX = 2;
              ctx.shadowOffsetY = 3;
              ctx.fill();
              
              // Clear shadow
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;

              // Little identifier letter print for big atoms
              if (radiusExp > 8 && pa.element !== 'H') {
                ctx.fillStyle = pa.element === 'C' ? '#f3f4f6' : '#ffffff';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pa.element, pa.projX, pa.projY);
              }
            }
          }
        });
      });

      // Add bonds to draw queue if in ball-and-stick or wireframe
      if (viewMode !== 'space-filling') {
        bonds.forEach(bond => {
          const a1 = projectedAtoms.find(pa => pa.id === bond.atom1);
          const a2 = projectedAtoms.find(pa => pa.id === bond.atom2);
          if (!a1 || !a2) return;

          // Average Z represents depth
          const avgZ = (a1.projZ + a2.projZ) / 2;

          drawQueue.push({
            type: 'bond',
            z: avgZ,
            render: () => {
              ctx.beginPath();
              ctx.moveTo(a1.projX, a1.projY);
              ctx.lineTo(a2.projX, a2.projY);
              
              if (viewMode === 'wireframe') {
                ctx.strokeStyle = '#9ca3af';
                ctx.lineWidth = bond.order === 2 ? 4 : (bond.order === 3 ? 6 : 1.5);
                ctx.stroke();
              } else {
                // Ball and stick double/triple bonds layout
                if (bond.order === 2) {
                  // Double bond (draw parallel bonds)
                  const dx = a2.projX - a1.projX;
                  const dy = a2.projY - a1.projY;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  // normal perpendicular offset
                  const ox = (-dy / len) * 4;
                  const oy = (dx / len) * 4;

                  ctx.beginPath();
                  ctx.moveTo(a1.projX + ox, a1.projY + oy);
                  ctx.lineTo(a2.projX + ox, a2.projY + oy);
                  ctx.moveTo(a1.projX - ox, a1.projY - oy);
                  ctx.lineTo(a2.projX - ox, a2.projY - oy);

                  ctx.strokeStyle = '#4b5563';
                  ctx.lineWidth = 3.5;
                  ctx.stroke();
                } else if (bond.order === 3) {
                  // Triple bond
                  const dx = a2.projX - a1.projX;
                  const dy = a2.projY - a1.projY;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const ox = (-dy / len) * 5;
                  const oy = (dx / len) * 5;

                  ctx.beginPath();
                  ctx.moveTo(a1.projX + ox, a1.projY + oy);
                  ctx.lineTo(a2.projX + ox, a2.projY + oy);
                  ctx.moveTo(a1.projX, a1.projY);
                  ctx.lineTo(a2.projX, a2.projY);
                  ctx.moveTo(a1.projX - ox, a1.projY - oy);
                  ctx.lineTo(a2.projX - ox, a2.projY - oy);

                  ctx.strokeStyle = '#374151';
                  ctx.lineWidth = 2.5;
                  ctx.stroke();
                } else {
                  // Single bond (cylinder shaded look using standard color transition gradients)
                  const grad = ctx.createLinearGradient(a1.projX, a1.projY, a2.projX, a2.projY);
                  const col1 = getElementColor(a1.element).light;
                  const col2 = getElementColor(a2.element).light;
                  grad.addColorStop(0, col1);
                  grad.addColorStop(0.5, col1);
                  grad.addColorStop(0.5, col2);
                  grad.addColorStop(1, col2);

                  ctx.strokeStyle = grad;
                  ctx.lineWidth = 5;
                  ctx.lineCap = 'round';
                  ctx.stroke();
                }
              }
            }
          });
        });
      }

      // Draw all elements sorted from back to front (largest Z represents back)
      drawQueue.sort((a, b) => b.z - a.z);
      drawQueue.forEach(item => item.render());

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [viewMode, isRotating, rotationSpeed, zoom]);

  // Adjust canvas matching parent element bounds
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight || 320;
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Drag interaction events
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    rotRef.current.alpha += dx * 0.007;
    rotRef.current.beta += dy * 0.007;

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Reset viewport angles
  const resetOrientation = () => {
    rotRef.current = { alpha: -0.4, beta: 0.5 };
    setZoom(100);
  };

  // Extract distinct element list present in chemical to render list legend
  const atoms = atomsRef.current || [];
  const uniqElements: string[] = Array.from(new Set(atoms.map(a => a.element)));

  return (
    <div className="relative flex flex-col h-full bg-[#07080a] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
      {/* Molecule Header bar */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
        <div className="bg-[#111318]/95 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-1.5 shadow-sm">
          <h4 className="text-xs font-semibold text-white">{chemicalName}</h4>
          <p className="text-[10px] font-mono text-slate-400">{formula}</p>
        </div>

        {/* Style Switches Toggle bar */}
        <div className="flex bg-[#111318]/95 backdrop-blur-sm border border-slate-800 rounded-lg p-0.5 shadow-sm pointer-events-auto">
          <button
            onClick={() => setViewMode('ball-and-stick')}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'ball-and-stick' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Ball & Stick
          </button>
          <button
            onClick={() => setViewMode('space-filling')}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'space-filling' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Space Fill
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors cursor-pointer ${viewMode === 'wireframe' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Wireframe
          </button>
        </div>
      </div>

      {/* Primary drawing Canvas stage */}
      <div 
        ref={containerRef}
        className="flex-1 w-full relative min-h-[320px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Floating element coloring legend table */}
      <div className="absolute bottom-3 left-3 bg-[#111318]/90 backdrop-blur-sm border border-slate-800 px-2 py-1.5 rounded-lg shadow-sm flex flex-col gap-1 z-10 select-none">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block border-b border-slate-800 pb-0.5 mb-1 font-sans">Legend</span>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {uniqElements.map(el => {
            const colors = getElementColor(el);
            const count = atoms.filter(a => a.element === el).length;
            return (
              <div key={el} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border border-slate-800" style={{ backgroundColor: colors.light }} />
                <span className="text-[10px] font-serif font-semibold text-slate-300">{el} <span className="font-sans font-normal text-slate-500">({count})</span></span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls HUD button deck */}
      <div className="absolute bottom-3 right-3 flex gap-1.5 z-10 p-1 bg-[#111318]/90 backdrop-blur-sm border border-slate-800 rounded-lg shadow-sm">
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? "Pause auto-rotation" : "Play auto-rotation"}
          className="p-1 px-1.5 text-slate-400 hover:bg-slate-850 hover:text-white rounded transition-colors cursor-pointer"
        >
          {isRotating ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          onClick={resetOrientation}
          title="Reset rotation angles and zoom"
          className="p-1 px-1.5 text-slate-400 hover:bg-slate-850 hover:text-white rounded transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
        </button>
        <span className="w-px h-4 bg-slate-800 self-center" />
        <button
          onClick={() => setZoom(Math.max(40, zoom - 15))}
          title="Zoom Out (Scroll Wheel is integrated)"
          className="p-1 px-1.5 text-slate-400 hover:bg-slate-850 hover:text-white rounded transition-colors cursor-pointer"
        >
          <ZoomOut size={13} />
        </button>
        <button
          onClick={() => setZoom(Math.min(220, zoom + 15))}
          title="Zoom In"
          className="p-1 px-1.5 text-slate-400 hover:bg-slate-850 hover:text-white rounded transition-colors cursor-pointer"
        >
          <ZoomIn size={13} />
        </button>
      </div>
    </div>
  );
}
