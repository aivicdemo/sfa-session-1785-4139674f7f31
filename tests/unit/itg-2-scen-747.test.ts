import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-747
  test('[normal] 購買シグナル強度算出機能 - 最終接触日が1年以上前のとき、購買シグナル強度が弱と判定される', () => {
    const reference_date = new Date('2025-01-15T00:00:00Z');
    const last_contact_date = new Date('2024-01-01T00:00:00Z');
    
    const input = {
      customer_id: 'CUST001',
      last_contact_date: last_contact_date,
      purchase_amount: 5000,
      inquiry_frequency: 2,
      reference_date: reference_date
    };

    const result = calculatePurchaseSignalStrength(input);

    expect(result.signal_strength_level).toBe('WEAK');
    expect(result.signal_strength_score).toBeGreaterThanOrEqual(0.0);
    expect(result.signal_strength_score).toBeLessThanOrEqual(0.33);
  });
});