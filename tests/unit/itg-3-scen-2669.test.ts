import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン自動判定機能 - 複数条件判定の大規模処理', () => {
  // SCEN-2669
  test('100件超の複合条件判定が完全に完了し、全判定レコードにスコアが設定される', async () => {
    // テスト環境設定: 複合判定条件の大規模データセット構成
    // 顧客業界10パターン × 商談規模5段階 × 提案タイプ3種類 × 過去成功事例20件 = 3,000件判定
    const industryPatterns = [
      'manufacturing',
      'retail',
      'finance',
      'healthcare',
      'technology',
      'logistics',
      'energy',
      'telecom',
      'media',
      'construction'
    ];
    const dealSizeStages = ['small', 'medium', 'large', 'enterprise', 'strategic'];
    const proposalTypes = ['product_focused', 'solution_oriented', 'value_based'];
    const successExamples = Array.from({ length: 20 }, (_, i) => ({
      id: `example_${i}`,
      closedWon: true,
      adoptionRate: 0.85 + Math.random() * 0.15
    }));

    // 成功パターンマスタ: 100件超の複合条件パターン事前登録
    const successPatterns = [];
    for (const industry of industryPatterns) {
      for (const dealSize of dealSizeStages) {
        for (const proposalType of proposalTypes) {
          for (const example of successExamples) {
            successPatterns.push({
              patternId: `pattern_${industry}_${dealSize}_${proposalType}_${example.id}`,
              industry,
              dealSize,
              proposalType,
              referencedExample: example.id,
              baseRelevanceScore: 0.5 + Math.random() * 0.5,
              conditions: {
                minCompanySize: Math.floor(Math.random() * 5000) + 100,
                maxCompanySize: Math.floor(Math.random() * 50000) + 5000,
                requiredBudget: Math.floor(Math.random() * 5000000) + 100000,
                implementationMonths: Math.floor(Math.random() * 12) + 1
              }
            });
          }
        }
      }
    }

    // 新規案件データ: 複合判定条件を含む
    const newDealInput = {
      dealId: 'new_deal_001',
      customerId: 'cust_large_001',
      customerIndustry: 'manufacturing',
      customerSize: 8500,
      dealStage: 'discovery',
      proposedApproach: 'solution_oriented',
      estimatedBudget: 2500000,
      targetImplementationMonths: 6,
      customerHistory: {
        previousDeals: 3,
        totalSpend: 5000000,
        averageAdoptionRate: 0.82
      }
    };

    // AIRecommendationEngine スタブ設定
    // evaluatePatternRelevance メソッドが複合判定を実行
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(async (patterns, dealData) => {
        const evaluationResults = [];
        const startTime = Date.now();

        for (const pattern of patterns) {
          // 複合条件による適用可能性スコア計算
          const industrySimilarity =
            pattern.industry === dealData.customerIndustry ? 1.0 : 0.7;
          const dealSizeMatch =
            dealData.customerSize >= pattern.conditions.minCompanySize &&
            dealData.customerSize <= pattern.conditions.maxCompanySize
              ? 1.0
              : 0.5;
          const budgetFit =
            dealData.estimatedBudget >= pattern.conditions.requiredBudget
              ? 1.0
              : 0.6;
          const timelineAlignment =
            Math.abs(
              dealData.targetImplementationMonths -
                pattern.conditions.implementationMonths
            ) <= 2
              ? 1.0
              : 0.4;

          const relevanceScore =
            (industrySimilarity +
              dealSizeMatch +
              budgetFit +
              timelineAlignment) /
            4.0;

          evaluationResults.push({
            patternId: pattern.patternId,
            relevanceScore: Math.min(1.0, Math.max(0.0, relevanceScore)),
            isApplicable: relevanceScore >= 0.6,
            matchingConditions: {
              industry: industrySimilarity,
              dealSize: dealSizeMatch,
              budget: budgetFit,
              timeline: timelineAlignment
            }
          });
        }

        const processingTimeMs = Date.now() - startTime;

        return {
          evaluationResults,
          totalPatternsEvaluated: patterns.length,
          processingTimeMs,
          status: 'SUCCESS',
          errors: [],
          skipped: 0
        };
      })
    };

    // evaluatePatternRelevance 呼び出し
    const result = await evaluatePatternRelevance(
      successPatterns,
      newDealInput,
      mockAIEngine
    );

    // 処理完了待機（タイムアウト設定：120秒）
    expect(result.processingTimeMs).toBeLessThan(120000);

    // 返却される判定結果の総件数が投入パターン件数と一致
    expect(result.evaluationResults.length).toBe(successPatterns.length);
    expect(result.evaluationResults.length).toBeGreaterThanOrEqual(3000);

    // 全判定レコードに0～1.0の範囲内の適用可能性スコアが設定
    for (const evaluation of result.evaluationResults) {
      expect(evaluation.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(evaluation.relevanceScore).toBeLessThanOrEqual(1.0);
      expect(typeof evaluation.relevanceScore).toBe('number');
    }

    // 処理ログにスキップ・エラー・タイムアウトが0件
    expect(result.errors.length).toBe(0);
    expect(result.skipped).toBe(0);

    // 推奨パターンマスタのレコード数が投入件数と一致
    expect(result.totalPatternsEvaluated).toBe(successPatterns.length);

    // 処理完了ステータスが「SUCCESS」
    expect(result.status).toBe('SUCCESS');

    // 各判定ケースについて、適用可能性スコアが正しく計算・格納
    const applicablePatterns = result.evaluationResults.filter(
      (e) => e.isApplicable === true
    );
    expect(applicablePatterns.length).toBeGreaterThan(0);

    for (const applicable of applicablePatterns) {
      expect(applicable.relevanceScore).toBeGreaterThanOrEqual(0.6);
    }

    // 処理ログから、全複合判定が完了していることを確認
    expect(result.totalPatternsEvaluated).toBe(result.evaluationResults.length);
  });
});