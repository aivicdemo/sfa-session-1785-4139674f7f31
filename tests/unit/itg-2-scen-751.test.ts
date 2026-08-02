import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-751: [edge] 購買シグナル強度算出機能 - 購買履歴データが0件のとき、購買シグナル強度が「弱」と判定される
  test('購買履歴が0件の場合、購買シグナル強度は弱と判定される', () => {
    const customerId = 'CUST-00001';
    const purchaseHistoryCount = 0;
    const lastContactDate = new Date('2024-01-01T00:00:00Z');
    const purchaseCycleMonths = 12;

    const result = calculatePurchaseSignalStrength({
      customerId,
      purchaseHistoryCount,
      lastContactDate,
      purchaseCycleMonths,
    });

    expect(result.signalStrength).toBe('WEAK');
    expect(result.signalStrengthScore).toBe(1);
    expect(result.detectionReason).toContain('購買履歴');
  });
});