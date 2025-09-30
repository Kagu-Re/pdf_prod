import React, { useState, useEffect } from 'react';

const CryptoAIMockups: React.FC = () => {
  const [activeMockup, setActiveMockup] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotate mockups
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveMockup((prev) => (prev + 1) % 4);
        setIsAnimating(false);
    }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const mockups = [
    {
      id: 0,
      title: "AI DASHBOARD",
      description: "Real-time AI performance monitoring",
      component: <AIDashboard />
    },
    {
      id: 1,
      title: "QUANTUM CONTROL",
      description: "Quantum computing interface",
      component: <QuantumControl />
    },
    {
      id: 2,
      title: "BLOCKCHAIN MONITOR",
      description: "Decentralized network visualization",
      component: <BlockchainMonitor />
    },
    {
      id: 3,
      title: "AUTOMATION HUB",
      description: "Smart contract execution center",
      component: <AutomationHub />
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold font-mono text-cyan-400 mb-2">
          {mockups[activeMockup].title}
        </h3>
        <p className="text-gray-400 font-mono">
          {mockups[activeMockup].description}
        </p>
      </div>
      
      <div className="relative">
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {mockups[activeMockup].component}
        </div>
        
        {/* Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {mockups.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setActiveMockup(index);
                  setIsAnimating(false);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeMockup ? 'bg-cyan-400 scale-125' : 'bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// AI Dashboard Mockup
const AIDashboard: React.FC = () => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-96 overflow-hidden">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-mono text-cyan-400">AI PERFORMANCE</h4>
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-gray-800 p-4 rounded border border-purple-400">
        <div className="text-2xl font-mono text-purple-400 mb-1">99.7%</div>
        <div className="text-xs text-gray-400">ACCURACY</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-cyan-400">
        <div className="text-2xl font-mono text-cyan-400 mb-1">2.3ms</div>
        <div className="text-xs text-gray-400">LATENCY</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-green-400">
        <div className="text-2xl font-mono text-green-400 mb-1">847K</div>
        <div className="text-xs text-gray-400">REQUESTS</div>
      </div>
    </div>
    
    <div className="bg-gray-800 p-4 rounded border border-gray-600 h-48">
      <div className="text-sm font-mono text-gray-400 mb-2">NEURAL NETWORK ACTIVITY</div>
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="flex-1 bg-gray-700 rounded h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded animate-pulse"
                style={{ width: `${Math.random() * 100}%` }}
              ></div>
            </div>
            <div className="text-xs font-mono text-gray-400">
              {Math.floor(Math.random() * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Quantum Control Mockup
const QuantumControl: React.FC = () => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-96 overflow-hidden">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-mono text-purple-400">QUANTUM CONTROL</h4>
      <div className="text-sm font-mono text-green-400">QUANTUM STATE: ACTIVE</div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-800 p-4 rounded border border-purple-400">
        <div className="text-lg font-mono text-purple-400 mb-2">QUBITS</div>
        <div className="text-3xl font-mono text-white">1,024</div>
        <div className="text-xs text-gray-400">ENTANGLED</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-indigo-400">
        <div className="text-lg font-mono text-indigo-400 mb-2">COHERENCE</div>
        <div className="text-3xl font-mono text-white">99.9%</div>
        <div className="text-xs text-gray-400">STABLE</div>
      </div>
    </div>
    
    <div className="bg-gray-800 p-4 rounded border border-gray-600 h-48">
      <div className="text-sm font-mono text-gray-400 mb-2">QUANTUM CIRCUITS</div>
      <div className="grid grid-cols-4 gap-2 h-32">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className={`border rounded ${
              Math.random() > 0.5 ? 'border-purple-400 bg-purple-400/20' : 'border-gray-600'
            }`}
          >
            <div className="text-xs font-mono text-center p-1">
              Q{i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Blockchain Monitor Mockup
const BlockchainMonitor: React.FC = () => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-96 overflow-hidden">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-mono text-green-400">BLOCKCHAIN MONITOR</h4>
      <div className="text-sm font-mono text-green-400">SYNCED</div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-gray-800 p-4 rounded border border-green-400">
        <div className="text-lg font-mono text-green-400 mb-1">BLOCK</div>
        <div className="text-2xl font-mono text-white">#847,392</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-emerald-400">
        <div className="text-lg font-mono text-emerald-400 mb-1">HASH RATE</div>
        <div className="text-2xl font-mono text-white">847 TH/s</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-teal-400">
        <div className="text-lg font-mono text-teal-400 mb-1">NODES</div>
        <div className="text-2xl font-mono text-white">12,847</div>
      </div>
    </div>
    
    <div className="bg-gray-800 p-4 rounded border border-gray-600 h-48">
      <div className="text-sm font-mono text-gray-400 mb-2">NETWORK TOPOLOGY</div>
      <div className="relative h-32">
        {/* Network visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-green-400 rounded-full flex items-center justify-center">
            <div className="text-xs font-mono text-green-400">CORE</div>
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 border border-cyan-400 rounded-full flex items-center justify-center"
            style={{
              top: `${20 + Math.sin(i * 0.785) * 40}%`,
              left: `${20 + Math.cos(i * 0.785) * 40}%`,
            }}
          >
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        ))}
        {/* Connection lines */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute border-t border-gray-600"
            style={{
              top: '50%',
              left: '50%',
              width: '60px',
              transform: `rotate(${i * 45}deg) translateX(30px)`,
              transformOrigin: 'left center'
            }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// Automation Hub Mockup
const AutomationHub: React.FC = () => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 h-96 overflow-hidden">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-lg font-mono text-orange-400">AUTOMATION HUB</h4>
      <div className="text-sm font-mono text-green-400">RUNNING</div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-800 p-4 rounded border border-orange-400">
        <div className="text-lg font-mono text-orange-400 mb-1">ACTIVE BOTS</div>
        <div className="text-3xl font-mono text-white">47</div>
        <div className="text-xs text-gray-400">EXECUTING</div>
      </div>
      <div className="bg-gray-800 p-4 rounded border border-red-400">
        <div className="text-lg font-mono text-red-400 mb-1">SUCCESS RATE</div>
        <div className="text-3xl font-mono text-white">99.8%</div>
        <div className="text-xs text-gray-400">COMPLETED</div>
      </div>
    </div>
    
    <div className="bg-gray-800 p-4 rounded border border-gray-600 h-48">
      <div className="text-sm font-mono text-gray-400 mb-2">SMART CONTRACTS</div>
      <div className="space-y-2">
        {[
          { name: "DeFi Protocol", status: "ACTIVE", color: "green" },
          { name: "NFT Marketplace", status: "PENDING", color: "yellow" },
          { name: "DAO Governance", status: "ACTIVE", color: "green" },
          { name: "Cross-Chain Bridge", status: "EXECUTING", color: "blue" },
          { name: "Yield Farming", status: "ACTIVE", color: "green" },
          { name: "Liquidity Pool", status: "PENDING", color: "yellow" }
        ].map((contract, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="text-sm font-mono text-white">{contract.name}</div>
            <div className={`text-xs font-mono px-2 py-1 rounded ${
              contract.color === 'green' ? 'bg-green-400 text-black' :
              contract.color === 'yellow' ? 'bg-yellow-400 text-black' :
              'bg-blue-400 text-black'
            }`}>
              {contract.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CryptoAIMockups;




