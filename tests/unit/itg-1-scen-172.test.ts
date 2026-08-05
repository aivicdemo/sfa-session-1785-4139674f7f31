import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  analyzeProcessRequirements,
  type ProcessRequirementsInput,
  type ProcessRequirementsOutput,
} from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-172: [normal] KPI基準の要件仕様化機能 - KPI基準が0個定義されている場合、KPI基準なしの要件として正しく整理される
  test('KPI基準が0個の場合、要件仕様が正常に生成され、KPI基準セクションが空配列で返される', () => {
    const input: ProcessRequirementsInput = {
      processStages: [
        {
          stageId: 'stage_001',
          stageName: '初回接触',
          description: '新規顧客への初回接触',
          sequenceNumber: 1,
        },
        {
          stageId: 'stage_002',
          stageName: '提案',
          description: '顧客への提案実施',
          sequenceNumber: 2,
        },
        {
          stageId: 'stage_003',
          stageName: '交渉',
          description: '顧客との交渉',
          sequenceNumber: 3,
        },
        {
          stageId: 'stage_004',
          stageName: '成約',
          description: '案件成約',
          sequenceNumber: 4,
        },
      ],
      decisionCriteria: [
        {
          criteriaId: 'dc_001',
          criteriaName: '顧客興味度',
          condition: '顧客の反応が肯定的である',
          nextStage: 'stage_002',
        },
        {
          criteriaId: 'dc_002',
          criteriaName: '予算承認',
          condition: '顧客が予算承認を取得している',
          nextStage: 'stage_004',
        },
      ],
      kpiBaselines: [],
      dataItems: [
        {
          itemId: 'di_001',
          itemName: '顧客企業名',
          dataType: 'string',
          mandatory: true,
        },
        {
          itemId: 'di_002',
          itemName: '提案金額',
          dataType: 'number',
          mandatory: true,
        },
        {
          itemId: 'di_003',
          itemName: '成約日',
          dataType: 'date',
          mandatory: false,
        },
      ],
    };

    const output: ProcessRequirementsOutput = analyzeProcessRequirements(input);

    expect(output.requirementId).toBeDefined();
    expect(output.requirementId).toMatch(/^req_/);

    expect(output.generatedAt).toBeDefined();
    expect(typeof output.generatedAt).toBe('string');

    expect(output.processStages).toEqual(input.processStages);

    expect(output.decisionCriteria).toEqual(input.decisionCriteria);

    expect(output.kpiBaselinesStatus).toBe('KPI基準なし');
    expect(output.kpiBaselines).toEqual([]);
    expect(Array.isArray(output.kpiBaselines)).toBe(true);
    expect(output.kpiBaselines.length).toBe(0);

    expect(output.dataItems).toEqual(input.dataItems);

    expect(output.systemRequirements).toBeDefined();
    expect(Array.isArray(output.systemRequirements)).toBe(true);
    expect(output.systemRequirements.length).toBeGreaterThan(0);

    const hasProcessStageRequirement = output.systemRequirements.some(
      (req) => req.category === 'process_stage'
    );
    expect(hasProcessStageRequirement).toBe(true);

    const hasDecisionCriteriaRequirement = output.systemRequirements.some(
      (req) => req.category === 'decision_criteria'
    );
    expect(hasDecisionCriteriaRequirement).toBe(true);

    const hasDataItemRequirement = output.systemRequirements.some(
      (req) => req.category === 'data_item'
    );
    expect(hasDataItemRequirement).toBe(true);

    const hasKpiRequirement = output.systemRequirements.some(
      (req) => req.category === 'kpi_baseline'
    );
    if (hasKpiRequirement) {
      const kpiReq = output.systemRequirements.find(
        (req) => req.category === 'kpi_baseline'
      );
      expect(kpiReq?.requirementText).toMatch(/KPI基準/);
    }

    expect(output.validationStatus).toBe('valid');
  });
});