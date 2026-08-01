import { classifyDetectionResult } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-533
  test('問題検出結果の重要度・優先度分類機能 - 同じ入力で2回実行した場合、同じ分類結果が返される', () => {
    const input = {
      salesOpportunityId: 'A-12345',
      problemType: '提案期限超過',
      detectionDateTime: new Date('2024-01-15T10:30:00Z'),
      relatedData: {
        excessDays: 7,
      },
    };

    const result1 = classifyDetectionResult(input);
    const result2 = classifyDetectionResult(input);

    expect(result1.importanceLevel).toBe(result2.importanceLevel);
    expect(result1.priorityScore).toBe(result2.priorityScore);
    expect(result1.classificationReason).toBe(result2.classificationReason);
    expect(result1).toEqual(result2);
  });
});