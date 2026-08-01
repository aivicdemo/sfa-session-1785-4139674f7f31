import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-144
  test('営業担当者IDが空文字列のとき、エラーが発生する', () => {
    const result = generateSalesPersonBehaviorAnalysisReport({
      salesPersonId: '',
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-01-31T23:59:59Z'),
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('INVALID_SALES_PERSON_ID');
    expect(result.error?.message).toBe('営業担当者IDは空文字列では指定できません');
    expect(result.reportData).toBeUndefined();
  });
});