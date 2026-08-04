import { generateExecutiveSummaryReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料の自動生成', () => {
  test('SCEN-1980: 生成された説得資料がExcel形式でファイルストレージアダプタにアップロードされる', () => {
    // テスト用の顧客情報と提案内容を準備
    const customerInfo = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社サンプルコーポレーション',
      industry: '製造業',
      scale: '中堅企業（従業員数500名）',
      businessChallenge: 'サプライチェーン最適化による原価削減'
    };

    const proposalInfo = {
      proposalId: 'PROP-20240115-001',
      productName: 'クラウドサプライチェーン管理システム',
      proposalPrice: 50000000,
      implementationDuration: 6,
      expectedSavings: 15000000,
      roiPeriod: 3.33
    };

    const uploadTimestamp = new Date('2024-01-15T10:30:00Z');
    const s3FileKey = 'reports/EXEC-SUMMARY-CUST-20240115-001-20240115T103000Z.xlsx';

    // AIRecommendationEngineのスタブを設定
    const aiEngineStub = {
      generateRecommendation: jest.fn().mockReturnValue({
        executiveSummary: '経営層向けのサマリー：本提案により3年で15百万円のコスト削減を見込む',
        roiAnalysis: {
          initialInvestment: 50000000,
          annualBenefit: 5000000,
          breakEvenMonth: 10,
          threeYearRoi: 45000000
        },
        implementationSchedule: {
          phase1: 'システム構築（3ヶ月）',
          phase2: 'データ移行・テスト（2ヶ月）',
          phase3: '本稼働・最適化（1ヶ月）'
        },
        competitiveComparison: {
          productName: 'クラウドサプライチェーン管理システム',
          competitorA: { price: 60000000, implementationTime: 8 },
          competitorB: { price: 55000000, implementationTime: 7 },
          ourAdvantage: '最安値かつ最短期間での導入を実現'
        },
        riskFactors: [
          '既存システムとの統合複雑度',
          'ユーザー教育期間の確保'
        ],
        improvementProposals: [
          '段階的な機能導入で初期負荷を軽減',
          'オンサイト研修を含めたサポート体制を強化'
        ]
      })
    };

    // FileStorageAdapterのスタブを設定
    const fileStorageStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        success: true,
        fileKey: s3FileKey,
        format: 'xlsx',
        uploadedAt: uploadTimestamp.toISOString(),
        fileSize: 245632
      })
    };

    // 説得資料自動生成機能を実行
    const result = generateExecutiveSummaryReport(
      customerInfo,
      proposalInfo,
      aiEngineStub,
      fileStorageStub,
      uploadTimestamp
    );

    // 生成された資料データがメモリで保持されることを確認
    expect(result).toHaveProperty('generatedReportData');
    expect(result.generatedReportData).toEqual({
      title: '経営層向け提案資料：クラウドサプライチェーン管理システム',
      customerName: '株式会社サンプルコーポレーション',
      industry: '製造業',
      sections: {
        executiveSummary: '経営層向けのサマリー：本提案により3年で15百万円のコスト削減を見込む',
        roiAnalysis: {
          initialInvestment: 50000000,
          annualBenefit: 5000000,
          breakEvenMonth: 10,
          threeYearRoi: 45000000
        },
        implementationSchedule: {
          phase1: 'システム構築（3ヶ月）',
          phase2: 'データ移行・テスト（2ヶ月）',
          phase3: '本稼働・最適化（1ヶ月）'
        },
        competitiveComparison: {
          productName: 'クラウドサプライチェーン管理システム',
          competitorA: { price: 60000000, implementationTime: 8 },
          competitorB: { price: 55000000, implementationTime: 7 },
          ourAdvantage: '最安値かつ最短期間での導入を実現'
        },
        riskFactors: [
          '既存システムとの統合複雑度',
          'ユーザー教育期間の確保'
        ],
        improvementProposals: [
          '段階的な機能導入で初期負荷を軽減',
          'オンサイト研修を含めたサポート体制を強化'
        ]
      }
    });

    // FileStorageAdapterのuploadRecommendationReportメソッド呼び出しを確認
    expect(fileStorageStub.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    
    // アップロード時に渡されたペイロードを確認（Excel形式）
    const uploadCall = fileStorageStub.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCall).toHaveProperty('format', 'xlsx');
    expect(uploadCall).toHaveProperty('reportData');
    expect(uploadCall.reportData).toEqual({
      title: '経営層向け提案資料：クラウドサプライチェーン管理システム',
      customerName: '株式会社サンプルコーポレーション',
      industry: '製造業',
      sections: {
        executiveSummary: '経営層向けのサマリー：本提案により3年で15百万円のコスト削減を見込む',
        roiAnalysis: {
          initialInvestment: 50000000,
          annualBenefit: 5000000,
          breakEvenMonth: 10,
          threeYearRoi: 45000000
        },
        implementationSchedule: {
          phase1: 'システム構築（3ヶ月）',
          phase2: 'データ移行・テスト（2ヶ月）',
          phase3: '本稼働・最適化（1ヶ月）'
        },
        competitiveComparison: {
          productName: 'クラウドサプライチェーン管理システム',
          competitorA: { price: 60000000, implementationTime: 8 },
          competitorB: { price: 55000000, implementationTime: 7 },
          ourAdvantage: '最安値かつ最短期間での導入を実現'
        },
        riskFactors: [
          '既存システムとの統合複雑度',
          'ユーザー教育期間の確保'
        ],
        improvementProposals: [
          '段階的な機能導入で初期負荷を軽減',
          'オンサイト研修を含めたサポート体制を強化'
        ]
      }
    });

    // レポートファイルメタデータテーブルに1件のレコードが新規作成されたことを確認
    expect(result).toHaveProperty('fileMetadata');
    expect(result.fileMetadata).toEqual({
      fileKey: s3FileKey,
      format: 'xlsx',
      uploadedAt: '2024-01-15T10:30:00Z',
      status: '完了',
      fileSize: 245632,
      customerId: 'CUST-20240115-001',
      proposalId: 'PROP-20240115-001'
    });

    // ユーザーへのレスポンスが正しい形式であることを確認
    expect(result).toHaveProperty('userResponse');
    expect(result.userResponse).toEqual({
      success: true,
      message: '経営層向け説得資料を生成してアップロードしました',
      format: 'xlsx',
      fileKey: s3FileKey,
      uploadedAt: '2024-01-15T10:30:00Z',
      fileSize: 245632
    });

    // アップロード成功フラグ、ファイル形式、S3ファイルキーが含まれていることを確認
    expect(result.userResponse.success).toBe(true);
    expect(result.userResponse.format).toBe('xlsx');
    expect(result.userResponse.fileKey).toBe(s3FileKey);
    expect(result.userResponse.uploadedAt).toBe('2024-01-15T10:30:00Z');
  });
});