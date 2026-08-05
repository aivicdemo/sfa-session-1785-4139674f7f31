import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeCorrelationBetweenDeviationAndContractResult } from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('営業プロセス標準書との乖離度と成約実績の相関分析', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-1167
  test('標準プロセスからの乖離度が100%（完全乖離）の場合、相関分析結果に反映される', async () => {
    const salesRepId = 'SR-001';
    const salesRepName = '営業太郎';
    const analysisStartDate = '2023-07-01';
    const analysisEndDate = '2024-01-31';
    const deviationPercentage = 100;
    const standardStepCount = 4;
    const actualStepCount = 0;
    const contractCount = 12;
    const statisticalMethod = 'pearson_correlation';
    const correlationCoefficient = -0.85;
    const pValue = 0.0032;
    const datasetId = 'dataset-2024-01-001';
    const auditLogId = 'audit-2024-01-001';

    const inputData = {
      sales_rep_id: salesRepId,
      sales_rep_name: salesRepName,
      analysis_start_date: analysisStartDate,
      analysis_end_date: analysisEndDate,
      deviation_percentage: deviationPercentage,
      standard_step_count: standardStepCount,
      actual_step_count: actualStepCount,
      contract_count: contractCount,
      period_months: 7,
    };

    const mockAuditLog = {
      audit_log_id: auditLogId,
      analysis_timestamp: '2024-01-31T15:30:00Z',
      dataset_id: datasetId,
      statistical_method: statisticalMethod,
      parameters: {
        deviation_percentage: deviationPercentage,
        standard_step_count: standardStepCount,
        actual_step_count: actualStepCount,
        contract_count: contractCount,
        period_months: 7,
      },
      calculation_logic: 'Pearson correlation coefficient computed on deviation vs contract rate',
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockAuditLog), { status: 200 });

    const result = await analyzeCorrelationBetweenDeviationAndContractResult(inputData);

    expect(result).toBeDefined();
    expect(result.sales_rep_id).toBe(salesRepId);
    expect(result.deviation_percentage).toBe(deviationPercentage);
    expect(result.correlation_coefficient).toBe(correlationCoefficient);
    expect(typeof result.correlation_coefficient).toBe('number');
    expect(Number.isNaN(result.correlation_coefficient)).toBe(false);
    expect(result.correlation_coefficient).not.toBeNull();

    expect(result.deviation_classification).toBe('complete_deviation');
    expect(result.contract_correlation_classification).toBe('complete_deviation_correlation_pattern');
    expect(result.contract_relationship).toBe('maximum_deviation_contract_correlation');

    expect(result.audit_log_id).toBe(auditLogId);
    expect(result.dataset_id).toBe(datasetId);
    expect(result.statistical_method).toBe(statisticalMethod);
    expect(result.p_value).toBe(pValue);
    expect(result.analysis_timestamp).toBe('2024-01-31T15:30:00Z');

    expect(result.audit_parameters).toEqual({
      deviation_percentage: deviationPercentage,
      standard_step_count: standardStepCount,
      actual_step_count: actualStepCount,
      contract_count: contractCount,
      period_months: 7,
    });

    expect(result.calculation_logic).toBe('Pearson correlation coefficient computed on deviation vs contract rate');
    expect(Array.isArray(result.audit_log_records)).toBe(true);
    expect(result.audit_log_records.length).toBeGreaterThan(0);

    const auditRecord = result.audit_log_records[0];
    expect(auditRecord.sales_rep_id).toBe(salesRepId);
    expect(auditRecord.dataset_id).toBe(datasetId);
    expect(auditRecord.statistical_method).toBe(statisticalMethod);
  });
});