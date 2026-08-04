import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2235
  test('[normal] 推奨根拠説明生成機能 - OpenAI API呼び出しが正常応答したとき詳細な根拠説明が生成される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningText:
          '顧客業界は製造業で従業員規模500-1000名。過去3年間の類似案件（同業界・規模）の成功率は78%。提案アプローチ「段階的導入プラン」は同条件での採用率が最も高く（成功事例15件）、平均契約金額は1,200万円。リスク要因として既存システム統合の複雑性があるため、技術検証フェーズを最初に実施することを推奨。',
        confidence: 0.89,
        citedPatternCount: 15,
      }),
    };

    const recommendationId = 'rec_20240115_001';
    const customerIndustry = '製造業';
    const customerEmployeeCount = 750;
    const proposedApproach = '段階的導入プラン';

    const result = await explainRecommendationReasoning(
      {
        recommendationId,
        customerIndustry,
        customerEmployeeCount,
        proposedApproach,
      },
      mockAIEngine
    );

    expect(result.reasoningText).toBe(
      '顧客業界は製造業で従業員規模500-1000名。過去3年間の類似案件（同業界・規模）の成功率は78%。提案アプローチ「段階的導入プラン」は同条件での採用率が最も高く（成功事例15件）、平均契約金額は1,200万円。リスク要因として既存システム統合の複雑性があるため、技術検証フェーズを最初に実施することを推奨。'
    );

    expect(result.confidence).toBe(0.89);

    expect(result.citedPatternCount).toBe(15);

    expect(result.reasoningText).toMatch(/製造業/);
    expect(result.reasoningText).toMatch(/500-1000名/);
    expect(result.reasoningText).toMatch(/成功率は78%/);
    expect(result.reasoningText).toMatch(/段階的導入プラン/);
    expect(result.reasoningText).toMatch(/成功事例15件/);
    expect(result.reasoningText).toMatch(/1,200万円/);
    expect(result.reasoningText).toMatch(/技術検証フェーズ/);

    expect(typeof result.reasoningText).toBe('string');
    expect(result.reasoningText.length).toBeGreaterThan(0);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId,
        customerIndustry,
        customerEmployeeCount,
        proposedApproach,
      })
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
  });
});