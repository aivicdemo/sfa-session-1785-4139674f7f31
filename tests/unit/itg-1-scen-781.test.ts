import { describe, test, expect } from '@jest/globals';
import { selectAnalysisIndicators } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-781
  test('行動パターン分析対象指標の自動選定機能 - 営業プロセス標準書の提案成功率閾値49%が反映される', () => {
    const processStandardBook = {
      stages: [
        {
          stageId: 'stage-001',
          stageName: '初回接触',
          kpiCriteria: {
            contactFrequency: {
              metricName: '初回接触頻度',
              threshold: 5,
              unit: '件/月'
            }
          }
        },
        {
          stageId: 'stage-002',
          stageName: '提案',
          kpiCriteria: {
            proposalSuccessRate: {
              metricName: '提案成功率',
              threshold: 0.49,
              unit: '%'
            }
          }
        },
        {
          stageId: 'stage-003',
          stageName: '交渉',
          kpiCriteria: {
            negotiationDuration: {
              metricName: '交渉期間',
              threshold: 14,
              unit: '日'
            }
          }
        },
        {
          stageId: 'stage-004',
          stageName: '成約',
          kpiCriteria: {
            closingRate: {
              metricName: '成約率',
              threshold: 0.30,
              unit: '%'
            }
          }
        }
      ]
    };

    const correlationAnalysisData = {
      performanceMetrics: [
        {
          metricId: 'metric-001',
          metricName: '初回接触頻度',
          correlationWithClosing: 0.65
        },
        {
          metricId: 'metric-002',
          metricName: '提案成功率',
          correlationWithClosing: 0.82
        },
        {
          metricId: 'metric-003',
          metricName: '交渉期間',
          correlationWithClosing: 0.58
        },
        {
          metricId: 'metric-004',
          metricName: '成約率',
          correlationWithClosing: 0.95
        }
      ]
    };

    const selectedIndicators = selectAnalysisIndicators(
      processStandardBook,
      correlationAnalysisData
    );

    expect(selectedIndicators).toBeDefined();
    expect(Array.isArray(selectedIndicators)).toBe(true);
    expect(selectedIndicators.length).toBeGreaterThan(0);

    const proposalSuccessRateIndicator = selectedIndicators.find(
      (indicator) => indicator.metricName === '提案成功率'
    );

    expect(proposalSuccessRateIndicator).toBeDefined();
    expect(proposalSuccessRateIndicator?.threshold).toBe(0.49);
    expect(proposalSuccessRateIndicator?.metricName).toBe('提案成功率');
  });
});