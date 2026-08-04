import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('営業成功パターンの構造化テンプレート設計機能', () => {
  test('SCEN-2498: 営業プロセスの各ステップにおける失敗パターンが構造化テンプレートに組み込まれる', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        success: true,
        structuredTemplate: {
          targetIndustry: 'manufacturing',
          budgetScale: 'mid_market',
          decisionMakers: 'multiple_departments',
          steps: [
            {
              stepName: 'initial_contact',
              stepLabel: '初期接触ステップ',
              successPattern: '顧客のビジネス環境を正確に理解した上での初回面談',
              failurePattern: '顧客ニーズのヒアリング不足',
              mitigation: '初回面談で最低限確認すべき5項目のチェックリスト',
              checklistItems: [
                '経営課題と現状分析の確認',
                '購買決定プロセスと関係部門の把握',
                '予算枠と承認権限の確認',
                '導入スケジュールの初期検討',
                '競合状況と差別化ポイントの引き出し'
              ]
            },
            {
              stepName: 'proposal',
              stepLabel: '提案ステップ',
              successPattern: '顧客ニーズに合わせたカスタマイズ提案を期限内に提出',
              failurePattern: '提案資料の提出遅延',
              mitigation: '提案資料作成の期限（営業日3日以内）',
              checklistItems: [
                '提案内容の顧客課題との適合性確認',
                '資料レビュー・承認プロセスの完了',
                '提案内容の正確性と整合性検証',
                '顧客への提出前の品質チェック完了',
                '提出方法と説明スケジュールの調整完了'
              ]
            },
            {
              stepName: 'quotation',
              stepLabel: '見積ステップ',
              successPattern: '見積提示後の顧客質問に迅速に対応し信頼を構築',
              failurePattern: '価格交渉対応の遅れ',
              mitigation: '見積提示後24時間以内の顧客質問対応体制',
              checklistItems: [
                '見積内容の詳細説明資料の準備',
                '価格根拠と提案価値の説明資料作成',
                '見積提示後の質問受け付け体制の整備',
                '対応時間目標（24時間以内）の営業チーム間での共有',
                '見積修正対応時の承認フロー確認'
              ]
            },
            {
              stepName: 'followup',
              stepLabel: 'フォローアップステップ',
              successPattern: '定期的な接触により顧客との関係を継続維持',
              failurePattern: '商談放置による競合優位喪失',
              mitigation: '商談終了後3営業日以内の接触義務',
              checklistItems: [
                '前回商談の内容確認と進捗確認',
                '顧客からの質問・要望への対応状況確認',
                '次のアクションと接触予定日の設定',
                '営業チーム内での情報共有（進捗・懸念事項など）',
                '必要に応じた上位者の同行訪問の検討'
              ]
            }
          ],
          visibility: {
            isStructured: true,
            isVisualized: true,
            componentsPerStep: ['failurePattern', 'mitigation', 'checklistItems']
          }
        }
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const newCaseInput = {
      industry: 'manufacturing',
      budgetScale: 'mid_market',
      decisionMakers: 'multiple_departments'
    };

    const result = await generateRecommendation(newCaseInput, mockAIEngine);

    expect(result.success).toBe(true);
    expect(result.structuredTemplate.targetIndustry).toBe('manufacturing');
    expect(result.structuredTemplate.budgetScale).toBe('mid_market');
    expect(result.structuredTemplate.decisionMakers).toBe('multiple_departments');

    expect(result.structuredTemplate.steps).toHaveLength(4);

    const initialContactStep = result.structuredTemplate.steps[0];
    expect(initialContactStep.stepName).toBe('initial_contact');
    expect(initialContactStep.stepLabel).toBe('初期接触ステップ');
    expect(initialContactStep.failurePattern).toBe('顧客ニーズのヒアリング不足');
    expect(initialContactStep.mitigation).toBe('初回面談で最低限確認すべき5項目のチェックリスト');
    expect(initialContactStep.checklistItems).toEqual([
      '経営課題と現状分析の確認',
      '購買決定プロセスと関係部門の把握',
      '予算枠と承認権限の確認',
      '導入スケジュールの初期検討',
      '競合状況と差別化ポイントの引き出し'
    ]);

    const proposalStep = result.structuredTemplate.steps[1];
    expect(proposalStep.stepName).toBe('proposal');
    expect(proposalStep.stepLabel).toBe('提案ステップ');
    expect(proposalStep.failurePattern).toBe('提案資料の提出遅延');
    expect(proposalStep.mitigation).toBe('提案資料作成の期限（営業日3日以内）');
    expect(proposalStep.checklistItems.length).toBe(5);

    const quotationStep = result.structuredTemplate.steps[2];
    expect(quotationStep.stepName).toBe('quotation');
    expect(quotationStep.stepLabel).toBe('見積ステップ');
    expect(quotationStep.failurePattern).toBe('価格交渉対応の遅れ');
    expect(quotationStep.mitigation).toBe('見積提示後24時間以内の顧客質問対応体制');
    expect(quotationStep.checklistItems.length).toBe(5);

    const followupStep = result.structuredTemplate.steps[3];
    expect(followupStep.stepName).toBe('followup');
    expect(followupStep.stepLabel).toBe('フォローアップステップ');
    expect(followupStep.failurePattern).toBe('商談放置による競合優位喪失');
    expect(followupStep.mitigation).toBe('商談終了後3営業日以内の接触義務');
    expect(followupStep.checklistItems.length).toBe(5);

    expect(result.structuredTemplate.visibility.isStructured).toBe(true);
    expect(result.structuredTemplate.visibility.isVisualized).toBe(true);
    expect(result.structuredTemplate.visibility.componentsPerStep).toEqual([
      'failurePattern',
      'mitigation',
      'checklistItems'
    ]);

    mockAIEngine.generateRecommendation.mockClear();
  });
});