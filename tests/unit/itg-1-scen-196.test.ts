import { determineSalesPersonGuidance } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-196
  test('[normal] 営業担当者行動パターン分析・改善指導対象判定機能 - 改善指導内容が複数種類の場合、全指導が優先順序付きで提示される', () => {
    const salesPersonId = 'sales_person_001';
    const behaviorPatternData = {
      visitFrequency: 5,
      proposalDocumentCreationCount: 2,
      customerFollowupDelayDays: 15,
    };

    const guidanceList = determineSalesPersonGuidance(
      salesPersonId,
      behaviorPatternData
    );

    expect(Array.isArray(guidanceList)).toBe(true);
    expect(guidanceList.length).toBe(3);

    expect(guidanceList[0]).toEqual({
      guidanceId: 'guidance_001',
      content: '顧客フォローアップ遅延',
      priority: 1,
    });
    expect(guidanceList[1]).toEqual({
      guidanceId: 'guidance_002',
      content: '提案資料作成不足',
      priority: 2,
    });
    expect(guidanceList[2]).toEqual({
      guidanceId: 'guidance_003',
      content: '低訪問頻度',
      priority: 3,
    });

    const priorities = guidanceList.map((g) => g.priority);
    expect(priorities).toEqual([1, 2, 3]);
  });
});