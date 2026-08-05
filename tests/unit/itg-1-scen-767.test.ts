import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-767: 推論精度評価が入力データの順序に依存しないこと', () => {
    // 営業担当者の行動パターン分析対象データを準備
    const behaviorPatternDataAscending = [
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-10T09:00:00Z',
        activityType: 'initial_contact',
        proposalAlignment: 0.85,
        successPattern: true,
      },
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-15T14:30:00Z',
        activityType: 'proposal',
        proposalAlignment: 0.92,
        successPattern: true,
      },
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-20T11:00:00Z',
        activityType: 'negotiation',
        proposalAlignment: 0.88,
        successPattern: true,
      },
    ];

    const behaviorPatternDataDescending = [
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-20T11:00:00Z',
        activityType: 'negotiation',
        proposalAlignment: 0.88,
        successPattern: true,
      },
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-15T14:30:00Z',
        activityType: 'proposal',
        proposalAlignment: 0.92,
        successPattern: true,
      },
      {
        salesPersonId: 'SP001',
        activityDate: '2024-01-10T09:00:00Z',
        activityType: 'initial_contact',
        proposalAlignment: 0.85,
        successPattern: true,
      },
    ];

    // 昇順でのデータ入力と推論精度評価の実行
    const resultAscending = evaluateInferenceAccuracy({
      salesPersonId: 'SP001',
      behaviorPatternData: behaviorPatternDataAscending,
      evaluationTimestamp: '2024-01-25T10:00:00Z',
    });

    // 降順でのデータ入力と推論精度評価の再実行
    const resultDescending = evaluateInferenceAccuracy({
      salesPersonId: 'SP001',
      behaviorPatternData: behaviorPatternDataDescending,
      evaluationTimestamp: '2024-01-25T10:00:00Z',
    });

    // 推論精度スコアの比較：誤差±0.1以内で同一値であることを確認
    const scoreDifference = Math.abs(resultAscending.accuracyScore - resultDescending.accuracyScore);
    expect(scoreDifference).toBeLessThanOrEqual(0.1);

    // 期待される推論精度スコア：平均値 (0.85 + 0.92 + 0.88) / 3 = 0.8833... ≈ 88.33
    const expectedAccuracyScore = 88.33;
    expect(resultAscending.accuracyScore).toBeCloseTo(expectedAccuracyScore, 1);
    expect(resultDescending.accuracyScore).toBeCloseTo(expectedAccuracyScore, 1);

    // 評価判定結果（精度レベルのカテゴリ分類）が完全に一致することを確認
    expect(resultAscending.accuracyLevel).toBe(resultDescending.accuracyLevel);
    expect(resultAscending.accuracyLevel).toBe('高');

    // 昇順入力と降順入力の評価判定結果詳細が同一であることを確認
    expect(resultAscending.evaluationSummary).toEqual(resultDescending.evaluationSummary);
    expect(resultAscending.evaluationSummary).toEqual({
      successPatternCount: 3,
      alignmentScoreAverage: 88.33,
      orderIndependentEvaluation: true,
    });

    // 行動パターン分析の対象データの処理順序が、
    // 最終的な推論精度評価値と評価判定に影響を与えないことを確認
    expect(resultAscending.inferenceAccuracyDecimal).toBe(resultDescending.inferenceAccuracyDecimal);
    expect(resultAscending.inferenceAccuracyDecimal).toBe(0.8833);
  });
});