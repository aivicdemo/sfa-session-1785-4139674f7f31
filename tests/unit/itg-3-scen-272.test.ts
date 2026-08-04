import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化機能', () => {
  test('SCEN-272: 提案アプローチ推奨機能 - OpenAI APIが正常応答したとき、推奨提案アプローチが生成される', async () => {
    // スタブ: AIRecommendationEngine.generateRecommendation の正常応答を模擬
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approachName: '導入効果シミュレーション提案',
        detailedDescription:
          'お客様の現在の生産効率を詳細に分析し、当社ソリューション導入後の効果を数値化したシミュレーション結果を提案資料として提示します。投資対効果の明確化により経営層の意思決定を加速させ、導入決定率が向上します。当社は同業他社での類似案件において、導入効果シミュレーション提案により75%の提案採用率を達成した実績があります。',
        score: 82,
        referencedSuccessCaseIds: ['case_001', 'case_015', 'case_042'],
      }),
    };

    // テスト対象: 新規案件情報
    const newDealInput = {
      customerIndustry: '製造業',
      customerSize: '従業員500名',
      dealStage: '初期接触',
      mainChallenge: '生産効率化',
    };

    // 提案アプローチ推奨機能を実行
    const result = await generateRecommendation(newDealInput, mockAIRecommendationEngine);

    // AIRecommendationEngine.generateRecommendation が呼び出されたことを確認
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(newDealInput);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    // 戻り値オブジェクトの属性を検証
    expect(result).toHaveProperty('approachName');
    expect(result.approachName).toBe('導入効果シミュレーション提案');

    expect(result).toHaveProperty('detailedDescription');
    expect(typeof result.detailedDescription).toBe('string');
    expect(result.detailedDescription.length).toBeGreaterThanOrEqual(200);

    expect(result).toHaveProperty('score');
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBe(82);

    expect(result).toHaveProperty('referencedSuccessCaseIds');
    expect(Array.isArray(result.referencedSuccessCaseIds)).toBe(true);
    expect(result.referencedSuccessCaseIds.length).toBeGreaterThanOrEqual(1);
    expect(result.referencedSuccessCaseIds).toEqual(['case_001', 'case_015', 'case_042']);
  });
});