import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { runTx2Imp2Agent } from '../../src/logic/it-1';

describe('営業プロセス遵守状況の自動監視と改善提案の実行', () => {
  // SCEN-1242
  it('should detect low-compliance sales representatives and generate improvement proposals', async () => {
    // ===== 1. Mock Sales Activity Data Setup =====
    const sales_activity_data = [
      {
        representative_id: 'REP_A',
        representative_name: '営業担当者A',
        process_step_completion: {
          initial_contact: 1,
          needs_analysis: 1,
          proposal: 0.8,
          follow_up: 0.6,
        },
        compliance_rate: 0.72,
        total_deals: 25,
      },
      {
        representative_id: 'REP_B',
        representative_name: '営業担当者B',
        process_step_completion: {
          initial_contact: 1,
          needs_analysis: 1,
          proposal: 0.95,
          follow_up: 0.8,
        },
        compliance_rate: 0.91,
        total_deals: 28,
      },
      {
        representative_id: 'REP_C',
        representative_name: '営業担当者C',
        process_step_completion: {
          initial_contact: 0.7,
          needs_analysis: 0.6,
          proposal: 0.65,
          follow_up: 0.55,
        },
        compliance_rate: 0.65,
        total_deals: 20,
      },
    ];

    // ===== 2. Standard Process Definition Setup =====
    const process_definition = {
      process_id: 'PROC_STD_001',
      process_name: '標準営業プロセス',
      steps: [
        {
          step_id: 'STEP_001',
          step_name: '初回接触',
          sequence: 1,
          completion_weight: 0.25,
        },
        {
          step_id: 'STEP_002',
          step_name: 'ニーズ把握',
          sequence: 2,
          completion_weight: 0.25,
        },
        {
          step_id: 'STEP_003',
          step_name: '提案',
          sequence: 3,
          completion_weight: 0.25,
        },
        {
          step_id: 'STEP_004',
          step_name: 'フォローアップ',
          sequence: 4,
          completion_weight: 0.25,
        },
      ],
      minimum_compliance_threshold: 0.9,
    };

    // ===== 3. Success Case Database Setup =====
    const success_case_database = [
      {
        case_id: 'CASE_001',
        representative_id: 'REP_SUCCESS_001',
        compliance_rate: 0.96,
        sales_result: true,
        deal_amount: 5000000,
        process_steps_executed: [
          { step_id: 'STEP_001', duration_minutes: 25, completed: true },
          { step_id: 'STEP_002', duration_minutes: 45, completed: true },
          { step_id: 'STEP_003', duration_minutes: 60, completed: true },
          { step_id: 'STEP_004', duration_minutes: 30, completed: true },
        ],
      },
      {
        case_id: 'CASE_002',
        representative_id: 'REP_SUCCESS_002',
        compliance_rate: 0.97,
        sales_result: true,
        deal_amount: 3500000,
        process_steps_executed: [
          { step_id: 'STEP_001', duration_minutes: 30, completed: true },
          { step_id: 'STEP_002', duration_minutes: 50, completed: true },
          { step_id: 'STEP_003', duration_minutes: 55, completed: true },
          { step_id: 'STEP_004', duration_minutes: 40, completed: true },
        ],
      },
      {
        case_id: 'CASE_003',
        representative_id: 'REP_SUCCESS_003',
        compliance_rate: 0.95,
        sales_result: true,
        deal_amount: 4200000,
        process_steps_executed: [
          { step_id: 'STEP_001', duration_minutes: 28, completed: true },
          { step_id: 'STEP_002', duration_minutes: 48, completed: true },
          { step_id: 'STEP_003', duration_minutes: 58, completed: true },
          { step_id: 'STEP_004', duration_minutes: 35, completed: true },
        ],
      },
      {
        case_id: 'CASE_004',
        representative_id: 'REP_SUCCESS_004',
        compliance_rate: 0.96,
        sales_result: true,
        deal_amount: 6100000,
        process_steps_executed: [
          { step_id: 'STEP_001', duration_minutes: 26, completed: true },
          { step_id: 'STEP_002', duration_minutes: 52, completed: true },
          { step_id: 'STEP_003', duration_minutes: 62, completed: true },
          { step_id: 'STEP_004', duration_minutes: 38, completed: true },
        ],
      },
      {
        case_id: 'CASE_005',
        representative_id: 'REP_SUCCESS_005',
        compliance_rate: 0.95,
        sales_result: true,
        deal_amount: 4800000,
        process_steps_executed: [
          { step_id: 'STEP_001', duration_minutes: 29, completed: true },
          { step_id: 'STEP_002', duration_minutes: 46, completed: true },
          { step_id: 'STEP_003', duration_minutes: 59, completed: true },
          { step_id: 'STEP_004', duration_minutes: 37, completed: true },
        ],
      },
    ];

    // ===== 4. AI Client Configuration =====
    const ai_client_config = {
      inference_accuracy_rate: 0.95,
      model_version: 'TX2_IMP2_V1.0',
      temperature: 0.3,
      max_tokens: 2048,
    };

    // ===== 5. Execute Agent =====
    const agent_result = await runTx2Imp2Agent({
      sales_activity_data,
      process_definition,
      success_case_database,
      ai_client_config,
      execution_timestamp: new Date('2024-06-15T09:00:00Z'),
    });

    // ===== 6. Assertion: Data Collection and Analysis Execution =====
    expect(agent_result.agent_execution_completed).toBe(true);
    expect(agent_result.data_collection_status).toBe('COMPLETED');
    expect(agent_result.process_compliance_analysis_status).toBe('COMPLETED');

    // ===== 7. Assertion: Low-Compliance Representative Detection =====
    expect(agent_result.detected_representatives).toBeDefined();
    expect(agent_result.detected_representatives.length).toBeGreaterThanOrEqual(1);

    const low_compliance_rep = agent_result.detected_representatives.find(
      (rep: any) => rep.representative_id === 'REP_C'
    );
    expect(low_compliance_rep).toBeDefined();
    expect(low_compliance_rep.representative_id).toBe('REP_C');
    expect(low_compliance_rep.compliance_rate).toBe(0.65);
    expect(low_compliance_rep.detection_reason).toMatch(/遵守率|コンプライアンス|低い/);

    // ===== 8. Assertion: Improvement Opportunities Detection =====
    expect(agent_result.detected_improvement_opportunities).toBeDefined();
    expect(agent_result.detected_improvement_opportunities.length).toBeGreaterThanOrEqual(1);

    const rep_c_opportunities = agent_result.detected_improvement_opportunities.filter(
      (opp: any) => opp.representative_id === 'REP_C'
    );
    expect(rep_c_opportunities.length).toBeGreaterThanOrEqual(1);
    expect(rep_c_opportunities[0].opportunity_type).toMatch(/プロセス|ステップ|改善/);

    // ===== 9. Assertion: Improvement Proposal Generation (3+ proposals) =====
    expect(agent_result.generated_proposals).toBeDefined();
    expect(agent_result.generated_proposals.length).toBeGreaterThanOrEqual(3);

    const rep_c_proposals = agent_result.generated_proposals.filter(
      (proposal: any) => proposal.target_representative_id === 'REP_C'
    );
    expect(rep_c_proposals.length).toBeGreaterThanOrEqual(3);

    // Proposal 1: Needs Analysis Step Enhancement
    const proposal_1 = rep_c_proposals.find(
      (p: any) => p.proposal_category === 'NEEDS_ANALYSIS_ENHANCEMENT'
    );
    expect(proposal_1).toBeDefined();
    expect(proposal_1.proposal_content).toMatch(/ニーズ把握|詳細化|潜在ニーズ/);
    expect(proposal_1.execution_priority).toMatch(/HIGH|MEDIUM|LOW/);

    // Proposal 2: Initial Contact Process Optimization
    const proposal_2 = rep_c_proposals.find(
      (p: any) => p.proposal_category === 'INITIAL_CONTACT_OPTIMIZATION'
    );
    expect(proposal_2).toBeDefined();
    expect(proposal_2.proposal_content).toMatch(/初回接触|事前リサーチ|業界背景/);

    // Proposal 3: Process Duration Adjustment
    const proposal_3 = rep_c_proposals.find(
      (p: any) => p.proposal_category === 'PROCESS_DURATION_ADJUSTMENT'
    );
    expect(proposal_3).toBeDefined();
    expect(proposal_3.proposal_content).toMatch(/時間|延長|分/);

    // ===== 10. Assertion: Proposal Manager Review Flag =====
    rep_c_proposals.forEach((proposal: any) => {
      expect(proposal.manager_review_required).toBe(true);
      expect(proposal.manager_review_flag).toBeDefined();
      expect(proposal.manager_review_flag).toMatch(/PENDING|REQUIRED/);
    });

    // ===== 11. Assertion: Audit Log Recording =====
    expect(agent_result.audit_log).toBeDefined();
    expect(agent_result.audit_log.execution_event).toBe('Tx2Imp2Agent_EXECUTION');
    expect(agent_result.audit_log.detected_representative_count).toBe(1);
    expect(agent_result.audit_log.detected_representative_ids).toContain('REP_C');
    expect(agent_result.audit_log.generated_proposal_count).toBeGreaterThanOrEqual(3);
    expect(agent_result.audit_log.inference_accuracy_rate).toBe(0.95);
    expect(agent_result.audit_log.execution_timestamp).toBe('2024-06-15T09:00:00Z');
    expect(agent_result.audit_log.agent_status).toBe('COMPLETED');

    // ===== 12. Assertion: No Exception or Escalation =====
    expect(agent_result.escalation_required).toBe(false);
    expect(agent_result.error_occurred).toBe(false);
    expect(agent_result.error_message).toBeUndefined();
    expect(agent_result.exception_type).toBeUndefined();

    // ===== 13. Assertion: Proposal Quality and Content Validation =====
    agent_result.generated_proposals.forEach((proposal: any) => {
      expect(proposal.proposal_id).toBeDefined();
      expect(proposal.target_representative_id).toBeDefined();
      expect(proposal.proposal_content).toBeDefined();
      expect(proposal.proposal_content.length).toBeGreaterThan(0);
      expect(proposal.success_case_reference).toBeDefined();
      expect(proposal.success_case_reference.length).toBeGreaterThan(0);
      expect(proposal.estimated_compliance_improvement).toBeGreaterThan(0);
      expect(proposal.estimated_compliance_improvement).toBeLessThanOrEqual(0.35);
    });

    // ===== 14. Assertion: Success Case Comparison Execution =====
    expect(agent_result.success_case_comparison_executed).toBe(true);
    expect(agent_result.success_case_comparison_result).toBeDefined();
    expect(agent_result.success_case_comparison_result.average_success_compliance_rate).toBeGreaterThanOrEqual(
      0.95
    );
    expect(
      agent_result.success_case_comparison_result.compliance_gap_with_rep_c
    ).toBeCloseTo(0.3, 1);

    // ===== 15. Assertion: Manager Reporting Mark =====
    expect(agent_result.manager_reporting_marked).toBe(true);
    expect(agent_result.manager_reporting_priority).toMatch(/HIGH|URGENT/);
    expect(agent_result.manager_report_content).toBeDefined();
    expect(agent_result.manager_report_content).toMatch(/REP_C|営業担当者C|改善提案/);
  });
});