import { recordCustomerResponse } from '../../src/logic/it-1-br-2-1-1';

describe('顧客反応の標準化分類・記録機能', () => {
  // SCEN-421: [normal] 顧客反応の標準化分類・記録機能 - 提案への反応という顧客反応を標準化された分類パターンに従って記録される
  test('提案への反応を標準化分類パターンで記録し、一覧に表示される', () => {
    const input = {
      customerId: 'CUST-001',
      proposalName: '新製品パッケージプラン',
      reactionClassification: '積極的関心',
      reactionCategory: '提案への反応',
      detailInformation: '実装時期の質問あり',
      recordedAt: new Date('2024-01-15T14:30:00Z'),
    };

    const result = recordCustomerResponse(input);

    expect(result).toEqual({
      customerId: 'CUST-001',
      proposalName: '新製品パッケージプラン',
      reactionClassification: '積極的関心',
      reactionCategory: '提案への反応',
      detailInformation: '実装時期の質問あり',
      recordedAt: new Date('2024-01-15T14:30:00Z'),
      displayText: '顧客：CUST-001 | 提案：新製品パッケージプラン | 反応分類：積極的関心 | 詳細：実装時期の質問あり | 記録日時：2024-01-15 14:30',
      isRecorded: true,
    });
  });
});