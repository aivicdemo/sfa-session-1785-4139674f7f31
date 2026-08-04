import { generateRecommendationWithConstraintValidation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合・推奨機能', () => {
  test('SCEN-1895: 提案内容が顧客制約条件に違反するとき推奨に警告フラグが立つ', () => {
    // Arrange: モック化されたAIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalContent: {
          budget: 1500000,
          implementationPeriod: 6,
          technologyStack: ['禁止技術1', '推奨技術A'],
        },
        recommendationId: 'rec-001',
        confidence: 0.85,
      }),
    };

    // 顧客制約条件を定義
    const customerConstraints = {
      budgetLimit: 1000000,
      implementationPeriodMonths: 3,
      prohibitedTechnology: ['禁止技術1', '禁止技術2'],
    };

    // 新規案件データ
    const dealData = {
      customerId: 'cust-123',
      customerName: 'テスト顧客',
      industry: 'IT',
      dealId: 'deal-456',
    };

    // Act: 推奨ロジックを実行
    const result = generateRecommendationWithConstraintValidation(
      dealData,
      customerConstraints,
      mockAIEngine
    );

    // Assert: 警告フラグと違反内容を検証
    expect(result.warningFlag).toBe(true);
    expect(result.violations).toHaveLength(3);

    const budgetViolation = result.violations.find(
      (v: { constraint: string }) => v.constraint === '予算上限'
    );
    expect(budgetViolation).toEqual({
      constraint: '予算上限',
      expected: '100万円以下',
      actual: '150万円',
    });

    const periodViolation = result.violations.find(
      (v: { constraint: string }) => v.constraint === '導入期間'
    );
    expect(periodViolation).toEqual({
      constraint: '導入期間',
      expected: '3ヶ月以内',
      actual: '6ヶ月',
    });

    const technologyViolation = result.violations.find(
      (v: { constraint: string }) => v.constraint === '技術スタック'
    );
    expect(technologyViolation).toEqual({
      constraint: '技術スタック',
      expected: '禁止技術を除外',
      actual: '禁止技術を含む',
    });

    // 推奨内容が含まれることを確認
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.proposalContent.budget).toBe(1500000);
    expect(result.recommendation.confidence).toBe(0.85);
  });
});