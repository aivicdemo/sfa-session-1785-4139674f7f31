import { generateSignalRationale } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-761
  test('信号検出根拠生成機能 - 最終接触日と購買周期と反応パターンすべてが揃うとき、根拠に3要素すべてが記載される', () => {
    const last_contact_date = '2024-01-15';
    const purchase_cycle_days = 30;
    const interaction_pattern = '高頻度アクセス';

    const rationale = generateSignalRationale({
      last_contact_date,
      purchase_cycle_days,
      interaction_pattern,
    });

    expect(rationale).toContain('最終接触日：2024-01-15');
    expect(rationale).toContain('購買周期：30日');
    expect(rationale).toContain('反応パターン：高頻度アクセス');
  });
});