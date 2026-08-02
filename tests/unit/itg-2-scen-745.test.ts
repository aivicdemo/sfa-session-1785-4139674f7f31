import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-745
  test('購買シグナル強度算出機能 - 最終接触日が本日のとき、購買シグナル強度に正のボーナスが加算される', () => {
    const today = new Date('2024-01-15');
    const yesterday = new Date('2024-01-14');

    const customerDataToday = {
      customer_id: 'CUST001',
      customer_name: '顧客A',
      last_contact_date: today,
      contact_frequency: 5,
      product_category: 'software',
      past_purchase_amount: 500000,
    };

    const customerDataYesterday = {
      customer_id: 'CUST001',
      customer_name: '顧客A',
      last_contact_date: yesterday,
      contact_frequency: 5,
      product_category: 'software',
      past_purchase_amount: 500000,
    };

    const signalStrengthToday = calculatePurchaseSignalStrength(customerDataToday);
    const signalStrengthYesterday = calculatePurchaseSignalStrength(customerDataYesterday);

    const bonus = 5;
    const expectedDifference = bonus;

    expect(signalStrengthToday).toBe(signalStrengthYesterday + expectedDifference);
  });
});