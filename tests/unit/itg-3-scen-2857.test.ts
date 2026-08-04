import { recordRecommendationReasons } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 推奨根拠の可視化機能', () => {
  // SCEN-2857
  test('推奨根拠の記録機能 - 営業管理職が推奨内容を承認した場合、その根拠情報が推奨根拠テーブルに記録される', () => {
    const recommendationId = 'REC-20250115-001';
    const approvedBy = 'MGR-USER-001';
    const approvedAt = new Date('2025-01-15T14:30:00Z');
    const confidenceScore = 0.87;

    const recommendationData = {
      recommendationId,
      approach: '顧客の既存システムとの連携を強調した提案',
      reasoning: [
        '過去3年間で同業種への導入実績が15件',
        '初期接続時の課題解決パターンが90%の成功率',
        '競合他社との差別化ポイントは保守性と拡張性'
      ],
      confidenceScore
    };

    const result = recordRecommendationReasons({
      recommendationId,
      reasoning: recommendationData.reasoning,
      confidenceScore,
      approvedBy,
      approvedAt
    });

    expect(result.recordedCount).toBe(3);
    expect(result.records).toHaveLength(3);

    const pastResultRecord = result.records.find(
      r => r.reasoningType === '過去実績'
    );
    expect(pastResultRecord).toEqual({
      recommendationId: 'REC-20250115-001',
      reasoningType: '過去実績',
      reasonText: '過去3年間で同業種への導入実績が15件',
      confidenceScore: 0.87,
      approvedBy: 'MGR-USER-001',
      approvedAt: new Date('2025-01-15T14:30:00Z').toISOString(),
      status: 'approved'
    });

    const successPatternRecord = result.records.find(
      r => r.reasoningType === '成功パターン'
    );
    expect(successPatternRecord).toEqual({
      recommendationId: 'REC-20250115-001',
      reasoningType: '成功パターン',
      reasonText: '初期接続時の課題解決パターンが90%の成功率',
      confidenceScore: 0.87,
      approvedBy: 'MGR-USER-001',
      approvedAt: new Date('2025-01-15T14:30:00Z').toISOString(),
      status: 'approved'
    });

    const differentiationRecord = result.records.find(
      r => r.reasoningType === '差別化ポイント'
    );
    expect(differentiationRecord).toEqual({
      recommendationId: 'REC-20250115-001',
      reasoningType: '差別化ポイント',
      reasonText: '競合他社との差別化ポイントは保守性と拡張性',
      confidenceScore: 0.87,
      approvedBy: 'MGR-USER-001',
      approvedAt: new Date('2025-01-15T14:30:00Z').toISOString(),
      status: 'approved'
    });

    expect(result.success).toBe(true);
  });
});