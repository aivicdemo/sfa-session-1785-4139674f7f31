import { generateRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠可視化 - 経営層向け説得資料自動生成', () => {
  // SCEN-2012
  test('照合評価結果が1件のとき、その1件の提案妥当性に基づいて資料が生成される', async () => {
    // Setup: Mock AIRecommendationEngine
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 0.85,
        is_applicable: true,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similar_patterns: [
          {
            proposal_id: 'PROP-001',
            customer_id: 'CUST-2012',
            industry: '製造業',
            challenge: '生産効率化',
            match_score: 0.92,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning_text:
          '貴社の生産効率化課題に対して、提案ID:PROP-001のソリューションが過去5件の類似案件で平均1.8倍の効率改善実績を有しており、投資対効果が優れています。',
      }),
    };

    // Setup: Mock FileStorageAdapter
    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          file_metadata_id: 'META-2012',
          upload_status: 'success',
          file_url:
            'https://s3.example.com/reports/META-2012/persuasion_report.pdf',
        }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Setup: Data store with single evaluation result
    const evaluationResults = [
      {
        evaluation_id: 'EVAL-2012',
        proposal_id: 'PROP-001',
        customer_id: 'CUST-2012',
        feasibility_score: 0.85,
        roi_score: 0.82,
        risk_score: 0.15,
        overall_applicability: 0.85,
      },
    ];

    // Input: Customer and deal condition for generation trigger
    const customerInfo = {
      customer_id: 'CUST-2012',
      industry: '製造業',
      company_size: 'large',
      primary_challenge: '生産効率化',
    };

    const dealCondition = {
      deal_stage: 'proposal_validation',
      estimated_budget: 5000000,
      decision_timeline_days: 60,
      stakeholder_count: 3,
    };

    // Execute: Call generateRecommendation with mocked external services
    const result = await generateRecommendation(
      {
        customer_info: customerInfo,
        deal_condition: dealCondition,
        evaluation_results: evaluationResults,
      },
      mockAIEngine,
      mockFileStorage
    );

    // Verify: AI Engine calls were made correctly
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: 'CUST-2012',
        industry: '製造業',
      })
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    // Verify: File storage upload was called
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'pdf',
        proposal_id: 'PROP-001',
      })
    );

    // Assert: Generated report structure and content
    expect(result).toEqual(
      expect.objectContaining({
        material_id: 'META-2012',
        format: 'pdf',
        proposal_id: 'PROP-001',
        customer_id: 'CUST-2012',
        feasibility_score: 0.85,
        generated_at: expect.any(String),
      })
    );

    // Assert: Report sections include required components
    expect(result.sections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          section_name: '推奨根拠',
        }),
        expect.objectContaining({
          section_name: '類似成功事例',
        }),
        expect.objectContaining({
          section_name: 'ROI試算',
        }),
      ])
    );

    // Assert: Single proposal pattern reflected, no comparison sections
    expect(result.sections).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          section_name: '提案パターン比較',
        }),
      ])
    );

    // Assert: Report content structure matches single evaluation result
    const proposalSection = result.sections.find(
      (s) => s.section_name === '推奨根拠'
    );
    expect(proposalSection).toEqual(
      expect.objectContaining({
        content: expect.stringContaining('PROP-001'),
      })
    );

    // Assert: Feasibility score of 0.85 is reflected in confidence level
    const confidenceLevel = result.confidence_level;
    expect(confidenceLevel).toBe('high');
    expect(confidenceLevel).toMatch(/high|medium|low/);

    // Assert: Single pattern only, no multiple alternatives
    const roiSection = result.sections.find((s) => s.section_name === 'ROI試算');
    expect(roiSection.estimated_improvement_rate).toBe(1.8);

    // Assert: File metadata ID matches upload response
    expect(result.material_id).toBe('META-2012');

    // Assert: Process log confirms single recommendation pattern application
    expect(result.generation_log).toEqual(
      expect.objectContaining({
        evaluation_results_count: 1,
        applied_pattern_count: 1,
        recommendation_pattern_id: 'PROP-001',
      })
    );
  });
});