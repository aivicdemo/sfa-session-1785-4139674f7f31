import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案妥当性判定機能', () => {
  // SCEN-1279: [edge] 提案が承認前の状態である場合に判定ロジックが適切に処理される
  test('SCEN-1279: 承認前状態の提案に対して妥当性判定を実行し、推奨根拠と判定結果を記録する', async () => {
    // ===== Setup: 承認前状態の提案エンティティを作成 =====
    const proposal_id = 'PROP-20240115-001';
    const customer_id = 'CUST-20240115-001';
    const evaluate_at = new Date('2024-01-15T11:00:00Z');
    const proposal_pending = {
      proposal_id,
      customer_id,
      status: 'PENDING',
      proposal_content: {
        product_category: 'ERP',
        estimated_value: 5000000,
        proposed_timeline: '2024-Q2',
        key_features: ['財務管理', 'サプライチェーン最適化'],
      },
      customer_constraints: {
        budget_ceiling: 6000000,
        max_implementation_months: 6,
        required_go_live_date: '2024-06-30',
      },
      created_at: new Date('2024-01-15T10:00:00Z'),
      evaluate_at: null,
      evaluation_status: null,
      reasoning_summary: null,
    };

    // ===== Mock: AIRecommendationEngineの成功レスポンスを設定 =====
    const ai_recommendation_mock = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: 'REC-20240115-001',
        proposal_id,
        reasoning_basis: {
          matching_patterns: [
            {
              pattern_id: 'PAT-ERP-001',
              pattern_name: '大規模ERP導入 - 製造業向け',
              similarity_score: 0.92,
              success_rate: 0.88,
              past_case_count: 12,
            },
          ],
          risk_factors: [
            {
              risk_id: 'RISK-ERP-TIMELINE',
              risk_name: '実装期間の短さ',
              severity: 'MEDIUM',
              mitigation_strategy: '並行フェーズ導入',
            },
          ],
          confidence_score: 0.85,
        },
        feasibility_evaluation: {
          budget_fit: 0.95,
          timeline_fit: 0.78,
          technical_fit: 0.90,
          overall_feasibility_score: 0.88,
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: 'PAT-ERP-001',
          success_rate: 0.88,
          applicable_count: 12,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        plain_text_explanation:
          '過去12件の類似案件（ERP導入、製造業）では88%の成功率を確認しました。提案の予算は顧客制約内であり、技術的な実装可能性も高くなっています。ただし、実装期間が6ヶ月という制約がある点が若干のリスク要因です。並行フェーズでの導入を検討することで、リスク軽減が可能です。',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 0.85,
        is_applicable: true,
      }),
    };

    // ===== Mock: FileStorageAdapterの成功レスポンスを設定 =====
    const file_storage_adapter_mock = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        report_id: 'RPT-20240115-001',
        s3_key: 's3://recommendation-reports/PROP-20240115-001_20240115T110000Z.pdf',
        download_url:
          'https://s3.amazonaws.com/recommendation-reports/PROP-20240115-001_20240115T110000Z.pdf',
        url_expiration_at: new Date('2024-01-16T11:00:00Z'),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        download_url:
          'https://s3.amazonaws.com/recommendation-reports/PROP-20240115-001_20240115T110000Z.pdf',
        expiration_at: new Date('2024-01-16T11:00:00Z'),
      }),
    };

    // ===== 内部推奨パターンマスタのモック =====
    const internal_pattern_master_mock = [
      {
        pattern_id: 'PAT-ERP-001',
        pattern_name: '大規模ERP導入 - 製造業向け',
        success_rate: 0.88,
        frequency: 12,
        recommendation_rank: 1,
      },
      {
        pattern_id: 'PAT-ERP-002',
        pattern_name: 'ERP導入 - 段階的実装',
        success_rate: 0.82,
        frequency: 8,
        recommendation_rank: 2,
      },
    ];

    // ===== テスト実行: 提案妥当性判定機能を実行 =====
    const evaluation_result = await evaluateProposalValidity(
      proposal_pending,
      ai_recommendation_mock,
      file_storage_adapter_mock,
      internal_pattern_master_mock,
      evaluate_at
    );

    // ===== 検証1: AIRecommendationEngineが呼び出されたことを確認 =====
    expect(ai_recommendation_mock.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        proposal_id,
        customer_id,
      })
    );

    // ===== 検証2: 推奨内容の根拠スコアが計算・保持されていることを確認 =====
    expect(evaluation_result.reasoning_basis).toEqual(
      expect.objectContaining({
        matching_patterns: expect.any(Array),
        risk_factors: expect.any(Array),
        confidence_score: 0.85,
      })
    );
    expect(evaluation_result.reasoning_basis.matching_patterns[0]).toEqual(
      expect.objectContaining({
        pattern_id: 'PAT-ERP-001',
        similarity_score: 0.92,
        success_rate: 0.88,
      })
    );

    // ===== 検証3: 判定結果ステータスが'EVALUATED_PENDING_APPROVAL'に設定されていることを確認 =====
    expect(evaluation_result.evaluation_status).toBe('EVALUATED_PENDING_APPROVAL');

    // ===== 検証4: 総合妥当性スコアが0～100の範囲で計算されていることを確認 =====
    // feasibility_evaluation の overall_feasibility_score (0.88) を 0～100 にスケール: 88
    expect(evaluation_result.overall_feasibility_score).toBe(88);

    // ===== 検証5: 提案メタデータ（evaluate_at, evaluation_status, reasoning_summary）が記録されていることを確認 =====
    expect(evaluation_result.evaluate_at).toEqual(evaluate_at);
    expect(evaluation_result.evaluation_status).toBe('EVALUATED_PENDING_APPROVAL');
    expect(evaluation_result.reasoning_summary).toBe(
      '過去12件の類似案件（ERP導入、製造業）では88%の成功率を確認しました。提案の予算は顧客制約内であり、技術的な実装可能性も高くなっています。ただし、実装期間が6ヶ月という制約がある点が若干のリスク要因です。並行フェーズでの導入を検討することで、リスク軽減が可能です。'
    );

    // ===== 検証6: 予算適合度、タイムライン適合度、技術適合度が個別に記録されていることを確認 =====
    expect(evaluation_result.feasibility_evaluation).toEqual(
      expect.objectContaining({
        budget_fit: 0.95,
        timeline_fit: 0.78,
        technical_fit: 0.90,
      })
    );

    // ===== 検証7: リスク要因が記録されていることを確認 =====
    expect(evaluation_result.risk_factors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          risk_id: 'RISK-ERP-TIMELINE',
          risk_name: '実装期間の短さ',
          severity: 'MEDIUM',
        }),
      ])
    );

    // ===== 検証8: 承認前状態のまま、レポート生成が内部推奨パターンマスタを参照して進行することを確認 =====
    const report_generation_result = await evaluateProposalValidity(
      {
        ...proposal_pending,
        evaluation_status: 'EVALUATED_PENDING_APPROVAL',
      },
      ai_recommendation_mock,
      file_storage_adapter_mock,
      internal_pattern_master_mock,
      evaluate_at
    );

    // レポート生成が試行された場合、内部パターンマスタが参照され、
    // メタフラグ（approval_pending=true）が付与されることを確認
    expect(report_generation_result.report_metadata).toEqual(
      expect.objectContaining({
        approval_pending: true,
        generated_from_internal_master: true,
      })
    );

    // ===== 検証9: 提案ステータスは依然として'PENDING'のままであることを確認 =====
    expect(evaluation_result.proposal_status).toBe('PENDING');
  });
});