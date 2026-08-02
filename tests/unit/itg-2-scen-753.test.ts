import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-753
  test('[normal] 購買シグナル強度算出機能 - 購買履歴データが複数件のとき、購買シグナル強度が正しく算出される', () => {
    const purchase_history = [
      {
        purchase_date: new Date('2024-01-15T10:30:00Z'),
        purchase_amount: 150000,
        purchase_category: 'software',
        purchase_frequency_days: 30,
      },
      {
        purchase_date: new Date('2024-02-20T14:15:00Z'),
        purchase_amount: 200000,
        purchase_category: 'hardware',
        purchase_frequency_days: 36,
      },
      {
        purchase_date: new Date('2024-03-10T09:45:00Z'),
        purchase_amount: 175000,
        purchase_category: 'software',
        purchase_frequency_days: 29,
      },
    ];

    const result = calculatePurchaseSignalStrength(purchase_history);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
    expect(result).toBeCloseTo(62.5, 1);
  });
});