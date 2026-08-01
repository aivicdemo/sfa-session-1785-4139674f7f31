import { describe, test, expect } from '@jest/globals';
import { determineProposalApproachFromSuccessPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-272
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの決定要因が欠落している場合、パターンマッチングが実行されない', () => {
    const mockSuccessPatternMatrix = {
      patternId: 'PATTERN-001',
      industryClassification: null,
      companyScale: 'enterprise',
      budgetRange: 'high',
      proposalContent: 'クラウド導入プラン',
      successRate: 0.85,
      conversationRank: 'A'
    };

    const customerProfile = {
      customerId: 'CUST-001',
      industryClassification: 'finance',
      companyScale: 'enterprise',
      budgetRange: 'high'
    };

    expect(() =>
      determineProposalApproachFromSuccessPattern(mockSuccessPatternMatrix, customerProfile)
    ).toThrow(/決定要因/);
  });
});