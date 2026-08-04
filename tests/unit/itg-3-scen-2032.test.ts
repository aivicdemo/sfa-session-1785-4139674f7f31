import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  test('SCEN-2032: 照合評価結果の期間開始日と終了日が同一のとき、単日評価として資料が生成される', () => {
    // Arrange
    const evaluation_start_date = '2026-08-15';
    const evaluation_end_date = '2026-08-15';

    const matching_evaluation_result = {
      evaluation_id: 'eval-20260815-001',
      evaluation_start_date,
      evaluation_end_date,
      proposal_id: 'prop-001',
      customer_constraint_id: 'cc-001',
      conformity_score: 85,
      risk_level: 'medium',
      execution_feasibility: 0.88,
      roi_value: 1.25,
    };

    const customer_info = {
      customer_id: 'cust-001',
      customer_name: 'Example Corp',
      industry: 'IT',
      business_scale: 'large',
      annual_revenue: 50000000,
    };

    const proposal_content = {
      proposal_id: 'prop-001',
      product_name: 'Cloud Solution',
      proposed_value: 5000000,
      implementation_period: 6,
    };

    // Stub AIRecommendationEngine
    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'rec-20260815-001',
        evaluation_period_type: 'single_day',
        recommendation_content: 'Single day evaluation for 2026-08-15',
        confidence_score: 92,
        success_pattern_id: 'sp-single-day-001',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        'This is a single-day evaluation period.'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.95),
    };

    // Stub FileStorageAdapter
    const mock_file_storage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        file_path: 's3://bucket/reports/single_day_evaluation_20260815_001.pdf',
        file_name: 'single_day_evaluation_20260815_001.pdf',
        upload_timestamp: '2026-08-15T10:30:00Z',
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        download_url:
          'https://s3.amazonaws.com/bucket/reports/single_day_evaluation_20260815_001.pdf?expires=2026-08-22',
        expiration_timestamp: '2026-08-22T10:30:00Z',
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deleted_count: 0 }),
    };

    // Act
    const generated_material = generateExecutivePersuasionMaterial(
      matching_evaluation_result,
      customer_info,
      proposal_content,
      mock_ai_engine,
      mock_file_storage
    );

    // Assert - Check that AI recommendation was called
    expect(mock_ai_engine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        evaluation_start_date,
        evaluation_end_date,
      })
    );

    // Assert - Check metadata evaluation_period_type is 'single_day'
    expect(generated_material).toHaveProperty('metadata');
    expect(generated_material.metadata).toHaveProperty(
      'evaluation_period_type',
      'single_day'
    );

    // Assert - Check that material content contains '単日評価'
    expect(generated_material.material_content).toContain('単日評価');

    // Assert - Check that same date is explicitly stated
    expect(generated_material.material_content).toContain('2026-08-15');
    expect(generated_material.material_content).toMatch(/同一|同じ日付|当該日付/);

    // Assert - Check that single-day analysis section is included
    expect(generated_material.material_content).toContain('当日の成約確度');
    expect(generated_material.material_content).toContain('当日の顧客接触状況');

    // Assert - Check file storage upload was called
    expect(mock_file_storage.uploadRecommendationReport).toHaveBeenCalled();

    // Assert - Check that uploaded file has single_day marker
    const upload_call_args =
      mock_file_storage.uploadRecommendationReport.mock.calls[0][0];
    expect(upload_call_args.file_name).toContain('single_day');

    // Assert - Check returned upload metadata
    expect(generated_material.upload_metadata).toHaveProperty('file_name');
    expect(generated_material.upload_metadata.file_name).toContain('single_day');
    expect(generated_material.upload_metadata).toHaveProperty('upload_timestamp');
    expect(generated_material.upload_metadata.upload_timestamp).toBe(
      '2026-08-15T10:30:00Z'
    );

    // Assert - Verify material structure completeness
    expect(generated_material).toHaveProperty('material_id');
    expect(generated_material).toHaveProperty('metadata');
    expect(generated_material).toHaveProperty('material_content');
    expect(generated_material).toHaveProperty('upload_metadata');
  });
});