import { evaluateProposalCustomerFitScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案内容と顧客制約条件の自動照合機能', () => {
  // SCEN-1394
  test('顧客の経営目標が1件のとき、適合度スコアが計算される', () => {
    // 顧客レコード: 経営目標1件設定
    const customer = {
      id: 'cust_001',
      name: '山田商事',
      managementGoals: [
        {
          id: 'goal_001',
          description: '売上20%増加',
          targetValue: 20,
          unit: 'percent',
        },
      ],
    };

    // 提案内容: 顧客の経営目標と関連する内容
    const proposal = {
      id: 'prop_001',
      title: '新規営業チャネル構築による売上拡大',
      description: '既存顧客層に加えて新規市場への営業チャネルを構築し、売上拡大を実現',
      proposedApproach: 'channel_expansion',
    };

    // AIRecommendationEngineのevaluatePatternRelevanceをスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.85,
        matchDetails: {
          goalCoverage: 0.85,
          strategicAlignment: 0.85,
        },
      }),
    };

    // 適合度スコア計算関数を実行
    const result = evaluateProposalCustomerFitScore(
      customer,
      proposal,
      mockAIEngine
    );

    // 戻り値のスコアを検証: 0.0～1.0の範囲
    expect(result.fitScore).toBe(0.85);
    expect(result.fitScore).toBeGreaterThanOrEqual(0.0);
    expect(result.fitScore).toBeLessThanOrEqual(1.0);

    // スコアが顧客の経営目標とスタブから返却されたスコアと一致
    expect(result.fitScore).toEqual(0.85);

    // AIRecommendationEngine.evaluatePatternRelevanceが1回のみ呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      customer,
      proposal
    );

    // 計算の実行履歴を検証
    expect(result).toHaveProperty('fitScore');
    expect(result).toHaveProperty('executedAt');
    expect(result.executedAt).toBeDefined();
  });
});