import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('パターン適用可能性評価機能', () => {
  test('SCEN-068: OpenAI API呼び出しが成功した場合に評価スコアが正常に返される', async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'PAT-001',
        relevanceScore: 0.87,
        confidenceLevel: 'high',
        applicableConditions: ['業種: IT', '案件規模: 100万円以上']
      })
    };

    const newDealData = {
      customerId: 'CUST-MFG-001',
      customerIndustry: '製造業',
      customerName: 'メーカーA',
      dealType: 'システム導入',
      budget: 5000000,
      dealPhase: '初期提案',
      decisionMaker: '情報システム部長'
    };

    const result = await evaluatePatternRelevance(newDealData, mockAIEngine);

    expect(result).toEqual({
      patternId: 'PAT-001',
      relevanceScore: 0.87,
      confidenceLevel: 'high',
      applicableConditions: ['業種: IT', '案件規模: 100万円以上']
    });
    expect(result.relevanceScore).toBe(0.87);
    expect(result.confidenceLevel).toBe('high');
    expect(Array.isArray(result.applicableConditions)).toBe(true);
    expect(result.applicableConditions.length).toBe(2);
  });
});