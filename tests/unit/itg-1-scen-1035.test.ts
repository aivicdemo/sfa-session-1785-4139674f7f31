import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('SCEN-1035: 営業活動ログが0件のとき行動パターン分析がエラーになること', () => {
    // Arrange
    const sales_rep_id = 'REP_001';
    const empty_activity_logs = [];

    fetchMock.mockResponseOnce(JSON.stringify(empty_activity_logs), {
      status: 200,
    });

    // Act & Assert
    expect(() => {
      generateSalesRepBehaviorAnalysisReport({
        sales_rep_id: sales_rep_id,
        activity_logs: empty_activity_logs,
      });
    }).toThrow(/ERR_NO_ACTIVITY_LOG/);

    try {
      generateSalesRepBehaviorAnalysisReport({
        sales_rep_id: sales_rep_id,
        activity_logs: empty_activity_logs,
      });
    } catch (error: any) {
      expect(error.message).toMatch(/営業活動ログが0件のため行動パターン分析を実行できません/);
      expect(error.code).toBe('ERR_NO_ACTIVITY_LOG');
    }
  });
});