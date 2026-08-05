import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { convertProcessStepsToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-196: [edge] プロセス段階数が上限値直下（例：9段階）のとき、全段階が要件仕様に変換される
  test('プロセス段階数が9段階のときすべての段階が要件仕様に正確に変換されること', () => {
    // テストデータ: 9段階のプロセス定義
    const processSteps = [
      {
        step_number: 1,
        step_name: '初回接触',
        process_outline: '顧客と初回で接触し、基本情報を収集する',
        responsible_person: '営業担当者',
        completion_condition: '顧客の連絡先と基本ニーズが記録される'
      },
      {
        step_number: 2,
        step_name: '需要分析',
        process_outline: '顧客のビジネス課題を深掘りし、必要なソリューションを分析する',
        responsible_person: '営業担当者',
        completion_condition: '顧客ニーズシートが完成し、営業担当者により確認される'
      },
      {
        step_number: 3,
        step_name: '提案資料準備',
        process_outline: '分析結果に基づき提案資料を作成する',
        responsible_person: '営業担当者',
        completion_condition: '提案資料がテンプレートに基づき完成し、営業管理職の承認を得る'
      },
      {
        step_number: 4,
        step_name: '提案実行',
        process_outline: '顧客に対して提案資料を用いてプレゼンテーションを実施する',
        responsible_person: '営業担当者',
        completion_condition: '顧客の反応が記録され、商談記録に保存される'
      },
      {
        step_number: 5,
        step_name: 'フィードバック収集',
        process_outline: '提案に対する顧客の具体的なフィードバックを取得する',
        responsible_person: '営業担当者',
        completion_condition: 'フィードバック内容がシステムに記録される'
      },
      {
        step_number: 6,
        step_name: '提案修正',
        process_outline: 'フィードバックに基づき提案内容を修正する',
        responsible_person: '営業担当者',
        completion_condition: '修正版提案資料が完成し、営業管理職により承認される'
      },
      {
        step_number: 7,
        step_name: '交渉',
        process_outline: '顧客と契約条件や金額について交渉する',
        responsible_person: '営業担当者',
        completion_condition: '契約条件が合意され、商談記録に詳細が記載される'
      },
      {
        step_number: 8,
        step_name: '契約締結準備',
        process_outline: '契約書の作成および法務レビューを実施する',
        responsible_person: '営業管理職',
        completion_condition: '契約書が法務部により承認される'
      },
      {
        step_number: 9,
        step_name: '成約',
        process_outline: '契約書に署名を取得し、成約実績を記録する',
        responsible_person: '営業担当者',
        completion_condition: '成約実績がシステムに登録され、売上計上の基準を満たす'
      }
    ];

    // システム要件変換機能を実行
    const convertedRequirements = convertProcessStepsToSystemRequirements(processSteps);

    // 期待結果: 9個の要件が存在すること
    expect(convertedRequirements).toHaveLength(9);

    // 各要件が正確に変換されていることを検証
    expect(convertedRequirements[0]).toEqual({
      requirement_id: 'REQ-1',
      requirement_title: '初回接触',
      requirement_description: '顧客と初回で接触し、基本情報を収集する',
      acceptance_criteria: '顧客の連絡先と基本ニーズが記録される'
    });

    expect(convertedRequirements[1]).toEqual({
      requirement_id: 'REQ-2',
      requirement_title: '需要分析',
      requirement_description: '顧客のビジネス課題を深掘りし、必要なソリューションを分析する',
      acceptance_criteria: '顧客ニーズシートが完成し、営業担当者により確認される'
    });

    expect(convertedRequirements[2]).toEqual({
      requirement_id: 'REQ-3',
      requirement_title: '提案資料準備',
      requirement_description: '分析結果に基づき提案資料を作成する',
      acceptance_criteria: '提案資料がテンプレートに基づき完成し、営業管理職の承認を得る'
    });

    expect(convertedRequirements[3]).toEqual({
      requirement_id: 'REQ-4',
      requirement_title: '提案実行',
      requirement_description: '顧客に対して提案資料を用いてプレゼンテーションを実施する',
      acceptance_criteria: '顧客の反応が記録され、商談記録に保存される'
    });

    expect(convertedRequirements[4]).toEqual({
      requirement_id: 'REQ-5',
      requirement_title: 'フィードバック収集',
      requirement_description: '提案に対する顧客の具体的なフィードバックを取得する',
      acceptance_criteria: 'フィードバック内容がシステムに記録される'
    });

    expect(convertedRequirements[5]).toEqual({
      requirement_id: 'REQ-6',
      requirement_title: '提案修正',
      requirement_description: 'フィードバックに基づき提案内容を修正する',
      acceptance_criteria: '修正版提案資料が完成し、営業管理職により承認される'
    });

    expect(convertedRequirements[6]).toEqual({
      requirement_id: 'REQ-7',
      requirement_title: '交渉',
      requirement_description: '顧客と契約条件や金額について交渉する',
      acceptance_criteria: '契約条件が合意され、商談記録に詳細が記載される'
    });

    expect(convertedRequirements[7]).toEqual({
      requirement_id: 'REQ-8',
      requirement_title: '契約締結準備',
      requirement_description: '契約書の作成および法務レビューを実施する',
      acceptance_criteria: '契約書が法務部により承認される'
    });

    expect(convertedRequirements[8]).toEqual({
      requirement_id: 'REQ-9',
      requirement_title: '成約',
      requirement_description: '契約書に署名を取得し、成約実績を記録する',
      acceptance_criteria: '成約実績がシステムに登録され、売上計上の基準を満たす'
    });
  });
});