import { describe, it, expect, beforeEach } from '@jest/globals';
import { analyzeSalesPersonBehaviorPattern } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-703
  it('行動パターン定義マスタが null のとき行動分類処理がエラーになる', () => {
    const salesPersonId = 'SA001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');
    const behaviorPatternMaster = null;

    expect(() =>
      analyzeSalesPersonBehaviorPattern(
        salesPersonId,
        analysisStartDate,
        analysisEndDate,
        behaviorPatternMaster
      )
    ).toThrow(/行動パターン定義マスタ/);
  });
});