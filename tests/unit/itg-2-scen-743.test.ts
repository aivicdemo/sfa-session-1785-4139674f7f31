import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-743
  test('購買シグナル強度算出機能 - 購買周期が推奨間隔未満のとき、購買シグナル強度が中未満と判定される', () => {
    const customer_id = 'CUST001';
    const last_contact_date = new Date('2024-01-15T10:00:00Z');
    const purchase_cycle_days = 25;
    const recommended_interval_days = 30;
    const purchase_history = [
      {
        purchase_date: new Date('2024-01-01T09:00:00Z'),
        amount: 50000,
      },
      {
        purchase_date: new Date('2023-12-07T09:00:00Z'),
        amount: 50000,
      },
    ];
    const response_pattern_score = 0.6;

    const result = calculatePurchaseSignalStrength({
      customer_id,
      last_contact_date,
      purchase_cycle_days,
      recommended_interval_days,
      purchase_history,
      response_pattern_score,
    });

    expect(result.signal_strength_level).toBe('LOW');
    expect(result.is_below_medium).toBe(true);
  });
});