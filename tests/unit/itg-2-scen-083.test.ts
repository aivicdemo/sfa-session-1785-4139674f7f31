import { detectPartialDuplicates } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-083
  test('重複検出：部分的に重複する営業データを検出する', () => {
    const dataA = {
      customerId: 'C001',
      customerName: '山田太郎',
      emailAddress: 'yamada@example.com',
      phoneNumber: '090-1234-5678',
      address: '東京都渋谷区',
    };

    const dataB = {
      customerId: 'C002',
      customerName: '山田太郎',
      emailAddress: 'yamada@example.com',
      phoneNumber: '090-1111-1111',
      address: '東京都渋谷区',
    };

    const result = detectPartialDuplicates([dataA, dataB]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      groupId: expect.any(String),
      duplicationLevel: 'PARTIAL',
      matchItems: expect.arrayContaining(['customerName', 'emailAddress', 'address']),
      matchScore: 0.75,
      unmatchItems: ['phoneNumber'],
    });
    expect(result[0].includedData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customerId: 'C001',
          customerName: '山田太郎',
          emailAddress: 'yamada@example.com',
          phoneNumber: '090-1234-5678',
          address: '東京都渋谷区',
        }),
        expect.objectContaining({
          customerId: 'C002',
          customerName: '山田太郎',
          emailAddress: 'yamada@example.com',
          phoneNumber: '090-1111-1111',
          address: '東京都渋谷区',
        }),
      ])
    );
  });
});