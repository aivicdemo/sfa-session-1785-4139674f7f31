import { confirmMergeTargets } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検出・統合判定機能', () => {
  // SCEN-163
  test('[normal] 統合対象の確定時に、マージ対象レコードのIDリストが返される', () => {
    const duplicateCustomerIds = ['C001', 'C002', 'C003'];
    const isConfirmed = true;

    const result = confirmMergeTargets(duplicateCustomerIds, isConfirmed);

    expect(result).toEqual(['C001', 'C002', 'C003']);
  });
});