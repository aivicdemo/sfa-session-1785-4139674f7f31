import { validateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-716: 複数の必須項目が不足しているとき、すべての不足項目の理由コードが営業担当者に通知される', () => {
    // Arrange: テストデータ準備
    // 複数の必須項目を意図的に不足させた案件データ
    const incompleteCustomerData = {
      customerId: 'CUST-001',
      customerName: '', // 顧客名が空文字列（不足）
      phoneNumber: null, // 電話番号がnull（不足）
      emailAddress: undefined, // メールアドレスが未設定（不足）
      budgetAmount: 0, // 予算額が0（無効）
      industry: 'IT',
      companySize: 'large',
      salesStageId: 'STAGE-001',
    };

    // Act: 顧客データ完全性・妥当性判定機能を呼び出し
    const validationResult = validateCustomerDataCompleteness(incompleteCustomerData);

    // Assert: 判定結果を検証
    // 1. 判定結果が不正を示していること
    expect(validationResult.isValid).toBe(false);

    // 2. 検出された不足項目の理由コードが4件すべて含まれていること
    const reasonCodes = validationResult.missingReasons.map((reason) => reason.code);
    expect(reasonCodes).toContain('MISSING_CUSTOMER_NAME');
    expect(reasonCodes).toContain('MISSING_PHONE_NUMBER');
    expect(reasonCodes).toContain('MISSING_EMAIL_ADDRESS');
    expect(reasonCodes).toContain('INVALID_BUDGET_AMOUNT');
    expect(reasonCodes).toHaveLength(4);

    // 3. 通知ペイロードが4件の不足項目を報告していること
    expect(validationResult.notificationPayload.defectCount).toBe(4);
    expect(validationResult.notificationPayload.message).toBe(
      '顧客データに4件の不足項目が検出されました',
    );

    // 4. 各理由コードに対応する項目名が含まれていること
    const reasonDetails = validationResult.missingReasons;
    expect(reasonDetails).toContainEqual(
      expect.objectContaining({
        code: 'MISSING_CUSTOMER_NAME',
        fieldName: '顧客名',
      }),
    );
    expect(reasonDetails).toContainEqual(
      expect.objectContaining({
        code: 'MISSING_PHONE_NUMBER',
        fieldName: '電話番号',
      }),
    );
    expect(reasonDetails).toContainEqual(
      expect.objectContaining({
        code: 'MISSING_EMAIL_ADDRESS',
        fieldName: 'メールアドレス',
      }),
    );
    expect(reasonDetails).toContainEqual(
      expect.objectContaining({
        code: 'INVALID_BUDGET_AMOUNT',
        fieldName: '予算額',
      }),
    );

    // 5. 営業担当者画面に一覧表示されるメッセージが正しく構成されていること
    expect(validationResult.notificationPayload.details).toHaveLength(4);
    expect(validationResult.notificationPayload.details[0]).toContain('顧客名');
    expect(validationResult.notificationPayload.details[1]).toContain('電話番号');
    expect(validationResult.notificationPayload.details[2]).toContain('メールアドレス');
    expect(validationResult.notificationPayload.details[3]).toContain('予算額');
  });
});