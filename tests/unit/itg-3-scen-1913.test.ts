import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1913
  test('過去事例の日付が期間終了日より直後のときに根拠から除外される', async () => {
    const periodStartDate = '2026-01-01';
    const periodEndDate = '2026-01-31';
    
    const newDeal = {
      customerId: 'CUST-001',
      customerIndustry: '製造業',
      customerSize: '中堅企業',
      periodStartDate,
      periodEndDate,
      dealAmount: 5000000,
      productCategory: 'システムソリューション',
    };

    const pastExamples = [
      {
        exampleId: 'EX-A',
        successDate: '2026-01-15',
        customerId: 'CUST-X',
        industry: '製造業',
        size: '中堅企業',
        productCategory: 'システムソリューション',
        successPattern: 'initial_proposal_accepted',
        dealAmount: 4800000,
      },
      {
        exampleId: 'EX-B',
        successDate: '2026-02-01',
        customerId: 'CUST-Y',
        industry: '製造業',
        size: '中堅企業',
        productCategory: 'システムソリューション',
        successPattern: 'initial_proposal_accepted',
        dealAmount: 5200000,
      },
      {
        exampleId: 'EX-C',
        successDate: '2026-02-05',
        customerId: 'CUST-Z',
        industry: '製造業',
        size: '中堅企業',
        productCategory: 'システムソリューション',
        successPattern: 'initial_proposal_accepted',
        dealAmount: 4900000,
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        proposalApproach: '段階的な提案を採用し、初期接触で顧客のニーズ把握に注力する',
        confidenceScore: 85,
        applicablePastExamples: ['EX-A', 'EX-B', 'EX-C'],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText: '過去事例の分析により、同じ業種・規模の顧客に対して、段階的な提案アプローチが有効であることが確認されました。特に事例A（2026-01-15成功）が期間内の成功事例として適用可能です。事例B、Cは期間終了日より後の事例のため、参考値として含みますが、期間内実績としては事例Aのみが該当します。',
        relevantExamples: [
          {
            exampleId: 'EX-A',
            successDate: '2026-01-15',
            relevanceReason: '期間内の成功事例として直接適用可能',
            withinPeriod: true,
          },
        ],
        excludedExamples: [
          {
            exampleId: 'EX-B',
            successDate: '2026-02-01',
            exclusionReason: '期間終了日より直後のため根拠から除外',
            withinPeriod: false,
          },
          {
            exampleId: 'EX-C',
            successDate: '2026-02-05',
            exclusionReason: '期間終了日より後のため根拠から除外',
            withinPeriod: false,
          },
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue(pastExamples),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 85,
      }),
    };

    const recommendationResult = await generateRecommendation(
      newDeal,
      mockAIRecommendationEngine
    );

    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.recommendationId).toBe('REC-001');
    expect(recommendationResult.confidenceScore).toBe(85);

    const reasoningResult = await explainRecommendationReasoning(
      recommendationResult.recommendationId,
      mockAIRecommendationEngine
    );

    expect(reasoningResult).toBeDefined();
    expect(reasoningResult.relevantExamples).toHaveLength(1);
    expect(reasoningResult.relevantExamples[0].exampleId).toBe('EX-A');
    expect(reasoningResult.relevantExamples[0].successDate).toBe('2026-01-15');
    expect(reasoningResult.relevantExamples[0].withinPeriod).toBe(true);

    expect(reasoningResult.excludedExamples).toHaveLength(2);
    
    const excludedExampleB = reasoningResult.excludedExamples.find(
      (ex) => ex.exampleId === 'EX-B'
    );
    expect(excludedExampleB).toBeDefined();
    expect(excludedExampleB?.successDate).toBe('2026-02-01');
    expect(excludedExampleB?.withinPeriod).toBe(false);
    expect(excludedExampleB?.exclusionReason).toMatch(/期間終了日より直後/);

    const excludedExampleC = reasoningResult.excludedExamples.find(
      (ex) => ex.exampleId === 'EX-C'
    );
    expect(excludedExampleC).toBeDefined();
    expect(excludedExampleC?.successDate).toBe('2026-02-05');
    expect(excludedExampleC?.withinPeriod).toBe(false);
    expect(excludedExampleC?.exclusionReason).toMatch(/期間終了日より後/);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDeal
    );
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});