import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateDeviationDegree } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  let standardProcessDefinition: {
    steps: Array<{
      stepId: string;
      stepName: string;
      sequenceOrder: number;
      requiredItems: string[];
    }>;
  };

  let salesCaseData: {
    caseId: string;
    proposalContent: {
      steps: Array<{
        stepId: string;
        stepName: string;
        sequenceOrder: number;
        items: string[];
      }>;
    };
  };

  beforeEach(() => {
    standardProcessDefinition = {
      steps: [
        {
          stepId: 'step_001',
          stepName: 'Initial Contact',
          sequenceOrder: 1,
          requiredItems: ['greeting', 'needs_assessment'],
        },
        {
          stepId: 'step_002',
          stepName: 'Proposal Presentation',
          sequenceOrder: 2,
          requiredItems: ['solution_overview', 'pricing_terms'],
        },
        {
          stepId: 'step_003',
          stepName: 'Negotiation',
          sequenceOrder: 3,
          requiredItems: ['objection_handling', 'deal_terms'],
        },
        {
          stepId: 'step_004',
          stepName: 'Closing',
          sequenceOrder: 4,
          requiredItems: ['final_agreement', 'contract_signature'],
        },
      ],
    };

    salesCaseData = {
      caseId: 'case_20240115_001',
      proposalContent: {
        steps: [
          {
            stepId: 'step_001',
            stepName: 'Initial Contact',
            sequenceOrder: 1,
            items: ['greeting', 'needs_assessment'],
          },
          {
            stepId: 'step_002',
            stepName: 'Proposal Presentation',
            sequenceOrder: 2,
            items: ['solution_overview', 'pricing_terms'],
          },
          {
            stepId: 'step_003',
            stepName: 'Negotiation',
            sequenceOrder: 3,
            items: ['objection_handling', 'deal_terms'],
          },
          {
            stepId: 'step_004',
            stepName: 'Closing',
            sequenceOrder: 4,
            items: ['final_agreement', 'contract_signature'],
          },
        ],
      },
    };
  });

  // SCEN-596
  it('should return deviation degree of 0 when proposal content perfectly matches standard process definition', () => {
    const result = calculateDeviationDegree(
      salesCaseData.proposalContent,
      standardProcessDefinition
    );

    expect(result).toBe(0);
  });
});