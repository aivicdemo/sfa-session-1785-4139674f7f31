import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-484
  test('[error] 営業担当者ごとの行動パターン分析レポート生成機能 - 営業活動の種類が欠けている場合、欠けている種類を検出してレポートに注記される', () => {
    const salesPersonId = 'SA001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const salesActivities = [
      {
        id: 'ACT001',
        salesPersonId: 'SA001',
        activityType: '顧客訪問',
        executionDate: new Date('2024-01-05T10:00:00Z'),
        duration: 60,
        description: 'A社への訪問',
      },
      {
        id: 'ACT002',
        salesPersonId: 'SA001',
        activityType: '提案資料送付',
        executionDate: new Date('2024-01-10T14:30:00Z'),
        duration: 30,
        description: 'B社への提案資料送付',
      },
      {
        id: 'ACT003',
        salesPersonId: 'SA001',
        activityType: '見積提示',
        executionDate: new Date('2024-01-15T09:00:00Z'),
        duration: 45,
        description: 'C社への見積提示',
      },
    ];

    const standardActivityTypes = [
      '顧客訪問',
      '提案資料送付',
      '見積提示',
      '商談',
      '受注',
      '失注',
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      salesPersonId,
      analysisStartDate,
      analysisEndDate,
      salesActivities,
      standardActivityTypes,
    });

    expect(report.missingActivityTypes).toEqual(['商談', '受注', '失注']);
    expect(report.notes).toContain(
      '分析対象期間内に実施されていない営業活動: 商談、受注、失注'
    );
    expect(report.salesPersonId).toBe('SA001');
    expect(report.analysisStartDate).toEqual(analysisStartDate);
    expect(report.analysisEndDate).toEqual(analysisEndDate);
  });
});