import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="relative z-50 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 transform rotate-45 rounded-sm"></div>
            <h1 className="text-2xl font-bold text-white tracking-wider">ViewCraft</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 border border-cyan-400/30"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 border border-purple-400/30"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="relative">
          {/* Background geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cyan-400/20 transform rotate-45"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-purple-600/10 transform -rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-pink-400/30 transform rotate-12"></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 text-sm font-mono">
                NEXT-GEN PRODUCT VIEWER
              </Badge>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-tight">
                VIEW<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">CRAFT</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Experience the future of product discovery with our 
                <span className="text-cyan-400 font-semibold"> cyberpunk-inspired </span>
                interface. Browse, explore, and discover products like never before.
              </p>
            </div>

            {/* Glassmorphic Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    Smart Discovery
                  </h3>
                  <p className="text-slate-400">
                    Advanced filtering and search capabilities to find exactly what you're looking for.
                  </p>
                </div>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Curated Collections
                  </h3>
                  <p className="text-slate-400">
                    Handpicked products organized in beautiful, interactive card layouts.
                  </p>
                </div>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                    Lightning Fast
                  </h3>
                  <p className="text-slate-400">
                    Optimized performance with real-time data and smooth interactions.
                  </p>
                </div>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="mt-16 space-y-6">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold tracking-wide transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
                onClick={() => navigate('/login')}
              >
                Enter ViewCraft
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <p className="text-sm text-slate-500 font-mono">
                Demo credentials: emilys / emilyspass
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer geometric accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>
    </div>
  );
}
