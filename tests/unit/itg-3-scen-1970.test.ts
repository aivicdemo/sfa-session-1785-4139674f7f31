import { generatePersuasionReportForExecutives } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1970: 照合評価完了後、提案の妥当性スコアと根拠説明を含む経営層向け説得資料が生成される', () => {
    // スタブ定義: AIRecommendationEngine
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning:
          '顧客の経営目標と提案内容が高度に適合し、過去の類似案件で成功実績あり。投資対効果が明確で、リスク要因は顧客の既存体制で対応可能。',
        executiveKeyMessages: [
          'ROI 3年間で 150% の見込み',
          '既存システムとの統合コスト最小化',
          '業界標準に準拠したセキュリティ基準達成',
          '段階的導入による運用リスク回避',
          '12ヶ月以内の完全稼働達成可能',
        ],
        proposalValidityScore: 87,
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    // スタブ定義: FileStorageAdapter
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: 'report-uuid-20240915-001',
        uploadedAt: '2024-09-15T14:30:00Z',
        s3Url:
          'https://s3.ap-northeast-1.amazonaws.com/sales-ai-reports/report-uuid-20240915-001.pdf',
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 入力: 照合評価完了した提案データ
    const proposalInput = {
      proposalId: 'PROP-2024-00542',
      customerId: 'CUST-A-000128',
      customerName: '株式会社テック産業',
      proposalContent: {
        productCategory: 'クラウドERP導入',
        estimatedValue: 15000000,
        implementationPeriod: 12,
      },
      matchingEvaluationResult: {
        managerialGoalAlignment: 92,
        budgetConstraintFit: 88,
        scheduleConstraintFit: 85,
        operationalFeasibility: 80,
        overallCompatibilityScore: 86,
      },
      matchingCompletedFlag: true,
      evaluationCompletedAt: '2024-09-15T10:00:00Z',
    };

    // 実行: 経営層向け説得資料の自動生成
    const result = generatePersuasionReportForExecutives(
      proposalInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // 検証1: AIRecommendationEngineのexplainRecommendationReasoningが呼ばれたこと
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalId: 'PROP-2024-00542',
        customerId: 'CUST-A-000128',
      })
    );

    // 検証2: 生成される説得資料の妥当性スコアが期待値と一致
    expect(result.persuasionReport.proposalValidityScore).toBe(87);

    // 検証3: 根拠説明が含まれていることを検証
    expect(result.persuasionReport.reasoning).toMatch(/顧客の経営目標/);

    // 検証4: 経営層向けキーメッセージが5項目含まれていることを検証
    expect(result.persuasionReport.executiveKeyMessages).toHaveLength(5);
    expect(result.persuasionReport.executiveKeyMessages[0]).toMatch(/ROI/);
    expect(result.persuasionReport.executiveKeyMessages[1]).toMatch(/統合コスト/);
    expect(result.persuasionReport.executiveKeyMessages[2]).toMatch(
      /セキュリティ/
    );
    expect(result.persuasionReport.executiveKeyMessages[3]).toMatch(/段階的/);
    expect(result.persuasionReport.executiveKeyMessages[4]).toMatch(
      /12ヶ月/
    );

    // 検証5: 説得資料に顧客名が明記されていることを検証
    expect(result.persuasionReport.customerName).toBe('株式会社テック産業');

    // 検証6: 提案内容の要約が含まれていることを検証
    expect(result.persuasionReport.proposalSummary).toMatch(/クラウドERP導入/);

    // 検証7: ROI試算値が含まれていることを検証
    expect(result.persuasionReport.estimatedRoiPercentage).toBe(150);

    // 検証8: リスク分析セクションが含まれていることを検証
    expect(result.persuasionReport).toHaveProperty('riskAnalysis');
    expect(Array.isArray(result.persuasionReport.riskAnalysis)).toBe(true);

    // 検証9: 推奨アクションが明記されていることを検証
    expect(result.persuasionReport).toHaveProperty('recommendedAction');
    expect(result.persuasionReport.recommendedAction).toMatch(/導入/);

    // 検証10: FileStorageAdapterのuploadRecommendationReportが呼ばれたこと
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();

    // 検証11: アップロード呼び出しの引数にPDF形式が指定されていることを検証
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'pdf',
        proposalId: 'PROP-2024-00542',
        customerId: 'CUST-A-000128',
      })
    );

    // 検証12: 生成されたレポートメタデータが返却されることを検証
    expect(result.reportMetadata).toBeDefined();
    expect(result.reportMetadata.fileId).toBe('report-uuid-20240915-001');
    expect(result.reportMetadata.customerId).toBe('CUST-A-000128');
    expect(result.reportMetadata.proposalId).toBe('PROP-2024-00542');
    expect(result.reportMetadata.generatedAt).toBe('2024-09-15T14:30:00Z');

    // 検証13: S3アップロード後の一時ダウンロードURLが含まれていることを検証
    expect(result.reportMetadata).toHaveProperty('s3Url');
    expect(result.reportMetadata.s3Url).toMatch(/s3\.ap-northeast-1/);

    // 検証14: 全体の戻り値が期待される構造を持つことを検証
    expect(result).toEqual(
      expect.objectContaining({
        persuasionReport: expect.objectContaining({
          proposalValidityScore: 87,
          reasoning: expect.any(String),
          executiveKeyMessages: expect.arrayContaining([
            expect.any(String),
          ]),
          customerName: '株式会社テック産業',
          proposalSummary: expect.any(String),
          estimatedRoiPercentage: 150,
          riskAnalysis: expect.any(Array),
          recommendedAction: expect.any(String),
        }),
        reportMetadata: expect.objectContaining({
          fileId: expect.any(String),
          customerId: 'CUST-A-000128',
          proposalId: 'PROP-2024-00542',
          generatedAt: expect.any(String),
          s3Url: expect.any(String),
        }),
      })
    );
  });
});