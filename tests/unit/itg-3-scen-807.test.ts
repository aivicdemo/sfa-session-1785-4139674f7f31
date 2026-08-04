import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fetch from 'jest-fetch-mock';
import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨外部連携', () => {
  beforeEach(() => {
    fetch.enableMocks();
    fetch.resetMocks();
  });

  afterEach(() => {
    fetch.disableMocks();
  });

  // SCEN-807
  it('[normal] OpenAI APIが正常応答したとき、生成された推奨内容が返却される', async () => {
    const testCaseData = {
      customerName: 'テスト顧客A株式会社',
      industry: '製造業',
      dealAmount: 5000000,
      issue: '生産効率化による原価削減が急務',
    };

    const expectedApproach =
      '顧客の生産プロセスデジタル化を支援する提案スキームを推奨します。過去の類似事例では同業種で平均30%の効率化を実現しています。';
    const expectedReason =
      '当社の過去成功パターン分析により、製造業かつ5000万円規模の案件では、ERPシステム導入を軸とした包括的な提案が最も高い成約率を示しています。本案件は顧客課題、業種、金額規模が合致しており、推奨スキームの適用可能性が高いと判定されました。';
    const expectedPatternIds = ['pattern_001', 'pattern_012', 'pattern_045'];
    const expectedConfidenceScore = 0.88;
    const expectedTimestamp = '2024-01-15T10:30:00Z';

    const mockResponse = {
      recommendedApproach: expectedApproach,
      reason: expectedReason,
      similarPatternIds: expectedPatternIds,
      confidenceScore: expectedConfidenceScore,
      generatedAt: expectedTimestamp,
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

    const result = await generateRecommendation({
      customerName: testCaseData.customerName,
      industry: testCaseData.industry,
      dealAmount: testCaseData.dealAmount,
      issue: testCaseData.issue,
    });

    expect(result.status).toBe(200);
    expect(result.body.recommendedApproach).toBe(expectedApproach);
    expect(result.body.recommendedApproach.length).toBeGreaterThanOrEqual(20);
    expect(result.body.reason).toBe(expectedReason);
    expect(result.body.reason.length).toBeGreaterThanOrEqual(30);
    expect(result.body.similarPatternIds).toEqual(expectedPatternIds);
    expect(result.body.similarPatternIds.length).toBeGreaterThanOrEqual(1);
    expect(result.body.confidenceScore).toBe(expectedConfidenceScore);
    expect(result.body.confidenceScore).toBeGreaterThanOrEqual(0.75);
    expect(result.body.confidenceScore).toBeLessThanOrEqual(0.99);
    expect(result.body.generatedAt).toBe(expectedTimestamp);
    expect(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(result.body.generatedAt)).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});