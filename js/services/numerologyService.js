// 수치학 데이터베이스 서비스
import { initializeSupabase } from './supabase.js';

export class NumerologyService {
    async getLifePathInsight(lifePathNumber, purposeType, cardDirection) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'life_path')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .eq('card_direction', cardDirection)
                .single();
            
            if (error) {
                console.warn('생명수 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('생명수 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getSeasonInsight(seasonName, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'season')
                .eq('season_name', seasonName)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('계절 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('계절 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async getCombinationInsight(lifePathNumber, purposeType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', 'combination')
                .eq('life_path_number', lifePathNumber)
                .eq('purpose_type', purposeType)
                .single();
            
            if (error) {
                console.warn('조합 해석 조회 실패:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('조합 해석 조회 중 오류:', error);
            return null;
        }
    }
    
    async applyNumerologicalInsight(card, purpose, lifePathNumber, birthSeason, isReversed) {
        try {
            const cardDirection = isReversed ? 'reversed' : 'upright';
            
            // 생명수별 해석 조회
            const lifePathInsight = await this.getLifePathInsight(lifePathNumber, purpose, cardDirection);
            
            // 계절별 해석 조회
            const seasonInsight = await this.getSeasonInsight(birthSeason.name, purpose);
            
            if (lifePathInsight || seasonInsight) {
                // 카드별 고유 특성을 반영한 개인화된 해석 생성
                const cardSpecificContext = this.generateCardSpecificContext(card, purpose, isReversed);
                
                // 카드별로 다른 기본 의미 생성
                const baseMeaning = this.generateCardSpecificBaseMeaning(card, lifePathInsight, seasonInsight, isReversed);
                
                // 랜덤 템플릿 선택 및 적용
                const template = this.getRandomInterpretationTemplate();
                const templatedMeaning = this.applyInterpretationTemplate(
                    baseMeaning, card, template, lifePathNumber, birthSeason
                );
                
                // 자연스러운 문장 구성
                let finalMeaning = templatedMeaning;
                if (cardSpecificContext) {
                    finalMeaning += cardSpecificContext;
                }
                
                const advice = lifePathInsight?.advice_text || '';
                
                return {
                    meaning: finalMeaning,
                    advice: advice
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 해석 적용 실패:', error);
            return null;
        }
    }
    
    async applyNumerologicalCombination(combinationReading, purpose, lifePathNumber, birthSeason, cardReadings) {
        try {
            // 생명수별 조합 해석 조회
            const combinationInsight = await this.getCombinationInsight(lifePathNumber, purpose);
            
            if (combinationInsight) {
                return {
                    ...combinationReading,
                    overall_meaning: combinationInsight.insight_text,
                    advice: combinationInsight.advice_text
                };
            }
            
            return null;
        } catch (error) {
            console.error('수치학적 조합 해석 적용 실패:', error);
            return null;
        }
    }
    
    // 관리용 함수들
    async getAllNumerologyInsights() {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .order('insight_type, life_path_number, season_name, purpose_type, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('전체 수치학 데이터 조회 실패:', error);
            return [];
        }
    }
    
    async getInsightsByType(insightType) {
        try {
            const supabase = await initializeSupabase();
            const { data, error } = await supabase
                .from('numerology_insights')
                .select('*')
                .eq('insight_type', insightType)
                .order('purpose_type, life_path_number, season_name, card_direction');
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`${insightType} 타입 데이터 조회 실패:`, error);
            return [];
        }
    }
    
    // 해석 템플릿 다양화 함수
    getRandomInterpretationTemplate() {
        const templates = [
            'narrative', 'reflective', 'action', 'symbolic', 'personal', 'seasonal'
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    
    // 다양한 해석 템플릿 적용
    applyInterpretationTemplate(cardMeaning, card, template, lifePathNumber, birthSeason) {
        const cardName = card.name;
        const isReversed = card.reversed;
        
        switch (template) {
            case 'narrative':
                return `현재 당신의 상황에서 ${cardMeaning}가 중요한 역할을 하고 있습니다.`;
                
            case 'reflective':
                return `${cardName}은 ${cardMeaning}를 통해 당신에게 메시지를 전하고 있습니다.`;
                
            case 'action':
                return `이 시점에서 ${cardMeaning}는 당신의 현재 상황에 있어 의미있는 변화를 나타냅니다.`;
                
            case 'symbolic':
                return `${cardName}의 상징적 의미는 ${cardMeaning}를 나타내며, 이는 당신의 삶에 깊은 영향을 미칠 것입니다.`;
                
            case 'personal':
                if (lifePathNumber) {
                    return `당신의 생명수 ${lifePathNumber}의 에너지가 ${cardMeaning}와 조화를 이루며 특별한 의미를 만들어냅니다.`;
                }
                return cardMeaning;
                
            case 'seasonal':
                if (birthSeason) {
                    return `${birthSeason.name}의 특성과 ${cardMeaning}가 만나 당신에게 특별한 통찰을 제공합니다.`;
                }
                return cardMeaning;
                
            default:
                return cardMeaning;
        }
    }
    
    // 카드별 고유 기본 의미 생성 (개선된 버전)
    generateCardSpecificBaseMeaning(card, lifePathInsight, seasonInsight, isReversed) {
        const cardName = card.name;
        const cardNumber = card.number;
        const cardSuit = card.suit;
        const isMajor = card.major_minor === 'major';
        
        // 기본 수치학적 의미
        let baseMeaning = lifePathInsight?.insight_text || '';
        
        // 카드별 특성에 따른 기본 의미 조정
        if (isMajor) {
            // 메이저 아르카나 - 카드별 고유한 특성 반영 (개선된 표현)
            switch (cardName) {
                case 'The Fool':
                    baseMeaning = isReversed ? '새로운 시작에 대한 두려움이 당신을 막고 있는 상황' : '새로운 모험을 시작할 준비가 된 상태';
                    break;
                case 'The Magician':
                    baseMeaning = isReversed ? '자신의 능력을 의심하는 내면의 갈등' : '자신의 창의적 능력을 활용할 수 있는 기회';
                    break;
                case 'The High Priestess':
                    baseMeaning = isReversed ? '직감을 무시하고 있는 현재의 상태' : '내면의 지혜를 신뢰할 수 있는 시기';
                    break;
                case 'The Empress':
                    baseMeaning = isReversed ? '창조적 에너지가 억제되고 있는 상황' : '풍요로운 창조적 에너지를 발휘할 수 있는 기회';
                    break;
                case 'The Emperor':
                    baseMeaning = isReversed ? '리더십을 포기하고 있는 내면의 갈등' : '강력한 리더십을 발휘할 수 있는 시기';
                    break;
                case 'The Hierophant':
                    baseMeaning = isReversed ? '전통적 가치를 무시하고 있는 현재의 상태' : '전통적 지혜를 활용할 수 있는 기회';
                    break;
                case 'The Lovers':
                    baseMeaning = isReversed ? '관계에서의 선택이 어려워지는 상황' : '진정한 사랑과 조화를 추구할 수 있는 시기';
                    break;
                case 'The Chariot':
                    baseMeaning = isReversed ? '의지력이 약해지는 내면의 갈등' : '강한 의지력으로 목표를 향해 나아갈 수 있는 기회';
                    break;
                case 'Strength':
                    baseMeaning = isReversed ? '내면의 힘을 의심하는 현재의 상태' : '내면의 강인함을 활용할 수 있는 시기';
                    break;
                case 'The Hermit':
                    baseMeaning = isReversed ? '고독을 두려워하는 내면의 갈등' : '내면의 지혜를 찾을 수 있는 기회';
                    break;
                case 'Wheel of Fortune':
                    baseMeaning = isReversed ? '변화를 두려워하는 현재의 상태' : '운명의 변화를 받아들일 수 있는 시기';
                    break;
                case 'Justice':
                    baseMeaning = isReversed ? '공정함을 포기하고 있는 내면의 갈등' : '공정하고 균형잡힌 판단을 할 수 있는 기회';
                    break;
                case 'The Hanged Man':
                    baseMeaning = isReversed ? '새로운 관점을 찾지 못하는 현재의 상태' : '다른 관점에서 상황을 바라볼 수 있는 기회';
                    break;
                case 'Death':
                    baseMeaning = isReversed ? '변화를 거부하는 내면의 갈등' : '새로운 시작을 위한 변화를 받아들일 수 있는 시기';
                    break;
                case 'Temperance':
                    baseMeaning = isReversed ? '균형을 잃고 있는 현재의 상태' : '조화와 균형을 유지할 수 있는 기회';
                    break;
                case 'The Devil':
                    baseMeaning = isReversed ? '속박에서 벗어나려는 내면의 갈등' : '물질적 속박을 인식할 수 있는 기회';
                    break;
                case 'The Tower':
                    baseMeaning = isReversed ? '변화를 두려워하는 현재의 상태' : '갑작스러운 변화를 통해 성장할 수 있는 기회';
                    break;
                case 'The Star':
                    baseMeaning = isReversed ? '희망을 잃고 있는 내면의 갈등' : '희망과 영감을 가지고 나아갈 수 있는 시기';
                    break;
                case 'The Moon':
                    baseMeaning = isReversed ? '직감을 신뢰하지 못하는 현재의 상태' : '직감과 상상력을 활용할 수 있는 기회';
                    break;
                case 'The Sun':
                    baseMeaning = isReversed ? '긍정적 에너지를 찾지 못하는 상황' : '밝고 긍정적인 에너지로 나아갈 수 있는 시기';
                    break;
                case 'Judgement':
                    baseMeaning = isReversed ? '새로운 깨달음을 찾지 못하는 내면의 갈등' : '새로운 깨달음과 부활을 통해 성장할 수 있는 기회';
                    break;
                case 'The World':
                    baseMeaning = isReversed ? '완성에 대한 두려움이 있는 현재의 상태' : '완성과 성취를 향해 나아갈 수 있는 시기';
                    break;
                default:
                    baseMeaning = isReversed ? '새로운 관점을 찾아야 하는 상황' : '카드의 에너지를 활용할 수 있는 기회';
            }
        } else {
            // 마이너 아르카나 - 수트별 특성 반영 (개선된 표현)
            const suitBaseMeanings = {
                'wands': {
                    upright: '창의적 에너지와 열정을 가지고 나아갈 수 있는 기회',
                    reversed: '창의적 에너지가 부족한 현재의 상태'
                },
                'cups': {
                    upright: '감정적 직관과 사랑을 가지고 나아갈 수 있는 시기',
                    reversed: '감정적 균형을 찾아야 하는 상황'
                },
                'swords': {
                    upright: '명확한 사고와 의사결정을 할 수 있는 기회',
                    reversed: '사고의 혼란을 정리해야 하는 현재의 상태'
                },
                'pentacles': {
                    upright: '실용적 접근과 물질적 안정을 추구할 수 있는 시기',
                    reversed: '물질적 가치를 재평가해야 하는 상황'
                }
            };
            
            baseMeaning = isReversed ? suitBaseMeanings[cardSuit].reversed : suitBaseMeanings[cardSuit].upright;
            
            // 숫자별 특성 추가 (개선된 표현)
            if (cardNumber >= 1 && cardNumber <= 10) {
                const numberMeanings = {
                    1: '새로운 시작을 할 수 있는 기회',
                    2: '균형과 선택을 신중히 할 수 있는 시기',
                    3: '창조와 성장을 추구할 수 있는 기회',
                    4: '안정과 기반을 다질 수 있는 시기',
                    5: '변화와 도전을 받아들일 수 있는 기회',
                    6: '조화와 균형을 유지할 수 있는 시기',
                    7: '내면의 성찰을 할 수 있는 기회',
                    8: '발전과 성취를 추구할 수 있는 시기',
                    9: '만족과 성취를 느낄 수 있는 기회',
                    10: '완성과 새로운 순환을 준비할 수 있는 시기'
                };
                baseMeaning = numberMeanings[cardNumber] || baseMeaning;
            } else if (cardNumber >= 11 && cardNumber <= 14) {
                // Court Cards (개선된 표현)
                const courtMeanings = {
                    11: '새로운 학습을 시작할 수 있는 기회',
                    12: '적극적인 행동을 취할 수 있는 시기',
                    13: '지혜로운 판단을 할 수 있는 기회',
                    14: '성숙한 리더십을 발휘할 수 있는 시기'
                };
                baseMeaning = courtMeanings[cardNumber] || baseMeaning;
            }
        }
        
        return baseMeaning;
    }
    
    // 카드별 고유 특성을 반영한 컨텍스트 생성 (개선된 버전)
    generateCardSpecificContext(card, purpose, isReversed) {
        const cardName = card.name;
        const cardNumber = card.number;
        const cardSuit = card.suit;
        const isMajor = card.major_minor === 'major';
        
        // 카드별 고유한 특성에 따른 컨텍스트 생성
        let cardContext = '';
        
        if (isMajor) {
            // 메이저 아르카나 카드별 특성 - 더 자연스러운 문장으로
            switch (cardName) {
                case 'The Fool':
                    cardContext = isReversed ? ' 이는 새로운 시작에 대한 두려움을 극복해야 하는 시기임을 나타냅니다' : ' 이는 새로운 모험을 시작할 준비가 되었음을 의미합니다';
                    break;
                case 'The Magician':
                    cardContext = isReversed ? ' 이는 자신의 능력을 의심하지 말아야 함을 상기시킵니다' : ' 이는 자신의 창의적 능력을 활용할 수 있는 기회임을 나타냅니다';
                    break;
                case 'The High Priestess':
                    cardContext = isReversed ? ' 이는 직감을 무시하지 말아야 함을 강조합니다' : ' 이는 내면의 지혜를 신뢰할 수 있는 시기임을 의미합니다';
                    break;
                case 'The Empress':
                    cardContext = isReversed ? ' 이는 창조적 에너지를 억누르지 말아야 함을 상기시킵니다' : ' 이는 풍요로운 창조적 에너지를 발휘할 수 있는 기회임을 나타냅니다';
                    break;
                case 'The Emperor':
                    cardContext = isReversed ? ' 이는 리더십을 포기하지 말아야 함을 강조합니다' : ' 이는 강력한 리더십을 발휘할 수 있는 시기임을 의미합니다';
                    break;
                case 'The Hierophant':
                    cardContext = isReversed ? ' 이는 전통적 가치를 무시하지 말아야 함을 상기시킵니다' : ' 이는 전통적 지혜를 활용할 수 있는 기회임을 나타냅니다';
                    break;
                case 'The Lovers':
                    cardContext = isReversed ? ' 이는 관계에서의 선택을 신중히 해야 함을 강조합니다' : ' 이는 진정한 사랑과 조화를 추구할 수 있는 시기임을 의미합니다';
                    break;
                case 'The Chariot':
                    cardContext = isReversed ? ' 이는 의지력을 잃지 말아야 함을 상기시킵니다' : ' 이는 강한 의지력으로 목표를 향해 나아갈 수 있는 기회임을 나타냅니다';
                    break;
                case 'Strength':
                    cardContext = isReversed ? ' 이는 내면의 힘을 의심하지 말아야 함을 강조합니다' : ' 이는 내면의 강인함을 활용할 수 있는 시기임을 의미합니다';
                    break;
                case 'The Hermit':
                    cardContext = isReversed ? ' 이는 고독을 두려워하지 말아야 함을 상기시킵니다' : ' 이는 내면의 지혜를 찾을 수 있는 기회임을 나타냅니다';
                    break;
                case 'Wheel of Fortune':
                    cardContext = isReversed ? ' 이는 변화를 두려워하지 말아야 함을 강조합니다' : ' 이는 운명의 변화를 받아들일 수 있는 시기임을 의미합니다';
                    break;
                case 'Justice':
                    cardContext = isReversed ? ' 이는 공정함을 포기하지 말아야 함을 상기시킵니다' : ' 이는 공정하고 균형잡힌 판단을 할 수 있는 기회임을 나타냅니다';
                    break;
                case 'The Hanged Man':
                    cardContext = isReversed ? ' 이는 새로운 관점을 찾아야 함을 강조합니다' : ' 이는 다른 관점에서 상황을 바라볼 수 있는 기회임을 의미합니다';
                    break;
                case 'Death':
                    cardContext = isReversed ? ' 이는 변화를 거부하지 말아야 함을 상기시킵니다' : ' 이는 새로운 시작을 위한 변화를 받아들일 수 있는 시기임을 나타냅니다';
                    break;
                case 'Temperance':
                    cardContext = isReversed ? ' 이는 균형을 잃지 말아야 함을 강조합니다' : ' 이는 조화와 균형을 유지할 수 있는 기회임을 의미합니다';
                    break;
                case 'The Devil':
                    cardContext = isReversed ? ' 이는 속박에서 벗어나야 함을 상기시킵니다' : ' 이는 물질적 속박을 인식할 수 있는 기회임을 나타냅니다';
                    break;
                case 'The Tower':
                    cardContext = isReversed ? ' 이는 변화를 두려워하지 말아야 함을 강조합니다' : ' 이는 갑작스러운 변화를 통해 성장할 수 있는 기회임을 의미합니다';
                    break;
                case 'The Star':
                    cardContext = isReversed ? ' 이는 희망을 잃지 말아야 함을 상기시킵니다' : ' 이는 희망과 영감을 가지고 나아갈 수 있는 시기임을 나타냅니다';
                    break;
                case 'The Moon':
                    cardContext = isReversed ? ' 이는 직감을 신뢰해야 함을 강조합니다' : ' 이는 직감과 상상력을 활용할 수 있는 기회임을 의미합니다';
                    break;
                case 'The Sun':
                    cardContext = isReversed ? ' 이는 긍정적 에너지를 찾아야 함을 상기시킵니다' : ' 이는 밝고 긍정적인 에너지로 나아갈 수 있는 시기임을 나타냅니다';
                    break;
                case 'Judgement':
                    cardContext = isReversed ? ' 이는 새로운 깨달음을 찾아야 함을 강조합니다' : ' 이는 새로운 깨달음과 부활을 통해 성장할 수 있는 기회임을 의미합니다';
                    break;
                case 'The World':
                    cardContext = isReversed ? ' 이는 완성에 대한 두려움을 극복해야 함을 상기시킵니다' : ' 이는 완성과 성취를 향해 나아갈 수 있는 시기임을 나타냅니다';
                    break;
                default:
                    cardContext = isReversed ? ' 이는 새로운 관점을 찾아야 함을 강조합니다' : ' 이는 카드의 에너지를 활용할 수 있는 기회임을 의미합니다';
            }
        } else {
            // 마이너 아르카나 - 더 자연스러운 문장으로
            const suitContexts = {
                'wands': {
                    upright: ' 이는 창의적 에너지와 열정을 가지고 나아갈 수 있는 기회임을 나타냅니다',
                    reversed: ' 이는 창의적 에너지를 회복해야 하는 시기임을 의미합니다'
                },
                'cups': {
                    upright: ' 이는 감정적 직관과 사랑을 가지고 나아갈 수 있는 기회임을 나타냅니다',
                    reversed: ' 이는 감정적 균형을 찾아야 하는 시기임을 의미합니다'
                },
                'swords': {
                    upright: ' 이는 명확한 사고와 의사결정을 할 수 있는 기회임을 나타냅니다',
                    reversed: ' 이는 사고의 혼란을 정리해야 하는 시기임을 의미합니다'
                },
                'pentacles': {
                    upright: ' 실용적 접근과 물질적 안정을 추구하세요',
                    reversed: ' 물질적 가치를 재평가하세요'
                }
            };
            
            const suitContext = suitContexts[cardSuit] || suitContexts['wands'];
            cardContext = isReversed ? suitContext.reversed : suitContext.upright;
            
            // 숫자별 특성 추가 (Page, Knight, Queen, King 제외)
            if (cardNumber >= 1 && cardNumber <= 10) {
                const numberContexts = {
                    1: ' 새로운 시작을 하세요',
                    2: ' 균형과 선택을 신중히 하세요',
                    3: ' 창조와 성장을 추구하세요',
                    4: ' 안정과 기반을 다지세요',
                    5: ' 변화와 도전을 받아들이세요',
                    6: ' 조화와 균형을 유지하세요',
                    7: ' 내면의 성찰을 하세요',
                    8: ' 발전과 성취를 추구하세요',
                    9: ' 만족과 성취를 느끼세요',
                    10: ' 완성과 새로운 순환을 준비하세요'
                };
                cardContext = numberContexts[cardNumber] || cardContext;
            } else if (cardNumber >= 11 && cardNumber <= 14) {
                // Court Cards (Page, Knight, Queen, King)
                const courtContexts = {
                    11: ' 새로운 학습을 시작하세요',
                    12: ' 적극적인 행동을 취하세요',
                    13: ' 지혜로운 판단을 하세요',
                    14: ' 성숙한 리더십을 발휘하세요'
                };
                cardContext = courtContexts[cardNumber] || cardContext;
            }
        }
        
        return cardContext;
    }
    
    // 카드 조합 상호작용 분석 및 해석 생성
    analyzeCardCombination(cards, purpose) {
        const [pastCard, presentCard, futureCard] = cards;
        
        // 카드 간 에너지 조화/갈등 분석
        const energyAnalysis = this.analyzeEnergyFlow(pastCard, presentCard, futureCard);
        
        // 카드 간 관계 분석
        const relationshipAnalysis = this.analyzeCardRelationships(pastCard, presentCard, futureCard);
        
        // 목적별 특화 해석
        const purposeSpecificAnalysis = this.analyzePurposeSpecificFlow(pastCard, presentCard, futureCard, purpose);
        
        return {
            energyFlow: energyAnalysis,
            relationships: relationshipAnalysis,
            purposeFlow: purposeSpecificAnalysis
        };
    }
    
    // 에너지 흐름 분석 (과거→현재→미래)
    analyzeEnergyFlow(pastCard, presentCard, futureCard) {
        const pastEnergy = this.getCardEnergyLevel(pastCard);
        const presentEnergy = this.getCardEnergyLevel(presentCard);
        const futureEnergy = this.getCardEnergyLevel(futureCard);
        
        // 에너지 변화 패턴 분석
        const energyPattern = this.detectEnergyPattern(pastEnergy, presentEnergy, futureEnergy);
        
        // 흐름 설명 생성
        let flowDescription = '';
        
        if (energyPattern === 'rising') {
            flowDescription = '과거의 도전을 통해 현재의 성장을 이루고, 미래로 향한 긍정적인 변화의 흐름을 보여줍니다.';
        } else if (energyPattern === 'falling') {
            flowDescription = '과거의 높은 에너지에서 현재의 도전을 거쳐 미래의 새로운 균형을 찾아가는 과정을 나타냅니다.';
        } else if (energyPattern === 'stable') {
            flowDescription = '과거부터 미래까지 일관된 에너지를 유지하며 안정적인 발전을 추구하는 흐름을 보여줍니다.';
        } else if (energyPattern === 'volatile') {
            flowDescription = '과거와 현재, 미래 간의 에너지 변화가 크며, 이를 통해 깊은 통찰과 성장을 얻을 수 있는 기회를 제공합니다.';
        }
        
        return {
            pattern: energyPattern,
            description: flowDescription,
            levels: { past: pastEnergy, present: presentEnergy, future: futureEnergy }
        };
    }
    
    // 카드 에너지 레벨 계산
    getCardEnergyLevel(card) {
        const isReversed = card.reversed;
        const isMajor = card.major_minor === 'major';
        
        // 기본 에너지 점수 (0-100)
        let baseEnergy = 50;
        
        // 메이저 아르카나별 에너지 점수
        if (isMajor) {
            const majorEnergyScores = {
                'The Fool': 60, 'The Magician': 80, 'The High Priestess': 70,
                'The Empress': 85, 'The Emperor': 90, 'The Hierophant': 75,
                'The Lovers': 80, 'The Chariot': 85, 'Strength': 80,
                'The Hermit': 65, 'Wheel of Fortune': 70, 'Justice': 75,
                'The Hanged Man': 60, 'Death': 40, 'Temperance': 75,
                'The Devil': 30, 'The Tower': 20, 'The Star': 85,
                'The Moon': 55, 'The Sun': 95, 'Judgement': 80, 'The World': 90
            };
            baseEnergy = majorEnergyScores[card.name] || 50;
        } else {
            // 마이너 아르카나 에너지 점수
            const suitEnergyScores = {
                'wands': 75, 'cups': 70, 'swords': 60, 'pentacles': 65
            };
            baseEnergy = suitEnergyScores[card.suit] || 50;
            
            // 숫자별 조정
            if (card.number >= 1 && card.number <= 10) {
                const numberAdjustments = {
                    1: 10, 2: 5, 3: 15, 4: 0, 5: -10, 6: 10, 7: -5, 8: 15, 9: 20, 10: 5
                };
                baseEnergy += numberAdjustments[card.number] || 0;
            }
        }
        
        // 역방향 조정
        if (isReversed) {
            baseEnergy = Math.max(0, baseEnergy - 20);
        }
        
        return Math.min(100, Math.max(0, baseEnergy));
    }
    
    // 에너지 패턴 감지
    detectEnergyPattern(pastEnergy, presentEnergy, futureEnergy) {
        const energyDiff1 = presentEnergy - pastEnergy;
        const energyDiff2 = futureEnergy - presentEnergy;
        
        // 에너지 변화 임계값
        const threshold = 15;
        
        if (energyDiff1 > threshold && energyDiff2 > threshold) {
            return 'rising'; // 상승
        } else if (energyDiff1 < -threshold && energyDiff2 < -threshold) {
            return 'falling'; // 하락
        } else if (Math.abs(energyDiff1) < threshold && Math.abs(energyDiff2) < threshold) {
            return 'stable'; // 안정
        } else {
            return 'volatile'; // 변동
        }
    }
    
    // 카드 간 관계 분석
    analyzeCardRelationships(pastCard, presentCard, futureCard) {
        const relationships = [];
        
        // 과거-현재 관계
        const pastPresentRelation = this.analyzeTwoCardRelationship(pastCard, presentCard, '과거', '현재');
        relationships.push(pastPresentRelation);
        
        // 현재-미래 관계
        const presentFutureRelation = this.analyzeTwoCardRelationship(presentCard, futureCard, '현재', '미래');
        relationships.push(presentFutureRelation);
        
        // 전체 조합 관계
        const overallRelation = this.analyzeOverallCombination(pastCard, presentCard, futureCard);
        relationships.push(overallRelation);
        
        return relationships;
    }
    
    // 두 카드 간 관계 분석
    analyzeTwoCardRelationship(card1, card2, period1, period2) {
        const energy1 = this.getCardEnergyLevel(card1);
        const energy2 = this.getCardEnergyLevel(card2);
        const energyDiff = energy2 - energy1;
        
        let relationshipType = '';
        let description = '';
        
        if (Math.abs(energyDiff) < 10) {
            relationshipType = 'harmony';
            description = `${period1}와 ${period2}의 에너지가 조화롭게 연결되어 있습니다.`;
        } else if (energyDiff > 20) {
            relationshipType = 'growth';
            description = `${period1}에서 ${period2}로 향한 긍정적인 성장과 발전의 흐름을 보여줍니다.`;
        } else if (energyDiff < -20) {
            relationshipType = 'challenge';
            description = `${period1}에서 ${period2}로 이어지는 도전과 극복의 과정을 나타냅니다.`;
        } else {
            relationshipType = 'transition';
            description = `${period1}에서 ${period2}로의 자연스러운 전환과 변화를 보여줍니다.`;
        }
        
        return {
            type: relationshipType,
            description: description,
            energyDifference: energyDiff
        };
    }
    
    // 전체 조합 분석
    analyzeOverallCombination(pastCard, presentCard, futureCard) {
        const energies = [
            this.getCardEnergyLevel(pastCard),
            this.getCardEnergyLevel(presentCard),
            this.getCardEnergyLevel(futureCard)
        ];
        
        const avgEnergy = energies.reduce((a, b) => a + b, 0) / 3;
        const energyVariance = this.calculateVariance(energies);
        
        let combinationType = '';
        let description = '';
        
        if (energyVariance < 100) {
            combinationType = 'balanced';
            description = '세 카드가 균형잡힌 에너지를 보여주며, 안정적이고 조화로운 발전을 예시합니다.';
        } else if (avgEnergy > 70) {
            combinationType = 'powerful';
            description = '강력한 에너지의 조합으로, 큰 변화와 성취의 가능성을 나타냅니다.';
        } else if (avgEnergy < 40) {
            combinationType = 'transformative';
            description = '낮은 에너지의 조합이지만, 이를 통해 깊은 성찰과 변화의 기회를 제공합니다.';
        } else {
            combinationType = 'dynamic';
            description = '다양한 에너지의 조합으로, 변화와 성장의 역동적인 과정을 보여줍니다.';
        }
        
        return {
            type: combinationType,
            description: description,
            averageEnergy: avgEnergy,
            variance: energyVariance
        };
    }
    
    // 분산 계산
    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
        return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    }
    
    // 목적별 특화 흐름 분석
    analyzePurposeSpecificFlow(pastCard, presentCard, futureCard, purpose) {
        const purposeFlowTemplates = {
            'love': {
                'rising': '과거의 관계 경험을 바탕으로 현재의 사랑을 더 깊이 이해하고, 미래의 진정한 조화를 향해 나아가는 여정을 보여줍니다.',
                'falling': '과거의 이상적인 사랑에서 현재의 현실적 도전을 거쳐, 미래의 성숙한 사랑을 찾아가는 과정을 나타냅니다.',
                'stable': '일관된 사랑의 에너지를 유지하며, 과거부터 미래까지 안정적이고 깊은 관계를 발전시켜 나갑니다.',
                'volatile': '사랑의 다양한 측면을 경험하며, 이를 통해 더욱 깊고 의미있는 관계를 이해하게 됩니다.'
            },
            'career': {
                'rising': '과거의 경험과 학습을 바탕으로 현재의 성장을 이루고, 미래의 성공과 성취를 향해 나아가는 경력을 보여줍니다.',
                'falling': '과거의 높은 성취에서 현재의 도전을 거쳐, 미래의 새로운 방향과 균형을 찾아가는 과정을 나타냅니다.',
                'stable': '안정적인 경력 발전을 유지하며, 과거의 기반을 바탕으로 미래의 지속적인 성장을 추구합니다.',
                'volatile': '다양한 경험과 변화를 통해 더욱 풍부하고 의미있는 경력을 만들어 나갑니다.'
            },
            'health': {
                'rising': '과거의 건강 관리 노력을 바탕으로 현재의 웰빙을 향상시키고, 미래의 최적의 건강 상태를 달성해 나갑니다.',
                'falling': '과거의 건강한 상태에서 현재의 도전을 거쳐, 미래의 새로운 건강한 균형을 찾아가는 과정을 나타냅니다.',
                'stable': '일관된 건강 관리와 웰빙을 유지하며, 과거부터 미래까지 지속적인 건강을 추구합니다.',
                'volatile': '건강의 다양한 측면을 이해하며, 이를 통해 더욱 균형잡힌 웰빙을 달성해 나갑니다.'
            },
            'spirituality': {
                'rising': '과거의 영적 탐구를 바탕으로 현재의 깨달음을 얻고, 미래의 더욱 깊은 영적 성장을 향해 나아갑니다.',
                'falling': '과거의 높은 영적 상태에서 현재의 의문을 거쳐, 미래의 새로운 영적 이해를 찾아가는 과정을 나타냅니다.',
                'stable': '안정적인 영적 발전을 유지하며, 과거의 기반을 바탕으로 미래의 지속적인 영적 성장을 추구합니다.',
                'volatile': '영성의 다양한 측면을 경험하며, 이를 통해 더욱 깊고 의미있는 영적 여정을 만들어 나갑니다.'
            }
        };
        
        const energyPattern = this.detectEnergyPattern(
            this.getCardEnergyLevel(pastCard),
            this.getCardEnergyLevel(presentCard),
            this.getCardEnergyLevel(futureCard)
        );
        
        const template = purposeFlowTemplates[purpose] || purposeFlowTemplates['love'];
        const description = template[energyPattern] || template['stable'];
        
        return {
            purpose: purpose,
            pattern: energyPattern,
            description: description
        };
    }
}
