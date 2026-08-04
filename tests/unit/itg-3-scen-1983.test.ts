import {
  generateExecutivePersuasionMaterial,
} from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1983
  test("経営層向け説得資料の自動生成 - 同一データで2回実行した場合に同じ内容が生成される", async () => {
    // テスト用の顧客情報と提案内容を準備
    const customerInfo = {
      companyName: "ABC Manufacturing Co., Ltd.",
      industry: "manufacturing",
      annualRevenue: 5000000000,
      primaryChallenge: "生産効率の低下と品質管理の不統一",
    };

    const proposalContent = {
      solutionName: "統合生産管理システム X1",
      expectedEffects: [
        "生産効率 25% 向上",
        "不良率 40% 削減",
        "運用コスト 18% 削減",
      ],
      estimatedCost: 150000000,
      implementationPeriod: "6 ヶ月",
      roi: 1.8,
    };

    // AIRecommendationEngine のスタブ
    const mockAIEngine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue({
          recommendedApproach: "段階的導入アプローチ",
          confidenceScore: 92,
          similarSuccessCases: [
            {
              caseId: "CASE-001",
              companyName: "XYZ Corporation",
              industry: "manufacturing",
              resultMetrics: {
                efficiencyGain: 0.25,
                defectReduction: 0.4,
                costSavings: 0.18,
              },
              implementationMonths: 6,
              roiAchieved: 1.8,
            },
            {
              caseId: "CASE-002",
              companyName: "DEF Industries",
              industry: "manufacturing",
              resultMetrics: {
                efficiencyGain: 0.23,
                defectReduction: 0.38,
                costSavings: 0.17,
              },
              implementationMonths: 7,
              roiAchieved: 1.75,
            },
          ],
          riskFactors: [
            { riskType: "change_management", severity: "medium" },
            { riskType: "data_migration", severity: "low" },
          ],
        }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          "提案ソリューションは、御社の生産効率課題と品質管理の統一要件を満たす最適なアプローチです。過去の成功事例から、同規模企業での導入実績が92%の信頼度で適用可能と判断されました。"
        ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.92),
    };

    // FileStorageAdapter のスタブ
    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          uploadId: "UPLOAD-2026-001",
          s3Key: "reports/executive-persuasion/2026-01-15-abc-mfg.pdf",
          uploadTimestamp: "2026-01-15T10:30:00Z",
        }),
      generateDownloadUrl: jest
        .fn()
        .mockResolvedValue({
          downloadUrl:
            "https://s3.amazonaws.com/reports/executive-persuasion/2026-01-15-abc-mfg.pdf?expires=...",
          expiresIn: 604800,
        }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    };

    // 第1回目の実行
    const firstResult = await generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockAIEngine,
      mockFileStorage
    );

    // 第2回目の実行（同一入力）
    const secondResult = await generateExecutivePersuasionMaterial(
      customerInfo,
      proposalContent,
      mockAIEngine,
      mockFileStorage
    );

    // タイトルが完全に一致すること
    expect(firstResult.materialContent.title).toBe(
      secondResult.materialContent.title
    );
    expect(firstResult.materialContent.title).toBe(
      "ABC Manufacturing Co., Ltd. - 統合生産管理システム X1 導入提案書（経営層向け要点版）"
    );

    // セクション構成が完全に一致すること
    expect(firstResult.materialContent.sections.length).toBe(
      secondResult.materialContent.sections.length
    );
    expect(firstResult.materialContent.sections.length).toBe(6);

    // 見出しが完全に一致すること
    expect(firstResult.materialContent.sections.map((s) => s.heading)).toEqual(
      secondResult.materialContent.sections.map((s) => s.heading)
    );
    expect(firstResult.materialContent.sections[0].heading).toBe("エグゼクティブサマリ");
    expect(firstResult.materialContent.sections[1].heading).toBe(
      "課題認識と提案価値"
    );
    expect(firstResult.materialContent.sections[2].heading).toBe("投資対効果分析");
    expect(firstResult.materialContent.sections[3].heading).toBe(
      "実装スケジュール"
    );
    expect(firstResult.materialContent.sections[4].heading).toBe("リスク評価と対策");
    expect(firstResult.materialContent.sections[5].heading).toBe(
      "成功事例とベストプラクティス"
    );

    // ROI計算値が完全に一致すること
    expect(firstResult.materialContent.roiAnalysis.investmentAmount).toBe(
      secondResult.materialContent.roiAnalysis.investmentAmount
    );
    expect(firstResult.materialContent.roiAnalysis.investmentAmount).toBe(
      150000000
    );

    expect(firstResult.materialContent.roiAnalysis.expectedAnnualBenefit).toBe(
      secondResult.materialContent.roiAnalysis.expectedAnnualBenefit
    );
    expect(firstResult.materialContent.roiAnalysis.expectedAnnualBenefit).toBe(
      270000000
    );

    expect(firstResult.materialContent.roiAnalysis.roiPercentage).toBe(
      secondResult.materialContent.roiAnalysis.roiPercentage
    );
    expect(firstResult.materialContent.roiAnalysis.roiPercentage).toBe(180);

    expect(firstResult.materialContent.roiAnalysis.paybackMonths).toBe(
      secondResult.materialContent.roiAnalysis.paybackMonths
    );
    expect(firstResult.materialContent.roiAnalysis.paybackMonths).toBe(6.67);

    // スケジュール内容が完全に一致すること
    expect(
      firstResult.materialContent.implementationSchedule.phases.length
    ).toBe(secondResult.materialContent.implementationSchedule.phases.length);
    expect(
      firstResult.materialContent.implementationSchedule.phases.length
    ).toBe(4);

    expect(
      firstResult.materialContent.implementationSchedule.phases.map(
        (p) => p.phaseName
      )
    ).toEqual(
      secondResult.materialContent.implementationSchedule.phases.map(
        (p) => p.phaseName
      )
    );

    expect(
      firstResult.materialContent.implementationSchedule.phases[0].phaseName
    ).toBe("準備・計画フェーズ");
    expect(
      firstResult.materialContent.implementationSchedule.phases[0].durationMonths
    ).toBe(1);
    expect(
      firstResult.materialContent.implementationSchedule.phases[0].keyActivities
    ).toEqual(["要件定義", "体制構築", "教育計画策定"]);

    // リスク評価内容が完全に一致すること
    expect(
      firstResult.materialContent.riskAssessment.riskItems.length
    ).toBe(secondResult.materialContent.riskAssessment.riskItems.length);
    expect(
      firstResult.materialContent.riskAssessment.riskItems.length
    ).toBe(2);

    expect(firstResult.materialContent.riskAssessment.riskItems[0]).toEqual(
      secondResult.materialContent.riskAssessment.riskItems[0]
    );
    expect(firstResult.materialContent.riskAssessment.riskItems[0]).toEqual({
      riskId: "RISK-001",
      description: "変更管理の推進難度",
      severity: "medium",
      mitigationStrategy: "段階的導入と従業員トレーニング",
      ownerRole: "IT Director",
    });

    expect(firstResult.materialContent.riskAssessment.riskItems[1]).toEqual(
      secondResult.materialContent.riskAssessment.riskItems[1]
    );
    expect(firstResult.materialContent.riskAssessment.riskItems[1]).toEqual({
      riskId: "RISK-002",
      description: "既存データの移行品質",
      severity: "low",
      mitigationStrategy: "事前データクレンジングと検証テスト",
      ownerRole: "Data Manager",
    });

    // 引用事例の事例番号と企業属性が完全に一致すること
    expect(firstResult.materialContent.successCases.cases.length).toBe(
      secondResult.materialContent.successCases.cases.length
    );
    expect(firstResult.materialContent.successCases.cases.length).toBe(2);

    expect(firstResult.materialContent.successCases.cases[0]).toEqual(
      secondResult.materialContent.successCases.cases[0]
    );
    expect(firstResult.materialContent.successCases.cases[0]).toEqual({
      caseId: "CASE-001",
      companyName: "XYZ Corporation",
      industry: "manufacturing",
      efficiencyImprovement: "25%",
      defectReduction: "40%",
      costSavings: "18%",
      implementationMonths: 6,
      roiAchieved: "180%",
    });

    expect(firstResult.materialContent.successCases.cases[1]).toEqual(
      secondResult.materialContent.successCases.cases[1]
    );
    expect(firstResult.materialContent.successCases.cases[1]).toEqual({
      caseId: "CASE-002",
      companyName: "DEF Industries",
      industry: "manufacturing",
      efficiencyImprovement: "23%",
      defectReduction: "38%",
      costSavings: "17%",
      implementationMonths: 7,
      roiAchieved: "175%",
    });

    // 全テキスト内容が完全に一致すること
    expect(firstResult.materialContent.sections[0].content).toBe(
      secondResult.materialContent.sections[0].content
    );
    expect(firstResult.materialContent.sections[0].content).toContain(
      "ABC Manufacturing Co., Ltd. は、生産効率 25% 向上と品質管理の統一を実現する統合生産管理システム X1 の導入をお勧めします"
    );

    // 表・図表の内容が完全に一致すること
    expect(firstResult.materialContent.sections[2].tables.length).toBe(
      secondResult.materialContent.sections[2].tables.length
    );
    expect(firstResult.materialContent.sections[2].tables[0]).toEqual(
      secondResult.materialContent.sections[2].tables[0]
    );
    expect(firstResult.materialContent.sections[2].tables[0]).toEqual({
      tableId: "TABLE-ROI-001",
      title: "投資対効果一覧表",
      rows: [
        {
          label: "初期投資額",
          value: "¥150,000,000",
        },
        {
          label: "年間便益（効果測定値）",
          value: "¥270,000,000",
        },
        {
          label: "ROI",
          value: "180%",
        },
        {
          label: "投資回収期間",
          value: "6.67 ヶ月",
        },
      ],
    });

    // パラグラフ順序が完全に一致すること
    const firstParagraphOrder = firstResult.materialContent.sections
      .map((s) => s.paragraphCount)
      .join(",");
    const secondParagraphOrder = secondResult.materialContent.sections
      .map((s) => s.paragraphCount)
      .join(",");
    expect(firstParagraphOrder).toBe(secondParagraphOrder);

    // ファイルストレージへのアップロード結果が完全に一致すること
    expect(firstResult.uploadResult.uploadId).toBe(
      secondResult.uploadResult.uploadId
    );
    expect(firstResult.uploadResult.uploadId).toBe("UPLOAD-2026-001");

    expect(firstResult.uploadResult.s3Key).toBe(
      secondResult.uploadResult.s3Key
    );
    expect(firstResult.uploadResult.s3Key).toBe(
      "reports/executive-persuasion/2026-01-15-abc-mfg.pdf"
    );

    // ダウンロードURLが完全に一致すること
    expect(firstResult.downloadUrl).toBe(secondResult.downloadUrl);
    expect(firstResult.downloadUrl).toContain(
      "https://s3.amazonaws.com/reports/executive-persuasion/2026-01-15-abc-mfg.pdf"
    );

    // 生成時刻のフォーマットが一致すること
    expect(firstResult.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(secondResult.generatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    // AIエンジンとストレージアダプタが期待通り呼ばれたこと
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(2);
  });
});