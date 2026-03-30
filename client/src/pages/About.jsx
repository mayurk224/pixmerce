import React from 'react';

const About = ({ onBack }) => {
  return (
    // Outer wrapper: Takes up full screen, semi-transparent dark background to blur the map behind it
    <div className="min-h-screen w-full bg-black/50 flex justify-center items-start p-4 md:p-10 overflow-y-auto z-50 fixed inset-0">
      
      {/* Main Pixelated Container */}
      <div className="relative w-full max-w-4xl bg-[#8a8a8a] border-4 border-[#2c2c2c] p-6 md:p-10 mt-10 mb-10 shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.3),inset_4px_4px_0_rgba(255,255,255,0.4)]">
        
        {/* Corner Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-[#b5b5b5] shadow-[1px_1px_0_rgba(0,0,0,0.5)]"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#b5b5b5] shadow-[1px_1px_0_rgba(0,0,0,0.5)]"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#b5b5b5] shadow-[1px_1px_0_rgba(0,0,0,0.5)]"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#b5b5b5] shadow-[1px_1px_0_rgba(0,0,0,0.5)]"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="text-5xl md:text-7xl text-[#fcdb6d] tracking-widest uppercase"
            style={{ 
              fontFamily: "'Pixelify Sans', sans-serif",
              textShadow: "3px 3px 0 #2c2c2c, -1px -1px 0 #2c2c2c, 1px -1px 0 #2c2c2c, -1px 1px 0 #2c2c2c, 1px 1px 0 #2c2c2c"
            }}
          >
            Pixel Market
          </h1>
          <p className="text-[#2c2c2c] font-bold mt-2 text-lg tracking-wide">v1.0.0 - Early Access</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#1a1a1a]">
          
          {/* Left Column: What is it & How to Play */}
          <div className="space-y-6">
            <section className="bg-[#b5b5b5] p-5 border-2 border-[#2c2c2c] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2)]">
              <h2 className="text-2xl text-[#2c2c2c] mb-3" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>
                What is this?
              </h2>
              <p className="font-medium leading-relaxed">
                Pixel Market is a next-generation negotiation RPG. Step into a dynamic 2.5D world where every shopkeeper is powered by an advanced AI LLM. They have secret minimum prices, unique personalities, and a strict timer. Your goal? Buy low, haggle hard, and build your empire.
              </p>
            </section>

            <section className="bg-[#b5b5b5] p-5 border-2 border-[#2c2c2c] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.2)]">
              <h2 className="text-2xl text-[#2c2c2c] mb-3" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>
                How to Play
              </h2>
              <ul className="space-y-3 font-medium">
                <li className="flex gap-2"><span>🛒</span> <strong>Browse:</strong> Explore the map and click on shops to view their inventory.</li>
                <li className="flex gap-2"><span>💬</span> <strong>Haggle:</strong> Enter the chat arena. You have 60 seconds and 6 rounds to talk the AI down from their sticker price.</li>
                <li className="flex gap-2"><span>🤝</span> <strong>Deal:</strong> If the AI accepts your offer, the cash is deducted from your wallet and the items are yours.</li>
                <li className="flex gap-2"><span>🚫</span> <strong>Reject:</strong> Insult the AI with a lowball offer, and they will kick you out of the store.</li>
              </ul>
            </section>
          </div>

          {/* Right Column: Roadmap / Upcoming */}
          <div className="space-y-6">
            <section className="bg-[#3a3a3a] text-white p-5 border-2 border-[#2c2c2c] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5)]">
              <h2 className="text-3xl text-[#fcdb6d] mb-4" style={{ fontFamily: "'Pixelify Sans', sans-serif", textShadow: "2px 2px 0 #000" }}>
                Development Roadmap
              </h2>
              <p className="text-gray-300 mb-4 text-sm font-medium">
                The market is constantly expanding. Here is what is coming in future updates:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#5d995d] pl-3">
                  <h3 className="text-[#5d995d] font-bold text-lg" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>🏆 Global Leaderboards</h3>
                  <p className="text-sm text-gray-300">Compete against other players. Rank up based on your total net worth and the best deals you've secured.</p>
                </div>

                <div className="border-l-4 border-[#4b77b7] pl-3">
                  <h3 className="text-[#4b77b7] font-bold text-lg" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>🏦 The Pixel Bank</h3>
                  <p className="text-sm text-gray-300">Run out of cash? Take out a loan with interest, store your excess wealth safely, and manage your economy.</p>
                </div>

                <div className="border-l-4 border-[#c75e5e] pl-3">
                  <h3 className="text-[#c75e5e] font-bold text-lg" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>💼 Daily Hustle</h3>
                  <p className="text-sm text-gray-300">Complete mini-games and daily jobs in the city to earn extra starting cash before you hit the shops.</p>
                </div>

                <div className="border-l-4 border-[#d49942] pl-3">
                  <h3 className="text-[#d49942] font-bold text-lg" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>🌍 Multiplayer Hub</h3>
                  <p className="text-sm text-gray-300">See other players walking around the map live, trade items peer-to-peer, and chat in the global server.</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-10 flex justify-center">
          <button 
            onClick={onBack}
            className="bg-[#c75e5e] border-[3px] border-[#2c2c2c] px-10 py-3 rounded-sm outline-none transition-all
                       shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.4),inset_3px_3px_0_rgba(255,255,255,0.4)]
                       hover:brightness-110 
                       active:translate-y-1 active:shadow-[inset_3px_3px_0_rgba(0,0,0,0.4)]"
          >
            <span 
              className="text-[#fcdb6d] text-2xl tracking-widest uppercase block"
              style={{ 
                fontFamily: "'Pixelify Sans', sans-serif",
                textShadow: "2px 2px 0 #2c2c2c"
              }}
            >
              Back to Game
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default About;