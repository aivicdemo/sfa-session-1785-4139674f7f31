import { calculatePurchaseSignal } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-771
  test('購買シグナル算出全体 - 顧客IDがnullのとき、例外が発生する', () => {
    expect(() => calculatePurchaseSignal({ customer_id: null, last_contact_date: '2024-01-15', purchase_cycle_days: 30, response_pattern: 'active' })).toThrow(/顧客ID/);
  });
});