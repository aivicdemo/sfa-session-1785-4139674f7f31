import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-379
  test('[error] 行動ログにアクティビティタイプが欠落しているとき、エラーが発生する', () => {
    const activityLogs = [
      {
        timestamp: '2024-01-15T09:30:00Z',
        salesPersonId: 'SP-001',
        customerId: 'CUST-123',
        activityType: null,
      },
    ];

    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        activityLogs,
      })
    ).toThrow(/アクティビティタイプ/);
  });
});