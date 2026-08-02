import { describe, test, expect } from '@jest/globals';
import { detectDuplicateIssuesAndVisualize } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1195
  test('検出問題パターンの可視化 - 重複エラーの件数が4件の場合、件数が正確に集計される', () => {
    const duplicate_error_records = [
      {
        customer_id_1: 'CUST001',
        customer_id_2: 'CUST002',
        similarity_score: 0.95,
        detected_at: new Date('2024-01-15T10:00:00Z'),
      },
      {
        customer_id_1: 'CUST003',
        customer_id_2: 'CUST004',
        similarity_score: 0.92,
        detected_at: new Date('2024-01-15T10:15:00Z'),
      },
      {
        customer_id_1: 'CUST005',
        customer_id_2: 'CUST006',
        similarity_score: 0.88,
        detected_at: new Date('2024-01-15T10:30:00Z'),
      },
      {
        customer_id_1: 'CUST007',
        customer_id_2: 'CUST008',
        similarity_score: 0.90,
        detected_at: new Date('2024-01-15T10:45:00Z'),
      },
    ];

    const result = detectDuplicateIssuesAndVisualize(duplicate_error_records);

    expect(result.duplicate_error_count).toBe(4);
    expect(result.duplicate_errors).toEqual(duplicate_error_records);
    expect(result.visualization_data).toHaveProperty('duplicate_count', 4);
  });
});