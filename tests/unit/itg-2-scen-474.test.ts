import { decideRulePriorityOrder } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-474
  test('重複検知ルールが0件のときに空リストを返す', () => {
    const emptyRules: any[] = [];
    const result = decideRulePriorityOrder(emptyRules);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});