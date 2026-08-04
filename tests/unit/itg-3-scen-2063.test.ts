import { findSimilarPatterns, evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2063
  test('年度またぎ期間での成功パターン抽出と年度メタデータ付与が適切に行われる', async () => {
    const fiscal_year_boundary = '2025-03-31';
    const extract_start_date = '2024-03-15';
    const extract_end_date = '2025-04-10';
    const fy2024_success_count = 5;
    const fy2025_success_count = 3;
    const total_expected_patterns = 8;

    // 2024年度（2024年4月1日～2025年3月31日）の成功商談パターンを準備
    const fy2024_patterns = Array.from({ length: fy2024_success_count }, (_, idx) => ({
      pattern_id: `fy2024_pattern_${idx + 1}`,
      fiscal_year: '2024',
      customer_industry: 'manufacturing',
      deal_amount: 5000000 + idx * 100000,
      success_date: `2024-${String((idx % 12) + 4).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')}T10:00:00+09:00`,
      approach_type: 'consultative',
    }));

    // 2025年度（2025年4月1日～2026年3月31日）の成功商談パターンを準備
    const fy2025_patterns = Array.from({ length: fy2025_success_count }, (_, idx) => ({
      pattern_id: `fy2025_pattern_${idx + 1}`,
      fiscal_year: '2025',
      customer_industry: 'retail',
      deal_amount: 3000000 + idx * 50000,
      success_date: `2025-${String((idx % 12) + 4).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')}T14:30:00+09:00`,
      approach_type: 'transactional',
    }));

    const all_patterns = [...fy2024_patterns, ...fy2025_patterns];

    // AIRecommendationEngineのスタブを準備
    const stub_ai_engine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: all_patterns,
        total_count: total_expected_patterns,
        extraction_date: '2025-08-01T12:00:00+09:00',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        pattern_id: 'fy2024_pattern_1',
        relevance_score: 85,
        confidence: 0.92,
      }),
    };

    // 年度またぎ期間の成功パターン抽出を実行
    const extraction_result = await findSimilarPatterns(
      {
        start_date: extract_start_date,
        end_date: extract_end_date,
        fiscal_year_boundary: fiscal_year_boundary,
      },
      stub_ai_engine,
    );

    // 抽出されたパターン総数が8件であることを検証
    expect(extraction_result.patterns.length).toBe(total_expected_patterns);

    // 2024年度分のパターンに『会計年度2024』メタデータが付与されていることを確認
    const fy2024_extracted = extraction_result.patterns.filter(
      (p: any) => p.fiscal_year === '2024',
    );
    expect(fy2024_extracted.length).toBe(fy2024_success_count);
    fy2024_extracted.forEach((pattern: any) => {
      expect(pattern.fiscal_year).toBe('2024');
      expect(pattern.success_date).toContain('+09:00');
    });

    // 2025年度分のパターンに『会計年度2025』メタデータが付与されていることを確認
    const fy2025_extracted = extraction_result.patterns.filter(
      (p: any) => p.fiscal_year === '2025',
    );
    expect(fy2025_extracted.length).toBe(fy2025_success_count);
    fy2025_extracted.forEach((pattern: any) => {
      expect(pattern.fiscal_year).toBe('2025');
      expect(pattern.success_date).toContain('+09:00');
    });

    // 各パターンの抽出時刻がタイムゾーン情報とともに正確に記録されていることを確認
    extraction_result.patterns.forEach((pattern: any) => {
      expect(pattern.success_date).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+09:00/);
    });

    // 年度別にグループ化されたパターンセットがevaluatePatternRelevanceで正常にスコア化されることを確認
    const relevance_evaluation = await evaluatePatternRelevance(
      {
        patterns: extraction_result.patterns,
        target_customer_industry: 'manufacturing',
        target_deal_amount: 5500000,
      },
      stub_ai_engine,
    );

    expect(relevance_evaluation.relevance_score).toBeGreaterThanOrEqual(0);
    expect(relevance_evaluation.relevance_score).toBeLessThanOrEqual(100);
    expect(relevance_evaluation.confidence).toBeGreaterThan(0);
    expect(relevance_evaluation.confidence).toBeLessThanOrEqual(1);
  });
});