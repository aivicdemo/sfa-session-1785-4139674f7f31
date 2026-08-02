import { generatePurchaseSignalRationale } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-757
  test('[normal] 信号検出根拠生成機能 - 購買周期が正常に計算できるとき、根拠に具体的な周期が記載される', () => {
    const customerId = 'CUST-001';
    const lastPurchaseDate = '2024-01-15';
    const purchaseCycleInDays = 30;

    const result = generatePurchaseSignalRationale({
      customerId,
      lastPurchaseDate,
      purchaseCycleInDays,
    });

    expect(result).toContain('購買周期：30日');
    expect(result).toContain('購買周期が正常に計算されたため');
    expect(result).toContain('この値に基づき信号を検出しました');
  });
});