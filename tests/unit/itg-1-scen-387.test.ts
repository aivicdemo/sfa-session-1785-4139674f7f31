import { determineApproachFromSuccessPatterns } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-387
  test('成功商談パターンマトリクスが空配列のとき適用可能なアプローチが見つからない', () => {
    const empty_success_pattern_matrix: Array<{
      industry: string;
      deal_size: string;
      sales_stage: string;
      recommended_approach: string;
      success_rate: number;
    }> = [];

    const current_deal_data = {
      industry: '製造業',
      deal_size: '大',
      sales_stage: '提案段階',
    };

    expect(() => {
      determineApproachFromSuccessPatterns(empty_success_pattern_matrix, current_deal_data);
    }).toThrow(/ERR_NO_MATCHING_APPROACH/);
  });
});