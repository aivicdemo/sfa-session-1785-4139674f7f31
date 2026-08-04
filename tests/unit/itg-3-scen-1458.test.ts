import { validatePurchaseHistoryData } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1458
  test('複数の不適合項目を持つ購買履歴データで全ての不適合項目が検出されて返される', () => {
    const invalidPurchaseHistoryData = {
      purchaseDate: null,
      amount: -5000,
      customerId: 'CUST-999-XYZ-INVALID',
      items: [
        {
          productCode: 'PROD-001',
          quantity: 3.5,
        },
        {
          productCode: 'PROD-001',
          quantity: 2,
        },
      ],
    };

    const result = validatePurchaseHistoryData(invalidPurchaseHistoryData);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorCode: 'REQUIRED_FIELD_MISSING',
          message: '購買日は必須項目です',
          fieldName: 'purchaseDate',
        }),
        expect.objectContaining({
          errorCode: 'INVALID_VALUE_RANGE',
          message: '金額は0以上である必要があります',
          fieldName: 'amount',
          value: -5000,
        }),
        expect.objectContaining({
          errorCode: 'FORMAT_INVALID',
          message: '顧客IDは指定形式に準拠していません',
          fieldName: 'customerId',
        }),
        expect.objectContaining({
          errorCode: 'DUPLICATE_DETECTED',
          message: '商品コードが重複しています',
          fieldName: 'productCode',
          duplicateValue: 'PROD-001',
        }),
        expect.objectContaining({
          errorCode: 'TYPE_MISMATCH',
          message: '数量は整数である必要があります',
          fieldName: 'quantity',
          value: 3.5,
        }),
      ])
    );

    expect(result.length).toBe(5);
  });
});