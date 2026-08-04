import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  test('SCEN-2020: 改善提案が0件のとき、改善提案列が空となる', async () => {
    // Setup: AIRecommendationEngine をモック化
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationsList: [],
        proposals: [],
        timingScore: 0,
        riskFactors: [],
        improvementSuggestions: []
      })
    };

    // Setup: 最小限の顧客情報と商談条件
    const customerInfo = {
      companyName: 'Example Corp',
      industry: 'IT',
      issueDescription: 'System integration challenge'
    };

    const dealConditions = {
      dealValue: 500000,
      timeline: '2024-Q2',
      decisionMaker: 'CTO'
    };

    // Execute: 生成処理を実行
    const result = await generateRecommendation(
      customerInfo,
      dealConditions,
      mockAIEngine
    );

    // Verify: AIRecommendationEngine が呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealConditions
    );

    // Verify: 改善提案配列が空であることを確認
    expect(result.improvementSuggestions).toEqual([]);
    expect(result.recommendationsList).toEqual([]);
    expect(result.proposals).toEqual([]);

    // Verify: 空状態メッセージが生成されていることを確認
    expect(result.emptyStateMessage).toBe('該当する改善提案がありません');

    // Verify: レポート生成フラグが false であることを確認（PDF/Excel出力の抑止）
    expect(result.shouldGenerateReport).toBe(false);

    // Verify: タイミングスコアが0であることを確認
    expect(result.timingScore).toBe(0);

    // Verify: リスク要因も空であることを確認
    expect(result.riskFactors).toEqual([]);
  });
});