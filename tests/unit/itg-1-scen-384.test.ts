import { describe, test, expect } from '@jest/globals';
import { determineSuccessPatternApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-384
  test('成功パターンマトリクス適用判定機能 - 顧客条件データが null のとき処理が中断される', () => {
    const successPatternMatrix = [
      {
        id: 'pattern_001',
        customerSegment: 'large_enterprise',
        productCategory: 'cloud_solution',
        proposalApproach: 'executive_briefing',
        successRate: 0.85,
      },
    ];

    const currentDealStage = 'proposal';
    const customerConditionData = null;

    expect(() => {
      determineSuccessPatternApplicability(
        successPatternMatrix,
        currentDealStage,
        customerConditionData
      );
    }).toThrow(/顧客条件データ/);
  });
});