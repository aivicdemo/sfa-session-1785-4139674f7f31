import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-946: [error] 改善優先度スコア算出機能 - 検出日時が無効な形式のとき処理がエラーになる
  it('should throw error when detection_date_time has invalid format', () => {
    const improvement_item_id = 'IMP-001';
    const importance_level = 8;
    const frequency_count = 5;
    const impact_assessment = 7;
    const detection_date_time = '2024/13/45 25:70:80';
    const resolution_window_days = 14;

    expect(() =>
      calculateImprovementPriorityScore({
        improvement_item_id,
        importance_level,
        frequency_count,
        impact_assessment,
        detection_date_time,
        resolution_window_days,
      })
    ).toThrow(/検出日時の形式が無効です|Invalid date format/);
  });
});