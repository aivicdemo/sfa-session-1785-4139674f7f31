import { analyzeActionPatternAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-401
  test('成功パターンレコードが複数件の場合、最も合致度の高いパターンとの合致度が計算される', () => {
    const successPatterns = [
      {
        pattern_id: 'pattern_a',
        name: 'パターンA',
        steps: ['初回接触', '提案', 'クロージング'],
        match_threshold: 0.95,
      },
      {
        pattern_id: 'pattern_b',
        name: 'パターンB',
        steps: ['初回接触', 'ニーズ調査', '提案', 'クロージング'],
        match_threshold: 0.88,
      },
      {
        pattern_id: 'pattern_c',
        name: 'パターンC',
        steps: ['初回接触', '提案'],
        match_threshold: 0.72,
      },
    ];

    const actionHistory = {
      sales_person_id: 'sp_001',
      steps: ['初回接触', '提案', 'クロージング'],
      contact_timestamps: [
        '2024-01-15T09:00:00Z',
        '2024-01-16T10:30:00Z',
        '2024-01-17T14:00:00Z',
      ],
    };

    const result = analyzeActionPatternAndGenerateReport({
      sales_person_id: actionHistory.sales_person_id,
      action_steps: actionHistory.steps,
      success_patterns: successPatterns,
    });

    expect(result.highest_match_pattern_id).toBe('pattern_a');
    expect(result.highest_match_score).toBe(0.95);
    expect(result.analysis_complete).toBe(true);
  });
});