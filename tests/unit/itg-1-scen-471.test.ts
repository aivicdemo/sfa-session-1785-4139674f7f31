import { generateBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-471
  test('営業担当者の営業活動ログが0件の場合、レポートは生成されない', () => {
    const salesPersonId = 'SP-001';
    const analysisMonth = '2024-01';
    const emptyActivityLogs: any[] = [];

    const result = generateBehaviorAnalysisReport({
      salesPersonId,
      analysisMonth,
      activityLogs: emptyActivityLogs,
    });

    expect(
      result === null ||
        result === undefined ||
        (typeof result === 'object' &&
          result !== null &&
          'errorCode' in result &&
          result.errorCode === 'NO_ACTIVITY_LOG')
    ).toBe(true);
  });
});