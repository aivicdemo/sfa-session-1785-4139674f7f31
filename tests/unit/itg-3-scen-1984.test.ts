import { generateExecutivePersuasionDocument } from '../../src/logic/it-1-br-3-3-2-1';

describe('経営層向け説得資料の自動生成機能', () => {
  // SCEN-1984
  test('提案に紐付く成功パターン情報が照合評価結果から正確に抽出され説得資料に含まれる', () => {
    const successPatterns = [
      {
        patternId: 'PAT-001',
        industry: '製造業',
        companyScale: '大企業',
        issueType: '生産効率化',
        solutionApproach: 'IoT導入による自動化',
        successRate: 0.92,
        reasoning: '過去12件中11件が成功',
        relevanceScore: 0.95
      },
      {
        patternId: 'PAT-002',
        industry: '製造業',
        companyScale: '大企業',
        issueType: '生産効率化',
        solutionApproach: 'AIを活用した予測保全',
        successRate: 0.88,
        reasoning: '過去8件中7件が成功',
        relevanceScore: 0.89
      },
      {
        patternId: 'PAT-003',
        industry: '製造業',
        companyScale: '大企業',
        issueType: '生産効率化',
        solutionApproach: 'クラウド基盤の構築',
        successRate: 0.85,
        reasoning: '過去6件中5件が成功',
        relevanceScore: 0.82
      }
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(successPatterns)
    };

    const proposalInput = {
      customerId: 'CUST-2024-001',
      industry: '製造業',
      companyScale: '大企業',
      issue: '生産効率化',
      proposalContent: 'IoT・AI統合ソリューション',
      estimatedInvestment: 15000000,
      expectedROI: 2.5,
      implementationPeriod: 12
    };

    return generateExecutivePersuasionDocument(proposalInput, mockAIEngine).then(
      (document) => {
        expect(document).toBeDefined();
        expect(document.successPatterns).toBeDefined();
        expect(document.successPatterns).toHaveLength(3);

        expect(document.successPatterns[0].patternId).toBe('PAT-001');
        expect(document.successPatterns[0].industry).toBe('製造業');
        expect(document.successPatterns[0].companyScale).toBe('大企業');
        expect(document.successPatterns[0].issueType).toBe('生産効率化');
        expect(document.successPatterns[0].solutionApproach).toBe(
          'IoT導入による自動化'
        );
        expect(document.successPatterns[0].successRate).toBe(0.92);
        expect(document.successPatterns[0].reasoning).toBe('過去12件中11件が成功');

        expect(document.successPatterns[1].patternId).toBe('PAT-002');
        expect(document.successPatterns[1].relevanceScore).toBe(0.89);

        expect(document.successPatterns[2].patternId).toBe('PAT-003');
        expect(document.successPatterns[2].relevanceScore).toBe(0.82);

        const relevanceScores = document.successPatterns.map(
          (p: { relevanceScore: number }) => p.relevanceScore
        );
        for (let i = 0; i < relevanceScores.length - 1; i++) {
          expect(relevanceScores[i]).toBeGreaterThanOrEqual(
            relevanceScores[i + 1]
          );
        }

        expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
          expect.objectContaining({
            industry: '製造業',
            companyScale: '大企業',
            issue: '生産効率化'
          })
        );

        const patternIds = document.successPatterns.map(
          (p: { patternId: string }) => p.patternId
        );
        expect(patternIds).toContain('PAT-001');
        expect(patternIds).toContain('PAT-002');
        expect(patternIds).toContain('PAT-003');
        expect(patternIds).not.toContain('PAT-999');
      }
    );
  });
});