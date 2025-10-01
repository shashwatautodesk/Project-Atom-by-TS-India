import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Rocket, Zap, Database, BarChart3, Clock, FileSpreadsheet, ArrowRight, Sparkles, Search, Wand2, TrendingUp, Calendar } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setParticlesVisible(true), 500);
  }, []);

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Element Search",
      description: "Advanced filters & multi-criteria search",
      color: "from-teal-400 to-cyan-500"
    },
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI Rendering",
      description: "Photorealistic visualization with AI",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "BOQ Analytics",
      description: "Interactive charts & quantity takeoffs",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "4D BIM",
      description: "Time-based construction simulation",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Gantt Chart",
      description: "Visual timeline & project scheduling",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FileSpreadsheet className="w-8 h-8" />,
      title: "Excel Import",
      description: "Bulk WBS schedule integration",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Smart Export",
      description: "CSV, IFC, and data extraction",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Cloud Sync",
      description: "Real-time ACC project access",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-autodesk-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Floating Particles */}
      {particlesVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-hello-yellow opacity-30"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: Math.random() * 5 + 's'
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className={`max-w-6xl w-full transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Large Animated Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-hello-yellow blur-3xl opacity-30 animate-pulse" />
                <Logo size="large" className="relative scale-150 hover:scale-[1.6] transition-transform duration-500" />
              </div>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-hello-yellow to-autodesk-blue bg-clip-text text-transparent animate-gradient">
              Project <span className="text-hello-yellow">Atom</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-autodesk-gray-300 mb-3 font-light">
              Next-Generation BIM Platform with AI & Analytics
            </p>
            
            {/* Feature Stats */}
            <div className="flex items-center justify-center gap-6 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-hello-yellow rounded-full animate-pulse" />
                <span className="text-xs text-autodesk-gray-400">8 Power Features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-autodesk-teal rounded-full animate-pulse" />
                <span className="text-xs text-autodesk-gray-400">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-autodesk-blue rounded-full animate-pulse" />
                <span className="text-xs text-autodesk-gray-400">Cloud-Native</span>
              </div>
            </div>
            
            {/* Powered By */}
            <div className="flex items-center justify-center gap-2 text-autodesk-teal mb-2">
              <Zap className="w-5 h-5 animate-pulse" />
              <p className="text-sm font-medium">
                Powered by Autodesk Platform Services
              </p>
            </div>
            
            {/* Credits */}
            <p className="text-xs text-autodesk-gray-400 italic">
              Developed by Autodesk India Technical Sales
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-hello-yellow/20 cursor-pointer ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-autodesk-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onEnter}
              className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-hello-yellow via-yellow-400 to-hello-yellow bg-size-200 bg-pos-0 hover:bg-pos-100 text-autodesk-black font-bold text-lg rounded-full shadow-2xl shadow-hello-yellow/50 hover:shadow-hello-yellow/80 transition-all duration-500 transform hover:scale-105 animate-pulse-slow"
            >
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Launch Project Atom</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              
              {/* Sparkle Effect */}
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-white opacity-0 group-hover:opacity-100 animate-ping" />
            </button>
            
            {/* Helper Text */}
            <p className="mt-6 text-autodesk-gray-500 text-sm flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Ready to transform your BIM workflow
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-xs text-autodesk-gray-400 italic">
              Questions? Contact{' '}
              <a 
                href="mailto:shashwat.bahrdwaj@autodesk.com" 
                className="text-hello-yellow hover:text-yellow-400 underline transition-colors"
              >
                shashwat.bahrdwaj@autodesk.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hello-yellow/10 to-transparent pointer-events-none" />

      {/* CSS Animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .bg-size-200 {
          background-size: 200% auto;
        }
        
        .bg-pos-0 {
          background-position: 0% center;
        }
        
        .hover\:bg-pos-100:hover {
          background-position: 100% center;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

