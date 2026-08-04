import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateRecommendationWithReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠の可視化機能', () => {
  // SCEN-926
  test('[normal] 新規案件の顧客情報と商談条件からAIエージェントが提案アプローチと根拠情報を生成', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の経営課題に対応した導入支援パッケージを提案',
        reasoning: '過去3件の類似規模企業で同パターンの課題が90%の成約率で解決',
        confidenceScore: 0.92,
        similarPatterns: [
          {
            caseId: 'CASE-2024-001',
            industry: '製造業',
            scale: '従業員数1000-5000',
            adoptionRate: 0.95,
          },
          {
            caseId: 'CASE-2024-002',
            industry: '製造業',
            scale: '従業員数1000-5000',
            adoptionRate: 0.88,
          },
          {
            caseId: 'CASE-2024-003',
            industry: '製造業',
            scale: '従業員数800-4000',
            adoptionRate: 0.90,
          },
        ],
      }),
    };

    const customerInfo = {
      industry: '製造業',
      scale: '従業員数2500',
      challenges: ['業務プロセス効率化', '原価削減'],
      budget: 5000000,
    };

    const dealConditions = {
      dealStage: '提案準備',
      customerFocusArea: 'オペレーション改善',
      proposalDeadline: new Date('2024-12-31T23:59:59Z'),
    };

    const result = generateRecommendationWithReasoning(
      customerInfo,
      dealConditions,
      mockAIEngine,
    );

    expect(result).toBeDefined();
    expect(result.recommendedApproach).toBe(
      '顧客の経営課題に対応した導入支援パッケージを提案',
    );
    expect(result.recommendedApproach).not.toBe('');
    expect(typeof result.recommendedApproach).toBe('string');

    expect(result.reasoning).toBe(
      '過去3件の類似規模企業で同パターンの課題が90%の成約率で解決',
    );
    expect(result.reasoning).not.toBe('');
    expect(typeof result.reasoning).toBe('string');

    expect(result.confidenceScore).toBe(0.92);
    expect(typeof result.confidenceScore).toBe('number');
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(1);

    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBe(3);

    expect(result.similarPatterns[0]).toEqual({
      caseId: 'CASE-2024-001',
      industry: '製造業',
      scale: '従業員数1000-5000',
      adoptionRate: 0.95,
    });
    expect(result.similarPatterns[1]).toEqual({
      caseId: 'CASE-2024-002',
      industry: '製造業',
      scale: '従業員数1000-5000',
      adoptionRate: 0.88,
    });
    expect(result.similarPatterns[2]).toEqual({
      caseId: 'CASE-2024-003',
      industry: '製造業',
      scale: '従業員数800-4000',
      adoptionRate: 0.90,
    });

    expect(result.similarPatterns.every((p) => p.adoptionRate !== null)).toBe(
      true,
    );
    expect(
      result.similarPatterns.every((p) => typeof p.adoptionRate === 'number'),
    ).toBe(true);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealConditions,
    );
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});