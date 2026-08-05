import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  analyzeSalesPerformanceWithDeduplication,
} from '../../src/logic/it-1-br-2-1-1';

const fetchMock = require('jest-fetch-mock');

describe('IT-1-BR-2-1-1: 営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-648: 顧客対応記録に重複データが含まれるとき、重複を除外して分析が実行される
  test('should deduplicate customer interaction records and generate accurate report metrics', () => {
    // Arrange: 重複を含む顧客対応記録データセット
    const duplicateInteractionRecord = {
      id: 'interaction_001',
      customerId: 'cust_100',
      salesRepId: 'sales_rep_a',
      interactionDate: '2024-01-15T09:00:00Z',
      interactionType: 'phone_call',
      notes: 'Initial contact regarding product inquiry',
    };

    const customerInteractionDataset = [
      {
        id: 'interaction_001_dup1',
        customerId: 'cust_100',
        salesRepId: 'sales_rep_a',
        interactionDate: '2024-01-15T09:00:00Z',
        interactionType: 'phone_call',
        notes: 'Initial contact regarding product inquiry',
        dealOutcome: 'no_outcome',
      },
      {
        id: 'interaction_001_dup2',
        customerId: 'cust_100',
        salesRepId: 'sales_rep_a',
        interactionDate: '2024-01-15T09:00:00Z',
        interactionType: 'phone_call',
        notes: 'Initial contact regarding product inquiry',
        dealOutcome: 'no_outcome',
      },
      {
        id: 'interaction_002',
        customerId: 'cust_101',
        salesRepId: 'sales_rep_a',
        interactionDate: '2024-01-16T10:30:00Z',
        interactionType: 'email',
        notes: 'Sent proposal document',
        dealOutcome: 'won',
      },
      {
        id: 'interaction_003',
        customerId: 'cust_102',
        salesRepId: 'sales_rep_b',
        interactionDate: '2024-01-17T14:00:00Z',
        interactionType: 'visit',
        notes: 'In-person meeting',
        dealOutcome: 'no_outcome',
      },
      {
        id: 'interaction_004',
        customerId: 'cust_103',
        salesRepId: 'sales_rep_b',
        interactionDate: '2024-01-18T11:00:00Z',
        interactionType: 'phone_call',
        notes: 'Follow-up call',
        dealOutcome: 'won',
      },
    ];

    const deduplicationConfig = {
      duplicateFields: [
        'customerId',
        'salesRepId',
        'interactionDate',
        'interactionType',
        'notes',
      ],
      keepFirst: true,
    };

    const analysisParams = {
      datasetPeriodStart: '2024-01-01T00:00:00Z',
      datasetPeriodEnd: '2024-01-31T23:59:59Z',
      analyzeByField: 'salesRepId',
    };

    // Act: 重複除外ロジックを含む分析実行
    const analysisReport = analyzeSalesPerformanceWithDeduplication(
      customerInteractionDataset,
      deduplicationConfig,
      analysisParams
    );

    // Assert: 重複が除外され、正確な件数ベースで分析が実行されることを検証

    // 1. 重複除外後のユニークな記録数を検証（元の5件から重複1件を除外して4件）
    expect(analysisReport.deduplicatedRecordCount).toBe(4);
    expect(analysisReport.removedDuplicateCount).toBe(1);

    // 2. 営業担当者別の成約実績を検証
    // sales_rep_a: interaction_002で1件成約（重複を含む元データでも1件）
    // sales_rep_b: interaction_004で1件成約
    const sales_rep_a_performance = analysisReport.performanceByRepId.find(
      (perf: any) => perf.salesRepId === 'sales_rep_a'
    );
    expect(sales_rep_a_performance).toBeDefined();
    expect(sales_rep_a_performance.totalInteractionCount).toBe(3); // dup1, dup2削除後は interaction_001, interaction_002の2件が正規化される = 2件
    expect(sales_rep_a_performance.totalInteractionCount).toBe(2); // 重複除外後: 2件
    expect(sales_rep_a_performance.wonDealsCount).toBe(1);
    expect(sales_rep_a_performance.winRate).toBe(0.5); // 1/2

    const sales_rep_b_performance = analysisReport.performanceByRepId.find(
      (perf: any) => perf.salesRepId === 'sales_rep_b'
    );
    expect(sales_rep_b_performance).toBeDefined();
    expect(sales_rep_b_performance.totalInteractionCount).toBe(2);
    expect(sales_rep_b_performance.wonDealsCount).toBe(1);
    expect(sales_rep_b_performance.winRate).toBe(0.5); // 1/2

    // 3. 顧客接触回数の集計を検証
    // cust_100: 重複除外後は1件（interaction_001_dup1またはdup2のうち1件残存）
    // cust_101: 1件
    // cust_102: 1件
    // cust_103: 1件
    // 合計: 4件（重複を除外した後）
    expect(analysisReport.totalUniqueCustomerTouchCount).toBe(4);

    // 4. 対応パターンの集計を検証
    const interactionTypeCounts = analysisReport.interactionPatternSummary;
    expect(interactionTypeCounts.phone_call).toBe(2); // interaction_001（重複1件除外後）と interaction_004
    expect(interactionTypeCounts.email).toBe(1); // interaction_002
    expect(interactionTypeCounts.visit).toBe(1); // interaction_003

    // 5. レポートに重複排除の監査情報が含まれることを検証
    expect(analysisReport.auditInfo).toBeDefined();
    expect(analysisReport.auditInfo.deduplicationApplied).toBe(true);
    expect(analysisReport.auditInfo.duplicateDetectionCriteria).toEqual(
      deduplicationConfig.duplicateFields
    );
    expect(analysisReport.auditInfo.originalRecordCount).toBe(5);
    expect(analysisReport.auditInfo.finalRecordCount).toBe(4);

    // 6. 全体の成約実績を検証（重複を除外した4件ベース）
    // won: 2件（interaction_002, interaction_004）
    // no_outcome: 2件（interaction_001の1件+interaction_003）
    expect(analysisReport.overallWonDealsCount).toBe(2);
    expect(analysisReport.overallNoOutcomeCount).toBe(2);
    expect(analysisReport.overallWinRate).toBe(0.5); // 2/4
  });
});