import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { classifyDetectionResultPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-807
  test('問題検出結果の重要度・優先度分類機能 - 検出日が月初日の場合、対応期限が当月内に収まる', () => {
    const detection_date = new Date('2024-01-01T00:00:00Z');
    const severity_level = 'high';
    const issue_type = 'process_deviation';
    const impact_area = 'sales_rep';

    const result = classifyDetectionResultPriority({
      detection_date,
      severity_level,
      issue_type,
      impact_area,
    });

    expect(result).toHaveProperty('response_deadline');
    
    const response_deadline = new Date(result.response_deadline);
    const detection_month = detection_date.getMonth();
    const detection_year = detection_date.getFullYear();
    const deadline_month = response_deadline.getMonth();
    const deadline_year = response_deadline.getFullYear();

    expect(deadline_year).toBe(detection_year);
    expect(deadline_month).toBe(detection_month);

    const month_end_date = new Date(detection_year, detection_month + 1, 0);
    expect(response_deadline.getTime()).toBeLessThanOrEqual(month_end_date.getTime());
    
    expect(response_deadline.getTime()).toBeGreaterThanOrEqual(detection_date.getTime());
  });
});