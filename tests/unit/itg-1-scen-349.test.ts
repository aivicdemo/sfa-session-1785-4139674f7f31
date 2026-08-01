import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-349
  test('営業担当者の商談実績データが0件のとき、成功パターン・失敗パターン・成約率が未計算状態で返される', () => {
    const salesPersonId = 'SP-001';
    const analysisMonth = '2024-01';

    const result = generateBehaviorPatternAnalysisReport({
      salesPersonId,
      analysisMonth,
      dealRecords: [],
    });

    expect(result.successPatterns).toEqual([]);
    expect(result.failurePatterns).toEqual([]);
    expect(result.conversionRate).toBeNull();
  });
});