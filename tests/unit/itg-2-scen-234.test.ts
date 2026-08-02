import { describe, test, expect, beforeEach } from '@jest/globals';
import { convertRequirementSpecification } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-234
  test('データ項目が0件のときは要件仕様変換処理がエラー状態で終了し、エラーコードとcompleted: falseを返す', () => {
    const emptyDataItems: any[] = [];
    
    const result = convertRequirementSpecification({
      dataItems: emptyDataItems,
      processStartTime: new Date('2024-01-15T10:00:00Z').toISOString()
    });

    expect(result.completed).toBe(false);
    expect(result.errorCode).toBe('DATA_ITEMS_EMPTY');
  });
});