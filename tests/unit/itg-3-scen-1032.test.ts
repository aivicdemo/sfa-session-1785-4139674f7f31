import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('商談条件照合評価 - 1件の商談条件と推奨パターンマッチング', () => {
  test('SCEN-1032: 商談条件が1件の場合、該当ルールに基づいて照合評価される', () => {
    // Arrange: テスト用の商談条件データを準備
    const dealCondition = {
      industry: 'IT',
      budgetRange: '1000000',
      purchasePhase: 'evaluation',
      companySize: 'large'
    };

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.85,
        matchedRuleId: 'RULE-001',
        evaluationReason: 'Industry match (IT) and budget range match (1M+) with purchase phase alignment'
      })
    };

    // Act: 商談条件照合評価の処理を実行
    const evaluationResult = evaluatePatternRelevance(dealCondition, aiEngineStub);

    // Assert: 戻り値の照合評価結果オブジェクトを検証
    expect(evaluationResult).toBeDefined();
    expect(evaluationResult.score).toBe(0.85);
    expect(evaluationResult.matchedRuleId).toBe('RULE-001');
    expect(evaluationResult.evaluationReason).toBe(
      'Industry match (IT) and budget range match (1M+) with purchase phase alignment'
    );

    // Assert: 推奨パターンマスタから該当ルール1件が抽出されたことを確認
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(aiEngineStub.evaluatePatternRelevance).toHaveBeenCalledWith(dealCondition);

    // Assert: 照合スコアが0.85であることを確認
    expect(evaluationResult.score).toEqual(0.85);

    // Assert: 評価根拠が推奨パターンマスタの該当ルール内容と一致していることを確認
    expect(evaluationResult.evaluationReason).toContain('Industry match');
    expect(evaluationResult.evaluationReason).toContain('IT');
    expect(evaluationResult.evaluationReason).toContain('budget range match');
  });
});