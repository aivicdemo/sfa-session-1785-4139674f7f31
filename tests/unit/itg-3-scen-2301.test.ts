import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2301: 提案内容データが欠落しているとき比較処理が中断される', () => {
    // モック AIRecommendationEngine の定義
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 提案内容オブジェクト - 必須フィールドの一部を undefined に設定
    const proposalWithMissingFields = {
      customerId: 'CUST-001',
      customerName: undefined, // 欠落フィールド
      dealCondition: 'High-priority deal',
      proposalApproach: null, // 欠落フィールド
      proposalContent: 'Solution for customer needs',
      submittedAt: new Date('2024-01-15T11:00:00Z'),
    };

    // 標準プロセスデータ - 正常なデータ構造
    const standardProcessData = {
      processStep: 'initial_proposal',
      expectedBehavior: 'customer_engagement',
      successPattern: 'positive_response_within_48h',
      deviationThreshold: 0.3,
    };

    // 比較処理を実行
    const result = generateRecommendation(
      proposalWithMissingFields,
      standardProcessData,
      mockAIEngine
    );

    // 期待結果の検証
    expect(result.status).toBe('VALIDATION_FAILED');
    expect(result.errorMessage).toMatch(/提案内容に必要な情報が不足/);
    expect(result.validationErrors).toContain('customerName');
    expect(result.validationErrors).toContain('proposalApproach');
    expect(result.comparisonDetails).toBeNull();
    expect(result.userFacingMessage).toBe(
      '提案内容に必要な情報が不足しています。入力内容を確認してください'
    );
  });
});