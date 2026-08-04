import { describe, test, expect, beforeEach } from '@jest/globals';
import { generatePersuasionDocument } from '../../src/logic/it-1-br-3-2-1-1';

// Mock types for AIRecommendationEngine
interface InvestmentAnalysis {
  initialInvestment: number;
  annualOperatingCost: number;
  expectedAnnualSavings: number;
  productivityGainRate: number;
  roiPaybackPeriodMonths: number;
  npvAmount: number;
}

interface RecommendationResponse {
  investmentAnalysis: InvestmentAnalysis;
}

interface CustomerInfo {
  industry: string;
  companySize: string;
  currentChallenge: string;
}

interface ProposalContent {
  systemName: string;
  implementationPeriodDays: number;
  licenseFeeAmount: number;
}

interface PersuasionDocument {
  investmentAnalysisSection: {
    initialInvestment: number;
    annualOperatingCost: number;
    expectedAnnualSavings: number;
    productivityGainRate: number;
    roiPaybackPeriodMonths: number;
    npvAmount: number;
  };
  layout: string;
}

describe('AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料生成', () => {
  let mockAIRecommendationEngine: {
    generateRecommendation: jest.Mock;
  };

  beforeEach(() => {
    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };
  });

  // SCEN-1972
  test('should generate persuasion document with accurate investment analysis results', async () => {
    const customerInfo: CustomerInfo = {
      industry: '製造業',
      companySize: '従業員500名',
      currentChallenge: '営業プロセスの属人化による成約率低下',
    };

    const proposalContent: ProposalContent = {
      systemName: 'AIエージェント推奨支援システム',
      implementationPeriodDays: 60,
      licenseFeeAmount: 5000000,
    };

    const investmentAnalysisStub: InvestmentAnalysis = {
      initialInvestment: 5000000,
      annualOperatingCost: 800000,
      expectedAnnualSavings: 3200000,
      productivityGainRate: 35,
      roiPaybackPeriodMonths: 18,
      npvAmount: 8500000,
    };

    const recommendationResponse: RecommendationResponse = {
      investmentAnalysis: investmentAnalysisStub,
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValueOnce(
      recommendationResponse
    );

    const generatedDocument: PersuasionDocument =
      await generatePersuasionDocument(
        customerInfo,
        proposalContent,
        mockAIRecommendationEngine
      );

    expect(
      generatedDocument.investmentAnalysisSection.initialInvestment
    ).toBe(5000000);
    expect(
      generatedDocument.investmentAnalysisSection.annualOperatingCost
    ).toBe(800000);
    expect(
      generatedDocument.investmentAnalysisSection.expectedAnnualSavings
    ).toBe(3200000);
    expect(
      generatedDocument.investmentAnalysisSection.productivityGainRate
    ).toBe(35);
    expect(
      generatedDocument.investmentAnalysisSection.roiPaybackPeriodMonths
    ).toBe(18);
    expect(generatedDocument.investmentAnalysisSection.npvAmount).toBe(
      8500000
    );
    expect(generatedDocument.layout).toBe('表形式');
  });
});