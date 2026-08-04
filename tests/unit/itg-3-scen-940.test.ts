import { describe, test, expect, beforeEach } from '@jest/globals';
import * as logic from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠情報の記録と追跡可能性', () => {
  let mockAIEngine: any;
  let mockRepository: any;
  let mockTraceabilityService: any;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
    };
    mockRepository = {
      save: jest.fn(),
      findByRecommendationId: jest.fn(),
    };
    mockTraceabilityService = {
      getRecommendationTrail: jest.fn(),
    };
  });

  // SCEN-940
  test('should record recommendation reasoning with full traceability and validate business effectiveness', async () => {
    // 準備: テストデータの構成
    const customerInfo = {
      customerId: 'CUST-2024-001',
      industry: 'IT',
      budget: 5000000,
      challenge: '業務効率化',
    };

    const pastSuccessPattern = {
      patternId: 'PATTERN-IT-001',
      similarityScore: 0.87,
      caseCount: 3,
    };

    const recommendationContent = {
      recommendationId: 'REC-2024-001',
      proposalContent: 'クラウドERPシステムA導入',
      confidenceScore: 0.89,
      similarPatternsCount: 3,
      generatedTimestamp: new Date('2024-06-15T10:30:00Z'),
      referencedPatternIds: ['PATTERN-IT-001', 'PATTERN-IT-002', 'PATTERN-IT-003'],
    };

    const reasoningExplanation = {
      selectionRationale: '類似度0.87の過去成功事例3件に基づいて信頼度0.89で選定',
      expectedBusinessEffect: 'IT業種向けの同種導入事例では平均35%の業務効率化が達成された実績がある',
    };

    // AIRecommendationEngineのスタブ設定
    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendationId: recommendationContent.recommendationId,
      proposalContent: recommendationContent.proposalContent,
      confidenceScore: recommendationContent.confidenceScore,
      similarPatternsCount: recommendationContent.similarPatternsCount,
      generatedTimestamp: recommendationContent.generatedTimestamp,
      referencedPatternIds: recommendationContent.referencedPatternIds,
      selectionRationale: reasoningExplanation.selectionRationale,
      expectedBusinessEffect: reasoningExplanation.expectedBusinessEffect,
    });

    // 推奨根拠情報の記録
    const savePayload = {
      recommendationId: recommendationContent.recommendationId,
      customerId: customerInfo.customerId,
      proposalContent: recommendationContent.proposalContent,
      reasoningExplanation: reasoningExplanation.selectionRationale,
      similarPatternsCount: recommendationContent.similarPatternsCount,
      confidenceScore: recommendationContent.confidenceScore,
      generatedTimestamp: recommendationContent.generatedTimestamp,
      referencedPatternIds: recommendationContent.referencedPatternIds,
    };

    mockRepository.save.mockResolvedValue({
      recordId: 'REASONING-2024-001',
      ...savePayload,
      savedAt: new Date('2024-06-15T10:30:05Z'),
    });

    // 推奨根拠テーブルからの取得
    mockRepository.findByRecommendationId.mockResolvedValue({
      recommendationId: recommendationContent.recommendationId,
      customerId: customerInfo.customerId,
      proposalContent: 'クラウドERPシステムA導入',
      reasoningExplanation: reasoningExplanation.selectionRationale,
      similarPatternsCount: 3,
      confidenceScore: 0.89,
      generatedTimestamp: new Date('2024-06-15T10:30:00Z'),
      referencedPatternIds: ['PATTERN-IT-001', 'PATTERN-IT-002', 'PATTERN-IT-003'],
    });

    // 推奨妥当性追跡機能のスタブ設定
    mockTraceabilityService.getRecommendationTrail.mockResolvedValue({
      recommendationId: recommendationContent.recommendationId,
      customerId: customerInfo.customerId,
      selectionRationale: '類似度0.87の過去成功事例3件に基づいて信頼度0.89で選定',
      expectedBusinessEffect: 'IT業種向けの同種導入事例では平均35%の業務効率化が達成された実績がある',
      traceabilityDetails: {
        baselineSimilarityScore: 0.87,
        confidenceScore: 0.89,
        matchedPatternCount: 3,
        industryBenchmark: {
          industry: 'IT',
          averageEfficiencyGain: 35,
          unit: 'percent',
        },
      },
    });

    // テスト実行: logicモジュールから記録処理を呼び出し
    const recordingResult = await logic.recordRecommendationReasoning(
      savePayload,
      mockRepository,
      mockAIEngine
    );

    // 記録結果の検証
    expect(recordingResult.recordId).toBe('REASONING-2024-001');
    expect(recordingResult.recommendationId).toBe('REC-2024-001');
    expect(recordingResult.customerId).toBe('CUST-2024-001');
    expect(recordingResult.proposalContent).toBe('クラウドERPシステムA導入');
    expect(recordingResult.similarPatternsCount).toBe(3);
    expect(recordingResult.confidenceScore).toBe(0.89);
    expect(recordingResult.generatedTimestamp).toEqual(
      new Date('2024-06-15T10:30:00Z')
    );
    expect(recordingResult.referencedPatternIds).toEqual([
      'PATTERN-IT-001',
      'PATTERN-IT-002',
      'PATTERN-IT-003',
    ]);

    // 推奨根拠テーブルからの検索と検証
    const retrievedReasoning = await logic.getRecommendationReasoningById(
      recommendationContent.recommendationId,
      mockRepository
    );

    expect(retrievedReasoning).toBeDefined();
    expect(retrievedReasoning.recommendationId).toBe('REC-2024-001');
    expect(retrievedReasoning.customerId).toBe('CUST-2024-001');
    expect(retrievedReasoning.proposalContent).toBe('クラウドERPシステムA導入');
    expect(retrievedReasoning.similarPatternsCount).toBe(3);
    expect(retrievedReasoning.confidenceScore).toBe(0.89);
    expect(retrievedReasoning.referencedPatternIds).toHaveLength(3);
    expect(retrievedReasoning.referencedPatternIds[0]).toBe('PATTERN-IT-001');

    // 推奨妥当性追跡機能による全根拠情報の取得と検証
    const traceabilityTrail = await logic.getRecommendationTraceability(
      recommendationContent.recommendationId,
      mockTraceabilityService
    );

    expect(traceabilityTrail).toBeDefined();
    expect(traceabilityTrail.recommendationId).toBe('REC-2024-001');
    expect(traceabilityTrail.customerId).toBe('CUST-2024-001');

    // 妥当性根拠の検証
    expect(traceabilityTrail.selectionRationale).toContain('類似度0.87');
    expect(traceabilityTrail.selectionRationale).toContain('信頼度0.89');
    expect(traceabilityTrail.selectionRationale).toContain('3件');

    // 期待効果（業務効果）の検証
    expect(traceabilityTrail.expectedBusinessEffect).toContain('IT業種');
    expect(traceabilityTrail.expectedBusinessEffect).toContain('35%');
    expect(traceabilityTrail.expectedBusinessEffect).toContain('業務効率化');

    // 追跡可能性の詳細情報検証
    const traceDetails = traceabilityTrail.traceabilityDetails;
    expect(traceDetails.baselineSimilarityScore).toBe(0.87);
    expect(traceDetails.confidenceScore).toBe(0.89);
    expect(traceDetails.matchedPatternCount).toBe(3);
    expect(traceDetails.industryBenchmark.industry).toBe('IT');
    expect(traceDetails.industryBenchmark.averageEfficiencyGain).toBe(35);
    expect(traceDetails.industryBenchmark.unit).toBe('percent');

    // repositoryが正しく呼ばれたことを確認
    expect(mockRepository.save).toHaveBeenCalledWith(savePayload);
    expect(mockRepository.findByRecommendationId).toHaveBeenCalledWith(
      'REC-2024-001'
    );

    // traceabilityServiceが正しく呼ばれたことを確認
    expect(mockTraceabilityService.getRecommendationTrail).toHaveBeenCalledWith(
      'REC-2024-001'
    );
  });
});