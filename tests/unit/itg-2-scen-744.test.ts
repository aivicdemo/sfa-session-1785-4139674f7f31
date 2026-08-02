import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-744
  test('購買シグナル強度算出機能 - 購買周期が推奨間隔を超過したとき、購買シグナル強度が強と判定される', () => {
    const recommendedIntervalDays = 30;
    const lastPurchaseDate = new Date('2024-01-01T00:00:00Z');
    const currentDate = new Date('2024-02-01T00:00:00Z');
    
    const result = calculatePurchaseSignalStrength({
      lastPurchaseDate,
      currentDate,
      recommendedIntervalDays
    });

    expect(result.strength).toBe('strong');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.85);
  });
});