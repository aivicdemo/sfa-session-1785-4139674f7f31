import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1463: 購買日時の順序が逆順の購買履歴データが順序の不正として不適合項目に含まれて返される', () => {
    const purchaseHistoryData = [
      {
        recordId: 'REC-001',
        purchaseDate: new Date('2026-01-15T10:30:00Z'),
        productId: 'PROD-A',
      },
      {
        recordId: 'REC-002',
        purchaseDate: new Date('2026-01-10T14:20:00Z'),
        productId: 'PROD-B',
      },
      {
        recordId: 'REC-003',
        purchaseDate: new Date('2026-01-20T09:15:00Z'),
        productId: 'PROD-C',
      },
    ];

    const result = evaluatePurchaseHistoryDataQuality(purchaseHistoryData);

    expect(result.overallStatus).toBe('NG');
    expect(result.incomplianceItems).toHaveLength(1);
    expect(result.incomplianceItems[0]).toMatchObject({
      type: '購買日時の順序不正',
      severity: 'error',
      affectedRecordIndex: 1,
      details: expect.stringContaining('2026-01-10'),
    });
    expect(result.incomplianceItems[0].details).toMatch(
      /2026-01-10.*2026-01-15.*前/
    );
  });
});