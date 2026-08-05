import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-702
  test('分析対象期間の開始日が終了日より後の日付のとき期間指定矛盾でエラーになる', () => {
    const salesPersonId = 'SP_001';
    const analysisStartDate = new Date('2024-12-31T00:00:00Z');
    const analysisEndDate = new Date('2024-12-01T00:00:00Z');

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        salesPersonId,
        analysisStartDate,
        analysisEndDate,
      })
    ).toThrow(/開始日/);
  });
});