import { runTx10Imp1Agent } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-1281
  test('営業データ入力から問題検出・通知までの自律実行 AIエージェント - 管理者・営業担当者へ通知を送信し、対応内容を記録する', async () => {
    // Arrange: モック AI クライアントの設定
    const mockAiClient = {
      validateDataQuality: jest.fn().mockResolvedValue({
        qualityScore: 85,
        hasErrors: true,
        errors: [],
      }),
      analyzeProposal: jest.fn().mockResolvedValue({
        proposalScore: 85,
        riskLevel: 'MEDIUM',
        detectedPatterns: ['提案根拠不足', '提案金額妥当性'],
      }),
    };

    const mockNotificationService = {
      sendManagerNotification: jest
        .fn()
        .mockResolvedValue({ status: 'SENT', notificationId: 'notif_mgr_001' }),
      sendSalesPersonNotification: jest
        .fn()
        .mockResolvedValue({ status: 'SENT', notificationId: 'notif_sales_001' }),
    };

    const mockRecordStorage = {
      createRecord: jest.fn().mockResolvedValue({
        recordId: 'rec_20240115_001',
        createdAt: '2024-01-15T11:00:00Z',
      }),
    };

    // Act: テスト対象関数を呼び出し
    const salesData = {
      customerId: 'cust_1001',
      proposalContent: 'クラウド導入支援サービス',
      proposalAmount: 500000,
      proposalDateTime: '2024-01-15T10:30:00Z',
      salesPersonId: 'sales_001',
    };

    const result = await runTx10Imp1Agent(
      salesData,
      mockAiClient,
      mockNotificationService,
      mockRecordStorage
    );

    // Assert: 品質検証が実行されたことを確認
    expect(mockAiClient.validateDataQuality).toHaveBeenCalledWith(salesData);

    // Assert: 提案内容分析が実行されたことを確認
    expect(mockAiClient.analyzeProposal).toHaveBeenCalledWith(salesData);

    // Assert: 品質スコアが 85 であることを確認
    expect(result.analysisResult.qualityScore).toBe(85);

    // Assert: リスク評価が「中リスク」であることを確認
    expect(result.analysisResult.riskLevel).toBe('MEDIUM');

    // Assert: 検出パターンが 2 件であることを確認
    expect(result.analysisResult.detectedPatterns).toHaveLength(2);
    expect(result.analysisResult.detectedPatterns).toEqual([
      '提案根拠不足',
      '提案金額妥当性',
    ]);

    // Assert: 管理者向け通知が送信されたことを確認
    expect(mockNotificationService.sendManagerNotification).toHaveBeenCalled();
    const managerNotifCall = mockNotificationService.sendManagerNotification.mock
      .calls[0][0];
    expect(managerNotifCall).toEqual(
      expect.objectContaining({
        salesPersonId: 'sales_001',
        detectedPatterns: ['提案根拠不足', '提案金額妥当性'],
        riskLevel: 'MEDIUM',
        qualityScore: 85,
      })
    );

    // Assert: 営業担当者向け通知が送信されたことを確認
    expect(
      mockNotificationService.sendSalesPersonNotification
    ).toHaveBeenCalled();
    const salesNotifCall =
      mockNotificationService.sendSalesPersonNotification.mock.calls[0][0];
    expect(salesNotifCall).toEqual(
      expect.objectContaining({
        salesPersonId: 'sales_001',
        improvementPoints: expect.arrayContaining(['提案根拠の補強が必要']),
        proposalScore: 85,
      })
    );

    // Assert: 対応記録が作成されたことを確認
    expect(mockRecordStorage.createRecord).toHaveBeenCalled();
    const recordCall = mockRecordStorage.createRecord.mock.calls[0][0];
    expect(recordCall).toEqual(
      expect.objectContaining({
        salesDataId: undefined,
        detectedPatterns: ['提案根拠不足', '提案金額妥当性'],
        notificationRecipients: ['manager', 'sales_001'],
        notificationDeliveryStatus: 'SENT',
        ruleVersion: 'v2.1',
      })
    );

    // Assert: 関数戻り値が成功ステータスを返すことを確認
    expect(result.success).toBe(true);

    // Assert: 関数戻り値に対応記録 ID が含まれていることを確認
    expect(result.recordId).toBe('rec_20240115_001');

    // Assert: 関数戻り値に通知 ID リストが含まれていることを確認
    expect(result.notificationIds).toHaveLength(2);
    expect(result.notificationIds).toEqual([
      'notif_mgr_001',
      'notif_sales_001',
    ]);

    // Assert: 関数戻り値のタイムスタンプが ISO 8601 形式であることを確認
    expect(result.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    // Assert: 対応記録の作成日時が現在時刻付近であることを確認
    const recordCreatedAt = new Date(
      mockRecordStorage.createRecord.mock.results[0].value.createdAt
    );
    const now = new Date();
    expect(
      Math.abs(recordCreatedAt.getTime() - now.getTime())
    ).toBeLessThan(5000);
  });
});