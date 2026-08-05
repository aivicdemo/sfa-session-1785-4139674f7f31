import { generateActionPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析レポート生成機能', () => {
  // SCEN-222
  test('[normal] 商談記録が0件の営業担当者に対してもレポートが生成される', () => {
    const salesRepId = 'rep-001';
    const reportType = '行動パターン分析';
    const generatedAt = new Date('2024-01-15T10:00:00Z');

    const result = generateActionPatternReport({
      salesRepId,
      reportType,
      generatedAt,
      dealRecordCount: 0,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('SUCCESS');
    expect(result.reportType).toBe('行動パターン分析');
    expect(result.targetSalesRepId).toBe('rep-001');
    expect(result.generatedAt).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(result.message).toMatch(/商談記録が存在しません/);
    expect(result.metadata).toBeDefined();
    expect(result.metadata.generatedAt).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(result.metadata.targetSalesRepId).toBe('rep-001');
    expect(result.metadata.reportType).toBe('行動パターン分析');
  });
});