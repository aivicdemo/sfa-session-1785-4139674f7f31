import { describe, test, expect } from '@jest/globals';
import { calculateProposalAccuracy } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質月次分析機能 - 提案精度計算', () => {
  // SCEN-918
  test('提案精度計算で割算により端数が発生するときの丸め処理が正しく適用される', () => {
    const proposal_count = 7;
    const accepted_count = 3;

    const result = calculateProposalAccuracy({
      proposal_count,
      accepted_count,
    });

    expect(result).toBe(42.86);
  });
});