import React, { useState, useEffect } from 'react';
import { Icon, SystemIcons, ProcessIcons } from '../components/IconLibrary';

const CryptoAILandingLong: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(212, 79, 79, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(106, 155, 106, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(106, 123, 155, 0.15) 0%, transparent 50%)
              `
            }}
          ></div>
          
          {/* Free Game Data Rain */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xs font-mono opacity-10 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  color: ['#6A9B6A', '#D44F4F', '#6A7B9B'][Math.floor(Math.random() * 3)],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['⚙️', '🧩', '🤖', '🧠', '🌱', 'TOKEN', 'QUEST'][Math.floor(Math.random() * 7)]}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl md:text-9xl font-bold font-mono mb-8" style={{ color: '#6A9B6A' }}>
              FREELANCE QUEST
            </h1>
            <h2 className="text-4xl md:text-5xl font-mono mb-8" style={{ color: '#6A7B9B' }}>
              🚀 ZERO TO $10K/MONTH
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed" style={{ color: '#6A7B9B' }}>
              Master the 6-stage progression system that transforms beginners into high-earning freelancers. 
              Learn specific skills → Build systems → Scale your business → Achieve financial freedom.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                className="px-16 py-6 rounded-lg font-mono font-bold text-2xl cyberpunk-button"
                style={{ 
                  background: 'linear-gradient(90deg, #D44F4F 0%, #7B3A3A 100%)',
                  color: '#1A1A1A',
                  border: '2px solid #D44F4F'
                }}
              >
                🚀 START YOUR QUEST
              </button>
              <button 
                className="px-16 py-6 rounded-lg font-mono transition-all text-2xl border-2 cyberpunk-button"
                style={{ 
                  backgroundColor: '#1A1A1A',
                  color: '#6A9B6A',
                  borderColor: '#6A9B6A'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6A9B6A';
                  e.currentTarget.style.color = '#1A1A1A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1A1A1A';
                  e.currentTarget.style.color = '#6A9B6A';
                }}
              >
                📋 VIEW CURRICULUM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="cyberpunk-panel p-8 rounded-lg industrial-border text-center">
            <div className="mb-6">
              <Icon name="shield" size="xl" color="accent" />
            </div>
            <h3 className="text-3xl font-mono font-bold mb-6" style={{ color: '#D44F4F' }}>
              ⚠️ IMPORTANT DISCLAIMER
            </h3>
            <div className="max-w-4xl mx-auto space-y-4 text-left">
              <p className="text-lg" style={{ color: '#6A7B9B' }}>
                <strong style={{ color: '#6A9B6A' }}>This is not your typical online course.</strong> 
                FREELANCE QUEST is a gamified progression system that transforms your skills into a profitable 
                freelance business through structured learning, practical implementation, and systematic scaling.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <h4 className="text-lg font-mono font-bold mb-3" style={{ color: '#6A9B6A' }}>💼 WHAT YOU GET:</h4>
                  <ul className="space-y-2 text-sm" style={{ color: '#6A7B9B' }}>
                    <li>• 6 structured progression stages</li>
                    <li>• Specific skills for each stage</li>
                    <li>• Client acquisition strategies</li>
                    <li>• Business scaling systems</li>
                    <li>• Exclusive community access</li>
                  </ul>
                </div>
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <h4 className="text-lg font-mono font-bold mb-3" style={{ color: '#D44F4F' }}>⚠️ WHAT TO KNOW:</h4>
                  <ul className="space-y-2 text-sm" style={{ color: '#6A7B9B' }}>
                    <li>• System is in beta testing</li>
                    <li>• Results may vary</li>
                    <li>• Requires active participation</li>
                    <li>• Free but with limitations</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 p-4 rounded" style={{ backgroundColor: '#2A2A2A', border: '2px solid #6A9B6A' }}>
                <p className="text-sm font-mono" style={{ color: '#6A9B6A' }}>
                  <strong>Ready for the challenge?</strong> Click "CONTINUE" only if 
                  you're truly ready to invest time and effort in your development.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <button 
                className="px-12 py-4 rounded-lg font-mono font-bold text-xl cyberpunk-button"
                style={{ 
                  background: 'linear-gradient(90deg, #6A9B6A 0%, #4A7B4A 100%)',
                  color: '#1A1A1A',
                  border: '2px solid #6A9B6A'
                }}
              >
                ПРОДОВЖИТИ → ДЕМО
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20" style={{ backgroundColor: '#2A2A2A' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold font-mono mb-6" style={{ color: '#6A9B6A' }}>
              💼 YOUR PATH TO FREEDOM
            </h3>
            <p className="text-xl max-w-4xl mx-auto" style={{ color: '#6A7B9B' }}>
              Master 6 progression stages: from complete beginner to high-earning freelancer with systematic skills acquisition
            </p>
            <div className="mt-6 flex justify-center">
              <div className="cyberpunk-panel p-4 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                <div className="flex items-center space-x-2">
                  <div className="text-xl">🔍</div>
                  <div className="text-sm font-mono" style={{ color: '#6A9B6A' }}>
                    EXPLORER → FREELANCER → SPECIALIST → SYSTEMATIZER → BUSINESS BUILDER → LEADER
                  </div>
                  <div className="text-xl">👑</div>
                </div>
              </div>
            </div>
          </div>

          {/* User Journey Demo */}
          <div className="cyberpunk-panel p-8 rounded-lg industrial-border mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {/* Stage 1: Explorer */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                    <Icon name="academic" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    1
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>🔍 EXPLORER</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Learn & Experiment</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#6A9B6A' }}>
                    Skills: Portfolio, Pricing
                  </div>
                  <div className="font-mono text-center" style={{ color: '#D44F4F' }}>
                    🏆 "First Steps"
                  </div>
                </div>
              </div>

              {/* Stage 2: Freelancer */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    <Icon name="cpu" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                    2
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>⚔️ FREELANCER</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Stabilize & Earn</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#D44F4F' }}>
                    Skills: Client Hunt, Proposals
                  </div>
                  <div className="font-mono text-center" style={{ color: '#6A9B6A' }}>
                    🏆 "Stabilizer"
                  </div>
                </div>
              </div>

              {/* Stage 3: Specialist */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B3A3A', color: '#1A1A1A' }}>
                    <Icon name="users" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    3
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>🏆 SPECIALIST</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Focus & Differentiate</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#7B3A3A' }}>
                    Skills: Niche, Premium Pricing
                  </div>
                  <div className="font-mono text-center" style={{ color: '#6A9B6A' }}>
                    🏆 "Expert"
                  </div>
                </div>
              </div>

              {/* Stage 4: Systematizer */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A7B9B', color: '#1A1A1A' }}>
                    <Icon name="cog" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    4
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>⚙️ SYSTEMATIZER</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Automate & Optimize</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#6A7B9B' }}>
                    Skills: Workflows, Tools
                  </div>
                  <div className="font-mono text-center" style={{ color: '#6A9B6A' }}>
                    🏆 "Automator"
                  </div>
                </div>
              </div>

              {/* Stage 5: Business Builder */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    <Icon name="cube" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                    5
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>🏗️ BUSINESS BUILDER</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Create & Scale</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#D44F4F' }}>
                    Skills: Team, Systems
                  </div>
                  <div className="font-mono text-center" style={{ color: '#6A9B6A' }}>
                    🏆 "Builder"
                  </div>
                </div>
              </div>

              {/* Stage 6: Leader */}
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                    <Icon name="star" size="lg" color="muted" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    6
                  </div>
                </div>
                <h4 className="text-sm font-mono font-bold mb-1" style={{ color: '#6A9B6A' }}>👑 LEADER</h4>
                <p className="text-xs mb-2" style={{ color: '#6A7B9B' }}>Integrate & Multiply</p>
                <div className="cyberpunk-panel p-2 rounded text-xs" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="font-mono text-center mb-1" style={{ color: '#6A9B6A' }}>
                    Skills: Strategy, Vision
                  </div>
                  <div className="font-mono text-center" style={{ color: '#D44F4F' }}>
                    🏆 "Legend"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Curriculum Section */}
          <div className="cyberpunk-panel p-8 rounded-lg industrial-border mb-12">
            <h4 className="text-3xl font-mono font-bold mb-8 text-center" style={{ color: '#6A9B6A' }}>📋 DETAILED CURRICULUM</h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Stage 1 Details */}
              <div className="cyberpunk-panel p-6 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                <h5 className="text-xl font-mono font-bold mb-4" style={{ color: '#6A9B6A' }}>🔍 STAGE 1: EXPLORER</h5>
                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>PREREQUISITES:</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Basic computer skills</li>
                      <li>• Internet connection</li>
                      <li>• 2-3 hours/week commitment</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>SKILLS TO ACQUIRE:</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Portfolio creation</li>
                      <li>• Basic pricing strategies</li>
                      <li>• Market research</li>
                      <li>• Personal branding</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>ITINERARY (4 weeks):</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Week 1: Skill assessment & market research</li>
                      <li>• Week 2: Portfolio building</li>
                      <li>• Week 3: Pricing strategy</li>
                      <li>• Week 4: Personal branding</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Stage 2 Details */}
              <div className="cyberpunk-panel p-6 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                <h5 className="text-xl font-mono font-bold mb-4" style={{ color: '#D44F4F' }}>⚔️ STAGE 2: FREELANCER</h5>
                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>PREREQUISITES:</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Completed Stage 1</li>
                      <li>• Basic portfolio ready</li>
                      <li>• 5-7 hours/week commitment</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>SKILLS TO ACQUIRE:</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Client hunting strategies</li>
                      <li>• Proposal writing</li>
                      <li>• Contract negotiation</li>
                      <li>• Project management basics</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>ITINERARY (6 weeks):</h6>
                    <ul className="text-xs space-y-1" style={{ color: '#6A7B9B' }}>
                      <li>• Week 1-2: Client acquisition</li>
                      <li>• Week 3-4: Proposal mastery</li>
                      <li>• Week 5: Contract negotiation</li>
                      <li>• Week 6: First project delivery</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Progress Dashboard */}
          <div className="cyberpunk-panel p-6 rounded-lg industrial-border">
            <h4 className="text-2xl font-mono font-bold mb-6 text-center" style={{ color: '#6A9B6A' }}>💼 YOUR FREELANCE PROFILE</h4>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-mono" style={{ color: '#6A7B9B' }}>OVERALL PROGRESS</span>
                <span className="text-sm font-mono" style={{ color: '#6A9B6A' }}>75%</span>
              </div>
              <div className="w-full h-4 rounded-full" style={{ backgroundColor: '#2A2A2A' }}>
                <div 
                  className="h-4 rounded-full transition-all duration-1000" 
                  style={{ 
                    width: '75%', 
                    background: 'linear-gradient(90deg, #6A9B6A 0%, #D44F4F 50%, #7B3A3A 100%)' 
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>$15,000</div>
                <div className="text-sm font-mono mb-2" style={{ color: '#6A7B9B' }}>MONTHLY INCOME</div>
                <div className="text-xs font-mono" style={{ color: '#6A9B6A' }}>💎 +50 XP per $1000</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold mb-2" style={{ color: '#D44F4F' }}>23</div>
                <div className="text-sm font-mono mb-2" style={{ color: '#6A7B9B' }}>ACTIVE CLIENTS</div>
                <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>⚔️ +100 XP per client</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold mb-2" style={{ color: '#7B3A3A' }}>8</div>
                <div className="text-sm font-mono mb-2" style={{ color: '#6A7B9B' }}>SERVICES MASTERED</div>
                <div className="text-xs font-mono" style={{ color: '#7B3A3A' }}>🏆 +500 XP per service</div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="mt-8">
              <h5 className="text-lg font-mono font-bold mb-4 text-center" style={{ color: '#6A9B6A' }}>🏅 YOUR FREELANCE RANKS</h5>
              <div className="flex justify-center space-x-2">
                <div className="cyberpunk-panel p-2 rounded-lg text-center" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">🔍</div>
                  <div className="text-xs font-mono" style={{ color: '#6A9B6A' }}>Explorer</div>
                </div>
                <div className="cyberpunk-panel p-2 rounded-lg text-center" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">⚔️</div>
                  <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>Freelancer</div>
                </div>
                <div className="cyberpunk-panel p-2 rounded-lg text-center" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">🏆</div>
                  <div className="text-xs font-mono" style={{ color: '#7B3A3A' }}>Specialist</div>
                </div>
                <div className="cyberpunk-panel p-2 rounded-lg text-center" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">⚙️</div>
                  <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>Systematizer</div>
                </div>
                <div className="cyberpunk-panel p-2 rounded-lg text-center" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">🏗️</div>
                  <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>Business Builder</div>
                </div>
                <div className="cyberpunk-panel p-2 rounded-lg text-center opacity-50" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-xl mb-1">👑</div>
                  <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>Leader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Examples Section */}
      <section className="py-20" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold font-mono mb-6" style={{ color: '#6A9B6A' }}>
              💼 ТВОЇ МОЖЛИВІ ШЛЯХИ
            </h3>
            <p className="text-xl max-w-4xl mx-auto" style={{ color: '#6A7B9B' }}>
              Обери свій шлях: від новачка до успішного фрилансера з прибутковим бізнесом
            </p>
            <div className="mt-6 flex justify-center">
              <div className="cyberpunk-panel p-4 rounded-lg" style={{ backgroundColor: '#2A2A2A' }}>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔍</div>
                    <div className="text-xs font-mono" style={{ color: '#6A9B6A' }}>НОВАЧОК</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚔️</div>
                    <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>ФРИЛАНСЕР</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <div className="text-xs font-mono" style={{ color: '#7B3A3A' }}>СПЕЦІАЛІСТ</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚙️</div>
                    <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>СИСТЕМАТИЗАТОР</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏗️</div>
                    <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>БІЗНЕС-БУДІВНИК</div>
                  </div>
                  <div className="text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">👑</div>
                    <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>ЛІДЕР</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scenario 1 */}
            <div className="cyberpunk-panel p-8 rounded-lg industrial-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                    <Icon name="users" size="lg" color="muted" />
                  </div>
                  <div>
                    <h4 className="text-xl font-mono font-bold" style={{ color: '#6A9B6A' }}>💼 ШЛЯХ 1</h4>
                    <p className="text-sm" style={{ color: '#6A7B9B' }}>Новачок → Фрилансер</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono" style={{ color: '#6A9B6A' }}>Складність</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A9B6A' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A9B6A' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A9B9B' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A7B9B' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A7B9B' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-sm font-mono mb-2" style={{ color: '#6A9B6A' }}>ТВІЙ ПОЧАТОК:</div>
                  <div className="text-sm" style={{ color: '#6A7B9B' }}>"Не знаєш, як почати фриланс та знайти перших клієнтів"</div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти завершиш квестів:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#6A9B6A' }}>15</span>
                    <span className="text-xs">💎</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти знайдеш клієнтів:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#D44F4F' }}>5</span>
                    <span className="text-xs">⚔️</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти адаптуєш послуг:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#7B3A3A' }}>3</span>
                    <span className="text-xs">🏆</span>
                  </div>
                </div>
                
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-sm font-mono mb-2" style={{ color: '#6A9B6A' }}>ТВІЙ РЕЗУЛЬТАТ:</div>
                  <div className="text-sm" style={{ color: '#6A7B9B' }}>"Тепер маєш стабільний дохід $3,000/місяць"</div>
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="cyberpunk-panel p-8 rounded-lg industrial-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                    <Icon name="users" size="lg" color="muted" />
                  </div>
                  <div>
                    <h4 className="text-xl font-mono font-bold" style={{ color: '#6A9B6A' }}>💼 ШЛЯХ 2</h4>
                    <p className="text-sm" style={{ color: '#6A7B9B' }}>Спеціаліст → Систематизатор</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono" style={{ color: '#D44F4F' }}>Складність</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D44F4F' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D44F4F' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D44F4F' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#D44F4F' }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6A7B9B' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-sm font-mono mb-2" style={{ color: '#6A9B6A' }}>ТВІЙ ПОЧАТОК:</div>
                  <div className="text-sm" style={{ color: '#6A7B9B' }}>"Хочеш масштабувати бізнес та покращити клієнтську базу"</div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти завершиш квестів:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#6A9B6A' }}>28</span>
                    <span className="text-xs">💎</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти знайдеш клієнтів:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#D44F4F' }}>15</span>
                    <span className="text-xs">⚔️</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: '#6A7B9B' }}>Ти адаптуєш послуг:</span>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#7B3A3A' }}>8</span>
                    <span className="text-xs">🏆</span>
                  </div>
                </div>
                
                <div className="cyberpunk-panel p-4 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="text-sm font-mono mb-2" style={{ color: '#6A9B6A' }}>ТВІЙ РЕЗУЛЬТАТ:</div>
                  <div className="text-sm" style={{ color: '#6A7B9B' }}>"Тепер маєш дохід $8,000/місяць з 15 клієнтами"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="cyberpunk-panel p-6 rounded-lg industrial-border mt-12">
            <h4 className="text-2xl font-mono font-bold mb-6 text-center" style={{ color: '#6A9B6A' }}>ТВОЯ МОЖЛИВА АКТИВНІСТЬ</h4>
            <div className="space-y-3">
              {[
                { action: "ти завершиш квест", quest: "Створити REST API", time: "через 2 хв" },
                { action: "ти отримаєш бейдж", quest: "React Master", time: "через 5 хв" },
                { action: "ти опублікуєш кейс", quest: "E-commerce додаток", time: "через 12 хв" },
                { action: "ти прочитаєш статтю", quest: "TypeScript Advanced", time: "через 18 хв" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#2A2A2A' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                      <Icon name="users" size="sm" color="muted" />
                    </div>
                    <div>
                      <span className="font-mono font-bold" style={{ color: '#6A9B6A' }}>ТИ</span>
                      <span className="text-sm ml-2" style={{ color: '#6A7B9B' }}>{activity.action}</span>
                      <span className="text-sm ml-2" style={{ color: '#D44F4F' }}>"{activity.quest}"</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* System Diagram Section */}
      <section className="py-20" style={{ backgroundColor: '#2A2A2A' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold font-mono mb-6" style={{ color: '#6A9B6A' }}>
              СХЕМА ЗВ'ЯЗКІВ
            </h3>
            <p className="text-xl max-w-4xl mx-auto" style={{ color: '#6A7B9B' }}>
              Як всі компоненти системи взаємодіють між собою
            </p>
          </div>

          <div className="cyberpunk-panel p-8 rounded-lg industrial-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* User */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A9B6A', color: '#1A1A1A' }}>
                  <Icon name="users" size="xl" color="muted" />
                </div>
                <h4 className="text-lg font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>КОРИСТУВАЧ</h4>
                <p className="text-sm" style={{ color: '#6A7B9B' }}>Читає, виконує квести, створює кейси</p>
              </div>

              {/* Site */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6A7B9B', color: '#1A1A1A' }}>
                  <Icon name="globe" size="xl" color="muted" />
                </div>
                <h4 className="text-lg font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>САЙТ</h4>
                <p className="text-sm" style={{ color: '#6A7B9B' }}>Статті, токени, рівні, прогрес</p>
              </div>

              {/* Bot */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D44F4F', color: '#1A1A1A' }}>
                  <Icon name="cpu" size="xl" color="muted" />
                </div>
                <h4 className="text-lg font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>TELEGRAM БОТ</h4>
                <p className="text-sm" style={{ color: '#6A7B9B' }}>Квести, консультації, фідбек</p>
              </div>

              {/* Community */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#7B3A3A', color: '#1A1A1A' }}>
                  <Icon name="users" size="xl" color="muted" />
                </div>
                <h4 className="text-lg font-mono font-bold mb-2" style={{ color: '#6A9B6A' }}>КОМʼЮНІТІ</h4>
                <p className="text-sm" style={{ color: '#6A7B9B' }}>Showcase, peer review, челенджі</p>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="mt-8 text-center">
              <div className="text-sm font-mono mb-4" style={{ color: '#6A7B9B' }}>
                🔄 Всі компоненти синхронізовані через єдину базу даних (SSOT)
              </div>
              <div className="text-xs font-mono" style={{ color: '#6A7B9B' }}>
                Сайт → Токени → Бот → Квести → Кейси → Комʼюніті → Репутація → Сайт
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CryptoAILandingLong;