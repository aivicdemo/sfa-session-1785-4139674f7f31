import { generateRecommendationWithProcessAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案ステップ順序乖離スコア', () => {
  // SCEN-2195
  test('提案の各ステップが標準プロセスの順序と同じ順序で提示されているとき、ステップ順序の乖離が0と判定される', () => {
    // 標準プロセスマスタ: 5ステップの標準提案順序
    const standardProcessSteps = [
      '顧客課題分析',
      '現状把握',
      'ソリューション提示',
      '導入計画',
      '合意形成'
    ];

    // 新規案件条件の入力パラメータ
    const caseInput = {
      customerIndustry: '製造業',
      challenge: 'デジタル化推進',
      budget: 50000000 // 5000万円
    };

    // AIRecommendationEngineのスタブ: generateRecommendationメソッドが標準順序と同一のステップを返す
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalSteps: [
          '顧客課題分析',
          '現状把握',
          'ソリューション提示',
          '導入計画',
          '合意形成'
        ],
        confidence: 85,
        reasoningBasis: ['過去の成功事例との高い一致度']
      })
    };

    // 提案内容の標準プロセスとの照合を実行
    const result = generateRecommendationWithProcessAlignment(
      caseInput,
      standardProcessSteps,
      aiEngineStub
    );

    // 提案ステップ順序と標準プロセス順序を比較し、ステップ順序の乖離スコアを算出
    // 期待値: ステップ順序の乖離スコアが 0.0（完全一致を示す）
    expect(result.stepOrderDeviationScore).toBe(0.0);
    expect(result.isAlignedWithStandardProcess).toBe(true);
    expect(result.proposalSteps).toEqual([
      '顧客課題分析',
      '現状把握',
      'ソリューション提示',
      '導入計画',
      '合意形成'
    ]);
  });
});