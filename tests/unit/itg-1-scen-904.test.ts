import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-904: [error] 営業担当者行動パターン分析レポート生成機能 - 問題パターンが空のとき、エラーになる
  test('should throw error when problem patterns array is empty', () => {
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const sales_person_id = 'SP001';
    const problem_patterns: string[] = [];
    const include_recommendations = true;

    expect(() =>
      generateSalesPersonBehaviorAnalysisReport({
        analysis_period_start,
        analysis_period_end,
        sales_person_id,
        problem_patterns,
        include_recommendations,
      })
    ).toThrow(/問題パターン/);
  });
});