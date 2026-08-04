import { evaluateProposalApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('顧客条件照合機能', () => {
  test('SCEN-1133: 商談条件データが入力されないとき、照合処理をスキップして業務上デフォルト値を返却する', () => {
    // テスト対象の顧客条件照合機能を初期化する
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタから統計的に上位の成功パターン
    const defaultSuccessPatterns = [
      {
        patternId: 'pattern_001',
        patternName: '初期接触フェーズ_ニーズ把握型',
        successRate: 0.78,
        frequencyRank: 1,
        description: '顧客の経営課題をヒアリングして信頼構築するアプローチ',
      },
      {
        patternId: 'pattern_002',
        patternName: 'ソリューション提案フェーズ_ROI焦点型',
        successRate: 0.72,
        frequencyRank: 2,
        description: '投資対効果を明示した提案内容',
      },
      {
        patternId: 'pattern_003',
        patternName: 'クロージングフェーズ_段階的合意型',
        successRate: 0.68,
        frequencyRank: 3,
        description: '複数の判断ステップを経て最終合意に導くアプローチ',
      },
    ];

    // 新規案件データを準備し、商談条件データを null で設定
    const newDealDataWithNullCondition = {
      customerId: 'cust_12345',
      customerName: '株式会社サンプル',
      industry: 'IT',
      companySize: 'large',
      dealId: 'deal_98765',
      dealConditions: null,
    };

    // 商談条件データを空オブジェクト {} で設定するケース
    const newDealDataWithEmptyCondition = {
      customerId: 'cust_54321',
      customerName: '有限会社テスト',
      industry: 'manufacturing',
      companySize: 'medium',
      dealId: 'deal_11111',
      dealConditions: {},
    };

    // null の場合の顧客条件照合処理を実行
    const resultWithNull = evaluateProposalApproach(
      newDealDataWithNullCondition,
      defaultSuccessPatterns,
      mockAIEngine
    );

    // generateRecommendation が呼び出されていないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // 返却されたデータが業務上デフォルト値であることを検証
    expect(resultWithNull).toEqual({
      recommendedPatterns: defaultSuccessPatterns,
      explanationBrief: '標準的な営業成功パターンマスタから推奨します',
      briefReasoning: true,
      patternCount: 3,
      alternativeApproaches: [
        {
          patternId: 'pattern_001',
          patternName: '初期接触フェーズ_ニーズ把握型',
          reasoning:
            '顧客情報のみに基づいて、最も汎用的なアプローチを推奨',
        },
        {
          patternId: 'pattern_002',
          patternName: 'ソリューション提案フェーズ_ROI焦点型',
          reasoning:
            '投資効果を重視する傾向が強い顧客セグメントに対応',
        },
        {
          patternId: 'pattern_003',
          patternName: 'クロージングフェーズ_段階的合意型',
          reasoning: '中規模企業の複雑な決定プロセスに対応',
        },
      ],
    });

    // mock をリセット
    mockAIEngine.generateRecommendation.mockClear();

    // 空オブジェクト {} の場合の顧客条件照合処理を実行
    const resultWithEmpty = evaluateProposalApproach(
      newDealDataWithEmptyCondition,
      defaultSuccessPatterns,
      mockAIEngine
    );

    // generateRecommendation が呼び出されていないことを確認
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();

    // 返却されたデータが業務上デフォルト値であることを検証
    expect(resultWithEmpty).toEqual({
      recommendedPatterns: defaultSuccessPatterns,
      explanationBrief: '標準的な営業成功パターンマスタから推奨します',
      briefReasoning: true,
      patternCount: 3,
      alternativeApproaches: [
        {
          patternId: 'pattern_001',
          patternName: '初期接触フェーズ_ニーズ把握型',
          reasoning:
            '顧客情報のみに基づいて、最も汎用的なアプローチを推奨',
        },
        {
          patternId: 'pattern_002',
          patternName: 'ソリューション提案フェーズ_ROI焦点型',
          reasoning:
            '投資効果を重視する傾向が強い顧客セグメントに対応',
        },
        {
          patternId: 'pattern_003',
          patternName: 'クロージングフェーズ_段階的合意型',
          reasoning: '中規模企業の複雑な決定プロセスに対応',
        },
      ],
    });

    // 最終確認: 全体で generateRecommendation は一度も呼び出されていない
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(0);
  });
});