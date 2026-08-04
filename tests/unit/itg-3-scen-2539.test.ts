import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2539
  test('各ステップに紐づく成功要因が閾値直下のとき、含まれる', () => {
    const THRESHOLD = 0.70;
    const SCORE_BELOW_THRESHOLD = 0.69;

    const dealStepData = {
      dealId: 'DEAL-20240115-001',
      dealTitle: '新規顧客 A社への提案',
      steps: [
        {
          stepId: 'STEP-001',
          stepName: '初回ヒアリング',
          successFactorScore: SCORE_BELOW_THRESHOLD,
          basedOnPatterns: ['顧客課題の深掘り', '経営層への情報確保']
        },
        {
          stepId: 'STEP-002',
          stepName: '提案資料作成',
          successFactorScore: 0.65,
          basedOnPatterns: ['標準テンプレート活用']
        },
        {
          stepId: 'STEP-003',
          stepName: '顧客プレゼン',
          successFactorScore: 0.85,
          basedOnPatterns: ['経営層との対話', 'ROI説明']
        }
      ]
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((step) => {
        if (step.stepId === 'STEP-001') {
          return { score: SCORE_BELOW_THRESHOLD, isRelevant: true };
        }
        if (step.stepId === 'STEP-002') {
          return { score: 0.65, isRelevant: false };
        }
        if (step.stepId === 'STEP-003') {
          return { score: 0.85, isRelevant: true };
        }
        return { score: 0, isRelevant: false };
      })
    };

    const result = extractSuccessPatterns(dealStepData, THRESHOLD, aiEngineStub);

    expect(result).toHaveProperty('extractedSteps');
    expect(result.extractedSteps).toHaveLength(2);

    const step001 = result.extractedSteps.find((s: any) => s.stepId === 'STEP-001');
    expect(step001).toBeDefined();
    expect(step001.successFactorScore).toBe(0.69);
    expect(step001.stepName).toBe('初回ヒアリング');
    expect(step001.basedOnPatterns).toEqual(['顧客課題の深掘り', '経営層への情報確保']);

    const step002 = result.extractedSteps.find((s: any) => s.stepId === 'STEP-002');
    expect(step002).toBeUndefined();

    const step003 = result.extractedSteps.find((s: any) => s.stepId === 'STEP-003');
    expect(step003).toBeDefined();
    expect(step003.successFactorScore).toBe(0.85);

    expect(result).toHaveProperty('structuredOutput');
    expect(result.structuredOutput).toHaveProperty('dealId', 'DEAL-20240115-001');
    expect(result.structuredOutput).toHaveProperty('threshold', THRESHOLD);
    expect(result.structuredOutput).toHaveProperty('extractionTimestamp');
    expect(typeof result.structuredOutput.extractionTimestamp).toBe('string');
  });
});