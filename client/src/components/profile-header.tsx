export default function ProfileHeader() {
  return (
    <div className="name-circle mb-8">
      {/* Circular photo with glowing effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-matrix-green to-neon-green p-1 animate-pulse-glow">
        <div className="w-full h-full bg-matrix-bg rounded-full overflow-hidden">
          <img 
            src="/rachid-photo.jpg" 
            alt="RACHID" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      </div>
      
      {/* Circular Text */}
      <svg className="absolute inset-0 animate-rotate">
        <defs>
          <path id="circle-path" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
        </defs>
        <text className="text-sm font-bold fill-matrix-green">
          <textPath href="#circle-path">
            RACHID • RACHID • RACHID • RACHID • 
          </textPath>
        </text>
      </svg>
    </div>
  );
}
