import { generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-601: 提案アプローチが複数件存在するとき全件の根拠が表示される', async () => {
    // Setup: AIRecommendationEngine.generateRecommendation スタブ
    const stubGenerateRecommendation = jest.fn().mockResolvedValue({
      recommendationId: 'rec-001',
      approaches: [
        {
          approachId: 'approach-001',
          title: 'アプローチA',
          description: '顧客の課題に対する提案内容',
          confidenceScore: 85,
        },
        {
          approachId: 'approach-002',
          title: 'アプローチB',
          description: '同業種での実績を活かした提案',
          confidenceScore: 92,
        },
        {
          approachId: 'approach-003',
          title: 'アプローチC',
          description: '予算規模に合わせた提案',
          confidenceScore: 78,
        },
      ],
    });

    // Setup: AIRecommendationEngine.explainRecommendationReasoning スタブ
    const stubExplainReasoning = jest.fn((approachId: string) => {
      const reasoningMap: Record<string, string> = {
        'approach-001': 'アプローチA：過去12ヶ月の類似案件で成約率78%',
        'approach-002': 'アプローチB：同業種での実績3件全て成功',
        'approach-003': 'アプローチC：予算規模マッチ度スコア85点',
      };
      return Promise.resolve({ reasoning: reasoningMap[approachId] || '' });
    });

    // Input: 推奨生成の入力条件
    const inputCondition = {
      customerIndustry: '小売',
      dealStage: '提案前',
      budgetScale: 5000,
    };

    // Execute: 推奨生成
    const recommendationResult = await stubGenerateRecommendation(inputCondition);

    // Verify: 提案アプローチが3件表示されている
    expect(recommendationResult.approaches).toHaveLength(3);
    expect(recommendationResult.approaches[0].approachId).toBe('approach-001');
    expect(recommendationResult.approaches[1].approachId).toBe('approach-002');
    expect(recommendationResult.approaches[2].approachId).toBe('approach-003');

    // Verify: 各提案アプローチの根拠説明を個別に取得して検証
    const reasoning1 = await stubExplainReasoning('approach-001');
    expect(reasoning1.reasoning).toBe('アプローチA：過去12ヶ月の類似案件で成約率78%');

    const reasoning2 = await stubExplainReasoning('approach-002');
    expect(reasoning2.reasoning).toBe('アプローチB：同業種での実績3件全て成功');

    const reasoning3 = await stubExplainReasoning('approach-003');
    expect(reasoning3.reasoning).toBe('アプローチC：予算規模マッチ度スコア85点');

    // Verify: 根拠説明が互いに異なる内容であることを確認
    expect(reasoning1.reasoning).not.toBe(reasoning2.reasoning);
    expect(reasoning2.reasoning).not.toBe(reasoning3.reasoning);
    expect(reasoning1.reasoning).not.toBe(reasoning3.reasoning);

    // Verify: スタブが3回呼び出されたことを確認
    expect(stubExplainReasoning).toHaveBeenCalledTimes(3);
    expect(stubExplainReasoning).toHaveBeenCalledWith('approach-001');
    expect(stubExplainReasoning).toHaveBeenCalledWith('approach-002');
    expect(stubExplainReasoning).toHaveBeenCalledWith('approach-003');
  });
});