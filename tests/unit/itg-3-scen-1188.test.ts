import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1188: 顧客ニーズが複数件の場合に妥当性判定が実行される', () => {
    // テストデータ: 複数の顧客ニーズを持つ案件情報
    const multipleNeeds = [
      {
        needId: 'need_001',
        needTitle: 'コスト削減',
        needCategory: 'cost_optimization'
      },
      {
        needId: 'need_002',
        needTitle: '業務効率化',
        needCategory: 'operational_efficiency'
      }
    ];

    const proposalData = {
      proposalId: 'prop_12345',
      customerId: 'cust_789',
      customerNeeds: multipleNeeds,
      proposalContent: {
        solutionName: 'クラウドERP導入',
        expectedBenefit: 'コスト30%削減、業務時間50%短縮'
      },
      dealCondition: {
        dealId: 'deal_456',
        industryType: 'manufacturing',
        companySize: 'large',
        budget: 5000000,
        timeline: '2024-Q2'
      }
    };

    // AIRecommendationEngineのモック設定
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((needData, proposalContent) => {
        if (needData.needCategory === 'cost_optimization') {
          return 85;
        }
        if (needData.needCategory === 'operational_efficiency') {
          return 78;
        }
        return 0;
      })
    };

    // 提案妥当性判定機能を実行
    const result = evaluateProposalViability(proposalData, mockAIRecommendationEngine);

    // evaluatePatternRelevanceメソッドが呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // スタブへの呼び出し回数がニーズ件数（2件）以上であることを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);

    // 各ニーズに対して妥当性判定が個別に実行されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      multipleNeeds[0],
      proposalData.proposalContent
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      multipleNeeds[1],
      proposalData.proposalContent
    );

    // 判定結果として各ニーズごとにスコア値が返却されていることを確認
    expect(result).toHaveProperty('viabilityScores');
    expect(result.viabilityScores).toEqual({
      need_001: 85,
      need_002: 78
    });

    // 各スコア値が0～100の範囲内であることを確認
    Object.values(result.viabilityScores).forEach((score: number) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    // 全ニーズ分の判定結果が結果オブジェクトに含まれることを確認
    expect(Object.keys(result.viabilityScores).length).toBe(2);
    expect(result).toHaveProperty('totalNeedsEvaluated', 2);
  });
});