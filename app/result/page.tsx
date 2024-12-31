"use client";

import { useProposal } from '@/hooks/use-proposal';
import { ResultHeader } from '@/components/proposal/result/result-header';
import { ProposalContent } from '@/components/proposal/result/proposal-content';
import { DownloadSection } from '@/components/proposal/result/download-section';
import { CostSection } from '@/components/proposal/result/cost-section';
import { NoDataFallback } from '@/components/proposal/result/no-data-fallback';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { calculateCosts } from '@/lib/cost-calculator';
import { AnimatedBackground } from '@/components/ui/animated-background';

export default function ResultPage() {
  const { 
    isLoading,
    isPart1Loading,
    isPart2Loading,
    error,
    formData,
    proposalPart1,
    proposalPart2,
    downloadAsWord,
    updatePart1,
    updatePart2
  } = useProposal();

  if (error || !formData) {
    return <NoDataFallback error={error} />;
  }

  const costs = calculateCosts({
    incidentTickets: formData.incidentTickets,
    serviceRequests: formData.serviceRequests,
    changeTickets: formData.changeTickets,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-12 relative">
        <ResultHeader 
          companyName={formData.companyName}
          clientName={formData.clientName}
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ProposalContent
            title="The core solution and operating model"
            content={proposalPart1}
            variant="primary"
            isLoading={isPart1Loading}
            onSave={updatePart1}
          />

          <ProposalContent
            title="Detailed execution approach and Value Adds"
            content={proposalPart2}
            variant="secondary"
            isLoading={isPart2Loading}
            onSave={updatePart2}
          />
        </div>

        <div className="mb-8">
          <DownloadSection 
            onDownload={downloadAsWord}
            isLoading={isPart1Loading || isPart2Loading}
          />
        </div>

        <div>
          <CostSection costs={costs} />
        </div>
      </div>
    </div>
  );
}