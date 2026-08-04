import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 経営層向け説得資料の自動生成', () => {
  test('SCEN-2029: 投資対効果計算で分子（効果）が0のとき、対効果が0として記載される', () => {
    // テストデータ準備: 効果（分子）が0円、費用（分母）が100万円
    const proposalData = {
      proposalId: 'PROP-20260115-001',
      customerId: 'CUST-20260115-A001',
      proposalTitle: '経営システム導入提案',
      proposedEffect: 0,
      proposedCost: 1000000,
      proposedDuration: 24,
      riskFactors: [
        {
          riskId: 'RISK-001',
          description: '導入期間の人員配置が困難',
          severity: 'medium',
          mitigationPlan: '段階的導入により対応',
        },
      ],
      improvementProposals: [
        {
          improvementId: 'IMP-001',
          proposal: '導入前のプロセス最適化を実施',
          expectedBenefit: 'スムーズな導入を実現',
        },
      ],
    };

    // AIRecommendationEngineのスタブ設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20260115-001',
        proposalEffect: 0,
        proposalCost: 1000000,
        roi: 0,
        confidence: 0,
        recommendedApproach: '段階的導入により期間短縮を目指す',
        reasoningBasis: {
          similarCases: [],
          successPatterns: [],
          dataPoints: [],
        },
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '効果が確認できない案件のため、リスク軽減を優先',
      }),
    };

    // FileStorageAdapterのスタブ設定
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: 'FILE-20260115-001',
        filePath: 's3://reports/executive-persuasion/FILE-20260115-001.pdf',
        uploadedAt: '2026-01-15T11:00:00Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.amazonaws.com/signed-url/FILE-20260115-001',
        expiresAt: '2026-01-15T12:00:00Z',
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 0,
      }),
    };

    // 経営層向け説得資料の自動生成機能を実行
    const generateMaterialPromise = generateExecutivePersuasionMaterial(
      proposalData,
      mockAIEngine,
      mockFileStorage
    );

    return generateMaterialPromise.then((result) => {
      // 生成資料のメタデータを検証
      expect(result.status).toBe('success');
      expect(result.fileId).toBe('FILE-20260115-001');
      expect(result.filePath).toBe(
        's3://reports/executive-persuasion/FILE-20260115-001.pdf'
      );

      // 生成資料内容の投資対効果（ROI）検証
      expect(result.material.roi).toBe(0);
      expect(result.material.roiPercentage).toBe('0%');
      expect(result.material.roiDescription).toBe(
        '投資対効果：0%（効果が未検証のため、実装前のリスク軽減と体制整備を優先）'
      );

      // 分母による除算エラーが発生していないことを確認
      expect(result.material.calculationValid).toBe(true);

      // 生成資料に必要な要素がすべて含まれていることを確認
      expect(result.material).toHaveProperty('proposalTitle');
      expect(result.material).toHaveProperty('riskFactors');
      expect(result.material).toHaveProperty('improvementProposals');
      expect(result.material).toHaveProperty('recommendedApproach');

      // ファイルストレージへのアップロードが正常に実行されたことを確認
      expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
        expect.objectContaining({
          proposalId: 'PROP-20260115-001',
          customerId: 'CUST-20260115-A001',
        }),
        expect.any(Object)
      );

      // ダウンロードURLが生成されていることを確認
      expect(result.downloadUrl).toBe(
        'https://s3.amazonaws.com/signed-url/FILE-20260115-001'
      );
      expect(result.downloadUrlExpiresAt).toBe('2026-01-15T12:00:00Z');
    });
  });
});