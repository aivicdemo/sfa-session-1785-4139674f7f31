import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に推奨する機能', () => {
  // SCEN-1128
  test('複数件の成功商談を類似度スコアの降順でランク付けして返却する', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          dealId: 'DEAL_A',
          customerName: '株式会社A',
          industry: 'IT',
          budgetRange: '500万円以上',
          implementationPeriod: '3ヶ月以内',
          successScore: 0.92,
          successOutcome: {
            contractAmount: 5000000,
            contractDate: '2024-01-15',
            contractStatus: 'completed'
          },
          approachStrategy: '段階的導入アプローチ',
          keySuccessFactors: ['経営層の早期巻き込み', '導入スケジュール明確化']
        },
        {
          dealId: 'DEAL_B',
          customerName: '株式会社B',
          industry: 'IT',
          budgetRange: '500万円以上',
          implementationPeriod: '3ヶ月以内',
          successScore: 0.78,
          successOutcome: {
            contractAmount: 4500000,
            contractDate: '2023-12-01',
            contractStatus: 'completed'
          },
          approachStrategy: 'RFP対応アプローチ',
          keySuccessFactors: ['提案資料の充実度', 'POC実施']
        },
        {
          dealId: 'DEAL_C',
          customerName: '株式会社C',
          industry: 'IT',
          budgetRange: '500万円以上',
          implementationPeriod: '3ヶ月以内',
          successScore: 0.85,
          successOutcome: {
            contractAmount: 5500000,
            contractDate: '2024-01-20',
            contractStatus: 'completed'
          },
          approachStrategy: 'コンサルティング型提案',
          keySuccessFactors: ['顧客ニーズ理解の深度', '予算配分の最適化']
        }
      ])
    };

    const newDealConditions = {
      industry: 'IT',
      budgetRange: '500万円以上',
      implementationPeriod: '3ヶ月以内',
      customerSize: 'enterprise',
      challengeArea: 'digital_transformation'
    };

    const result = await findSimilarPatterns(newDealConditions, mockAIEngine);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);

    expect(result[0].dealId).toBe('DEAL_A');
    expect(result[0].successScore).toBe(0.92);
    expect(result[0].customerName).toBe('株式会社A');
    expect(result[0].approachStrategy).toBe('段階的導入アプローチ');

    expect(result[1].dealId).toBe('DEAL_C');
    expect(result[1].successScore).toBe(0.85);
    expect(result[1].customerName).toBe('株式会社C');
    expect(result[1].approachStrategy).toBe('コンサルティング型提案');

    expect(result[2].dealId).toBe('DEAL_B');
    expect(result[2].successScore).toBe(0.78);
    expect(result[2].customerName).toBe('株式会社B');
    expect(result[2].approachStrategy).toBe('RFP対応アプローチ');

    expect(result[0].successScore).toBeGreaterThan(result[1].successScore);
    expect(result[1].successScore).toBeGreaterThan(result[2].successScore);

    expect(result[0].successOutcome.contractAmount).toBe(5000000);
    expect(result[1].successOutcome.contractAmount).toBe(5500000);
    expect(result[2].successOutcome.contractAmount).toBe(4500000);

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealConditions);
  });
});