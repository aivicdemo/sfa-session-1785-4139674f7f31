import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('経営層向け説得資料の自動生成 - 複月評価対応', () => {
  // SCEN-2033
  test('照合評価結果の期間が月をまたぐとき、複月評価として資料が生成される', async () => {
    // 照合評価結果の期間設定（月をまたぐ）
    const evaluation_start_date = new Date('2026-01-15T00:00:00Z');
    const evaluation_end_date = new Date('2026-02-28T23:59:59Z');

    // 顧客情報
    const customer_info = {
      company_name: 'テスト企業A',
      industry: '製造業',
      business_challenge: '生産効率化'
    };

    // 提案内容
    const proposal_content = {
      proposal_title: 'AI導入による工程最適化',
      expected_effect: '年間コスト削減30%'
    };

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'success_pattern_001',
          pattern_name: '複数月にまたがる長期導入プロジェクト',
          success_rate: 0.85,
          characteristics: {
            duration_months: 2.5,
            involves_multi_month_implementation: true
          }
        }
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 92,
        applicability: 'highly_applicable'
      })
    };

    // FileStorageAdapterのスタブ
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_key: 'report_2026_01_02_multi_month.pdf',
        upload_status: 'success',
        file_size_bytes: 245680
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        download_url: 'https://s3.amazonaws.com/reports/report_2026_01_02_multi_month.pdf?expires=...',
        url_expiry_seconds: 3600
      })
    };

    // 経営層向け説得資料の自動生成を実行
    const generated_material = await generateExecutivePersuasionMaterial(
      {
        customer_info,
        proposal_content,
        evaluation_start_date,
        evaluation_end_date
      },
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // 期待結果の検証
    // (1) 評価期間が正しく表示されている
    expect(generated_material.material_content.evaluation_period_display).toBe(
      '2026年1月15日～2026年2月28日（複月評価）'
    );

    // (2) 複月評価を考慮した分析セクションが含まれている
    expect(generated_material.material_content.analysis_sections).toContain(
      expect.objectContaining({
        section_type: 'multi_month_consolidated_analysis',
        section_title: expect.stringMatching(/複月評価による総合効果分析|複月期間の総合効果/)
      })
    );

    // (3) メタデータに複月評価タイプが記録されている
    expect(generated_material.file_metadata.evaluation_period_type).toBe(
      'multi_month'
    );

    // (4) ファイル名またはヘッダーに複月期間が明記されている
    expect(generated_material.material_content.header_period).toBe(
      '2026年1月-2月'
    );
    expect(generated_material.file_metadata.file_name).toMatch(/2026.*1.*2月|2026-01-02|202601-202602/);

    // 補足検証: AIエンジンとストレージアダプターが正しく呼ばれたこと
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_industry: '製造業',
        business_challenge: '生産効率化'
      })
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        report_type: 'executive_persuasion_material',
        period_type: 'multi_month'
      })
    );

    // アップロード成功の確認
    expect(generated_material.upload_status).toBe('success');
    expect(generated_material.file_key).toBe('report_2026_01_02_multi_month.pdf');
  });
});