import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-380
  test('行動ログの発生日時が欠落しているとき、エラーが発生する', () => {
    const behaviorLogs = [
      {
        salesRepId: 'REP001',
        customerId: 'CUST001',
        actionType: 'visit',
        actionTimestamp: null,
        actionDetails: 'Initial customer visit',
      },
    ];

    expect(() =>
      generateSalesRepBehaviorAnalysisReport(behaviorLogs)
    ).toThrow(/LOG_TIMESTAMP_MISSING/);
  });
});