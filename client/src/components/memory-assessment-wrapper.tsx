import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import MemoryAssessmentModal from "./memory-assessment-modal";
import { apiRequest } from "@/lib/queryClient";

interface MemoryAssessmentWrapperProps {
  children: React.ReactNode;
}

export default function MemoryAssessmentWrapper({ children }: MemoryAssessmentWrapperProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAssessment, setShowAssessment] = useState(false);

  // Check if user has completed memory assessment
  const { data: userProfile, isLoading } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    enabled: !!user,
  });

  // Update user memory settings
  const updateMemoryMutation = useMutation({
    mutationFn: async (data: { memoryType: 'good' | 'average' | 'poor'; memoryLambda: number }) => {
      const response = await apiRequest("PATCH", "/api/auth/update-memory", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Memory assessment completed!",
        description: "Your learning algorithm has been personalized based on your memory type."
      });
      setShowAssessment(false);
    }
  });

  // Show assessment if user is logged in but hasn't completed memory assessment
  useEffect(() => {
    if (user && !isLoading && userProfile && !userProfile.memoryType) {
      // Delay showing the modal to avoid showing it immediately on page load
      const timer = setTimeout(() => {
        setShowAssessment(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, userProfile]);

  const handleAssessmentComplete = (memoryType: 'good' | 'average' | 'poor') => {
    const memoryLambdas = {
      good: 0.2,
      average: 0.4,
      poor: 0.8
    };

    updateMemoryMutation.mutate({
      memoryType,
      memoryLambda: memoryLambdas[memoryType]
    });
  };

  const handleAssessmentClose = () => {
    setShowAssessment(false);
    toast({
      title: "Assessment postponed",
      description: "You can complete your memory assessment later in Settings > Profile.",
      variant: "default"
    });
  };

  return (
    <>
      {children}
      <MemoryAssessmentModal
        isOpen={showAssessment}
        onClose={handleAssessmentClose}
        onComplete={handleAssessmentComplete}
      />
    </>
  );
}
