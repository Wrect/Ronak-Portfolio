import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Cpu,
  Award,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  ChevronRight,
  Code,
  Wrench,
  Gamepad2,
  GraduationCap,
  Trophy,
  Zap,
  ChevronLeft,
  X,
  Maximize2,
  Music,
  Video,
  Layers,
  Sparkles
} from 'lucide-react';

// --- STYLES INJECTION ---
const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    :root {
      --action-red: #ef4444;
      --electric-cyan: #06b6d4;
      --bg-dark: #050505;
      --transition-curve: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .blur-active {
      filter: blur(25px);
      pointer-events: none;
      transition: filter 0.3s ease;
    }

    /* ENHANCED GLASSMORPHISM EFFECT */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(25px) saturate(160%);
      -webkit-backdrop-filter: blur(25px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      border-left: 1px solid rgba(255, 255, 255, 0.15);
      transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
    }

    .glass-card:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(6, 182, 212, 0.5);
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(6, 182, 212, 0.2);
    }

    .nav-glass {
      background: rgba(5, 5, 5, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .bg-gradient-flow {
      background: linear-gradient(135deg, #050505 0%, #020D12 100%);
      position: fixed;
      inset: -50%;
      z-index: -3;
    }

    .btn-action {
      background-color: var(--electric-cyan);
      color: #000;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 900;
    }

    .btn-gradient {
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: #ffffff;
      font-weight: 900;
    }

    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.03);
      color: #E5E7EB;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
    }

    model-viewer {
      width: 100%;
      height: 100%;
      background-color: transparent;
    }

    .deck-perspective {
      perspective: 1500px;
      transform-style: preserve-3d;
    }

    .section-divider {
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(6, 182, 212, 0.2), transparent);
    }
  `}} />
);

const DynamicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let reqId;
    let scene, camera, renderer, mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    const initBackgrounds = () => {
      if (!window.THREE) {
        setTimeout(initBackgrounds, 100);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      scene = new window.THREE.Scene();
      camera = new window.THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

      renderer = new window.THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const createSoftParticle = () => {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        return new window.THREE.CanvasTexture(pCanvas);
      };

      const streamCount = 12;
      const pointsPerStream = 600;
      const totalPoints = streamCount * pointsPerStream;
      const geometry = new window.THREE.BufferGeometry();
      const positions = new Float32Array(totalPoints * 3);
      const colors = new Float32Array(totalPoints * 3);
      const streamData = [];

      const colorPalette = [
        new window.THREE.Color('#00E5FF'), // Electric Cyan
        new window.THREE.Color('#8A2BE2'), // Hyper-Violet
        new window.THREE.Color('#00E5FF'),
        new window.THREE.Color('#8A2BE2')
      ];

      let ptIdx = 0;
      for (let i = 0; i < streamCount; i++) {
        const color = colorPalette[i % colorPalette.length];
        const freq = 0.01 + (i % 3) * 0.005;
        const speed = 0.5 + (i % 3) * 0.2;
        const yRadius = 8.0 + (i % 4) * 3.0;
        const zRadius = 5.0 + (i % 2) * 4.0;
        const phase = i * (Math.PI / 4);

        streamData.push({ freq, speed, yRadius, zRadius, phase });

        for (let j = 0; j < pointsPerStream; j++) {
          const x = -150 + (j / pointsPerStream) * 300;
          positions[ptIdx * 3] = x;
          positions[ptIdx * 3 + 1] = 0;
          positions[ptIdx * 3 + 2] = 0;
          colors[ptIdx * 3] = color.r;
          colors[ptIdx * 3 + 1] = color.g;
          colors[ptIdx * 3 + 2] = color.b;
          ptIdx++;
        }
      }

      geometry.setAttribute('position', new window.THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new window.THREE.BufferAttribute(colors, 3));

      const material = new window.THREE.PointsMaterial({
        size: 10.0,
        map: createSoftParticle(),
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: window.THREE.AdditiveBlending,
        depthWrite: false
      });

      const streams = new window.THREE.Points(geometry, material);
      scene.add(streams);
      camera.position.set(0, 0, 50);

      const animate = () => {
        reqId = requestAnimationFrame(animate);
        const time = Date.now() * 0.0003; // SLOW-MOVING NEURAL SPEED
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        const posAttr = streams.geometry.attributes.position;
        let index = 0;
        for (let i = 0; i < streamCount; i++) {
          const { freq, speed, yRadius, zRadius, phase } = streamData[i];
          for (let j = 0; j < pointsPerStream; j++) {
            const x = posAttr.getX(index);
            const wavePhase = (x * freq) - (time * speed) + phase;
            const y = Math.sin(wavePhase) * yRadius + Math.sin(x * 0.01) * 3;
            const z = Math.cos(wavePhase) * zRadius;
            posAttr.setY(index, y);
            posAttr.setZ(index, z);
            index++;
          }
        }
        posAttr.needsUpdate = true;
        scene.rotation.y = targetX * 0.05;
        scene.rotation.x = -targetY * 0.03;
        renderer.render(scene, camera);
      };
      animate();
    };

    initBackgrounds();
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
    };
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="bg-gradient-flow" />
      <canvas ref={canvasRef} className="fixed inset-0 z-[-2] pointer-events-none w-full h-full" />
      <div className="fixed inset-0 z-[-1] bg-black/65 pointer-events-none" />
    </>
  );
};

const ProjectDeck = ({ title, projects, selectedModel, setSelectedModel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const dealForward = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const recallBackward = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    if (selectedModel) return; // Pause auto-sliding when a model is open
    const interval = setInterval(() => {
      dealForward();
    }, 3000);
    return () => clearInterval(interval);
  }, [projects.length, selectedModel]);

  const getStyle = (idx) => {
    const base = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '400px',
      height: '560px',
      transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    };

    if (projects.length === 0) return base;

    const diff = (idx - currentIndex + projects.length) % projects.length;

    if (diff === 0) {
      // center
      return { ...base, transform: 'translate(-50%, -50%) translateZ(150px) scale(1)', opacity: 1, zIndex: 20 };
    } else if (diff === projects.length - 1) {
      // left
      return { ...base, transform: 'translate(-125%, -60%) translateZ(0px) rotateY(20deg) scale(0.85)', opacity: 0.6, zIndex: 10 };
    } else if (diff === 1) {
      // right
      return { ...base, transform: 'translate(25%, -40%) translateZ(0px) rotateY(-20deg) scale(0.85)', opacity: 0.6, zIndex: 10 };
    } else {
      // hidden
      return { ...base, transform: 'translate(-50%, -50%) translateZ(-200px) scale(0.5)', opacity: 0, zIndex: 0, pointerEvents: 'none' };
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center py-20">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-black italic tracking-widest uppercase text-white">{title}</h3>
          <div className="h-1 w-24 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
        </div>
        <div className="relative w-full max-w-6xl h-[600px] deck-perspective flex items-center justify-center">
          <button onClick={recallBackward} className="absolute left-4 md:left-10 z-50 w-16 h-16 rounded-full bg-zinc-900/90 border border-white/10 text-cyan-400 flex items-center justify-center hover:scale-110 transition-all shadow-2xl">
            <ChevronLeft size={32} />
          </button>
          <button onClick={dealForward} className="absolute right-4 md:right-10 z-50 w-16 h-16 rounded-full bg-zinc-900/90 border border-white/10 text-cyan-400 flex items-center justify-center hover:scale-110 transition-all shadow-2xl">
            <ChevronRight size={32} />
          </button>
          <div className="relative w-full h-full transform-style-3d">
            {projects.map((proj, idx) => {
              const diff = (idx - currentIndex + projects.length) % projects.length;
              return (
                <div
                  key={idx}
                  className="bg-black border border-white/10 rounded-[32px] flex flex-col shadow-2xl cursor-pointer hover:border-cyan-500/50"
                  style={getStyle(idx)}
                  onClick={() => {
                    if (diff === 0) {
                      setSelectedModel(proj);
                    } else if (diff === projects.length - 1) {
                      recallBackward();
                    } else if (diff === 1) {
                      dealForward();
                    }
                  }}
                >
                  <div className="w-full h-[300px] bg-black border-b border-white/5 pointer-events-none rounded-t-[32px]">
                    <model-viewer src={proj.model} auto-rotate shadow-intensity="1" exposure="1"></model-viewer>
                  </div>
                  <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-black italic uppercase text-white mb-4">{proj.title}</h3>
                    <div className="space-y-1 w-full">
                      {proj.desc.split('\n').map((line, i) => (
                        <p key={i} className="text-[11px] font-bold uppercase text-left tracking-tight">
                          <span className="text-cyan-400">{line.split(':')[0]}:</span>
                          <span className="text-slate-300 ml-1">{line.split(':')[1]}</span>
                        </p>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center text-xs text-cyan-400 font-bold uppercase tracking-wider">
                      <Maximize2 size={14} className="mr-2" /> View Model
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const loadScript = (src, type, onLoad) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        if (type) script.type = type;
        if (onLoad) script.onload = onLoad;
        document.head.appendChild(script);
      } else if (onLoad) onLoad();
    };
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    loadScript('https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js', 'module');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      setScrollY(currentScrollY);
      const sections = ['home', 'about', 'skills', 'projects', 'achievements'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 300) setActiveSection(section);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const cadProjects = [
    {
      title: "Ball Bearing",
      desc: "System: Mechanical\nProblem: Friction Reduction\nRole: Designer",
      model: "/BallBearing.glb"
    },
    {
      title: "Earphone Cover",
      desc: "System: Consumer Electronics\nProblem: Ergonomic Fit\nRole: Product Designer",
      model: "/EarphoneCover.glb"
    },
    {
      title: "Engine Model",
      desc: "System: Propulsion\nProblem: Thermal Efficiency\nRole: Lead Engineer",
      model: "/EngineModel.glb"
    },
    {
      title: "Gas Turbine",
      desc: "System: Power Gen\nProblem: Flow Dynamics\nRole: Modeler",
      model: "/GasTurbine.glb"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      <CustomStyles />
      <DynamicBackground />

      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full transition-all duration-300 ${isScrolled ? 'nav-glass py-4 shadow-2xl' : 'bg-transparent py-8'} ${selectedModel ? 'z-0 opacity-0 pointer-events-none' : 'z-50 opacity-100'}`}>
        <div className={`max-w-7xl mx-auto px-6 flex items-center transition-all duration-500 relative ${isScrolled ? 'justify-end' : 'justify-center'}`}>

          <div
            className="text-2xl font-black tracking-tighter text-white z-10 absolute left-6"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 200) / 100)),
              transform: `translateX(${Math.max(0, 40 - (scrollY - 200) * 0.4)}px)`,
              pointerEvents: scrollY > 200 ? 'auto' : 'none'
            }}
          >
            RONAK <span className="text-cyan-500 font-normal">KUMAR</span>
          </div>

          <div className="hidden md:flex space-x-10 items-center transition-all duration-500">
            {['Home', 'About', 'Skills', 'Projects', 'Achievements'].map((link) => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase())} className={`text-xs uppercase tracking-widest font-black transition-colors ${activeSection === link.toLowerCase() ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}>{link}</button>
            ))}
            <button onClick={() => scrollTo('contact')} className="btn-gradient px-8 py-3 rounded-full text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all">Contact</button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full pt-32 space-y-32">
        {/* HERO */}
        <section id="home" className="min-h-[85vh] flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">

            <div
              className="origin-top"
              style={{
                // Scale from 1 to 0.5 continuously over 300px
                transform: `scale(${Math.max(0.5, 1 - scrollY / 600)}) translateY(-${Math.min(120, scrollY * 0.4)}px) translateX(-${Math.min(100, scrollY * 0.3)}%)`,
                opacity: Math.max(0, 1 - scrollY / 250),
                pointerEvents: scrollY < 150 ? 'auto' : 'none'
              }}
            >
              <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 text-white tracking-tighter">RONAK <br className="md:hidden" /><span className="bg-gradient-to-r from-cyan-400 to-[#8A2BE2] bg-clip-text text-transparent">KUMAR</span></h1>
              <span className="inline-block py-2 px-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-10 shadow-lg shadow-[#8A2BE2]/20 backdrop-blur-md">CAD Modeling • AI Media • Automation</span>
            </div>
            <p className="text-slate-100 text-lg md:text-xl max-w-2xl mx-auto font-bold mb-12 drop-shadow-lg" style={{ opacity: Math.max(0, 1 - scrollY / 150) }}>
              Aspiring CAD Model Designer & Mechanical Engineering Student bridging the gap between precision engineering and AI automation.
            </p>
            <div className="flex gap-6 justify-center">
              <button onClick={() => scrollTo('projects')} className="btn-gradient px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest">Explore Work</button>
              <button onClick={() => scrollTo('about')} className="btn-secondary px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest">Profile Data</button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="scroll-mt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-white">Profile <span className="text-cyan-500 italic">Data</span></h2>
              <div className="h-1 w-24 bg-cyan-500/30 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black mb-6 text-white uppercase italic flex items-center tracking-tight">
                  <Monitor className="mr-3 text-cyan-400" /> Executive Summary
                </h3>
                <p className="text-lg leading-relaxed text-slate-200 mb-6 font-medium">
                  Experienced with AutoCAD, SolidWorks, and AI-based automation tools. Passionate about building systems that transform ideas into functional models, automation pipelines, and creative media.
                </p>
                <p className="text-lg leading-relaxed text-slate-200 font-medium">
                  A dedicated learner with proven team leadership in Esports, balancing competitive strategy with strong communication skills.
                </p>
              </div>
              <div className="glass-card p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black mb-8 text-white uppercase italic flex items-center">
                  <GraduationCap className="mr-3 text-cyan-400" /> Education Timeline
                </h3>
                <div className="space-y-8 border-l-2 border-white/10 pl-8 ml-2">
                  {[
                    { title: "B.Voc. D.M.T.", desc: "J.C. BOSE University (YMCA)", status: "Pursuing", highlight: true },
                    { title: "12th Grade (HBSC)", desc: "Govt. Model Senior Secondary School", status: "2024 — 76.6%" },
                    { title: "10th Grade (HBSC)", desc: "Govt. Model Senior Secondary School", status: "2022 — 90.8%" }
                  ].map((edu, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full ${edu.highlight ? 'bg-cyan-500 shadow-cyan-500/50 shadow-lg' : 'bg-zinc-700'}`}></div>
                      <h4 className="text-white font-black text-lg uppercase tracking-tight">{edu.title}</h4>
                      <p className="text-slate-400 text-sm font-medium">{edu.desc}</p>
                      <p className={`text-xs font-black mt-1 uppercase tracking-widest ${edu.highlight ? 'text-cyan-400' : 'text-zinc-500'}`}>{edu.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="scroll-mt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-white">Capability <span className="text-cyan-500 italic">Matrix</span></h2>
              <div className="h-1 w-24 bg-cyan-500/30 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Wrench, title: "Engineering", skills: ['AutoCAD (2D & 3D)', 'SolidWorks', 'Parametric thinking', 'EV Technology'] },
                { icon: Cpu, title: "AI Systems", skills: ['Vibe Coding', 'Automation Logic', 'Image Gen Dev', 'Workflow pipelines'] },
                { icon: Gamepad2, title: "Leadership", skills: ['Team coordination', 'Esports Management', 'Data Metrics', 'English Comm.'] }
              ].map((group, i) => (
                <div key={i} className="glass-card p-12 rounded-[3rem]">
                  <group.icon className="text-cyan-400 w-10 h-10 mb-8" />
                  <h3 className="text-2xl font-black mb-6 text-white uppercase italic">{group.title}</h3>
                  <ul className="space-y-4">
                    {group.skills.map(s => (
                      <li key={s} className="flex items-center gap-3 text-slate-300 font-bold text-sm uppercase tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-cyan-500/50 shadow-sm" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="scroll-mt-24 px-6 relative">
          <div className="max-w-7xl mx-auto text-center mb-24">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Systems <span className="text-cyan-500 italic underline decoration-cyan-500/30 underline-offset-[12px]">Execution</span></h2>
          </div>

          <div className="space-y-48">
            <ProjectDeck title="3D CAD Models" projects={cadProjects} selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

            {/* GEN-AI VISION SUITE */}
            <div className="w-full flex flex-col items-center">
              <div className="mb-12 text-center">
                <h3 className="text-3xl font-black italic tracking-widest uppercase text-white">Gen-AI Vision Suite</h3>
                <div className="h-1 w-24 bg-cyan-500 mx-auto mt-2 rounded-full"></div>
              </div>
              <div className="w-full max-w-[1000px] glass-card rounded-[32px] p-3 aspect-video shadow-2xl border border-white/10 mb-12">
                <video className="w-full h-full rounded-[24px] object-cover bg-black" controls autoPlay loop muted>
                  <source src="/VideoApp.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="w-full max-w-5xl grid md:grid-cols-3 gap-10 text-left px-4">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-3xl font-black text-white flex items-center tracking-tight"><Code className="mr-4 text-cyan-400" /> InfoGenius & Studio</h4>
                  <p className="text-xl text-slate-200 font-bold leading-relaxed">Unified application integrating Google Generative AI for content synthesis and image manipulation.</p>
                  <div className="grid gap-4">
                    {['Automated Fact Research', 'Prompt Optimization Pipeline', 'AI Canvas Manipulation'].map(pt => (
                      <div key={pt} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <Zap size={20} className="text-cyan-400" /> <span className="font-bold text-white uppercase text-xs tracking-wider">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-10 rounded-[40px] flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-black text-cyan-400 uppercase mb-6 tracking-widest">Technologies</h5>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Firebase', 'Gemini', 'Tailwind'].map(t => <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-300 font-bold">{t}</span>)}
                    </div>
                  </div>
                  <button className="btn-action w-full py-5 rounded-3xl font-black uppercase text-xs tracking-widest mt-12 hover:scale-105 transition-transform">Launch Project <ChevronRight size={16} className="inline ml-1" /></button>
                </div>
              </div>
            </div>

            {/* AI MUSIC VIDEO */}
            <div className="w-full flex flex-col items-center pb-20">
              <div className="mb-12 text-center">
                <h3 className="text-3xl font-black italic tracking-widest uppercase text-white">AI Music Video</h3>
                <div className="h-1 w-24 bg-cyan-500 mx-auto mt-2 rounded-full"></div>
              </div>
              <div className="w-full max-w-[1000px] glass-card rounded-[32px] p-3 aspect-video shadow-2xl border border-white/10 mb-12">
                <video className="w-full h-full rounded-[24px] object-cover bg-black" controls autoPlay loop muted>
                  <source src="/MusicClip.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="w-full max-w-[1000px] grid md:grid-cols-4 gap-6 text-left mb-10">
                {[
                  { icon: Music, title: "Audio Architecture", desc: "Synthesized using Suno AI for bespoke generative compositions and rhythmic precision." },
                  { icon: Video, title: "Visual Synthesis", desc: "Generated with Google Veo & Kling for cinematic motion and complex prompt-to-video execution." },
                  { icon: Layers, title: "Post-Production", desc: "Edited in Filmora and Canva for professional-grade timing, assets, and visual layering." },
                  { icon: Sparkles, title: "Upscaling & FX", desc: "Enhanced via Upscayl & ESRGAN to achieve 4K high-fidelity generative textures." }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all">
                    <h5 className="text-xs font-black text-white uppercase flex items-center mb-4 tracking-widest"><item.icon size={16} className="text-cyan-400 mr-2" /> {item.title}</h5>
                    <p className="text-xs text-slate-300 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 flex items-center shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mr-3"></div>
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]"><span className="text-white">Engine:</span> Gen-Media Pipeline</span>
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-full border border-white/10 flex items-center shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-zinc-500 mr-3"></div>
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]"><span className="text-white">Role:</span> Creative Direction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="scroll-mt-24 px-6 pb-40">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
            <div className="glass-card p-12 rounded-[50px]">
              <h3 className="text-3xl font-black uppercase italic text-white mb-12 flex items-center"><Trophy className="mr-4 text-cyan-400" /> Rankings</h3>
              <div className="space-y-6">
                {[{ r: "#16", t: "CAD Championship 2025" }, { r: "#20", t: "CAD Championship 2026" }].map((it, i) => (
                  <div key={i} className="flex items-center gap-8 p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all">
                    <span className="text-5xl font-black text-cyan-400 italic">{it.r}</span>
                    <span className="text-lg font-black uppercase text-white tracking-tight">{it.t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-12 rounded-[50px]">
              <h3 className="text-3xl font-black uppercase italic text-white mb-12 flex items-center"><Award className="mr-4 text-cyan-400" /> Academic Certificates</h3>
              <div className="space-y-4">
                {['Outskill AI Mastermind', 'CRM Level 4 — SVSU', 'IT Level 2 — SVSU'].map(c => (
                  <div key={c} className="p-6 border-b border-white/5 flex justify-between items-center group transition-all">
                    <span className="font-bold uppercase text-slate-200 group-hover:text-cyan-400 transition-colors tracking-wide">{c}</span>
                    <ChevronRight size={18} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="py-24 bg-zinc-900 rounded-t-[5rem] text-center border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-6xl font-black italic text-white mb-6 uppercase tracking-tighter">RONAK <span className="text-cyan-500 font-normal">KUMAR</span></div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.4em] mb-16">Intelligence meets Engineering</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20">
            <a href="mailto:Ronkaumar1211@gmail.com" className="flex items-center p-4 bg-white/5 rounded-full text-slate-300 hover:text-cyan-400 hover:-translate-y-2 transition-all border border-white/5 shadow-lg group">
              <div className="p-3 bg-white/5 rounded-full mr-4 group-hover:bg-cyan-500/20 transition-colors"><Mail size={24} /></div>
              <span className="font-bold tracking-wider text-sm">Ronkaumar1211@gmail.com</span>
            </a>
            <a href="https://linkedin.com/in/ronak-kumar-502709380" target="_blank" rel="noreferrer" className="flex items-center p-4 bg-white/5 rounded-full text-slate-300 hover:text-cyan-400 hover:-translate-y-2 transition-all border border-white/5 shadow-lg group">
              <div className="p-3 bg-white/5 rounded-full mr-4 group-hover:bg-cyan-500/20 transition-colors"><Linkedin size={24} /></div>
              <span className="font-bold tracking-wider text-sm">LinkedIn</span>
            </a>
            <a href="tel:+919891643893" className="flex items-center p-4 bg-white/5 rounded-full text-slate-300 hover:text-cyan-400 hover:-translate-y-2 transition-all border border-white/5 shadow-lg group">
              <div className="p-3 bg-white/5 rounded-full mr-4 group-hover:bg-cyan-500/20 transition-colors"><Phone size={24} /></div>
              <span className="font-bold tracking-wider text-sm">+91-9891643893</span>
            </a>
            <div className="flex items-center p-4 bg-white/5 rounded-full text-slate-300 border border-white/5 shadow-lg cursor-default">
              <div className="p-3 bg-white/5 rounded-full mr-4"><MapPin size={24} className="text-cyan-500" /></div>
              <span className="font-bold tracking-wider text-sm">Faridabad, Haryana</span>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">© 2026 Ronak Kumar • YMCA University of Science & Technology</p>
        </div>
      </footer>

      {/* MODEL POPUP MODAL (LIFTED OUT OF STACKING CONTEXT) */}
      {selectedModel && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-end bg-black/90 backdrop-blur-md pb-10 px-4 md:px-10 pointer-events-auto">

          <div className="absolute top-10 right-10 z-[100000] flex gap-4 pointer-events-auto items-center">
            <div className="hidden md:flex px-6 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full items-center text-xs font-bold uppercase text-slate-300 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></span> Interactive Mode
            </div>
            <button
              onClick={() => setSelectedModel(null)}
              className="w-14 h-14 bg-red-500/20 backdrop-blur-xl border-2 border-red-500/50 rounded-full flex items-center justify-center text-red-50 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-[0_0_30px_rgba(239,68,68,0.4)] pointer-events-auto isolate"
              style={{ position: 'relative', zIndex: 999999 }}
            >
              <X size={28} />
            </button>
          </div>

          <div className="fixed inset-0 w-screen h-screen bg-black/95 z-[90000] overflow-hidden flex flex-col pointer-events-auto">
            <div className="absolute top-10 left-10 z-[50] pointer-events-none">
              <h2 className="text-4xl font-black italic uppercase text-white tracking-widest drop-shadow-lg">{selectedModel.title}</h2>
              <div className="h-1 w-20 bg-cyan-500 mt-4 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            </div>

            <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-black relative z-0">
              <model-viewer
                src={selectedModel.model}
                auto-rotate
                camera-controls
                shadow-intensity="2"
                exposure="1"
                environment-image="neutral"
                style={{ width: '100%', height: '100%', outline: 'none' }}
              ></model-viewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;