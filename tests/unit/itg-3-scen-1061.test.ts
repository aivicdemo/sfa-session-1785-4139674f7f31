import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨内容の生成と説明', () => {
  // SCEN-1061
  test('OpenAI API（generateRecommendation）が正常応答した場合、推奨内容が返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の経営課題に対する3段階の段階的提案戦略：第1段階は経営層への現状分析報告、第2段階は具体的な改善施策の提案、第3段階は導入後の効果測定と改善',
        rationale: {
          similarCasesCount: 12,
          successRate: 0.92,
          patternIds: ['PAT-001', 'PAT-002', 'PAT-003']
        },
        applicabilityScore: 87,
        explanationText: '過去12件の類似案件（成功率92%）から抽出されたパターンに基づいています。顧客業界（製造業）、企業規模（従業員500～1000名）、課題領域（生産効率化）の組み合わせが高度にマッチしています。提案タイミング（年度初）も過去の成功事例と一致しており、採用可能性が高いと判定されました。'
      })
    };

    const testCase = {
      customerIndustry: '製造業',
      customerSize: 'mid-market',
      customerEmployeeCount: 750,
      dealPhase: 'discovery',
      proposedBudget: 5000000,
      businessChallenge: '生産効率化',
      decisionMakersCount: 3,
      implementationTimeline: 'Q1'
    };

    const result = await generateRecommendation(testCase, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.proposalApproach).toBeDefined();
    expect(result.proposalApproach).not.toBe('');
    expect(typeof result.proposalApproach).toBe('string');
    expect(result.proposalApproach.length).toBeGreaterThan(0);

    expect(result.rationale).toBeDefined();
    expect(result.rationale.similarCasesCount).toBe(12);
    expect(result.rationale.successRate).toBe(0.92);
    expect(Array.isArray(result.rationale.patternIds)).toBe(true);
    expect(result.rationale.patternIds.length).toBeGreaterThan(0);

    expect(result.applicabilityScore).toBeDefined();
    expect(typeof result.applicabilityScore).toBe('number');
    expect(result.applicabilityScore).toBe(87);
    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.applicabilityScore).toBeLessThanOrEqual(100);

    expect(result.explanationText).toBeDefined();
    expect(result.explanationText).not.toBe('');
    expect(typeof result.explanationText).toBe('string');
    expect(result.explanationText.length).toBeGreaterThan(0);
  });
});