import { memo } from "react";

export const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-background pointer-events-none">
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/glass-texture.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/30 blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-900/20 blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[130px] animate-blob animation-delay-4000" />
      
      {/* Vignette to darken edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10" />
    </div>
  );
});
