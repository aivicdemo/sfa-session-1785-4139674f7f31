import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-141
  it('対象営業担当者が空（null）のときレポート生成が失敗する', () => {
    const salesPersonId = null;
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      generateSalesActivityPatternReport({
        salesPersonId,
        analysisStartDate,
        analysisEndDate,
      })
    ).toThrow(/営業担当者が指定されていません/);
  });
});