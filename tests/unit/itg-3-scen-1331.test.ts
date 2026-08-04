import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と顧客制約条件の自動照合', () => {
  test('SCEN-1331: 投資対効果の数値化結果が画面に表示される', () => {
    // 顧客情報
    const customerInfo = {
      industry: '製造業',
      employeeCount: 500,
      budgetLimit: 50000000,
    };

    // 提案内容
    const proposalContent = {
      proposalAmount: 32000000,
      implementationPeriodMonths: 6,
    };

    // AIRecommendationEngine のスタブ
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        roi: 245,
        paybackPeriodMonths: 14,
        cumulativeEffectThreeYears: 28500000,
        successConfidenceScore: 0.87,
      }),
    };

    // 照合実行
    const result = evaluatePatternRelevance(
      customerInfo,
      proposalContent,
      aiRecommendationEngineStub
    );

    // 期待結果の検証
    expect(result).toEqual({
      roi: 245,
      paybackPeriodMonths: 14,
      cumulativeEffectThreeYears: 28500000,
      successConfidenceScore: 87,
    });

    // ROI が 245% で表示されることを確認
    expect(result.roi).toBe(245);

    // ペイバックピリオドが 14ヶ月で表示されることを確認
    expect(result.paybackPeriodMonths).toBe(14);

    // 3年間累積効果額が 2,850万円で表示されることを確認
    expect(result.cumulativeEffectThreeYears).toBe(28500000);

    // 成功確度スコアが 87% で表示されることを確認
    expect(result.successConfidenceScore).toBe(87);

    // AIRecommendationEngine のメソッドが呼び出されたことを確認
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(
      customerInfo,
      proposalContent
    );
  });
});