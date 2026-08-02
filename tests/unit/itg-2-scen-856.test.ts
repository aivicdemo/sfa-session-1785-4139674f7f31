import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-856
  test('顧客マスタのレコード数が0件のとき、重複検出処理が実行されず、エラーコード E001_NO_DATA が返却される', () => {
    const emptyCustomerMasterData = [];
    const duplicateDetectionLogBefore = [];

    const result = detectDuplicateCustomers({
      customerMasterRecords: emptyCustomerMasterData,
      detectionRules: [
        {
          ruleId: 'RULE_001',
          ruleType: 'name_match',
          weight: 10,
        },
      ],
      duplicateDetectionLogs: duplicateDetectionLogBefore,
    });

    expect(result.errorCode).toBe('E001_NO_DATA');
    expect(result.duplicatesDetected).toEqual([]);
    expect(result.processExecuted).toBe(false);
    expect(result.duplicateDetectionLogsUpdated).toHaveLength(0);
  });
});