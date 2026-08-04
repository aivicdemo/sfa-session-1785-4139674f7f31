import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2463
  test('同じ入力データで2回実行した場合、同じ構造化テンプレートが生成される', async () => {
    // テスト用の顧客情報と商談条件を含む入力データセット
    const inputDataset = {
      customerIndustry: 'IT',
      projectScale: 5000000,
      decisionMakers: 3,
      evaluationPeriod: 2,
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
    };

    // AIRecommendationEngineの呼び出し窓口（OpenAI APIスタブ）
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Phased Implementation',
        proposalSections: [
          {
            sectionName: 'Executive Summary',
            sequenceOrder: 1,
            fieldMapping: {
              businessValue: 'ROI calculation',
              riskMitigation: 'Phased approach reduces risk',
            },
            dataType: 'text',
            required: true,
          },
          {
            sectionName: 'Technical Architecture',
            sequenceOrder: 2,
            fieldMapping: {
              systemComponents: 'Cloud-based infrastructure',
              integrationPoints: 'Existing ERP connection',
            },
            dataType: 'text',
            required: true,
          },
          {
            sectionName: 'Implementation Timeline',
            sequenceOrder: 3,
            fieldMapping: {
              phase1: 'Months 1-2: Discovery and Design',
              phase2: 'Months 3-4: Development',
              phase3: 'Months 5-6: Testing and Deployment',
            },
            dataType: 'text',
            required: true,
          },
        ],
        confidenceScore: 85,
        rootCause: {
          pastSuccessPatterns: [
            {
              patternId: 'PATTERN-IT-500M-3DM',
              matchScore: 0.92,
              appliedApproaches: ['Phased Implementation', 'Executive Steering Committee'],
            },
          ],
          evidenceData: 'Similar 3 past cases with IT industry, 5M scale showed 88% adoption rate',
        },
      }),
    };

    // 1回目の呼び出し：構造化テンプレートT1を生成
    const template1 = await generateRecommendation(inputDataset, mockAIEngine);

    // T1の内容（推奨アプローチの構造、セクション構成、パラメータマッピング）をJSON形式で記録
    const json1 = JSON.stringify(template1, null, 2);

    // 2回目の呼び出し：同じ入力データセットAを用いて構造化テンプレートT2を生成
    const template2 = await generateRecommendation(inputDataset, mockAIEngine);

    // T2の内容をJSON形式で記録
    const json2 = JSON.stringify(template2, null, 2);

    // T1とT2のJSON構造を比較検証
    // スキーマ構造、セクション順序、フィールド名、データ型、推奨内容のマッピング関係が同一
    expect(template1.recommendedApproach).toBe(template2.recommendedApproach);
    expect(template1.proposalSections.length).toBe(template2.proposalSections.length);
    expect(template1.proposalSections.length).toBe(3);

    // 各セクションの名称・順序が同一
    for (let i = 0; i < template1.proposalSections.length; i++) {
      const section1 = template1.proposalSections[i];
      const section2 = template2.proposalSections[i];

      expect(section1.sectionName).toBe(section2.sectionName);
      expect(section1.sequenceOrder).toBe(section2.sequenceOrder);
      expect(section1.dataType).toBe(section2.dataType);
      expect(section1.required).toBe(section2.required);

      // フィールドマッピングの構造が同一
      expect(Object.keys(section1.fieldMapping).sort()).toEqual(
        Object.keys(section2.fieldMapping).sort()
      );
      for (const key of Object.keys(section1.fieldMapping)) {
        expect(section1.fieldMapping[key]).toBe(section2.fieldMapping[key]);
      }
    }

    // 推奨内容の信頼度スコア（0～100）が同一
    expect(template1.confidenceScore).toBe(template2.confidenceScore);
    expect(template1.confidenceScore).toBe(85);

    // 根拠データのマッピング関係が同一
    expect(template1.rootCause.pastSuccessPatterns.length).toBe(
      template2.rootCause.pastSuccessPatterns.length
    );
    expect(template1.rootCause.pastSuccessPatterns[0].patternId).toBe(
      template2.rootCause.pastSuccessPatterns[0].patternId
    );
    expect(template1.rootCause.pastSuccessPatterns[0].matchScore).toBe(
      template2.rootCause.pastSuccessPatterns[0].matchScore
    );
    expect(template1.rootCause.evidenceData).toBe(template2.rootCause.evidenceData);

    // JSON差分ツール相当：完全な同一性を検証
    expect(json1).toBe(json2);
  });
});