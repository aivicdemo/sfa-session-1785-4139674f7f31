import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能 - AI根拠説明生成失敗時の簡略版根拠返却', () => {
  test('SCEN-1590: explainRecommendationReasoning失敗時、推奨パターンマスタから簡略版根拠が返却される', async () => {
    // ===== Setup: モック化されたAIRecommendationEngine =====
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat-001',
          customerIndustry: 'IT',
          customerSize: 'medium',
          proposalApproach: 'クラウド導入支援',
          successRate: 0.82,
          caseCount: 45,
        },
        {
          patternId: 'pat-002',
          customerIndustry: 'IT',
          customerSize: 'medium',
          proposalApproach: 'DX推進コンサルティング',
          successRate: 0.78,
          caseCount: 38,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'pat-001',
        relevanceScore: 0.87,
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockRejectedValueOnce(new Error('AI API timeout'))
        .mockRejectedValueOnce(new Error('AI API timeout'))
        .mockRejectedValueOnce(new Error('AI API timeout')),
    };

    // ===== パターンマスタ（内部保持データ） =====
    const recommendationPatternMaster = [
      {
        patternId: 'pat-001',
        customerIndustry: 'IT',
        customerSize: 'medium',
        proposalApproach: 'クラウド導入支援',
        successRate: 0.82,
        abbreviatedReasoning:
          '顧客規模medium、業種ITでは、クラウド導入支援が推奨パターンマスタで上位（成功率82%、過去45案件）',
      },
      {
        patternId: 'pat-002',
        customerIndustry: 'IT',
        customerSize: 'medium',
        proposalApproach: 'DX推進コンサルティング',
        successRate: 0.78,
        abbreviatedReasoning:
          '顧客規模medium、業種ITではDX推進コンサルティングも適用可能（成功率78%、過去38案件）',
      },
    ];

    // ===== テスト用新規案件データ =====
    const newDealData = {
      customerId: 'cust-2024-001',
      customerName: 'テック企業A',
      industry: 'IT',
      companySize: 'medium',
      budget: 5000000,
      mainChallenges: ['デジタル化推進', 'システム老朽化対策'],
      dealStage: 'initial_contact',
      proposalDeadline: '2024-02-15',
    };

    // ===== 実行：generateRecommendation呼び出し =====
    const result = await generateRecommendation(newDealData, {
      recommendationEngine: mockRecommendationEngine,
      patternMaster: recommendationPatternMaster,
      maxRetries: 3,
      retryBackoffMs: 1000,
      retryTimeoutMs: 30000,
    });

    // ===== 検証1: findSimilarPatterns が正常に呼び出されたこと =====
    expect(mockRecommendationEngine.findSimilarPatterns).toHaveBeenCalled();

    // ===== 検証2: evaluatePatternRelevance が正常に呼び出されたこと =====
    expect(mockRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // ===== 検証3: explainRecommendationReasoning が呼び出されたこと =====
    expect(
      mockRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalled();

    // ===== 検証4: 再試行が最大3回実行されたこと =====
    expect(
      mockRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledTimes(3);

    // ===== 検証5: 推奨オブジェクトの構造 =====
    expect(result).toHaveProperty('recommendationId');
    expect(result).toHaveProperty('recommendedApproach');
    expect(result).toHaveProperty('reasoning');
    expect(result).toHaveProperty('relevanceScore');
    expect(result).toHaveProperty('isSimplified');

    // ===== 検証6: 推奨内容が最上位パターンであること =====
    expect(result.recommendedApproach).toBe('クラウド導入支援');

    // ===== 検証7: スコアが正常に計算されていること =====
    expect(result.relevanceScore).toBe(0.87);

    // ===== 検証8: 簡略版フラグが true であること =====
    expect(result.isSimplified).toBe(true);

    // ===== 検証9: 根拠説明が簡略版であること =====
    expect(result.reasoning).toBe(
      '顧客規模medium、業種ITでは、クラウド導入支援が推奨パターンマスタで上位（成功率82%、過去45案件）'
    );

    // ===== 検証10: 根拠説明が推奨パターンマスタから派生していること =====
    expect(result.reasoning).toContain('成功率82%');
    expect(result.reasoning).toContain('過去45案件');

    // ===== 検証11: 根拠説明が簡潔であること（フル説明より短い） =====
    // 簡略版は最大150文字程度を想定
    expect(result.reasoning.length).toBeLessThanOrEqual(200);

    // ===== 検証12: 返却されたオブジェクトが具体的な過去案件事例を参照していること =====
    expect(result.reasoning).toMatch(/成功率\d{1,2}%/);
    expect(result.reasoning).toMatch(/\d+案件/);
  });
});