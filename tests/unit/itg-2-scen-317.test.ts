import { describe, test, expect } from '@jest/globals';
import { decidePriorityForImprovementGuidance } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-317
  test('改善指導対象の営業担当者IDが空値のとき、優先度付与がエラーになる', () => {
    const improvementGuidanceTarget = {
      salesPersonId: null,
      improvementItem: '提案資料の品質向上',
      currentScore: 65,
      deviationRate: 0.25,
      contractRate: 0.45,
    };

    expect(() =>
      decidePriorityForImprovementGuidance(improvementGuidanceTarget)
    ).toThrow(/INVALID_SALES_PERSON_ID/);
  });
});