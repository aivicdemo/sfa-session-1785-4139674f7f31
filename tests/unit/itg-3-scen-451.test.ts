import { extractSalesRepsByImprovementItems } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者別改善対象抽出機能', () => {
  // SCEN-451
  test('改善対象項目を所有する営業担当者が0人の場合、対象者が0件で返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const improvementItems = [
      {
        id: 'item_001',
        name: '顧客満足度向上',
        description: '顧客満足度スコアを向上させるための改善項目',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      },
      {
        id: 'item_002',
        name: '提案資料品質改善',
        description: '提案資料の品質を改善するための項目',
        createdAt: new Date('2024-01-15T11:00:00Z'),
      },
    ];

    const salesReps = [
      {
        id: 'rep_001',
        name: '営業太郎',
        department: '営業部',
        email: 'taro@example.com',
      },
      {
        id: 'rep_002',
        name: '営業花子',
        department: '営業部',
        email: 'hanako@example.com',
      },
    ];

    const assignmentRecords: Array<{
      repId: string;
      itemId: string;
    }> = [];

    const result = extractSalesRepsByImprovementItems(
      improvementItems,
      salesReps,
      assignmentRecords,
      mockAIEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});