import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推論精度検証と改善提案生成', () => {
  test('SCEN-405: 推論精度検証実行後、改善提案が0件のとき改善提案なしとして記録される', () => {
    // Arrange: テスト用スタブ定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue([]), // 推奨パターン0件を返す
    };

    // テスト用の商談条件データ
    const dealConditionInput = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト営業',
      industry: 'IT',
      companySize: 'mid',
      dealAmount: 5000000,
      dealStage: 'proposal',
      dealDate: new Date('2024-01-15T11:00:00Z'),
      productCategory: 'software',
      requiredTimeline: 30,
    };

    // Act: 推論精度検証実行
    const accuracyCheckResult = evaluateInferenceAccuracy(
      dealConditionInput,
      mockAIRecommendationEngine
    );

    // Assert: 改善提案が0件であることを検証
    expect(accuracyCheckResult.improvementProposalCount).toBe(0);

    // 記録状態が『改善提案なし』であることを検証
    expect(accuracyCheckResult.improvementProposalStatus).toBe('改善提案なし');

    // ユーザー向けメッセージが正しく生成されていることを検証
    expect(accuracyCheckResult.userDisplayMessage).toMatch(/推奨パターンが十分に抽出できませんでした/);

    // evaluatePatternRelevanceが1回だけ呼ばれ、再呼び出しが発生していないことを検証
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20240115-001',
        industry: 'IT',
        dealAmount: 5000000,
      })
    );

    // 改善提案詳細が空配列であることを検証
    expect(accuracyCheckResult.improvementProposalDetails).toEqual([]);

    // 処理完了状態が正常（成功）であることを検証
    expect(accuracyCheckResult.executionStatus).toBe('completed');

    // 精度検証スコアが0～100の範囲内であることを検証
    expect(accuracyCheckResult.accuracyScore).toBeGreaterThanOrEqual(0);
    expect(accuracyCheckResult.accuracyScore).toBeLessThanOrEqual(100);
  });
});