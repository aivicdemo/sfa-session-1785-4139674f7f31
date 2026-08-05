import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalespersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-340
  test('対象営業担当者が指定されていないとき、エラーが発生する', () => {
    const result = generateSalespersonBehaviorAnalysisReport({
      salesperson_id: null,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    });

    expect(result).toHaveProperty('error');
    expect(result.error).toHaveProperty('code', 'SALESPERSON_ID_REQUIRED');
    expect(result.error).toHaveProperty('message');
    expect(result.error.message).toMatch(/対象営業担当者が指定されていません/);
  });
});