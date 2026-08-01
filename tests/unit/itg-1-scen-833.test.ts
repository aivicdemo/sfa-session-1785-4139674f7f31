import { analyzeProcessDeviationAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析', () => {
  // SCEN-833: [normal] 営業プロセス標準書との乖離分析と成約実績の相関分析 - 営業担当者が複数人の場合、全担当者の相関分析結果を返す
  test('複数の営業担当者の乖離分析と成約実績の相関分析を実行し、各担当者ごとの分析結果と統合コメントを返す', () => {
    const dealIds = [
      'DEAL001', 'DEAL002', 'DEAL003', 'DEAL004', 'DEAL005',
      'DEAL006', 'DEAL007', 'DEAL008', 'DEAL009', 'DEAL010'
    ];
    
    const standardProcessSteps = [
      { stepId: 'STEP001', stepName: '初期接触', order: 1 },
      { stepId: 'STEP002', stepName: 'ニーズ把握', order: 2 },
      { stepId: 'STEP003', stepName: '提案', order: 3 },
      { stepId: 'STEP004', stepName: '交渉', order: 4 },
      { stepId: 'STEP005', stepName: '成約', order: 5 }
    ];

    const processSalesPersonA = [
      { dealId: 'DEAL001', salesPersonId: 'SP001', processSteps: ['STEP001', 'STEP002', 'STEP003', 'STEP004', 'STEP005'], daysRequired: 30, dealClosed: true },
      { dealId: 'DEAL002', salesPersonId: 'SP001', processSteps: ['STEP001', 'STEP002', 'STEP003', 'STEP004', 'STEP005'], daysRequired: 28, dealClosed: true },
      { dealId: 'DEAL003', salesPersonId: 'SP001', processSteps: ['STEP001', 'STEP003', 'STEP002', 'STEP004', 'STEP005'], daysRequired: 35, dealClosed: true },
      { dealId: 'DEAL004', salesPersonId: 'SP001', processSteps: ['STEP001', 'STEP002', 'STEP003', 'STEP004', 'STEP005'], daysRequired: 32, dealClosed: false }
    ];

    const processSalesPersonB = [
      { dealId: 'DEAL005', salesPersonId: 'SP002', processSteps: ['STEP001', 'STEP003', 'STEP002', 'STEP004', 'STEP005'], daysRequired: 42, dealClosed: true },
      { dealId: 'DEAL006', salesPersonId: 'SP002', processSteps: ['STEP002', 'STEP001', 'STEP003', 'STEP004', 'STEP005'], daysRequired: 45, dealClosed: true },
      { dealId: 'DEAL007', salesPersonId: 'SP002', processSteps: ['STEP001', 'STEP002', 'STEP003', 'STEP004', 'STEP005'], daysRequired: 38, dealClosed: true },
      { dealId: 'DEAL008', salesPersonId: 'SP002', processSteps: ['STEP001', 'STEP003', 'STEP004', 'STEP002', 'STEP005'], daysRequired: 50, dealClosed: false }
    ];

    const processSalesPersonC = [
      { dealId: 'DEAL009', salesPersonId: 'SP003', processSteps: ['STEP001', 'STEP002', 'STEP004', 'STEP003', 'STEP005'], daysRequired: 55, dealClosed: true },
      { dealId: 'DEAL010', salesPersonId: 'SP003', processSteps: ['STEP001', 'STEP004', 'STEP002', 'STEP003', 'STEP005'], daysRequired: 60, dealClosed: false }
    ];

    const allProcessData = [
      ...processSalesPersonA,
      ...processSalesPersonB,
      ...processSalesPersonC
    ];

    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-12-31T23:59:59Z');

    const result = analyzeProcessDeviationAndCorrelation({
      dealIds,
      standardProcessSteps,
      processExecutionData: allProcessData,
      contractResults: allProcessData.map(p => ({
        dealId: p.dealId,
        salesPersonId: p.salesPersonId,
        closed: p.dealClosed,
        closedDate: p.dealClosed ? new Date('2024-06-15T00:00:00Z') : null
      })),
      startDate,
      endDate
    });

    // 担当者A: 4件中3件成約 → 成約率75.00%
    // 担当者A: ステップ順序が完全に正当なケース3件、逸脱1件(STEP002とSTEP003の順序逆転) → 乖離スコア25
    expect(result).toHaveProperty('salesPersonAnalysis');
    expect(result.salesPersonAnalysis).toHaveLength(3);

    const salesPersonA = result.salesPersonAnalysis.find((item: any) => item.salesPersonId === 'SP001');
    expect(salesPersonA).toBeDefined();
    expect(salesPersonA.deviationScore).toBe(25);
    expect(salesPersonA.contractRate).toBe(0.75);
    expect(salesPersonA.deviationPatterns).toEqual([
      { stepName: 'ニーズ把握', deviation: 'STEP002とSTEP003の順序逆転', count: 1 }
    ]);
    expect(typeof salesPersonA.correlationCoefficient).toBe('number');
    expect(salesPersonA.correlationCoefficient).toBeGreaterThanOrEqual(-1.0);
    expect(salesPersonA.correlationCoefficient).toBeLessThanOrEqual(1.0);

    // 担当者B: 4件中3件成約 → 成約率75.00%
    // 担当者B: ステップ順序逸脱が複数あり、STEP001とSTEP002、STEP002とSTEP003、STEP003とSTEP004の順序逸脱 → 乖離スコア50
    const salesPersonB = result.salesPersonAnalysis.find((item: any) => item.salesPersonId === 'SP002');
    expect(salesPersonB).toBeDefined();
    expect(salesPersonB.deviationScore).toBe(50);
    expect(salesPersonB.contractRate).toBe(0.75);
    expect(Array.isArray(salesPersonB.deviationPatterns)).toBe(true);
    expect(typeof salesPersonB.correlationCoefficient).toBe('number');

    // 担当者C: 2件中1件成約 → 成約率50.00%
    // 担当者C: ステップ順序が大きく逸脱、複数のステップが標準順序と異なる → 乖離スコア70
    const salesPersonC = result.salesPersonAnalysis.find((item: any) => item.salesPersonId === 'SP003');
    expect(salesPersonC).toBeDefined();
    expect(salesPersonC.deviationScore).toBe(70);
    expect(salesPersonC.contractRate).toBe(0.50);
    expect(Array.isArray(salesPersonC.deviationPatterns)).toBe(true);
    expect(typeof salesPersonC.correlationCoefficient).toBe('number');

    // 統合コメントが含まれていることを検証
    expect(result).toHaveProperty('integratedComment');
    expect(typeof result.integratedComment).toBe('string');
    expect(result.integratedComment.length).toBeGreaterThan(0);
    
    // 統合コメントが複数担当者の相関分析結果を示唆していることを確認
    expect(result.integratedComment).toMatch(/担当者/);
    expect(result.integratedComment).toMatch(/相関|乖離|成約率/);
  });
});