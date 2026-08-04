import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能 - 推奨精度スコア基準値未満時の判定', () => {
  // SCEN-2748
  test('推奨精度スコア0.79が基準値0.80未満のとき、研修実施可否フラグがfalseで返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.79,
        applicablePatterns: [],
        analysisDetails: {
          customerSegment: 'mid_market',
          productCategory: 'enterprise_software',
          stageMismatch: 0.21,
        },
      }),
    };

    const dealData = {
      dealId: 'DEAL-20240115-001',
      customerId: 'CUST-5678',
      customerIndustry: 'manufacturing',
      customerSize: 'mid_market',
      productCategory: 'enterprise_software',
      dealStage: 'discovery',
      estimatedValue: 250000,
      closingProbability: 0.65,
    };

    const evaluationThreshold = 0.80;

    const result = evaluatePatternRelevance(dealData, mockAIRecommendationEngine, evaluationThreshold);

    expect(result.trainingApprovedFlag).toBe(false);
    expect(result.relevanceScore).toBe(0.79);
    expect(result.evaluationThreshold).toBe(0.80);
    expect(result.judgmentStatus).toBe('実施不可');
    expect(result.detailMessage).toContain('精度スコア: 0.79');
    expect(result.detailMessage).toContain('基準値: 0.80');
    expect(result.detailMessage).toContain('判定: 実施不可');
  });
});