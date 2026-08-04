import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-769
  test('推奨生成ロジック(AIエージェント失敗時の振る舞い) - 3回目の呼び出しで失敗したとき、内部推奨パターンマスタから統計的上位パターンが返却される', async () => {
    // Setup: スタブAIRecommendationEngine
    let aiCallCount = 0;
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockImplementation(async () => {
        aiCallCount++;
        if (aiCallCount < 3) {
          // 1回目・2回目は成功
          return {
            pattern: `tempPattern${aiCallCount}`,
            confidence: 0.5 + aiCallCount * 0.1,
          };
        } else {
          // 3回目でエラー
          throw new Error('API call failed');
        }
      }),
    };

    // Setup: 推奨パターンマスタ内の統計データ
    const recommendationPatternMaster = [
      {
        patternId: 'patternA',
        name: 'パターンA',
        successRate: 0.85,
        frequency: 120,
        description: 'High-value pattern for manufacturing',
      },
      {
        patternId: 'patternB',
        name: 'パターンB',
        successRate: 0.78,
        frequency: 95,
        description: 'Mid-value pattern',
      },
      {
        patternId: 'patternC',
        name: 'パターンC',
        successRate: 0.72,
        frequency: 60,
        description: 'Lower-value pattern',
      },
    ];

    // Setup: 新規案件データ
    const newCasInput = {
      customerIndustry: '製造業',
      caseScale: '中規模',
      decisionMakerCount: 3,
      customerId: 'CUST001',
      dealAmount: 5000000,
    };

    // Execute: generateRecommendation を呼び出し
    const result = await generateRecommendation(
      newCasInput,
      aiRecommendationEngineStub,
      recommendationPatternMaster
    );

    // Verify: AI スタブへの呼び出し回数が 3 回であることを確認
    expect(aiRecommendationEngineStub.generateRecommendation).toHaveBeenCalledTimes(3);

    // Verify: 戻り値が推奨パターンマスタから統計的に最上位のパターン（パターンA）を含むこと
    expect(result).toEqual({
      recommendedPattern: 'パターンA',
      patternId: 'patternA',
      successRate: 0.85,
      frequency: 120,
      reasoningExplanation: '簡略版説明',
      fallbackMode: true,
    });

    // Verify: 結果に含まれるパターンが最も高い成功率と出現頻度を持つパターンA であること
    expect(result.recommendedPattern).toBe('パターンA');
    expect(result.successRate).toBe(0.85);
    expect(result.frequency).toBe(120);
  });
});