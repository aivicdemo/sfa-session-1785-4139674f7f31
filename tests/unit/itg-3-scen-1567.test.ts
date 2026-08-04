import { findSimilarCustomers } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1567
  test('[error] 類似顧客マッチング処理 - 購買履歴データに重複する顧客IDが含まれるとき、エラーが発生する', () => {
    const purchase_history_with_duplicates = [
      {
        customer_id: 'CUST-001',
        purchase_date: '2024-01-15',
        product_name: 'Product A',
        amount: 50000,
      },
      {
        customer_id: 'CUST-002',
        purchase_date: '2024-01-20',
        product_name: 'Product B',
        amount: 75000,
      },
      {
        customer_id: 'CUST-001',
        purchase_date: '2024-02-10',
        product_name: 'Product C',
        amount: 120000,
      },
    ];

    expect(() => {
      findSimilarCustomers(purchase_history_with_duplicates);
    }).toThrow(/購買履歴データに重複する顧客IDが存在します。顧客ID: CUST-001/);
  });
});