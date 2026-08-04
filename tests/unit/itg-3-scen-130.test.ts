import { validateLearningDataVolume } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-130
  test('[edge] 学習データ量検証機能 - 学習データが業務上の最大規模件数で検証が許可される', async () => {
    const maxScaleDealCount = 100000;
    const dealDataset = Array.from({ length: maxScaleDealCount }, (_, index) => ({
      dealId: `DEAL-${String(index + 1).padStart(6, '0')}`,
      customerId: `CUST-${String((index % 1000) + 1).padStart(4, '0')}`,
      dealAmount: 100000 + (index * 10),
      dealStage: ['初期接触', '提案', '交渉', '成約'][index % 4],
      successFlag: index % 3 !== 0,
      createdAt: new Date('2024-01-01T00:00:00Z').getTime() + (index * 86400000),
    }));

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-001',
        approach: '成功パターンに基づいた提案',
        confidence: 0.92,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const mockPatternMaster = {
      records: [] as Array<{
        dealId: string;
        customerId: string;
        dealAmount: number;
        dealStage: string;
        successFlag: boolean;
        createdAt: number;
      }>,
      count: 0,
    };

    const result = await validateLearningDataVolume(
      dealDataset,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result.status).toBe('APPROVED');
    expect(result.validationPassed).toBe(true);
    expect(mockPatternMaster.count).toBe(100000);
    expect(mockPatternMaster.records.length).toBe(100000);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        learningDataCount: 100000,
        datasetSize: 100000,
      })
    );
  });
});