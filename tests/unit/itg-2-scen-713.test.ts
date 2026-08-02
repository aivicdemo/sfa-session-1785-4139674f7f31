import { calculateNeedsCompatibilityScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-713
  test('提案資料と顧客ニーズの適合度スコア化機能 - 顧客課題が提案内容で全く解決できず、課題適合スコアが最低値になる', () => {
    const customerNeed = {
      needId: 'need-001',
      customerId: 'cust-001',
      businessChallenge: '既存システムの完全な刷新',
      priority: 'high',
      estimatedBudget: 5000000,
      implementationTimeline: '6ヶ月以内',
      createdAt: new Date('2024-01-15T11:00:00Z'),
    };

    const proposalContent = {
      proposalId: 'prop-001',
      customerId: 'cust-001',
      proposedSolution: '現行システムの部分的な機能追加',
      estimatedCost: 500000,
      implementationDuration: '2ヶ月',
      createdAt: new Date('2024-01-20T14:30:00Z'),
    };

    const result = calculateNeedsCompatibilityScore(customerNeed, proposalContent);

    expect(result.compatibilityScore).toBe(-100);
    expect(result.compatibilityStatus).toBe('適合度：極度に低い');
    expect(result.hasSignificantGap).toBe(true);
    expect(result.gapAnalysis).toBeDefined();
  });
});