import { analyzeActionPatternAndResults } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-402
  test('標準プロセスの定義が存在しない場合、エラーとして処理される', () => {
    const input = {
      salesRepresentativeId: 'SR001',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
      standardProcessDefinitions: [],
      actionRecords: [
        {
          id: 'ACT001',
          salesRepresentativeId: 'SR001',
          actionType: 'initial_contact',
          timestamp: '2024-01-15T10:00:00Z',
          customerId: 'CUST001',
        },
      ],
      contractResults: [
        {
          id: 'CONTRACT001',
          salesRepresentativeId: 'SR001',
          customerId: 'CUST001',
          contractDate: '2024-01-20T15:00:00Z',
          amount: 500000,
        },
      ],
    };

    expect(() => analyzeActionPatternAndResults(input)).toThrow(/標準プロセス/);
  });
});