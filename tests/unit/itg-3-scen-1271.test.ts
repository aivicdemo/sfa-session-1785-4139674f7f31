import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 提案妥当性判定機能', () => {
  // SCEN-1271
  test('営業プロセス遵守事項の順序が逆であっても判定結果に影響しない', () => {
    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((conditions: any) => {
        const hasInitialContact = conditions.processComplianceItems?.some(
          (item: string) => item === '初回接触'
        );
        const hasNeedsHearing = conditions.processComplianceItems?.some(
          (item: string) => item === 'ニーズヒアリング'
        );
        const hasProposal = conditions.processComplianceItems?.some(
          (item: string) => item === '提案'
        );
        const hasFollowup = conditions.processComplianceItems?.some(
          (item: string) => item === 'フォローアップ'
        );

        if (
          hasInitialContact &&
          hasNeedsHearing &&
          hasProposal &&
          hasFollowup
        ) {
          return 78;
        }
        return 0;
      }),
    };

    // 正順の営業プロセス遵守事項
    const businessConditionsNormalOrder = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      industryType: 'IT',
      companySize: 'large',
      processComplianceItems: [
        '初回接触',
        'ニーズヒアリング',
        '提案',
        'フォローアップ',
      ],
    };

    // 正順で提案妥当性スコアを取得
    const scoreNormalOrder = evaluateProposalValidity(
      businessConditionsNormalOrder,
      mockAIEngine
    );

    // 逆順の営業プロセス遵守事項
    const businessConditionsReverseOrder = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      industryType: 'IT',
      companySize: 'large',
      processComplianceItems: [
        'フォローアップ',
        '提案',
        'ニーズヒアリング',
        '初回接触',
      ],
    };

    // 逆順で提案妥当性スコアを再度取得
    const scoreReverseOrder = evaluateProposalValidity(
      businessConditionsReverseOrder,
      mockAIEngine
    );

    // 正順と逆順のスコアが完全に一致することを検証
    expect(scoreNormalOrder).toBe(78);
    expect(scoreReverseOrder).toBe(78);
    expect(scoreNormalOrder).toBe(scoreReverseOrder);
  });
});