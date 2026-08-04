import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1604
  test('[edge] 類似顧客マッチング処理 - 過去顧客データに重複顧客を含むとき、重複顧客のすべてに対して一致度判定が実行される', () => {
    const callCountMap = new Map<string, number>();
    const scoresByCustomerId = new Map<string, number[]>();

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn((customerId: string) => {
        const currentCount = (callCountMap.get(customerId) || 0) + 1;
        callCountMap.set(customerId, currentCount);

        let score: number;
        if (currentCount === 1) {
          score = 0.95;
        } else if (currentCount === 2) {
          score = 0.87;
        } else {
          score = 0.75;
        }

        if (!scoresByCustomerId.has(customerId)) {
          scoresByCustomerId.set(customerId, []);
        }
        scoresByCustomerId.get(customerId)!.push(score);

        return {
          patterns: [
            {
              patternId: `pattern_${customerId}_${currentCount}`,
              similarity: score,
              customerProfile: {
                customerId,
                industry: 'IT',
                scale: 'large'
              }
            }
          ]
        };
      })
    };

    const pastCustomerDataset = [
      {
        customerId: 'customerA',
        customerName: '顧客A_1',
        industry: 'IT',
        scale: 'large',
        annualRevenue: 10000000
      },
      {
        customerId: 'customerA',
        customerName: '顧客A_2',
        industry: 'IT',
        scale: 'large',
        annualRevenue: 10000000
      },
      {
        customerId: 'customerB',
        customerName: '顧客B',
        industry: 'Finance',
        scale: 'medium',
        annualRevenue: 5000000
      }
    ];

    const newDealCondition = {
      customerId: 'newCustomer',
      industry: 'IT',
      scale: 'large',
      annualRevenue: 9000000
    };

    const result = findSimilarPatterns(
      pastCustomerDataset,
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenNthCalledWith(1, 'customerA');
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenNthCalledWith(2, 'customerA');
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenNthCalledWith(3, 'customerB');

    expect(callCountMap.get('customerA')).toBe(2);
    expect(callCountMap.get('customerB')).toBe(1);

    const customerAScores = scoresByCustomerId.get('customerA')!;
    expect(customerAScores).toHaveLength(2);
    expect(customerAScores[0]).toBe(0.95);
    expect(customerAScores[1]).toBe(0.87);

    const customerBScores = scoresByCustomerId.get('customerB')!;
    expect(customerBScores).toHaveLength(1);
    expect(customerBScores[0]).toBe(0.75);

    expect(result).toEqual({
      similarityRecords: [
        {
          customerId: 'customerA',
          recordIndex: 0,
          similarity: 0.95
        },
        {
          customerId: 'customerA',
          recordIndex: 1,
          similarity: 0.87
        },
        {
          customerId: 'customerB',
          recordIndex: 0,
          similarity: 0.75
        }
      ],
      processingStatus: 'completed'
    });
  });
});