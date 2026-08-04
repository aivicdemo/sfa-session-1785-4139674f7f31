import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2037
  test('経営層向け説得資料の自動生成機能 - 照合評価結果のリスク要因リストの順序が逆のとき、適切なソート処理により正しい優先度順で資料に記載される', () => {
    const reverseOrderedRiskFactors = [
      { riskId: 'R3', priority: 1, score: 2.5 },
      { riskId: 'R2', priority: 2, score: 5.0 },
      { riskId: 'R1', priority: 3, score: 8.5 },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Premium Package',
        confidenceScore: 92,
        riskFactors: reverseOrderedRiskFactors,
        investmentEffect: {
          roi: 2.5,
          paybackPeriod: 18,
        },
        implementationNotes: 'Immediate deployment possible',
      }),
    };

    const customerConstraints = {
      customerId: 'CUST-2024-001',
      industryVertical: 'Manufacturing',
      businessSize: 'Enterprise',
      budgetLimit: 500000,
      implementationTimeline: 'Q2 2025',
    };

    const proposalContent = {
      proposalId: 'PROP-2024-001',
      productCategory: 'Digital Transformation',
      estimatedValue: 350000,
      riskAssessment: {
        technicalRisk: 'Medium',
        organizationalRisk: 'High',
        financialRisk: 'Low',
      },
    };

    return generateRecommendation(
      customerConstraints,
      proposalContent,
      mockAIRecommendationEngine
    ).then((result) => {
      expect(result.persuasionDocument).toBeDefined();

      const riskFactorsSection = result.persuasionDocument.riskFactorsSection;
      expect(riskFactorsSection).toBeDefined();
      expect(riskFactorsSection.factors).toHaveLength(3);

      expect(riskFactorsSection.factors[0].riskId).toBe('R1');
      expect(riskFactorsSection.factors[0].score).toBe(8.5);

      expect(riskFactorsSection.factors[1].riskId).toBe('R2');
      expect(riskFactorsSection.factors[1].score).toBe(5.0);

      expect(riskFactorsSection.factors[2].riskId).toBe('R3');
      expect(riskFactorsSection.factors[2].score).toBe(2.5);

      expect(riskFactorsSection.factors[0].score).toBeGreaterThan(
        riskFactorsSection.factors[1].score
      );
      expect(riskFactorsSection.factors[1].score).toBeGreaterThan(
        riskFactorsSection.factors[2].score
      );
    });
  });
});