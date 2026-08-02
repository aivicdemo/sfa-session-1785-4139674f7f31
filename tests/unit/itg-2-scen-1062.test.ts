import { describe, test, expect } from '@jest/globals';
import { createSalesExampleCollectionDefinition } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業事例データ収集定義エンジン', () => {
  test('SCEN-1062: 収集対象期間が指定されていない場合、ValidationErrorがスローされること', () => {
    const invalidInput = {
      departmentId: 'DEPT001',
      collectorName: '営業部長',
      targetDataItems: ['顧客名', '商品', '成約金額'],
      minExampleCount: 10
    };

    expect(() => createSalesExampleCollectionDefinition(invalidInput)).toThrow(/収集対象期間/);
  });
});