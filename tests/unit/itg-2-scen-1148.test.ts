import { describe, it, expect } from '@jest/globals';
import { validateCustomerDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  it('SCEN-1148: 顧客データ0件の入力リストに対して検証を実行した場合、空の検証結果リストが返される', async () => {
    const empty_customer_list: any[] = [];
    
    const validation_result = await validateCustomerDataQuality(empty_customer_list);
    
    expect(validation_result).toEqual([]);
    expect(validation_result.length).toBe(0);
  });
});