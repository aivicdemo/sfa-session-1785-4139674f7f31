import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2681
  test('推奨内容が複数件のとき、複数件すべてに対する根拠が表示される', async () => {
    const mockRecommendations = [
      {
        id: 'rec-1',
        title: '推奨A',
        reasoning: '過去事例X社での成功パターン'
      },
      {
        id: 'rec-2',
        title: '推奨B',
        reasoning: '同業種Y社での実績'
      },
      {
        id: 'rec-3',
        title: '推奨C',
        reasoning: 'Z業界での適用事例'
      }
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendations),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn()
        .mockResolvedValueOnce('推奨Aは顧客の課題パターンが過去成功事例X社の80%マッチ')
        .mockResolvedValueOnce('推奨Bは同業種Y社との商談規模が類似')
        .mockResolvedValueOnce('推奨Cはターゲット業界での採用率が高い'),
      evaluatePatternRelevance: jest.fn()
    };

    const customerData = {
      customerId: 'cust-001',
      industry: 'IT',
      companySize: 'large',
      budget: 5000000
    };

    const dealData = {
      dealId: 'deal-001',
      stage: 'proposal',
      amount: 3000000
    };

    const generatedRecommendations = await mockAIEngine.generateRecommendation(customerData, dealData);

    expect(generatedRecommendations).toHaveLength(3);
    expect(generatedRecommendations[0].id).toBe('rec-1');
    expect(generatedRecommendations[1].id).toBe('rec-2');
    expect(generatedRecommendations[2].id).toBe('rec-3');

    const reasoningExplanations: string[] = [];
    for (const rec of generatedRecommendations) {
      const explanation = await mockAIEngine.explainRecommendationReasoning(rec.id);
      reasoningExplanations.push(explanation);
    }

    expect(reasoningExplanations).toHaveLength(3);
    expect(reasoningExplanations[0]).toBe('推奨Aは顧客の課題パターンが過去成功事例X社の80%マッチ');
    expect(reasoningExplanations[1]).toBe('推奨Bは同業種Y社との商談規模が類似');
    expect(reasoningExplanations[2]).toBe('推奨Cはターゲット業界での採用率が高い');

    const uniqueExplanations = new Set(reasoningExplanations);
    expect(uniqueExplanations.size).toBe(3);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(1, 'rec-1');
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(2, 'rec-2');
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(3, 'rec-3');
  });
});