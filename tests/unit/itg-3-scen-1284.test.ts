import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  // SCEN-1284
  test('複数の成功パターンがマッチした場合にすべてが関連度でランク付けされて返却される', async () => {
    const newCaseData = {
      industry: 'SaaS',
      customerSize: '中堅企業',
      businessChallenge: '業務効率化',
    };

    const mockPatternA = {
      patternId: 'pattern-a-001',
      relatedScore: 0.95,
      successFactors: ['顧客の経営課題に基づいた提案', '段階的な導入アプローチ'],
      businessConditions: {
        industry: 'SaaS',
        targetSize: '中堅企業',
      },
      applicabilityReasoning: 'industry と targetSize が完全に一致し、業務効率化課題への解決事例が豊富',
    };

    const mockPatternB = {
      patternId: 'pattern-b-002',
      relatedScore: 0.87,
      successFactors: ['CTO レベルの経営層への早期接触', '技術検証フェーズの短縮'],
      businessConditions: {
        industry: 'SaaS',
        targetSize: '大企業',
      },
      applicabilityReasoning: 'industry は一致するが targetSize が異なり、スケーラビリティ要件は異なる可能性あり',
    };

    const mockPatternC = {
      patternId: 'pattern-c-003',
      relatedScore: 0.92,
      successFactors: ['ROI シミュレーションの早期提示', '業務プロセス最適化コンサル'],
      businessConditions: {
        industry: 'SaaS',
        targetSize: '中堅企業',
      },
      applicabilityReasoning: 'industry と targetSize が一致し、業務効率化課題での複数成功事例を保有',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockPatternA,
        mockPatternB,
        mockPatternC,
      ]),
    };

    const result = await findSimilarPatterns(newCaseData, mockAIEngine);

    expect(result).toHaveLength(3);
    expect(result[0].patternId).toBe('pattern-a-001');
    expect(result[0].relatedScore).toBe(0.95);
    expect(result[1].patternId).toBe('pattern-c-003');
    expect(result[1].relatedScore).toBe(0.92);
    expect(result[2].patternId).toBe('pattern-b-002');
    expect(result[2].relatedScore).toBe(0.87);

    expect(result[0].successFactors).toEqual([
      '顧客の経営課題に基づいた提案',
      '段階的な導入アプローチ',
    ]);
    expect(result[0].businessConditions).toEqual({
      industry: 'SaaS',
      targetSize: '中堅企業',
    });
    expect(result[0].applicabilityReasoning).toBe(
      'industry と targetSize が完全に一致し、業務効率化課題への解決事例が豊富'
    );

    expect(result[1].successFactors).toEqual([
      'ROI シミュレーションの早期提示',
      '業務プロセス最適化コンサル',
    ]);
    expect(result[1].businessConditions).toEqual({
      industry: 'SaaS',
      targetSize: '中堅企業',
    });
    expect(result[1].applicabilityReasoning).toBe(
      'industry と targetSize が一致し、業務効率化課題での複数成功事例を保有'
    );

    expect(result[2].successFactors).toEqual([
      'CTO レベルの経営層への早期接触',
      '技術検証フェーズの短縮',
    ]);
    expect(result[2].businessConditions).toEqual({
      industry: 'SaaS',
      targetSize: '大企業',
    });
    expect(result[2].applicabilityReasoning).toBe(
      'industry は一致するが targetSize が異なり、スケーラビリティ要件は異なる可能性あり'
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newCaseData);
  });
});