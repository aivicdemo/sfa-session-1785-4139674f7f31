import { describe, test, expect } from '@jest/globals';
import { calculateStandardProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-292
  test('標準プロセス遵守度スコア計算 - 交渉ステップの日付が空値のときエラーになる', () => {
    const negotiationStepData = {
      initialContactDate: new Date('2024-01-15'),
      proposalDate: new Date('2024-01-20'),
      negotiationDate: null,
      closureDate: new Date('2024-02-01'),
    };

    expect(() => calculateStandardProcessComplianceScore(negotiationStepData)).toThrow(/交渉ステップの日付/);
  });
});