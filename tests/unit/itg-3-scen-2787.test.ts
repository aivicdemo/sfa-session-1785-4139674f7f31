import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・重み付けロジック', () => {
  // SCEN-2787
  test('[error] 営業担当者の行動ログが空配列のレコードが含まれるとき、エラーを返す', () => {
    const salesRecordsWithEmptyActionLog = [
      {
        salesPersonId: 'SP001',
        customerId: 'CUST001',
        dealId: 'DEAL001',
        actionLog: [
          {
            timestamp: '2024-01-01T10:00:00Z',
            action: 'contacted_customer',
            result: 'success',
          },
          {
            timestamp: '2024-01-02T14:30:00Z',
            action: 'sent_proposal',
            result: 'success',
          },
        ],
        dealResult: 'won',
      },
      {
        salesPersonId: 'SP002',
        customerId: 'CUST002',
        dealId: 'DEAL002',
        actionLog: [],
        dealResult: 'won',
      },
      {
        salesPersonId: 'SP003',
        customerId: 'CUST003',
        dealId: 'DEAL003',
        actionLog: [
          {
            timestamp: '2024-01-05T09:15:00Z',
            action: 'initial_meeting',
            result: 'success',
          },
        ],
        dealResult: 'won',
      },
    ];

    expect(() => extractSuccessPatterns(salesRecordsWithEmptyActionLog)).toThrow(/EMPTY_ACTION_LOG/);
  });
});