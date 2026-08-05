import { analyzeSellerBehaviorPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1147
  test('行動分類がnullのとき、処理がエラーになること', () => {
    const behavior_pattern_data = {
      seller_id: 'S001',
      behavior_classification: null,
      contact_frequency: 5,
      proposal_success_rate: 0.75,
      follow_up_interval_days: 3,
      contract_result: true,
      contract_amount: 1000000,
    };

    expect(() => analyzeSellerBehaviorPatterns(behavior_pattern_data)).toThrow(
      /行動分類/,
    );
  });
});