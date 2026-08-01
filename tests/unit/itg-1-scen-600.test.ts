import { evaluateProblemDetectionResults } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-600: 複数の検出結果が同一営業担当者について記録されている場合すべてが判定される', () => {
    const sales_rep_id = 'tanaka_taro_001';
    const detection_results = [
      {
        detection_id: 'DET-001',
        sales_rep_id: sales_rep_id,
        detection_type: 'customer_contact_frequency_low',
        detected_at: '2024-01-15T10:00:00Z',
        severity_level: null as string | null,
        requires_action: null as boolean | null,
      },
      {
        detection_id: 'DET-002',
        sales_rep_id: sales_rep_id,
        detection_type: 'proposal_document_missing',
        detected_at: '2024-01-15T10:15:00Z',
        severity_level: null as string | null,
        requires_action: null as boolean | null,
      },
      {
        detection_id: 'DET-003',
        sales_rep_id: sales_rep_id,
        detection_type: 'sales_target_not_achieved',
        detected_at: '2024-01-15T10:30:00Z',
        severity_level: null as string | null,
        requires_action: null as boolean | null,
      },
    ];

    const evaluated_results = evaluateProblemDetectionResults({
      sales_rep_id: sales_rep_id,
      detection_results: detection_results,
    });

    expect(evaluated_results.length).toBe(3);

    expect(evaluated_results[0]).toEqual({
      detection_id: 'DET-001',
      sales_rep_id: sales_rep_id,
      detection_type: 'customer_contact_frequency_low',
      detected_at: '2024-01-15T10:00:00Z',
      severity_level: 'high',
      requires_action: true,
    });

    expect(evaluated_results[1]).toEqual({
      detection_id: 'DET-002',
      sales_rep_id: sales_rep_id,
      detection_type: 'proposal_document_missing',
      detected_at: '2024-01-15T10:15:00Z',
      severity_level: 'medium',
      requires_action: true,
    });

    expect(evaluated_results[2]).toEqual({
      detection_id: 'DET-003',
      sales_rep_id: sales_rep_id,
      detection_type: 'sales_target_not_achieved',
      detected_at: '2024-01-15T10:30:00Z',
      severity_level: 'medium',
      requires_action: true,
    });

    const all_evaluated = evaluated_results.every(
      (result) =>
        result.severity_level !== null &&
        result.requires_action !== null
    );
    expect(all_evaluated).toBe(true);

    const all_detection_ids = evaluated_results.map((r) => r.detection_id);
    expect(all_detection_ids).toContain('DET-001');
    expect(all_detection_ids).toContain('DET-002');
    expect(all_detection_ids).toContain('DET-003');
  });
});