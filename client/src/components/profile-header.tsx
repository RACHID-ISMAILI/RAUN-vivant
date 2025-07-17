export default function ProfileHeader() {
  return (
    <div className="name-circle mb-8">
      {/* Circular photo with glowing effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-matrix-green to-neon-green p-1 animate-pulse-glow">
        <div className="w-full h-full bg-matrix-bg rounded-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400" 
            alt="RACHID" 
            className="w-full h-full object-cover" 
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
