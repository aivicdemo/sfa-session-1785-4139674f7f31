import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('購買シグナル強度算出機能', () => {
  test('SCEN-749: [normal] 反応パターンが1件のとき、購買シグナル強度に反映される', () => {
    const reaction_pattern = {
      customer_contact_count: 3,
      inquiry_occurred: true,
      material_download: true,
    };

    const signal_strength = calculatePurchaseSignalStrength(reaction_pattern);

    expect(signal_strength).toBeGreaterThanOrEqual(0.65);
    expect(signal_strength).toBeLessThanOrEqual(0.85);
  });
});