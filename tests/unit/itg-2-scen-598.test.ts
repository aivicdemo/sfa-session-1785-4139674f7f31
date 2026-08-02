import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  test('SCEN-598: 妥当性検証で金額が許容範囲内ちょうどの場合、合格と判定される', () => {
    const min_amount = 100000;
    const max_amount = 500000;
    const validation_amount = 500000;

    const result = validateSalesDataQuality({
      amount: validation_amount,
      min_allowed_amount: min_amount,
      max_allowed_amount: max_amount,
    });

    expect(result.isValid).toBe(true);
    expect(result.error_message).toBe('');
    expect(result.validation_status).toBe('PASSED');
  });
});