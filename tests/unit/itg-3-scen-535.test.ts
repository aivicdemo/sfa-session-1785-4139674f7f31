import { extractTopPriorityImprovementItems } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善対象項目抽出', () => {
  test('SCEN-535: 改善対象項目が複数件のとき優先度上位のみが抽出される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([
        { itemId: 'item_1', priorityScore: 0.95, description: '顧客ニーズの詳細ヒアリング強化' },
        { itemId: 'item_2', priorityScore: 0.87, description: '競合分析の事前準備' },
        { itemId: 'item_3', priorityScore: 0.76, description: '提案資料の視覚化改善' },
        { itemId: 'item_4', priorityScore: 0.65, description: 'フォローアップタイミングの最適化' },
        { itemId: 'item_5', priorityScore: 0.52, description: '顧客データの統一性確保' },
      ]),
    };

    const customerData = {
      customerId: 'cust_001',
      industry: 'manufacturing',
      companySize: 'large',
      region: 'tokyo',
    };

    const dealConditions = {
      dealId: 'deal_001',
      dealStage: 'proposal',
      dealAmount: 5000000,
      expectedCloseDate: '2026-03-31',
    };

    const result = extractTopPriorityImprovementItems(
      mockAIRecommendationEngine,
      customerData,
      dealConditions,
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerData,
      dealConditions,
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].priorityScore).toBe(0.95);
    expect(result[0].itemId).toBe('item_1');

    const extractedScores = result.map((item: any) => item.priorityScore);
    expect(extractedScores).not.toContain(0.87);
    expect(extractedScores).not.toContain(0.76);
    expect(extractedScores).not.toContain(0.65);
    expect(extractedScores).not.toContain(0.52);
  });
});