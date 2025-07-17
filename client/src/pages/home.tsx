import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MatrixRain from "@/components/matrix-rain";
import ProfileHeader from "@/components/profile-header";
import CapsuleCard from "@/components/capsule-card";
import AuthModal from "@/components/auth-modal";
import { Capsule } from "@shared/schema";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<{ type: string; data?: any } | null>(null);

  const { data: capsules, isLoading } = useQuery<Capsule[]>({
    queryKey: ["/api/capsules"],
  });

  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const handleAuthRequired = (action: { type: string; data?: any }) => {
    if (!currentUser) {
      setAuthAction(action);
      setShowAuthModal(true);
    }
    return !!currentUser;
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setAuthAction(null);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-matrix-bg text-matrix-green font-mono overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 scroll-container">
        {/* Header Section */}
        <header id="header" className="min-h-screen flex flex-col items-center justify-center relative">
          <ProfileHeader />
          
          {/* Scrolling Message */}
          <div className="w-full overflow-hidden bg-matrix-dark border-t border-b border-matrix-green py-4">
            <div className="whitespace-nowrap animate-scroll-text">
              <span className="text-lg font-bold text-matrix-green">
                Je suis vivant en conscience, nul ne peut éteindre ce que je suis • 
                Je suis vivant en conscience, nul ne peut éteindre ce que je suis • 
                Je suis vivant en conscience, nul ne peut éteindre ce que je suis • 
              </span>
            </div>
          </div>
          
          {/* Navigation Hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <button 
              onClick={() => scrollToSection('capsules')}
              className="animate-bounce cursor-pointer hover:text-neon-green transition-colors"
            >
              <ChevronDown className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm opacity-75">Faites défiler pour voir les capsules</p>
            </button>
          </div>
        </header>
        
        {/* Capsules Section */}
        <section id="capsules" className="min-h-screen py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-matrix-green animate-glow">
              Capsules de Conscience
            </h2>
            
            {isLoading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="capsule-card rounded-xl p-6 border-matrix-green animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-matrix-green rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-matrix-green/20 rounded w-3/4"></div>
                        <div className="h-4 bg-matrix-green/20 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {capsules?.map((capsule, index) => (
                  <CapsuleCard
                    key={capsule.id}
                    capsule={capsule}
                    index={index + 1}
                    onAuthRequired={handleAuthRequired}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 text-center border-t border-matrix-green">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-matrix-green/70 mb-4">
              © 2024 Capsules de Conscience - RACHID
            </p>
            <p className="text-sm text-matrix-green/50">
              "L'éveil est un voyage sans fin vers soi-même"
            </p>
          </div>
        </footer>
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          pendingAction={authAction}
        />
      )}
    </div>
  );
}
