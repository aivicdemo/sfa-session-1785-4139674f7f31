import {
  detectDuplicateCustomers,
} from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-124: 同じ重複判定が複数回実行される場合、毎回同じ結果が得られる', () => {
    // テストデータの準備
    const customer_001 = {
      customerId: 'CUST-001',
      name: 'Tanaka Taro',
      phoneNumber: '09012345678',
      emailAddress: 'tanaka@example.com',
      companyName: 'ABC Corporation',
      industry: 'Manufacturing',
    };

    const customer_002 = {
      customerId: 'CUST-002',
      name: 'Tanaka Taro',
      phoneNumber: '09012345678',
      emailAddress: 'tanaka@example.com',
      companyName: 'XYZ Inc',
      industry: 'Retail',
    };

    // 第1回目の重複判定を実行
    const result_1st = detectDuplicateCustomers(customer_001, customer_002);

    // 第1回目の判定結果を保存
    const duplicateFlag_1st = result_1st.isDuplicate;
    const matchScore_1st = result_1st.matchScore;
    const matchedFields_1st = result_1st.matchedFields;

    // 第2回目の重複判定を同じ2つの顧客レコードの組み合わせに対して実行
    const result_2nd = detectDuplicateCustomers(customer_001, customer_002);

    // 第2回目の判定結果を取得
    const duplicateFlag_2nd = result_2nd.isDuplicate;
    const matchScore_2nd = result_2nd.matchScore;
    const matchedFields_2nd = result_2nd.matchedFields;

    // 第3回目の重複判定を同じ2つの顧客レコードの組み合わせに対して実行
    const result_3rd = detectDuplicateCustomers(customer_001, customer_002);

    // 第3回目の判定結果を取得
    const duplicateFlag_3rd = result_3rd.isDuplicate;
    const matchScore_3rd = result_3rd.matchScore;
    const matchedFields_3rd = result_3rd.matchedFields;

    // 期待結果：第1回目、第2回目、第3回目の判定結果がすべて同一
    expect(duplicateFlag_1st).toBe(true);
    expect(matchScore_1st).toBe(95);
    expect(matchedFields_1st).toEqual(['name', 'phoneNumber', 'emailAddress']);

    expect(duplicateFlag_2nd).toBe(true);
    expect(matchScore_2nd).toBe(95);
    expect(matchedFields_2nd).toEqual(['name', 'phoneNumber', 'emailAddress']);

    expect(duplicateFlag_3rd).toBe(true);
    expect(matchScore_3rd).toBe(95);
    expect(matchedFields_3rd).toEqual(['name', 'phoneNumber', 'emailAddress']);

    // 全結果の相互比較
    expect(result_1st).toEqual(result_2nd);
    expect(result_2nd).toEqual(result_3rd);
  });
});