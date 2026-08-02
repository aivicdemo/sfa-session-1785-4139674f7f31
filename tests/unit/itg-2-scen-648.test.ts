import { describe, test, expect, beforeEach } from '@jest/globals';
import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-2-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('SCEN-648: 推奨アプローチに関連する過去事例が0件のとき、事例なしを示すデータが返される', async () => {
    // Arrange
    const recommendation_approach_id = 'approach-001';
    const approach_name = '顧客分析型提案';

    fetchMock.mockResponseOnce(
      JSON.stringify({
        count: 0,
        case_list: [],
        message: '関連する過去事例がありません'
      }),
      { status: 200 }
    );

    // Act
    const result = await visualizeRecommendationBasis({
      recommendation_approach_id: recommendation_approach_id,
      approach_name: approach_name
    });

    // Assert
    expect(result).toEqual({
      related_cases: {
        count: 0,
        case_list: [],
        message: '関連する過去事例がありません'
      },
      basis_section_status: '事例なし',
      is_displayable: true
    });
    
    expect(result.related_cases.count).toBe(0);
    expect(result.related_cases.case_list).toEqual([]);
    expect(result.related_cases.message).toBe('関連する過去事例がありません');
    expect(result.basis_section_status).toBe('事例なし');
    expect(result.is_displayable).toBe(true);
  });
});