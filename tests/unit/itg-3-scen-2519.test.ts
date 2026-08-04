import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  test('SCEN-2519: 成功要因の件数がちょうど閾値のとき、テンプレートに含まれる', () => {
    // 初期化
    const thresholdSuccessFactorCount = 5;
    
    // 新規案件データ
    const newDealData = {
      customerId: 'cust-2024-001',
      customerIndustry: '製造業',
      customerScale: '中堅',
      dealAmount: 5000000,
      dealDuration: 90,
      dealType: 'システム導入'
    };

    // AIRecommendationEngineのスタブ設定
    // 成功要因の件数をちょうど閾値と同じ5件に設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patternId: 'pattern-001',
        successFactors: [
          { factorId: 'f-001', factorName: '初期ヒアリング充実', weight: 0.2 },
          { factorId: 'f-002', factorName: '予算承認の早期確保', weight: 0.2 },
          { factorId: 'f-003', factorName: 'IT部門との連携', weight: 0.18 },
          { factorId: 'f-004', factorName: '導入効果の明確化', weight: 0.22 },
          { factorId: 'f-005', factorName: '経営層の関与', weight: 0.2 }
        ],
        relevanceScore: 0.92
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'similar-001',
          similarity: 0.88,
          successFactorCount: 5
        }
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicable: true,
        score: 0.92,
        reason: '顧客業種・規模・取引額が過去成功事例と一致'
      })
    };

    // 成功パターン抽出・構造化機能を実行
    const result = generateSuccessPatternTemplate(newDealData, mockAIEngine);

    // AIRecommendationEngineの呼び出し窓口がスタブを経由して呼ばれたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 推奨パターンマスタに格納されたデータを検証
    expect(result.patternId).toBe('pattern-001');
    
    // 成功要因が構造化テンプレートに含まれているかを検査
    expect(result.successFactors).toHaveLength(thresholdSuccessFactorCount);
    expect(result.successFactors[0]).toEqual({
      factorId: 'f-001',
      factorName: '初期ヒアリング充実',
      weight: 0.2
    });
    expect(result.successFactors[1]).toEqual({
      factorId: 'f-002',
      factorName: '予算承認の早期確保',
      weight: 0.2
    });
    expect(result.successFactors[2]).toEqual({
      factorId: 'f-003',
      factorName: 'IT部門との連携',
      weight: 0.18
    });
    expect(result.successFactors[3]).toEqual({
      factorId: 'f-004',
      factorName: '導入効果の明確化',
      weight: 0.22
    });
    expect(result.successFactors[4]).toEqual({
      factorId: 'f-005',
      factorName: '経営層の関与',
      weight: 0.2
    });

    // テンプレートの各フィールドに正しくデータが格納されていることを確認
    expect(result.applicabilityScore).toBe(0.92);
    expect(result.isApplicable).toBe(true);
    expect(result.applicableReason).toBe('顧客業種・規模・取引額が過去成功事例と一致');
    
    // 推奨パターンマスタに保存されていることを確認
    expect(result.isSavedToMaster).toBe(true);
    expect(result.masterTableId).toBeDefined();
  });
});