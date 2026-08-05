import { calculateSuccessPatternMatchScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-649: 成功パターンデータと顧客対応パターンの順序が逆のとき、合致度が正確に計算される
  test('成功パターンと顧客対応パターンの順序が完全に逆転している場合、合致度スコアが0として計算される', () => {
    const success_pattern_steps = [
      { step_order: 1, step_name: '初期接触' },
      { step_order: 2, step_name: 'ニーズ把握' },
      { step_order: 3, step_name: '提案' },
      { step_order: 4, step_name: '契約' }
    ];

    const customer_response_steps = [
      { step_order: 1, step_name: '契約' },
      { step_order: 2, step_name: '提案' },
      { step_order: 3, step_name: 'ニーズ把握' },
      { step_order: 4, step_name: '初期接触' }
    ];

    const match_score = calculateSuccessPatternMatchScore(
      success_pattern_steps,
      customer_response_steps
    );

    expect(match_score).toBe(0);
  });
});