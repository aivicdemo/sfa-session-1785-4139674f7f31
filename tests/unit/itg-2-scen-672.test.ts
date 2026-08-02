import { visualizeRecommendationRationale } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-672: 推奨内容根拠の可視化機能 - 成功パターンが複数件で同値のものが並ぶとき、同値パターンが正しく処理される', () => {
    const success_patterns = [
      {
        pattern_id: 'PAT_A',
        pattern_name: 'A',
        rationale_basis: '顧客信用スコア≥80',
        conversion_rate: 0.75,
      },
      {
        pattern_id: 'PAT_B',
        pattern_name: 'B',
        rationale_basis: '顧客信用スコア≥80',
        conversion_rate: 0.68,
      },
      {
        pattern_id: 'PAT_C',
        pattern_name: 'C',
        rationale_basis: '顧客信用スコア≥80',
        conversion_rate: 0.72,
      },
    ];

    const result = visualizeRecommendationRationale(success_patterns);

    expect(result).toEqual({
      rationale_records: [
        {
          pattern_id: 'PAT_A',
          pattern_name: 'A',
          rationale_basis: '顧客信用スコア≥80',
          conversion_rate: 0.75,
          display_order: 1,
        },
        {
          pattern_id: 'PAT_B',
          pattern_name: 'B',
          rationale_basis: '顧客信用スコア≥80',
          conversion_rate: 0.68,
          display_order: 2,
        },
        {
          pattern_id: 'PAT_C',
          pattern_name: 'C',
          rationale_basis: '顧客信用スコア≥80',
          conversion_rate: 0.72,
          display_order: 3,
        },
      ],
      total_pattern_count: 3,
      unique_rationale_count: 1,
      is_deduplicated: false,
    });

    expect(result.rationale_records.length).toBe(3);
    expect(result.rationale_records[0].pattern_name).toBe('A');
    expect(result.rationale_records[1].pattern_name).toBe('B');
    expect(result.rationale_records[2].pattern_name).toBe('C');
    expect(result.rationale_records[0].rationale_basis).toBe('顧客信用スコア≥80');
    expect(result.rationale_records[1].rationale_basis).toBe('顧客信用スコア≥80');
    expect(result.rationale_records[2].rationale_basis).toBe('顧客信用スコア≥80');
    expect(result.total_pattern_count).toBe(3);
    expect(result.unique_rationale_count).toBe(1);
    expect(result.is_deduplicated).toBe(false);
  });
});