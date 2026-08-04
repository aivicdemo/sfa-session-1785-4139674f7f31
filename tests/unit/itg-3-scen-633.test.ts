import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-633
  test('外部AI推奨エンジンが失敗したとき、簡略版の根拠説明が返却される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn()
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout'))
        .mockRejectedValueOnce(new Error('API timeout')),
    };

    const mockRecommendationPatternMaster = [
      {
        patternId: 'pat_001',
        successProbability: 78,
        pastSuccessCount: 24,
        approachSummary: '提案型営業による段階的クロージング',
      },
      {
        patternId: 'pat_002',
        successProbability: 65,
        pastSuccessCount: 18,
        approachSummary: 'ニーズ調査型フォローアップ',
      },
    ];

    const newProjectData = {
      customerId: 'cust_xyz123',
      customerIndustry: '製造業',
      customerSize: '500-1000名',
      dealAmount: 2500000,
      dealStage: '提案前',
      salesRepExperience: 3,
    };

    const result = await explainRecommendationReasoning(
      newProjectData,
      mockAIEngine,
      mockRecommendationPatternMaster,
    );

    expect(result).toEqual({
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      isSimplified: true,
      reasoning: {
        recommendedPatternId: 'pat_001',
        successProbability: 78,
        pastSuccessCount: 24,
        approachSummary: '提案型営業による段階的クロージング',
      },
      retryAttempts: 3,
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
  });
});