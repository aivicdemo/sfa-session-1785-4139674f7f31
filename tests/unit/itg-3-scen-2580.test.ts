import { extractSuccessPatternsFromMultipleDealData } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データからの成功パターン抽出機能', () => {
  test('SCEN-2580: 過去商談データが複数件のとき、すべてから成功パターンが抽出される', () => {
    // テストデータ：異なる顧客業種・商談ステージ・成約結果を持つ過去商談データ3件
    const pastDealData = [
      {
        dealId: 'DEAL-001',
        customerIndustry: 'manufacturing',
        dealStage: 'initial_contact',
        contractedStatus: 'won',
        dealAmount: 5000000,
        duration: 45,
      },
      {
        dealId: 'DEAL-002',
        customerIndustry: 'retail',
        dealStage: 'proposal',
        contractedStatus: 'lost',
        dealAmount: 2000000,
        duration: 30,
      },
      {
        dealId: 'DEAL-003',
        customerIndustry: 'finance',
        dealStage: 'negotiation',
        contractedStatus: 'won',
        dealAmount: 8000000,
        duration: 60,
      },
    ];

    // AIRecommendationEngineをモック
    let callCount = 0;
    const mockAIEngine = {
      findSimilarPatterns: jest.fn((dealData) => {
        callCount++;
        if (dealData.dealId === 'DEAL-001') {
          return {
            patterns: [
              {
                patternId: 'PATTERN-A',
                name: '初期接触→信頼構築→提案',
                stages: ['initial_contact', 'trust_building', 'proposal'],
                successRate: 0.85,
              },
            ],
          };
        } else if (dealData.dealId === 'DEAL-002') {
          return {
            patterns: [
              {
                patternId: 'PATTERN-B',
                name: '業種別カスタマイズ→ROI説明',
                stages: ['customization', 'roi_explanation'],
                successRate: 0.72,
              },
            ],
          };
        } else if (dealData.dealId === 'DEAL-003') {
          return {
            patterns: [
              {
                patternId: 'PATTERN-C',
                name: '複数決裁者への並行提案',
                stages: ['multi_stakeholder_engagement', 'parallel_proposal'],
                successRate: 0.88,
              },
            ],
          };
        }
        return { patterns: [] };
      }),
    };

    // 成功パターン抽出機能を実行
    const result = extractSuccessPatternsFromMultipleDealData(
      pastDealData,
      mockAIEngine
    );

    // 抽出されたパターン数が3件であることを検証
    expect(result.extractedPatterns.length).toBe(3);

    // 各成功パターンが、対応する商談データのインデックスまたは参照キーと紐付いて格納されていることを確認
    expect(result.extractedPatterns[0]).toEqual({
      dealId: 'DEAL-001',
      patternId: 'PATTERN-A',
      name: '初期接触→信頼構築→提案',
      stages: ['initial_contact', 'trust_building', 'proposal'],
      successRate: 0.85,
    });

    expect(result.extractedPatterns[1]).toEqual({
      dealId: 'DEAL-002',
      patternId: 'PATTERN-B',
      name: '業種別カスタマイズ→ROI説明',
      stages: ['customization', 'roi_explanation'],
      successRate: 0.72,
    });

    expect(result.extractedPatterns[2]).toEqual({
      dealId: 'DEAL-003',
      patternId: 'PATTERN-C',
      name: '複数決裁者への並行提案',
      stages: ['multi_stakeholder_engagement', 'parallel_proposal'],
      successRate: 0.88,
    });

    // パターンA・B・C すべてが結果配列に含まれていることを確認
    const patternIds = result.extractedPatterns.map((p) => p.patternId);
    expect(patternIds).toContain('PATTERN-A');
    expect(patternIds).toContain('PATTERN-B');
    expect(patternIds).toContain('PATTERN-C');

    // AIRecommendationEngine.findSimilarPatterns が3回呼び出されたことを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenNthCalledWith(
      1,
      pastDealData[0]
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenNthCalledWith(
      2,
      pastDealData[1]
    );
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenNthCalledWith(
      3,
      pastDealData[2]
    );
  });
});