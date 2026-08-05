import { analyzeCustomerInteractionPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-676
  test('顧客IDが null のとき顧客対応パターンマッチングに失敗しエラーになる', () => {
    const test_input = {
      customer_id: null,
      interaction_date: new Date('2024-01-15T10:00:00Z'),
      interaction_type: 'email',
      sales_person_id: 'SP001',
      pattern_rules: [
        {
          pattern_id: 'P001',
          required_fields: ['customer_id', 'interaction_type'],
        },
      ],
    };

    expect(() => analyzeCustomerInteractionPattern(test_input)).toThrow(
      /顧客ID/
    );
  });
});