import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

const AIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
};

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-574
  test('推奨提案が複数個のときすべての根拠が統合説明文に含まれる', () => {
    const mockRecommendations = [
      {
        id: 'proposal_A',
        title: '提案A',
        description: 'ソリューションA',
        evidences: ['根拠1-1', '根拠1-2'],
      },
      {
        id: 'proposal_B',
        title: '提案B',
        description: 'ソリューションB',
        evidences: ['根拠2-1'],
      },
      {
        id: 'proposal_C',
        title: '提案C',
        description: 'ソリューションC',
        evidences: ['根拠3-1', '根拠3-2', '根拠3-3'],
      },
    ];

    const expectedExplanation =
      '顧客の業界分析結果に基づき、以下の複数の提案を推奨します。\n\n【提案A】ソリューションAは、' +
      '根拠1-1および根拠1-2により、顧客の現在の課題に直結する解決策となります。\n\n' +
      '【提案B】ソリューションBは、根拠2-1で示される市場動向との適合性が高く、' +
      '実装による効果が期待できます。\n\n' +
      '【提案C】ソリューションCは、根拠3-1、根拠3-2、根拠3-3の3つの根拠に支えられており、' +
      '長期的な経営目標達成に貢献する提案です。';

    AIRecommendationEngine.generateRecommendation.mockReturnValue(
      mockRecommendations,
    );

    AIRecommendationEngine.explainRecommendationReasoning.mockReturnValue(
      expectedExplanation,
    );

    const input = {
      customerName: 'テスト顧客',
      industry: 'IT業界',
      scale: '中堅企業',
      recommendations: mockRecommendations,
    };

    const result = explainRecommendationReasoning(
      input,
      AIRecommendationEngine,
    );

    expect(result).toContain('提案A');
    expect(result).toContain('根拠1-1');
    expect(result).toContain('根拠1-2');
    expect(result).toContain('提案B');
    expect(result).toContain('根拠2-1');
    expect(result).toContain('提案C');
    expect(result).toContain('根拠3-1');
    expect(result).toContain('根拠3-2');
    expect(result).toContain('根拠3-3');

    const proposalAIndex = result.indexOf('提案A');
    const proposalBIndex = result.indexOf('提案B');
    const proposalCIndex = result.indexOf('提案C');
    expect(proposalAIndex < proposalBIndex).toBe(true);
    expect(proposalBIndex < proposalCIndex).toBe(true);

    const evidence1_1Index = result.indexOf('根拠1-1');
    const evidence1_2Index = result.indexOf('根拠1-2');
    const evidence2_1Index = result.indexOf('根拠2-1');
    const evidence3_1Index = result.indexOf('根拠3-1');
    const evidence3_2Index = result.indexOf('根拠3-2');
    const evidence3_3Index = result.indexOf('根拠3-3');

    expect(evidence1_1Index < evidence1_2Index).toBe(true);
    expect(evidence1_2Index < evidence2_1Index).toBe(true);
    expect(evidence2_1Index < evidence3_1Index).toBe(true);
    expect(evidence3_1Index < evidence3_2Index).toBe(true);
    expect(evidence3_2Index < evidence3_3Index).toBe(true);

    expect(result).toMatch(/\S+/);
    expect(result.length > 0).toBe(true);
  });
});