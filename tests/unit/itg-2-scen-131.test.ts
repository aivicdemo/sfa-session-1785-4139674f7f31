import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-131: 電話番号が完全一致する2レコードが重複候補として検出される', () => {
    // Arrange: テストデータ準備
    const customerRecordA = {
      customerId: 1001,
      customerName: '株式会社A',
      phoneNumber: '09012345678',
      email: 'contact@company-a.jp',
      address: '東京都渋谷区1-1-1'
    };

    const customerRecordB = {
      customerId: 1002,
      customerName: 'A株式会社',
      phoneNumber: '09012345678',
      email: 'info@a-corp.jp',
      address: '東京都新宿区2-2-2'
    };

    const customerRecords = [customerRecordA, customerRecordB];

    // Act: 重複検出機能を実行
    const duplicateDetectionResult = detectDuplicateCustomers(customerRecords);

    // Assert: 期待結果を検証
    expect(duplicateDetectionResult.duplicateCandidates).toHaveLength(1);
    expect(duplicateDetectionResult.duplicateCandidates[0]).toEqual({
      customerIdA: 1001,
      customerIdB: 1002,
      matchReason: '電話番号が完全一致',
      confidenceScore: 1.0
    });
  });
});