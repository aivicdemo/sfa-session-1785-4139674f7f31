import { generateExecutiveSummaryConcurrently } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料の自動生成', () => {
  // SCEN-2045
  test('同じ入力条件で資料生成を2回実行した場合、同じ資料内容が生成される（冪等性）', () => {
    // テスト用の顧客情報と提案内容を準備
    const customerInfo = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社アルファテック',
      industry: '情報通信',
      scale: 'enterprise',
      challenges: ['デジタル変革推進', 'オペレーション効率化'],
      budgetRange: 50000000,
    };

    const proposalInfo = {
      proposalId: 'PROP-20240115-001',
      proposedProducts: ['クラウドERP導入', 'BIツール統合'],
      implementationEffectBasis: [
        { factor: '業務自動化率', expectedValue: 45, unit: '%' },
        { factor: 'コスト削減効果', expectedValue: 30000000, unit: 'JPY' },
      ],
    };

    // AIRecommendationEngineのスタブをセットアップ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        approachNarrative: '段階的クラウドシフト戦略：第1段階で主要業務システムをクラウド移行し、第2段階でデータ統合基盤を構築することで、段階的リスク軽減と継続的な効果測定を実現します',
        recommendationScore: 87,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-SUCCESS-2023-0156',
          matchingScore: 0.92,
          exampleName: '大手金融機関のクラウドERP導入事例',
          keyOutcome: '業務処理時間30%削減、年間3000万円のコスト削減を実現',
        },
        {
          patternId: 'PAT-SUCCESS-2023-0087',
          matchingScore: 0.88,
          exampleName: '製造業向けBIツール統合事例',
          keyOutcome: '経営判断サイクルを2週間短縮、データドリブン意思決定を実現',
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        explanation: '貴社の現在のシステム構成と業界ベンチマークを比較した結果、クラウドERP+BIツール統合アプローチが最適です。理由は3点：①類似企業での成功事例が豊富（成功率92%）、②初期投資50百万円で年間効果30百万円（ROI期間1.7年）、③分野別にシステム統合できるため導入リスク最小化',
        supportingDataPoints: [
          'クラウド市場調査（IDC 2024）',
          '業界平均ベンチマーク',
          '過去36ヶ月の成功事例統計',
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 0.89,
        relevantFactors: ['業界類似度', 'スケール適合度', '課題パターンマッチ'],
      }),
    };

    // FileStorageAdapterのスタブをセットアップ
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockReturnValue({
        uploadStatus: 'success',
        s3ObjectKey: 'recommendations/PROP-20240115-001_executive_summary_20240115_110000.pdf',
        downloadUrl: 'https://storage.example.com/temp/PROP-20240115-001_executive_summary_20240115_110000?expires=20240122',
      }),
      generateDownloadUrl: jest.fn().mockReturnValue({
        temporaryUrl: 'https://storage.example.com/temp/PROP-20240115-001_executive_summary_20240115_110000?expires=20240122',
      }),
    };

    // 1回目の資料生成を実行
    const firstGenerationResult = generateExecutiveSummaryConcurrently(
      customerInfo,
      proposalInfo,
      mockAIEngine,
      mockFileStorage
    );

    const firstGenerationContent = {
      proposalApproach: firstGenerationResult.proposalApproach,
      successExamplesOrder: firstGenerationResult.successExamples.map((ex) => ex.patternId),
      reasoningExplanation: firstGenerationResult.reasoningExplanation,
      recommendationScore: firstGenerationResult.recommendationScore,
      appliedPatternId: firstGenerationResult.appliedPatternId,
      s3ObjectKey: firstGenerationResult.s3ObjectKey,
      generationTimestamp: firstGenerationResult.generationTimestamp,
    };

    // AIエージェントとファイルストレージの呼び出し回数をリセット
    mockAIEngine.generateRecommendation.mockClear();
    mockAIEngine.findSimilarPatterns.mockClear();
    mockAIEngine.explainRecommendationReasoning.mockClear();
    mockAIEngine.evaluatePatternRelevance.mockClear();
    mockFileStorage.uploadRecommendationReport.mockClear();

    // 2回目の資料生成を同じ入力条件で実行
    const secondGenerationResult = generateExecutiveSummaryConcurrently(
      customerInfo,
      proposalInfo,
      mockAIEngine,
      mockFileStorage
    );

    const secondGenerationContent = {
      proposalApproach: secondGenerationResult.proposalApproach,
      successExamplesOrder: secondGenerationResult.successExamples.map((ex) => ex.patternId),
      reasoningExplanation: secondGenerationResult.reasoningExplanation,
      recommendationScore: secondGenerationResult.recommendationScore,
      appliedPatternId: secondGenerationResult.appliedPatternId,
      s3ObjectKey: secondGenerationResult.s3ObjectKey,
      generationTimestamp: secondGenerationResult.generationTimestamp,
    };

    // 1回目と2回目の生成資料を比較：提案アプローチの文言が字句単位で一致
    expect(firstGenerationContent.proposalApproach).toBe(
      secondGenerationContent.proposalApproach
    );

    // 参照される成功事例の順序が同じ
    expect(firstGenerationContent.successExamplesOrder).toEqual(
      secondGenerationContent.successExamplesOrder
    );

    // 根拠説明の内容が完全に一致
    expect(firstGenerationContent.reasoningExplanation).toBe(
      secondGenerationContent.reasoningExplanation
    );

    // 推奨スコアが同一
    expect(firstGenerationContent.recommendationScore).toBe(87);
    expect(secondGenerationContent.recommendationScore).toBe(87);
    expect(firstGenerationContent.recommendationScore).toBe(
      secondGenerationContent.recommendationScore
    );

    // パターンIDが同一
    expect(firstGenerationContent.appliedPatternId).toBe(
      secondGenerationContent.appliedPatternId
    );

    // S3オブジェクトキーが同一パターンで生成される（タイムスタンプ部分も固定されている）
    expect(firstGenerationContent.s3ObjectKey).toBe(
      secondGenerationContent.s3ObjectKey
    );

    // 外部AIサービスの呼び出し回数を検証：2回それぞれで同じ回数
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    // 生成資料の内容が完全に同一であることを最終確認
    expect(firstGenerationContent).toEqual(secondGenerationContent);
  });
});