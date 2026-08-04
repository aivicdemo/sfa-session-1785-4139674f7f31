import { evaluateRecommendationReliability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2756
  test('推奨根拠リストの順序が新しい順に並ぶとき、逆順で表示しても精度評価に影響しない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        recommendedApproach: 'カスタマイズ提案',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat_005',
          timestamp: new Date('2024-01-20T15:30:00Z').getTime(),
          customerIndustry: '製造業',
          dealStage: '初回提案',
          successRate: 0.92,
          caseId: 'case_5',
        },
        {
          patternId: 'pat_004',
          timestamp: new Date('2024-01-18T14:20:00Z').getTime(),
          customerIndustry: '製造業',
          dealStage: '初回提案',
          successRate: 0.88,
          caseId: 'case_4',
        },
        {
          patternId: 'pat_003',
          timestamp: new Date('2024-01-16T10:15:00Z').getTime(),
          customerIndustry: '製造業',
          dealStage: '初回提案',
          successRate: 0.85,
          caseId: 'case_3',
        },
        {
          patternId: 'pat_002',
          timestamp: new Date('2024-01-14T09:00:00Z').getTime(),
          customerIndustry: '製造業',
          dealStage: '初回提案',
          successRate: 0.80,
          caseId: 'case_2',
        },
        {
          patternId: 'pat_001',
          timestamp: new Date('2024-01-12T08:30:00Z').getTime(),
          customerIndustry: '製造業',
          dealStage: '初回提案',
          successRate: 0.78,
          caseId: 'case_1',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockImplementation((patternId) => {
        const explanations: { [key: string]: string } = {
          pat_005: '最新の同業種事例で初回提案から成約まで平均3週間の成功パターン',
          pat_004: '過去の類似顧客で予算規模が合致した事例',
          pat_003: '同じ商品カテゴリでの成功確率が高い提案アプローチ',
          pat_002: 'リード獲得方法が類似する顧客セグメント',
          pat_001: '最初の参照事例として登録された基本成功パターン',
        };
        return Promise.resolve(explanations[patternId] || '');
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(82),
    };

    const newCustomerData = {
      customerId: 'cust_new_001',
      industry: '製造業',
      companySize: '500-1000名',
      primaryChallenge: 'デジタル化推進',
    };

    const dealConditions = {
      dealId: 'deal_new_001',
      stage: '初回提案',
      productCategory: 'DXコンサルティング',
      estimatedBudget: 5000000,
    };

    return evaluateRecommendationReliability(
      mockAIEngine,
      newCustomerData,
      dealConditions,
    ).then((result_descending) => {
      expect(result_descending.evaluationScore).toBe(82);
      expect(result_descending.rationales.length).toBe(5);

      const reversed_rationales = [...result_descending.rationales].reverse();

      return Promise.all(
        reversed_rationales.map((rationale) =>
          mockAIEngine.explainRecommendationReasoning(rationale.patternId),
        ),
      ).then((explanations_ascending) => {
        const original_explanations = result_descending.rationales.map(
          (r) => r.explanation,
        );

        const reversed_explanations = reversed_rationales.map(
          (r) => r.explanation,
        );

        for (let i = 0; i < reversed_rationales.length; i++) {
          expect(reversed_explanations[i]).toBe(explanations_ascending[i]);
        }

        expect(result_descending.evaluationScore).toBe(82);

        const descending_pattern_ids = result_descending.rationales.map(
          (r) => r.patternId,
        );
        const ascending_pattern_ids = reversed_rationales.map(
          (r) => r.patternId,
        );

        expect(descending_pattern_ids).toEqual([
          'pat_005',
          'pat_004',
          'pat_003',
          'pat_002',
          'pat_001',
        ]);
        expect(ascending_pattern_ids).toEqual([
          'pat_001',
          'pat_002',
          'pat_003',
          'pat_004',
          'pat_005',
        ]);

        for (let i = 0; i < result_descending.rationales.length; i++) {
          expect(
            result_descending.rationales[i].explanation,
          ).toBeDefined();
          expect(
            result_descending.rationales[i].explanation.length,
          ).toBeGreaterThan(0);
        }
      });
    });
  });
});