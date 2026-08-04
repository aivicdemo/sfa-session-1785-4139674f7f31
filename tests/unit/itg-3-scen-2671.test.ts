import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 重複データ排除処理', () => {
  // SCEN-2671
  test('同じ顧客属性の重複成功パターンが排除されて処理される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          industry: 'IT',
          companyScale: '中堅',
          decisionMakerLevel: '部長',
          proposalApproach: 'デジタル変革支援',
          successRate: 0.85,
          caseCount: 12,
        },
        {
          patternId: 'pattern_002',
          industry: 'IT',
          companyScale: '中堅',
          decisionMakerLevel: '部長',
          proposalApproach: 'デジタル変革支援',
          successRate: 0.85,
          caseCount: 12,
        },
        {
          patternId: 'pattern_003',
          industry: 'IT',
          companyScale: '中堅',
          decisionMakerLevel: '部長',
          proposalApproach: 'クラウド導入支援',
          successRate: 0.78,
          caseCount: 8,
        },
      ]),
    };

    const newOpportunity = {
      customerId: 'cust_12345',
      industry: 'IT',
      companyScale: '中堅',
      decisionMakerLevel: '部長',
      dealAmount: 5000000,
      dealStage: '初期接触',
    };

    const result = await findSimilarPatterns(newOpportunity, mockAIEngine);

    expect(result.duplicateCount).toBe(1);
    expect(result.dedupedPatterns.length).toBe(2);
    expect(result.dedupedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          industry: 'IT',
          companyScale: '中堅',
          decisionMakerLevel: '部長',
        }),
        expect.objectContaining({
          industry: 'IT',
          companyScale: '中堅',
          decisionMakerLevel: '部長',
        }),
      ])
    );

    const uniquePatternIds = new Set(
      result.dedupedPatterns.map((p: { patternId: string }) => p.patternId)
    );
    expect(uniquePatternIds.size).toBe(2);

    expect(result.dedupedPatterns.some((p: { patternId: string }) => p.patternId === 'pattern_001')).toBe(true);
    expect(result.dedupedPatterns.some((p: { patternId: string }) => p.patternId === 'pattern_003')).toBe(true);

    const duplicatePatterns = result.dedupedPatterns.filter(
      (p: { proposalApproach: string }) => p.proposalApproach === 'デジタル変革支援'
    );
    expect(duplicatePatterns.length).toBe(1);
  });
});