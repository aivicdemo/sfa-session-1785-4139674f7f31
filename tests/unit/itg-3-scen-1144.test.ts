import { generateProposalApproach } from '../../src/logic/it-1-br-3-3-2-1';

const mockAIEngine = {
  generateRecommendation: jest.fn(),
};

const mockPatternMaster = [
  {
    patternId: 'P001',
    approach: 'オンサイト導入支援',
    successRate: 85,
    simplifiedReasoning: '過去12ヶ月の同業種案件で最高成約率を記録',
  },
];

describe('提案アプローチ生成機能 - AIエージェント呼び出し再試行失敗時の内部マスタ返却', () => {
  // SCEN-1144
  test('AIRecommendationEngine.generateRecommendation()が3回すべて失敗したとき、内部推奨パターンマスタから簡略版根拠とともに返却する', async () => {
    jest.useFakeTimers();

    const dealInput = {
      customerIndustry: '製造業',
      budgetScale: '5000万円',
      decisionMakerCount: 3,
    };

    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('timeout')
    );
    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('timeout')
    );
    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('timeout')
    );

    const resultPromise = generateProposalApproach(
      dealInput,
      mockAIEngine,
      mockPatternMaster
    );

    await jest.advanceTimersByTimeAsync(1000);
    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(4000);

    const result = await resultPromise;

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      recommendation: {
        approach: 'オンサイト導入支援',
        source: 'internal_master',
        reasoning: '過去12ヶ月の同業種案件で最高成約率を記録',
        patternId: 'P001',
        successRate: 85,
      },
      fallbackApplied: true,
      retryAttempts: 3,
    });

    jest.useRealTimers();
  });
});