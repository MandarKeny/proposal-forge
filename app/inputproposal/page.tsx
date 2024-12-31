"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ClientStorage } from "@/lib/client-storage";
import { FormSteps } from '@/components/proposal/input/form-steps';
import { FormSection } from '@/components/proposal/input/form-section';
import { TopicSelection } from '@/components/proposal/input/topic-selection';
import { ClientObjectives } from '@/components/proposal/input/client-objectives';
import { TicketInputs } from '@/components/proposal/input/ticket-inputs';
import { SimpleToast } from '@/components/ui/feedback/simple-toast';
import { useFormSteps } from '@/lib/hooks/use-form-steps';
import { BaseInput } from '@/components/ui/input/base-input';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useSubmitValidation } from './hooks/use-submit-validation';

const initialSteps = [
  { id: 'topic', title: 'Topic', isCompleted: false, isActive: true },
  { id: 'details', title: 'Details', isCompleted: false, isActive: false },
  { id: 'objectives', title: 'Objectives', isCompleted: false, isActive: false },
  { id: 'tickets', title: 'Tickets', isCompleted: false, isActive: false }
];

export default function InputProposalPage() {
  useAuth(true);
  const router = useRouter();
  const { steps, updateStepStatus } = useFormSteps(initialSteps);
  
  const [formData, setFormData] = useState({
    companyName: "",
    clientName: "",
    selectedTopic: null,
    clientObjectives: [],
    incidentTickets: 0,
    serviceRequests: 0,
    changeTickets: 0,
    model: "gpt-3.5-turbo" as const,
  });

  const [touchedTicketFields, setTouchedTicketFields] = useState({
    incidentTickets: false,
    serviceRequests: false,
    changeTickets: false
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { isSubmitDisabled, areAllTicketFieldsTouched } = useSubmitValidation(formData, touchedTicketFields);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (['incidentTickets', 'serviceRequests', 'changeTickets'].includes(field)) {
      setTouchedTicketFields(prev => ({ ...prev, [field]: true }));
    }
    updateStepStatus({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitDisabled()) {
      setToastMessage("Please complete all sections before generating the proposal.");
      setShowToast(true);
      return;
    }

    if (!areAllTicketFieldsTouched()) {
      setToastMessage("Please fill in all ticket information fields.");
      setShowToast(true);
      return;
    }

    // Save form data and navigate immediately
    ClientStorage.setFormData(formData);
    router.push('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="relative py-24 overflow-hidden">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 backdrop-blur-sm rounded-full text-blue-600 text-sm font-medium mb-6 border border-blue-100/50 shadow-lg"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI-Powered Proposal Generator
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Create Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient bg-[length:200%_auto]">
                Winning Proposal
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600"
            >
              Follow our guided process to generate a professional, AI-powered proposal tailored to your needs.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <FormSteps steps={steps} />

        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
          <FormSection 
            title="Select Proposal Topic" 
            description="Choose the type of proposal you want to generate"
            isActive={steps[0].isActive}
          >
            <TopicSelection
              selectedTopic={formData.selectedTopic}
              onTopicChange={(topic) => handleInputChange('selectedTopic', topic)}
            />
          </FormSection>

          {formData.selectedTopic && (
            <FormSection 
              title="Company Details" 
              description="Enter your company and client information"
              isActive={steps[1].isActive}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput
                  label="Your Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
                <BaseInput
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  required
                />
              </div>
            </FormSection>
          )}

          {formData.companyName && formData.clientName && (
            <FormSection 
              title="Client Objectives" 
              description="Select all objectives that apply"
              isActive={steps[2].isActive}
            >
              <ClientObjectives
                selectedObjectives={formData.clientObjectives}
                onChange={(objectives) => handleInputChange('clientObjectives', objectives)}
              />
            </FormSection>
          )}

          {formData.clientObjectives.length > 0 && (
            <FormSection 
              title="Ticket Information" 
              description="Enter monthly ticket volumes"
              isActive={steps[3].isActive}
            >
              <TicketInputs
                incidentTickets={formData.incidentTickets}
                serviceRequests={formData.serviceRequests}
                changeTickets={formData.changeTickets}
                onChange={handleInputChange}
              />
            </FormSection>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={isSubmitDisabled()}
              className={`
                px-8 py-4 rounded-xl text-white font-medium
                transition-all duration-300 transform hover:scale-105
                ${isSubmitDisabled()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'}
              `}
            >
              Generate Proposal
            </button>
          </motion.div>
        </form>
      </div>

      {showToast && (
        <SimpleToast
          message={toastMessage}
          type="error"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}