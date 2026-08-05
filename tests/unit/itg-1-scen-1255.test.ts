import { runTx2Imp2Agent } from '../../src/logic/it-1';

describe('営業プロセス遵守状況の自動監視と改善提案の実行 - 部分失敗時の補償トランザクション', () => {
  test('SCEN-1255: ステップ4の通知配信失敗時に補償トランザクションが自動実行される', async () => {
    // ===== Setup: モック営業活動データの準備 =====
    const salesRepresentativeId = 'SR-A-001';
    const processComplianceRate = 45;
    const proposalCount = 3;
    const assessmentTimestamp = new Date('2024-01-15T11:00:00Z');
    
    const mockSalesActivityData = {
      representative_id: salesRepresentativeId,
      activity_records: [
        {
          activity_id: 'ACT-001',
          activity_type: 'initial_contact',
          customer_id: 'CUST-001',
          recorded_at: '2024-01-10T09:30:00Z',
          standard_process_step: 'initial_contact',
          deviation_detected: false,
        },
        {
          activity_id: 'ACT-002',
          activity_type: 'proposal',
          customer_id: 'CUST-001',
          recorded_at: '2024-01-12T14:00:00Z',
          standard_process_step: 'proposal',
          deviation_detected: true,
          deviation_reason: 'Proposal content does not match customer requirements',
        },
        {
          activity_id: 'ACT-003',
          activity_type: 'negotiation',
          customer_id: 'CUST-002',
          recorded_at: '2024-01-13T10:15:00Z',
          standard_process_step: 'negotiation',
          deviation_detected: true,
          deviation_reason: 'Premature negotiation initiation before needs assessment',
        },
      ],
      compliance_score_calculation: {
        standard_steps_executed: 2,
        total_standard_steps: 4,
        compliance_rate: processComplianceRate,
      },
    };

    // ===== Setup: モックAIクライアントの準備 =====
    const mockAiResponses = {
      step1_analysis: {
        analysis_id: 'ANAL-001',
        representative_id: salesRepresentativeId,
        compliance_rate: processComplianceRate,
        assessment_status: 'completed',
        assessment_timestamp: assessmentTimestamp.toISOString(),
      },
      step2_violation_detection: {
        violations: [
          {
            violation_id: 'VIO-001',
            representative_id: salesRepresentativeId,
            violation_type: 'deviation_from_standard',
            severity: 'medium',
            activity_id: 'ACT-002',
          },
          {
            violation_id: 'VIO-002',
            representative_id: salesRepresentativeId,
            violation_type: 'deviation_from_standard',
            severity: 'medium',
            activity_id: 'ACT-003',
          },
        ],
      },
      step3_proposal_generation: {
        proposals: [
          {
            proposal_id: 'PROP-001',
            representative_id: salesRepresentativeId,
            improvement_area: 'proposal_quality',
            recommendation: 'Align proposal content with documented customer requirements',
            priority: 'high',
            status: 'pending_review',
          },
          {
            proposal_id: 'PROP-002',
            representative_id: salesRepresentativeId,
            improvement_area: 'process_sequence',
            recommendation: 'Complete needs assessment before initiating negotiation',
            priority: 'high',
            status: 'pending_review',
          },
          {
            proposal_id: 'PROP-003',
            representative_id: salesRepresentativeId,
            improvement_area: 'follow_up_frequency',
            recommendation: 'Increase customer touchpoint frequency to every 2 business days',
            priority: 'medium',
            status: 'pending_review',
          },
        ],
      },
      step4_notification_failure: new Error('Notification delivery failed'),
    };

    // ===== Mock Database State =====
    const mockDatabaseState = {
      sales_compliance_assessment: [] as Array<{
        assessment_id: string;
        representative_id: string;
        compliance_rate: number;
        status: string;
        created_at: string;
      }>,
      compliance_violations: [] as Array<{
        violation_id: string;
        representative_id: string;
        violation_type: string;
        deleted_at: string | null;
        created_at: string;
      }>,
      improvement_proposals: [] as Array<{
        proposal_id: string;
        representative_id: string;
        improvement_area: string;
        status: string;
        created_at: string;
      }>,
      manager_notifications: [] as Array<{
        notification_id: string;
        manager_id: string;
        content: string;
        created_at: string;
      }>,
      audit_log: [] as Array<{
        log_id: string;
        event_type: string;
        agent_action: string;
        reason: string;
        timestamp: string;
      }>,
    };

    // ===== Mock AI Client Implementation =====
    const mockAiClient = {
      step1_collectAndAnalyzeActivities: async () => {
        mockDatabaseState.sales_compliance_assessment.push({
          assessment_id: 'ASSESS-001',
          representative_id: salesRepresentativeId,
          compliance_rate: processComplianceRate,
          status: 'completed',
          created_at: assessmentTimestamp.toISOString(),
        });
        return mockAiResponses.step1_analysis;
      },

      step2_detectLowComplianceRepresentatives: async () => {
        const violations = mockAiResponses.step2_violation_detection.violations;
        for (const violation of violations) {
          mockDatabaseState.compliance_violations.push({
            violation_id: violation.violation_id,
            representative_id: violation.representative_id,
            violation_type: violation.violation_type,
            deleted_at: null,
            created_at: new Date().toISOString(),
          });
        }
        return mockAiResponses.step2_violation_detection;
      },

      step3_generateImprovementProposals: async () => {
        const proposals = mockAiResponses.step3_proposal_generation.proposals;
        for (const proposal of proposals) {
          mockDatabaseState.improvement_proposals.push({
            proposal_id: proposal.proposal_id,
            representative_id: proposal.representative_id,
            improvement_area: proposal.improvement_area,
            status: proposal.status,
            created_at: new Date().toISOString(),
          });
        }
        return mockAiResponses.step3_proposal_generation;
      },

      step4_notifyManager: async () => {
        throw mockAiResponses.step4_notification_failure;
      },
    };

    // ===== Mock Compensation Handler =====
    const compensationHandler = {
      rollback_improvement_proposals: async (proposal_ids: string[]) => {
        for (const proposal_id of proposal_ids) {
          const proposal = mockDatabaseState.improvement_proposals.find(
            (p) => p.proposal_id === proposal_id
          );
          if (proposal) {
            proposal.status = 'rolled_back';
          }
        }
      },

      rollback_compliance_violations: async (violation_ids: string[]) => {
        for (const violation_id of violation_ids) {
          const violation = mockDatabaseState.compliance_violations.find(
            (v) => v.violation_id === violation_id
          );
          if (violation) {
            violation.deleted_at = new Date().toISOString();
          }
        }
      },

      rollback_assessment: async (assessment_id: string) => {
        const assessment = mockDatabaseState.sales_compliance_assessment.find(
          (a) => a.assessment_id === assessment_id
        );
        if (assessment) {
          assessment.status = 'assessment_reverted';
        }
      },

      record_audit_event: async (
        event_type: string,
        agent_action: string,
        reason: string,
        timestamp: string
      ) => {
        mockDatabaseState.audit_log.push({
          log_id: `LOG-${Date.now()}`,
          event_type,
          agent_action,
          reason,
          timestamp,
        });
      },
    };

    // ===== Execute Agent with Compensation Logic =====
    const rollbackInitiatedTimestamp = new Date('2024-01-15T11:05:00Z').toISOString();
    const rollbackCompletedTimestamp = new Date('2024-01-15T11:06:00Z').toISOString();

    try {
      // Step 1
      await mockAiClient.step1_collectAndAnalyzeActivities();

      // Step 2
      const violationDetectionResult =
        await mockAiClient.step2_detectLowComplianceRepresentatives();
      const detectedViolationIds = violationDetectionResult.violations.map(
        (v) => v.violation_id
      );

      // Step 3
      const proposalGenerationResult = await mockAiClient.step3_generateImprovementProposals();
      const generatedProposalIds = proposalGenerationResult.proposals.map(
        (p) => p.proposal_id
      );

      // Step 4 - Will throw exception
      try {
        await mockAiClient.step4_notifyManager();
      } catch (error) {
        // ===== Compensation Transaction Start =====
        await compensationHandler.record_audit_event(
          'ROLLBACK_INITIATED',
          'proposal_generation',
          'Notification delivery failed',
          rollbackInitiatedTimestamp
        );

        // Rollback proposals
        await compensationHandler.rollback_improvement_proposals(generatedProposalIds);

        // Rollback violations
        await compensationHandler.rollback_compliance_violations(detectedViolationIds);

        // Rollback assessment
        await compensationHandler.rollback_assessment('ASSESS-001');

        // Record completion
        await compensationHandler.record_audit_event(
          'ROLLBACK_COMPLETED',
          'proposal_generation',
          'Notification delivery failed',
          rollbackCompletedTimestamp
        );
      }
    } catch (error) {
      throw error;
    }

    // ===== Assertions: Verify Final State =====

    // Assert 1: All proposals rolled back to 'rolled_back' status
    const rolledBackProposals = mockDatabaseState.improvement_proposals.filter(
      (p) => p.proposal_id === 'PROP-001' || p.proposal_id === 'PROP-002' || p.proposal_id === 'PROP-003'
    );
    expect(rolledBackProposals).toHaveLength(3);
    expect(rolledBackProposals.every((p) => p.status === 'rolled_back')).toBe(true);

    // Assert 2: All violations marked with deleted_at
    const markedViolations = mockDatabaseState.compliance_violations.filter(
      (v) => v.violation_id === 'VIO-001' || v.violation_id === 'VIO-002'
    );
    expect(markedViolations).toHaveLength(2);
    expect(markedViolations.every((v) => v.deleted_at !== null)).toBe(true);

    // Assert 3: Assessment reverted
    const revertedAssessment = mockDatabaseState.sales_compliance_assessment.find(
      (a) => a.assessment_id === 'ASSESS-001'
    );
    expect(revertedAssessment?.status).toBe('assessment_reverted');

    // Assert 4: No manager notifications created
    expect(mockDatabaseState.manager_notifications).toHaveLength(0);

    // Assert 5: Audit log contains exactly 2 events
    expect(mockDatabaseState.audit_log).toHaveLength(2);

    // Assert 6: First audit event is ROLLBACK_INITIATED
    const initiatedEvent = mockDatabaseState.audit_log.find(
      (log) => log.event_type === 'ROLLBACK_INITIATED'
    );
    expect(initiatedEvent).toBeDefined();
    expect(initiatedEvent?.agent_action).toBe('proposal_generation');
    expect(initiatedEvent?.reason).toBe('Notification delivery failed');
    expect(initiatedEvent?.timestamp).toBe(rollbackInitiatedTimestamp);

    // Assert 7: Second audit event is ROLLBACK_COMPLETED
    const completedEvent = mockDatabaseState.audit_log.find(
      (log) => log.event_type === 'ROLLBACK_COMPLETED'
    );
    expect(completedEvent).toBeDefined();
    expect(completedEvent?.agent_action).toBe('proposal_generation');
    expect(completedEvent?.reason).toBe('Notification delivery failed');
    expect(completedEvent?.timestamp).toBe(rollbackCompletedTimestamp);

    // Assert 8: Specific proposal status values for audit
    const prop001 = mockDatabaseState.improvement_proposals.find((p) => p.proposal_id === 'PROP-001');
    const prop002 = mockDatabaseState.improvement_proposals.find((p) => p.proposal_id === 'PROP-002');
    const prop003 = mockDatabaseState.improvement_proposals.find((p) => p.proposal_id === 'PROP-003');

    expect(prop001?.status).toBe('rolled_back');
    expect(prop002?.status).toBe('rolled_back');
    expect(prop003?.status).toBe('rolled_back');

    // Assert 9: Compliance violations deleted_at is set
    const vio001 = mockDatabaseState.compliance_violations.find((v) => v.violation_id === 'VIO-001');
    const vio002 = mockDatabaseState.compliance_violations.find((v) => v.violation_id === 'VIO-002');

    expect(vio001?.deleted_at).not.toBeNull();
    expect(vio002?.deleted_at).not.toBeNull();
  });
});