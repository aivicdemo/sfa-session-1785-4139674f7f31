import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-371
  test('[error] 推奨精度検証機能 - 根拠説明生成時に外部AI API が 3 回再試行後も失敗したとき、簡略版根拠説明で代替される', async () => {
    const mockRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    let callCount = 0;
    mockRecommendationEngine.explainRecommendationReasoning.mockImplementation(
      async () => {
        callCount++;
        if (callCount === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          throw new Error('Timeout');
        }
        if (callCount === 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          throw new Error('Timeout');
        }
        if (callCount === 3) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          throw new Error('Timeout');
        }
      }
    );

    const dealInfo = {
      customerName: 'A社',
      dealStage: '提案資料検討中',
      industry: '製造業',
      challenge: '生産効率化',
    };

    const mockPatternMaster = [
      {
        industry: '製造業',
        challenge: '生産効率化',
        approach: 'ERP導入',
        successRate: 78,
        description: 'ERP導入による生産効率化提案',
      },
    ];

    const result = await explainRecommendationReasoning(
      dealInfo,
      mockRecommendationEngine,
      mockPatternMaster
    );

    expect(mockRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(result.usedFallback).toBe(true);
    expect(result.explanation).toBe(
      '過去の類似案件では、ERP導入による生産効率化提案が最も効果的です'
    );
    expect(result.pattern).toEqual({
      industry: '製造業',
      challenge: '生産効率化',
      approach: 'ERP導入',
      successRate: 78,
      description: 'ERP導入による生産効率化提案',
    });
    expect(result.pattern.successRate).toBe(78);
  });
});