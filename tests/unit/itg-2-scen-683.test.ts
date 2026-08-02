import { describe, test, expect } from '@jest/globals';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-683
  test('推奨根拠が年をまたぐ期間に作成されたとき、正しく根拠データに含まれる', () => {
    const basis_created_date = new Date('2023-12-28T15:30:00Z');
    const period_start = new Date('2023-12-01T00:00:00Z');
    const period_end = new Date('2024-01-31T23:59:59Z');

    const basisData = {
      id: 'basis_001',
      recommendation_id: 'rec_001',
      created_at: basis_created_date,
      past_case_reference: {
        case_id: 'case_001',
        customer_name: 'Customer A',
        success_rate: 0.85
      },
      success_pattern: {
        pattern_id: 'pattern_001',
        pattern_name: 'High-value customer with seasonal buying',
        confidence: 0.92
      }
    };

    const period_config = {
      period_start: period_start,
      period_end: period_end
    };

    const result = visualizeRecommendationBasis(basisData, period_config);

    expect(result).toEqual({
      basis_id: 'basis_001',
      recommendation_id: 'rec_001',
      created_date: '2023-12-28T15:30:00Z',
      is_within_period: true,
      past_case_reference: {
        case_id: 'case_001',
        customer_name: 'Customer A',
        success_rate: 0.85
      },
      success_pattern: {
        pattern_id: 'pattern_001',
        pattern_name: 'High-value customer with seasonal buying',
        confidence: 0.92
      },
      period_range: {
        start: '2023-12-01T00:00:00Z',
        end: '2024-01-31T23:59:59Z'
      }
    });
  });
});