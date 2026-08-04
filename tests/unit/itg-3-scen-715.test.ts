import { evaluateCustomerDataCompleteness } from '../../src/logic/it-1-br-3-1-1-1';

describe('顧客データ完全性・妥当性判定機能', () => {
  // SCEN-715
  test('判定が「推奨生成不可」のとき、不可の原因を示す理由コードが営業担当者に通知される', () => {
    const incompleteCustomerData = {
      customerId: 'CUST-001',
      customerName: 'Test Company',
      industry: '', // 必須項目が未入力
      companySize: 50,
      budget: '', // 必須項目が空文字列
      contactPerson: 'John Doe',
      contactEmail: 'john@example.com',
      dealStage: 'initial_contact',
      dealAmount: 0,
    };

    const mockNotificationHandler = jest.fn();

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        isRecommendationPossible: false,
        reasonCode: 'DATA_INCOMPLETE',
        detailedMessage: '顧客データに必須項目（業種、予算）の入力が不足しています',
        missingFields: ['industry', 'budget'],
      }),
    };

    const result = evaluateCustomerDataCompleteness(
      incompleteCustomerData,
      mockAIEngine,
      mockNotificationHandler,
    );

    expect(result.recommendationStatus).toBe('推奨生成不可');
    expect(result.reasonCode).toBe('DATA_INCOMPLETE');
    expect(result.detailedMessage).toBe(
      '顧客データに必須項目（業種、予算）の入力が不足しています',
    );
    expect(result.missingFields).toEqual(['industry', 'budget']);

    expect(mockNotificationHandler).toHaveBeenCalledTimes(1);
    const notificationPayload = mockNotificationHandler.mock.calls[0][0];
    expect(notificationPayload.recommendationStatus).toBe('推奨生成不可');
    expect(notificationPayload.reasonCode).toBe('DATA_INCOMPLETE');
    expect(notificationPayload.detailedMessage).toBe(
      '顧客データに必須項目（業種、予算）の入力が不足しています',
    );
    expect(notificationPayload.notificationType).toBe('customerDataIncomplete');
    expect(notificationPayload.timestamp).toBeDefined();
  });
});