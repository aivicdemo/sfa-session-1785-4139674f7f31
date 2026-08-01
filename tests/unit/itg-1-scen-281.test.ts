import { describe, it, expect, beforeEach } from '@jest/globals';
import { referenceSuccessPatternMatrix } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-281
  it('成功パターンマトリクス参照による提案アプローチ判定機能 - 同じ入力条件で2回実行した場合、同じアプローチが特定される', () => {
    const input_condition = {
      customer_attribute: '大規模法人',
      industry: '製造業',
      deal_size: '5000万円以上',
      purchase_process_stage: '要件定義完了'
    };

    const approach_1st = referenceSuccessPatternMatrix(input_condition);
    const approach_2nd = referenceSuccessPatternMatrix(input_condition);

    expect(approach_1st).toEqual(approach_2nd);
    expect(approach_1st.approach_code).toBe('AP-002');
    expect(approach_1st.approach_name).toBe('経営層向けROI提示型');
    expect(approach_1st.proposal_strategy.material_type).toBe('経営層向け資料');
    expect(approach_1st.proposal_strategy.initial_contact_method).toBe('CレベルDM');
    expect(approach_1st.proposal_strategy.solution_emphasis).toBe('TCO削減効果');
    expect(approach_2nd.approach_code).toBe('AP-002');
    expect(approach_2nd.approach_name).toBe('経営層向けROI提示型');
    expect(approach_2nd.proposal_strategy.material_type).toBe('経営層向け資料');
    expect(approach_2nd.proposal_strategy.initial_contact_method).toBe('CレベルDM');
    expect(approach_2nd.proposal_strategy.solution_emphasis).toBe('TCO削減効果');
  });
});