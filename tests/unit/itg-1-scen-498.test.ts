import { describe, test, expect } from '@jest/globals';
import { analyzeSellerBehaviorPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-498
  test('成約実績が99.9%の場合、行動パターン判定が優秀ではなく通常または要改善と判定される', () => {
    const seller_id = 'seller_001';
    const performance_score = 99.9;
    const call_frequency = 15;
    const proposal_count = 8;
    const followup_interval_days = 3;
    const proposal_success_rate = 65;

    const result = analyzeSellerBehaviorPattern({
      seller_id,
      performance_score,
      call_frequency,
      proposal_count,
      followup_interval_days,
      proposal_success_rate,
    });

    expect(result).toEqual({
      seller_id: 'seller_001',
      performance_score: 99.9,
      behavior_pattern_rating: expect.not.stringMatching(/^優秀$/),
      call_frequency_assessment: expect.any(String),
      proposal_quality_assessment: expect.any(String),
      followup_effectiveness_assessment: expect.any(String),
      recommended_improvements: expect.any(Array),
      analysis_timestamp: expect.any(String),
    });

    const valid_ratings = ['通常', '要改善', '改善中'];
    expect(valid_ratings).toContain(result.behavior_pattern_rating);
  });
});