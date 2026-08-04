import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1742: 推奨根拠の可視化機能 - 根拠が複数件のとき根拠リストに全要素を含めて返す', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          patternName: '大規模企業向け提案パターン',
          matchScore: 0.92,
        },
        {
          patternId: 'pattern_002',
          patternName: '製造業向けDX提案パターン',
          matchScore: 0.87,
        },
        {
          patternId: 'pattern_003',
          patternName: '中堅企業マーケティング課題解決パターン',
          matchScore: 0.85,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasonsList: [
          {
            reasonId: 'reason_001',
            reasonText: '過去3年の同業種成功事例で80%の採用実績',
            relevanceScore: 0.95,
          },
          {
            reasonId: 'reason_002',
            reasonText: '顧客の経営課題が成功パターンと95%一致',
            relevanceScore: 0.93,
          },
          {
            reasonId: 'reason_003',
            reasonText: '提案予算が標準的な投資規模内である',
            relevanceScore: 0.88,
          },
        ],
      }),
      generateRecommendation: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'cust_001',
      customerName: '株式会社ABC',
      industry: '製造業',
      companySize: '大企業',
      dealCondition: {
        dealValue: 50000000,
        dealStage: '提案段階',
        decisionMaker: 'CTO',
      },
      customerNeeds: [
        'デジタルトランスフォーメーション推進',
        'システム統合効率化',
        'コスト削減',
      ],
    };

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendationId: 'rec_001',
      customerId: 'cust_001',
      recommendedApproach: '大規模製造業向けDX統合ソリューション提案',
      confidenceScore: 0.91,
      reasonsList: [
        {
          reasonId: 'reason_001',
          reasonText: '過去3年の同業種成功事例で80%の採用実績',
          relevanceScore: 0.95,
        },
        {
          reasonId: 'reason_002',
          reasonText: '顧客の経営課題が成功パターンと95%一致',
          relevanceScore: 0.93,
        },
        {
          reasonId: 'reason_003',
          reasonText: '提案予算が標準的な投資規模内である',
          relevanceScore: 0.88,
        },
      ],
    });

    const result = generateRecommendation(newDealData, mockAIRecommendationEngine);

    expect(result).toBeDefined();
    expect(result.reasonsList).toBeDefined();
    expect(Array.isArray(result.reasonsList)).toBe(true);
    expect(result.reasonsList.length).toBeGreaterThanOrEqual(3);

    expect(result.reasonsList[0].reasonId).toBe('reason_001');
    expect(result.reasonsList[0].reasonText).toBe(
      '過去3年の同業種成功事例で80%の採用実績'
    );
    expect(result.reasonsList[0].relevanceScore).toBe(0.95);

    expect(result.reasonsList[1].reasonId).toBe('reason_002');
    expect(result.reasonsList[1].reasonText).toBe(
      '顧客の経営課題が成功パターンと95%一致'
    );
    expect(result.reasonsList[1].relevanceScore).toBe(0.93);

    expect(result.reasonsList[2].reasonId).toBe('reason_003');
    expect(result.reasonsList[2].reasonText).toBe(
      '提案予算が標準的な投資規模内である'
    );
    expect(result.reasonsList[2].relevanceScore).toBe(0.88);

    const reasonIds = result.reasonsList.map((r: { reasonId: string }) => r.reasonId);
    const uniqueReasonIds = new Set(reasonIds);
    expect(uniqueReasonIds.size).toBe(3);

    for (let i = 0; i < result.reasonsList.length - 1; i++) {
      expect(result.reasonsList[i].relevanceScore).toBeGreaterThanOrEqual(
        result.reasonsList[i + 1].relevanceScore
      );
    }

    const hasEmptyElements = result.reasonsList.some(
      (r: { reasonId: string; reasonText: string; relevanceScore: number }) =>
        !r.reasonId || !r.reasonText || r.relevanceScore === null || r.relevanceScore === undefined
    );
    expect(hasEmptyElements).toBe(false);
  });
});