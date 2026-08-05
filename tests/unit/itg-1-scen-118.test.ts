import { describe, test, expect, beforeEach } from '@jest/globals';
import { deduplicateSalesRepresentatives } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-118
  test('抽出対象営業担当者リストに同一担当者が複数回含まれる場合、1件に統一されて確定される', () => {
    // 入力: 同一営業担当者が3回重複して含まれるリスト
    const input_sales_reps = [
      { sales_rep_id: 'sales_rep_001', sales_rep_name: '営業太郎', department: '営業部' },
      { sales_rep_id: 'sales_rep_001', sales_rep_name: '営業太郎', department: '営業部' },
      { sales_rep_id: 'sales_rep_001', sales_rep_name: '営業太郎', department: '営業部' }
    ];

    const result = deduplicateSalesRepresentatives(input_sales_reps);

    // 期待結果: 重複が削除され、1件のみ残る
    expect(result.deduped_sales_reps).toHaveLength(1);
    expect(result.deduped_sales_reps[0]).toEqual({
      sales_rep_id: 'sales_rep_001',
      sales_rep_name: '営業太郎',
      department: '営業部'
    });
    expect(result.original_count).toBe(3);
    expect(result.deduped_count).toBe(1);
  });
});