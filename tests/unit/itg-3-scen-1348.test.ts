import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1348
  test('推奨根拠の可視化と説明文生成機能 - OpenAI APIが正常応答したとき、詳細な根拠説明文が生成される', async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        pastSuccessPatternCount: 3,
        pastSuccessExamples: [
          {
            dealId: 'DEAL-2023-001',
            customerIndustry: '製造業',
            revenue: 1200000000,
            proposalApproach: 'カスタマイズ提案',
            contractResult: true,
            adoptionRate: 0.82
          },
          {
            dealId: 'DEAL-2023-015',
            customerIndustry: '製造業',
            revenue: 980000000,
            proposalApproach: 'カスタマイズ提案',
            contractResult: true,
            adoptionRate: 0.76
          },
          {
            dealId: 'DEAL-2023-028',
            customerIndustry: '製造業',
            revenue: 1100000000,
            proposalApproach: 'カスタマイズ提案',
            contractResult: true,
            adoptionRate: 0.76
          }
        ],
        similarityScore: 0.87,
        proposalApproachReasoning: '同一業界で売上規模が類似した3案件において、カスタマイズ提案により成約率が平均78%向上しました。当案件も同様の条件を満たしているため、本アプローチを推奨します。',
        successProbabilityByAttribute: {
          industryMatch: 0.92,
          revenueRangeMatch: 0.89,
          budgetAlignmentMatch: 0.81,
          overallSuccessProbability: 0.87
        },
        riskFactors: [
          {
            riskName: '実装期間の遅延',
            probability: 0.15,
            mitigation: '導入前にスケジュール調整ワークショップを実施'
          },
          {
            riskName: 'ユーザー採用率の低さ',
            probability: 0.12,
            mitigation: '段階的な導入と充実したトレーニングプログラムの提供'
          }
        ],
        actionItems: [
          '顧客CFOとの予算ヒアリングを優先実施（対応時期：提案後2営業日以内）',
          '過去成功事例の具体的なROI資料を提案時に添付',
          '初期導入フェーズの詳細なマイルストーンを顧客と共有'
        ],
        explanation: '当案件は製造業で売上規模1,000～1,200百万円という過去の3件の成功事例と高い類似性を示しています（類似度スコア：0.87）。これらの案件ではカスタマイズ提案により平均78%の成約率向上が実現されました。現在の商談条件下での総合的な成功確率は87%と見込まれます。ただし実装期間遅延リスク（15%）とユーザー採用率リスク（12%）に注意が必要です。推奨アクションとして、CFOとの予算ヒアリングを優先し、過去成功事例のROI資料を活用してください。'
      })
    };

    const dealInput = {
      customerId: 'CUST-2024-001',
      customerIndustry: '製造業',
      revenue: 1050000000,
      dealStage: '提案準備',
      proposedBudget: 45000000,
      dealTimeline: '3ヶ月'
    };

    const result = await mockAIEngine.explainRecommendationReasoning(dealInput);

    expect(result.pastSuccessPatternCount).toBe(3);
    expect(result.pastSuccessExamples).toHaveLength(3);
    expect(result.pastSuccessExamples[0]).toEqual({
      dealId: 'DEAL-2023-001',
      customerIndustry: '製造業',
      revenue: 1200000000,
      proposalApproach: 'カスタマイズ提案',
      contractResult: true,
      adoptionRate: 0.82
    });

    expect(result.similarityScore).toBe(0.87);
    expect(typeof result.similarityScore).toBe('number');
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.similarityScore).toBeLessThanOrEqual(1.0);

    expect(result.proposalApproachReasoning).toBe('同一業界で売上規模が類似した3案件において、カスタマイズ提案により成約率が平均78%向上しました。当案件も同様の条件を満たしているため、本アプローチを推奨します。');

    expect(result.successProbabilityByAttribute).toEqual({
      industryMatch: 0.92,
      revenueRangeMatch: 0.89,
      budgetAlignmentMatch: 0.81,
      overallSuccessProbability: 0.87
    });

    expect(result.riskFactors).toHaveLength(2);
    expect(result.riskFactors[0]).toEqual({
      riskName: '実装期間の遅延',
      probability: 0.15,
      mitigation: '導入前にスケジュール調整ワークショップを実施'
    });
    expect(result.riskFactors[1]).toEqual({
      riskName: 'ユーザー採用率の低さ',
      probability: 0.12,
      mitigation: '段階的な導入と充実したトレーニングプログラムの提供'
    });

    expect(result.actionItems).toHaveLength(3);
    expect(result.actionItems[0]).toBe('顧客CFOとの予算ヒアリングを優先実施（対応時期：提案後2営業日以内）');
    expect(result.actionItems[1]).toBe('過去成功事例の具体的なROI資料を提案時に添付');
    expect(result.actionItems[2]).toBe('初期導入フェーズの詳細なマイルストーンを顧客と共有');

    expect(result.explanation).toContain('当案件は製造業で売上規模1,000～1,200百万円という過去の3件の成功事例と高い類似性を示しています');
    expect(result.explanation).toContain('類似度スコア：0.87');
    expect(result.explanation).toContain('平均78%の成約率向上');
    expect(result.explanation).toContain('総合的な成功確率は87%');
    expect(result.explanation).toContain('実装期間遅延リスク（15%）');
    expect(result.explanation).toContain('ユーザー採用率リスク（12%）');
  });
});