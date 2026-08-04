import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1239: 提案妥当性確認判定機能 - 成功パターンマッチスコアが100を超えるとき、エラーを返す', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        matchScore: 101,
        isApplicable: true,
      }),
    };

    const newProposalData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト販売',
      industry: '製造業',
      employeeCount: 250,
      annualRevenue: 5000000000,
      dealAmount: 15000000,
      dealSchedule: '2024-Q2',
      proposedApproach: 'クラウドERPシステム導入支援',
      budget: 20000000,
      constraints: 'グローバル対応必須、実装期間6ヶ月以内',
    };

    // Act
    const result = evaluateProposalValidity(newProposalData, mockAIRecommendationEngine);

    // Assert
    expect(result).toEqual({
      isValid: false,
      error: {
        code: 'PATTERN_MATCH_SCORE_EXCEEDED',
        message: 'マッチスコアが上限値（100）を超えています。提案パターンが信頼度の範囲外です',
        statusCode: 400,
        details: {
          actualScore: 101,
          maxScore: 100,
        },
      },
      proposalContent: undefined,
      recommendedResult: undefined,
    });
  });
});