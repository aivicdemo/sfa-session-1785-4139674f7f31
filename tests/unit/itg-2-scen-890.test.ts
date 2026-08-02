import { validateCustomerPurchaseInput } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客購買検討データ入力検証機能', () => {
  // SCEN-890
  test('提案内容データが0件のとき不足警告を返す', () => {
    const testData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      proposalContents: [],
      purchaseHistory: [
        {
          productId: 'PROD-001',
          purchaseDate: '2024-01-15',
          quantity: 5
        }
      ],
      budget: 1000000
    };

    const result = validateCustomerPurchaseInput(testData);

    expect(result).toEqual({
      statusCode: 'WARNING',
      warningCode: 'PROPOSAL_DATA_EMPTY',
      message: '提案内容データが不足しています。最低1件以上の提案内容を入力してください。'
    });
  });
});