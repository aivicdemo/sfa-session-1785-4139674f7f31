import { extractSalesPersonsByImprovementTargets } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者別改善対象抽出機能', () => {
  // SCEN-451
  test('改善対象項目を所有する営業担当者が0人の場合、対象者が0件で返される', () => {
    const improvementTargets = [
      {
        id: 'target-001',
        name: '顧客満足度向上',
        description: 'NPS向上施策',
        createdAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 'target-002',
        name: '提案資料品質改善',
        description: 'テンプレート精度向上',
        createdAt: new Date('2024-01-15T10:00:00Z'),
      },
    ];

    const salesPersons = [
      {
        id: 'sp-001',
        name: '営業太郎',
        email: 'taro@sales.jp',
        department: '営業部',
      },
      {
        id: 'sp-002',
        name: '営業花子',
        email: 'hanako@sales.jp',
        department: '営業部',
      },
    ];

    const salesPersonTargetAssignments: Array<{
      salesPersonId: string;
      improvementTargetId: string;
    }> = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = extractSalesPersonsByImprovementTargets(
      improvementTargets,
      salesPersons,
      salesPersonTargetAssignments,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});