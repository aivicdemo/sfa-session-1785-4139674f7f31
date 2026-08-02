import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-686
  test('推奨内容根拠の可視化機能 - 推奨アプローチの対象顧客が変更前状態のとき、その顧客データが正しく取得される', () => {
    const customerId = 'CUST-001';
    const preChangeCustomerData = {
      customerId: 'CUST-001',
      customerName: '山田商事',
      industry: '製造',
      salesScale: '5000万円',
      lastContactDate: '2024-01-15',
    };

    const mockCustomerServiceStub = {
      getCustomerByIdAndState: jest.fn().mockReturnValue(preChangeCustomerData),
    };

    const result = visualizeRecommendationBasis(
      customerId,
      'pre_change',
      mockCustomerServiceStub
    );

    expect(result.customerId).toBe('CUST-001');
    expect(result.customerName).toBe('山田商事');
    expect(result.industry).toBe('製造');
    expect(result.salesScale).toBe('5000万円');
    expect(result.lastContactDate).toBe('2024-01-15');
    expect(mockCustomerServiceStub.getCustomerByIdAndState).toHaveBeenCalledWith(
      'CUST-001',
      'pre_change'
    );
  });
});