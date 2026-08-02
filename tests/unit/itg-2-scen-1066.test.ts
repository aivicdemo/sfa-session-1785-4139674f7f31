import { validateSalesExampleCollectionDefinition } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  // SCEN-1066
  test('最小収集件数が0件の場合、エラーが発生する', () => {
    const collectionDefinition = {
      minCollectionCount: 0,
      collectionPeriodDays: 30,
      requiredDataItems: ['customer_id', 'deal_amount', 'success_factor']
    };

    const result = validateSalesExampleCollectionDefinition(collectionDefinition);

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: 'INVALID_MIN_COLLECTION_COUNT',
        errorMessage: expect.stringContaining('最小収集件数は1件以上である必要があります')
      })
    );
  });
});