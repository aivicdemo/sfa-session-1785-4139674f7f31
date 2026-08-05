import { analyzeBusinessActivityPatterns } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-615
  test('顧客対応パターンデータが空配列のときエラーになる', () => {
    const empty_contact_patterns = [];
    const sales_staff_id = 'staff_001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    const result = analyzeBusinessActivityPatterns({
      sales_staff_id,
      contact_patterns: empty_contact_patterns,
      period_start: analysis_period_start,
      period_end: analysis_period_end,
    });

    expect(result.is_error).toBe(true);
    expect(result.error_code).toBe('EMPTY_CONTACT_PATTERN_DATA');
    expect(result.error_message).toMatch(/顧客対応パターンデータが空です/);
  });
});