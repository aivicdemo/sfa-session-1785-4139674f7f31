import { detectAnomalyPatterns } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2257: [normal] 異常パターン検出ロジック - 提案内容が標準プロセスに完全に合致するとき異常パターンとして検出されない', () => {
    const standardProcessProposal = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      businessChallenge: 'supply_chain_optimization',
      proposalApproach: 'process_automation',
      recommendationScore: 0.95,
      matchedSuccessPatternId: 'PATTERN-STD-001',
      proposalContent: {
        title: '製造業向けサプライチェーン最適化ソリューション',
        description: 'ERP統合による業務効率化提案',
        estimatedInvestment: 5000000,
        expectedROI: 0.35,
        implementationDays: 120,
      },
      detectionContext: {
        pastSuccessRate: 0.88,
        customerSegmentTrend: 'positive',
        proposalComplianceWithStandardProcess: 1.0,
        deviationScore: 0.0,
      },
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'process_automation',
        confidenceScore: 0.95,
        relatedSuccessPatterns: ['PATTERN-STD-001'],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PATTERN-STD-001',
          matchScore: 0.96,
          successRate: 0.88,
        },
      ]),
    };

    const detectionResult = detectAnomalyPatterns(
      standardProcessProposal,
      mockAIRecommendationEngine
    );

    expect(detectionResult.isAnomaly).toBe(false);
    expect(detectionResult.anomalyScore).toBe(0.0);
    expect(detectionResult.anomalyReason).toBe('');
  });
});