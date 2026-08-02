import { recordPurchaseResultAndIntegrateData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-993
  test('購買結果記録・営業データ統合機能 - 統合判定履歴が複数件の場合に全て履歴化される', async () => {
    const purchaseResultId = 'pr-2024-001';
    const customerId = 'cust-12345';
    const integrationHistories = [
      {
        integrationHistoryId: 'ih-001',
        purchaseResultId: purchaseResultId,
        judgmentDateTime: new Date('2024-01-15T10:30:00Z'),
        judgmentStatus: 'approved',
        judgmentReason: '顧客マスタデータの重複を確認、統合対象と判定'
      },
      {
        integrationHistoryId: 'ih-002',
        purchaseResultId: purchaseResultId,
        judgmentDateTime: new Date('2024-01-15T11:00:00Z'),
        judgmentStatus: 'confirmed',
        judgmentReason: '営業担当者による確認完了、統合実行承認'
      },
      {
        integrationHistoryId: 'ih-003',
        purchaseResultId: purchaseResultId,
        judgmentDateTime: new Date('2024-01-15T11:30:00Z'),
        judgmentStatus: 'completed',
        judgmentReason: '顧客マスタ統合処理完了、営業データ同期済み'
      }
    ];

    const result = await recordPurchaseResultAndIntegrateData({
      purchaseResultId: purchaseResultId,
      customerId: customerId,
      integrationHistories: integrationHistories
    });

    expect(result.recordedHistoryCount).toBe(3);
    expect(result.integrationHistories).toHaveLength(3);
    
    expect(result.integrationHistories[0]).toMatchObject({
      integrationHistoryId: 'ih-001',
      purchaseResultId: purchaseResultId,
      judgmentDateTime: new Date('2024-01-15T10:30:00Z'),
      judgmentStatus: 'approved',
      judgmentReason: '顧客マスタデータの重複を確認、統合対象と判定'
    });
    expect(result.integrationHistories[0].createdAt).toBeDefined();

    expect(result.integrationHistories[1]).toMatchObject({
      integrationHistoryId: 'ih-002',
      purchaseResultId: purchaseResultId,
      judgmentDateTime: new Date('2024-01-15T11:00:00Z'),
      judgmentStatus: 'confirmed',
      judgmentReason: '営業担当者による確認完了、統合実行承認'
    });
    expect(result.integrationHistories[1].createdAt).toBeDefined();

    expect(result.integrationHistories[2]).toMatchObject({
      integrationHistoryId: 'ih-003',
      purchaseResultId: purchaseResultId,
      judgmentDateTime: new Date('2024-01-15T11:30:00Z'),
      judgmentStatus: 'completed',
      judgmentReason: '顧客マスタ統合処理完了、営業データ同期済み'
    });
    expect(result.integrationHistories[2].createdAt).toBeDefined();

    expect(result.integrationHistories.every(h => h.purchaseResultId === purchaseResultId)).toBe(true);
    expect(result.integrationHistories.every(h => h.createdAt instanceof Date)).toBe(true);
  });
});