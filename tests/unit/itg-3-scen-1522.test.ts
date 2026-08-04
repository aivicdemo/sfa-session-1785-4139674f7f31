import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1522: 購買履歴データの入力に対して2回連続で実行しても同じ不適合項目が返される', () => {
    // テスト用の不完全な購買履歴データセット（3件の不適合を意図的に含める）
    const incompleteHistoryData = {
      purchase_history: [
        {
          transaction_id: 'TXN001',
          customer_id: '', // 顧客ID未入力
          purchase_amount: null, // 金額欠落
          product_code: 'PROD-ABC-999-XYZ-INVALID', // 商品コード形式不正（正規表現不一致）
          purchase_date: '2024-01-15T10:00:00Z',
          status: 'completed'
        }
      ]
    };

    // 1回目の実行：データセットを購買履歴データ品質判定機能に入力
    const firstExecutionResult = evaluateDataQuality(incompleteHistoryData);

    // 1回目の不適合項目リストを記録
    const firstNonconformities = firstExecutionResult.quality_issues;

    // 2回目の実行：同じデータセットを再度入力
    const secondExecutionResult = evaluateDataQuality(incompleteHistoryData);

    // 2回目の不適合項目リストを記録
    const secondNonconformities = secondExecutionResult.quality_issues;

    // 不適合項目の個数が同一であることを検証
    expect(firstNonconformities.length).toBe(3);
    expect(secondNonconformities.length).toBe(3);

    // 1回目と2回目の不適合項目を項目ごとに比較検証
    // 金額欠落（項目名、エラーコード、説明の内容が同一）
    expect(firstNonconformities[0].field_name).toBe('purchase_amount');
    expect(firstNonconformities[0].error_code).toBe('MISSING_VALUE');
    expect(firstNonconformities[0].description).toBe('金額が入力されていません');
    expect(secondNonconformities[0].field_name).toBe('purchase_amount');
    expect(secondNonconformities[0].error_code).toBe('MISSING_VALUE');
    expect(secondNonconformities[0].description).toBe('金額が入力されていません');

    // 顧客ID未入力（項目名、エラーコード、説明の内容が同一）
    expect(firstNonconformities[1].field_name).toBe('customer_id');
    expect(firstNonconformities[1].error_code).toBe('EMPTY_VALUE');
    expect(firstNonconformities[1].description).toBe('顧客IDが入力されていません');
    expect(secondNonconformities[1].field_name).toBe('customer_id');
    expect(secondNonconformities[1].error_code).toBe('EMPTY_VALUE');
    expect(secondNonconformities[1].description).toBe('顧客IDが入力されていません');

    // 商品コード形式不正（項目名、エラーコード、説明の内容が同一）
    expect(firstNonconformities[2].field_name).toBe('product_code');
    expect(firstNonconformities[2].error_code).toBe('INVALID_FORMAT');
    expect(firstNonconformities[2].description).toBe('商品コード形式が正しくありません');
    expect(secondNonconformities[2].field_name).toBe('product_code');
    expect(secondNonconformities[2].error_code).toBe('INVALID_FORMAT');
    expect(secondNonconformities[2].description).toBe('商品コード形式が正しくありません');

    // 1回目と2回目の不適合項目が完全に同一であることを深く検証
    expect(firstNonconformities).toEqual(secondNonconformities);

    // 不適合項目の順序が同一であることを検証
    firstNonconformities.forEach((issue, index) => {
      expect(issue.field_name).toBe(secondNonconformities[index].field_name);
      expect(issue.error_code).toBe(secondNonconformities[index].error_code);
      expect(issue.description).toBe(secondNonconformities[index].description);
    });
  });
});