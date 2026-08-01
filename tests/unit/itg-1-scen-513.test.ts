import { calculateAIAgentInferenceAccuracyScore } from '../../src/logic/it-1-br-target4-1-1-1';

describe('AIエージェント推論精度スコア算出機能', () => {
  // SCEN-513: [normal] AIエージェント推論精度スコア算出機能 - 営業担当者ごとの行動パターン分析対象データが1件の場合、精度スコアが正常に算出される
  test('営業担当者ごとの行動パターン分析対象データが1件の場合、精度スコアが正常に算出される', () => {
    const employeeId = 'EMP001';
    const analysisData = [
      {
        dealId: 'DEAL-2024-001',
        contactDateTime: '2024-01-15T10:00:00Z',
        contactType: '電話',
        result: '受注',
      },
    ];

    const result = calculateAIAgentInferenceAccuracyScore({
      employeeId,
      analysisData,
    });

    expect(result.accuracyScore).toBeGreaterThanOrEqual(0.0);
    expect(result.accuracyScore).toBeLessThanOrEqual(100.0);
    expect(result.accuracyScore).toBe(85.5);
    expect(result.calculationStatus).toBe('完了');
    expect(result.dataCount).toBe(1);
  });
});