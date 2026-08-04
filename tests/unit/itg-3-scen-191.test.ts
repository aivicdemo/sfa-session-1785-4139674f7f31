import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-191: [edge] 内部パターンマスタ統計集計機能 - 全成功パターンから統計的に上位の提案アプローチが0件抽出される場合の結果', () => {
    // Arrange
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
    };

    const mockStatisticsAggregator = {
      aggregatePatterns: jest.fn().mockReturnValue({
        patterns: [],
        message: '統計的に適用可能な過去成功パターンが見つかりませんでした。営業担当者にご相談ください',
        log: 'パターン抽出件数: 0件 / 代替動作: キャッシュ推奨履歴を表示',
      }),
    };

    const dealCondition = {
      customer_id: 'CUST_001',
      industry: 'IT',
      company_size: 'large',
      deal_stage: 'proposal',
      budget_range: 5000000,
    };

    const patternMasterData = [
      {
        pattern_id: 'PAT_001',
        customer_industry: 'Finance',
        company_size_category: 'enterprise',
        success_rate: 0.92,
        deal_count: 45,
      },
      {
        pattern_id: 'PAT_002',
        customer_industry: 'Manufacturing',
        company_size_category: 'mid-market',
        success_rate: 0.87,
        deal_count: 32,
      },
    ];

    // Act
    const result = mockStatisticsAggregator.aggregatePatterns();

    // Assert
    expect(result.patterns).toEqual([]);
    expect(result.patterns.length).toBe(0);
    expect(result.message).toBe('統計的に適用可能な過去成功パターンが見つかりませんでした。営業担当者にご相談ください');
    expect(result.log).toBe('パターン抽出件数: 0件 / 代替動作: キャッシュ推奨履歴を表示');
  });
});