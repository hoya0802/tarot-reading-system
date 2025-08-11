// 카드 관련 유틸리티 함수들

// 카드 그룹 분류
const CARD_GROUPS = {
    // 메이저 아르카나 그룹
    'new_beginnings': {
        cards: [0, 1, 2], // The Fool, The Magician, The High Priestess
        core_meaning: '새로운 시작과 가능성',
        variations: {
            0: '순수한 모험과 무지',
            1: '의지와 창조력',
            2: '직관과 신비'
        }
    },
    
    'relationships': {
        cards: [6, 11, 14], // The Lovers, Justice, Temperance
        core_meaning: '관계와 조화',
        variations: {
            6: '사랑과 선택',
            11: '균형과 공정',
            14: '절제와 조화'
        }
    },
    
    'transformation': {
        cards: [13, 16, 20], // Death, The Tower, Judgement
        core_meaning: '변화와 변형',
        variations: {
            13: '끝과 새로운 시작',
            16: '급격한 변화와 파괴',
            20: '부활과 깨달음'
        }
    },
    
    'material_world': {
        cards: [3, 4, 5], // The Empress, The Emperor, The Hierophant
        core_meaning: '물질적 세계와 권위',
        variations: {
            3: '풍요와 창조',
            4: '권위와 안정',
            5: '전통과 교육'
        }
    },
    
    'spiritual_journey': {
        cards: [7, 8, 9], // The Chariot, Strength, The Hermit
        core_meaning: '영적 여정과 성장',
        variations: {
            7: '의지와 승리',
            8: '내면의 힘',
            9: '고독과 지혜'
        }
    },
    
    'completion': {
        cards: [10, 12, 15, 17, 18, 19, 21], // Wheel of Fortune, The Hanged Man, The Devil, The Star, The Moon, The Sun, The World
        core_meaning: '완성과 순환',
        variations: {
            10: '운명과 변화',
            12: '희생과 새로운 관점',
            15: '속박과 욕망',
            17: '희망과 영감',
            18: '환상과 직관',
            19: '성공과 활력',
            21: '완성과 통합'
        }
    }
};

// 마이너 아르카나 수트별 그룹
const MINOR_SUITS = {
    'wands': {
        core_meaning: '에너지와 열정',
        element: '불',
        keywords: '창의성, 열정, 행동, 성장'
    },
    'cups': {
        core_meaning: '감정과 직관',
        element: '물',
        keywords: '사랑, 감정, 직관, 관계'
    },
    'swords': {
        core_meaning: '지적 사고',
        element: '공기',
        keywords: '사고, 논리, 갈등, 진실'
    },
    'pentacles': {
        core_meaning: '물질과 실용',
        element: '땅',
        keywords: '재정, 실용, 건강, 안정'
    }
};

// 카드 그룹 찾기
function findCardGroup(cardId) {
    for (const [groupName, group] of Object.entries(CARD_GROUPS)) {
        if (group.cards.includes(cardId)) {
            return {
                name: groupName,
                core_meaning: group.core_meaning,
                variation: group.variations[cardId] || group.core_meaning
            };
        }
    }
    return null;
}

// 수트 그룹 찾기
function findSuitGroup(suit) {
    return MINOR_SUITS[suit] || null;
}

/**
 * 카드 이미지 URL 생성 (플레이스홀더 포함)
 * @param {string} cardName - 카드 이름
 * @param {string} suit - 카드 무늬 (마이너 아르카나용)
 * @param {number} number - 카드 번호
 * @returns {string} 이미지 URL
 */
function getCardImageUrl(cardName, suit = null, number = null) {
    // 실제 이미지가 있는 경우 우선 사용
    if (cardName && cardName.trim()) {
        // 메이저 아르카나의 경우
        if (!suit && number !== null) {
            return `https://via.placeholder.com/300x500/2c3e50/ffffff?text=${encodeURIComponent(cardName)}`;
        }
        // 마이너 아르카나의 경우
        else if (suit && number !== null) {
            return `https://via.placeholder.com/300x500/34495e/ffffff?text=${encodeURIComponent(cardName)}`;
        }
    }
    
    // 기본 플레이스홀더
    return 'https://via.placeholder.com/300x500/95a5a6/ffffff?text=Tarot+Card';
}

/**
 * 카드 색상 테마 생성
 * @param {string} cardName - 카드 이름
 * @param {string} suit - 카드 무늬
 * @returns {object} 색상 정보
 */
function getCardColorTheme(cardName, suit = null) {
    const themes = {
        // 메이저 아르카나 테마
        'The Fool': { bg: '#f39c12', text: '#ffffff' },
        'The Magician': { bg: '#e74c3c', text: '#ffffff' },
        'The High Priestess': { bg: '#9b59b6', text: '#ffffff' },
        'The Empress': { bg: '#27ae60', text: '#ffffff' },
        'The Emperor': { bg: '#e67e22', text: '#ffffff' },
        'The Hierophant': { bg: '#8e44ad', text: '#ffffff' },
        'The Lovers': { bg: '#e91e63', text: '#ffffff' },
        'The Chariot': { bg: '#2196f3', text: '#ffffff' },
        'Strength': { bg: '#ff5722', text: '#ffffff' },
        'The Hermit': { bg: '#607d8b', text: '#ffffff' },
        'Wheel of Fortune': { bg: '#ff9800', text: '#ffffff' },
        'Justice': { bg: '#4caf50', text: '#ffffff' },
        'The Hanged Man': { bg: '#795548', text: '#ffffff' },
        'Death': { bg: '#424242', text: '#ffffff' },
        'Temperance': { bg: '#00bcd4', text: '#ffffff' },
        'The Devil': { bg: '#9c27b0', text: '#ffffff' },
        'The Tower': { bg: '#f44336', text: '#ffffff' },
        'The Star': { bg: '#3f51b5', text: '#ffffff' },
        'The Moon': { bg: '#673ab7', text: '#ffffff' },
        'The Sun': { bg: '#ffc107', text: '#000000' },
        'Judgement': { bg: '#009688', text: '#ffffff' },
        'The World': { bg: '#4caf50', text: '#ffffff' },
        
        // 마이너 아르카나 테마 (무늬별)
        'wands': { bg: '#ff5722', text: '#ffffff' },
        'cups': { bg: '#2196f3', text: '#ffffff' },
        'swords': { bg: '#9e9e9e', text: '#ffffff' },
        'pentacles': { bg: '#4caf50', text: '#ffffff' }
    };
    
    // 카드 이름으로 직접 매칭
    if (themes[cardName]) {
        return themes[cardName];
    }
    
    // 무늬별 매칭
    if (suit && themes[suit.toLowerCase()]) {
        return themes[suit.toLowerCase()];
    }
    
    // 기본 테마
    return { bg: '#2c3e50', text: '#ffffff' };
}

/**
 * 카드 플레이스홀더 HTML 생성
 * @param {string} cardName - 카드 이름
 * @param {string} suit - 카드 무늬
 * @param {number} number - 카드 번호
 * @param {boolean} isReversed - 역방 여부
 * @returns {string} HTML 문자열
 */
function generateCardPlaceholder(cardName, suit = null, number = null, isReversed = false) {
    const theme = getCardColorTheme(cardName, suit);
    const displayName = cardName || 'Unknown Card';
    const displaySuit = suit ? ` of ${suit}` : '';
    const displayNumber = number !== null ? ` (${number})` : '';
    
    return `
        <div class="card-placeholder" style="
            width: 300px;
            height: 500px;
            background: linear-gradient(135deg, ${theme.bg}, ${theme.bg}dd);
            border: 2px solid ${theme.text};
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transform: ${isReversed ? 'rotate(180deg)' : 'rotate(0deg)'};
            transition: transform 0.3s ease;
        ">
            <div style="
                color: ${theme.text};
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            ">
                ${displayName}
            </div>
            <div style="
                color: ${theme.text};
                font-size: 14px;
                opacity: 0.8;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            ">
                ${displaySuit}${displayNumber}
            </div>
            <div style="
                color: ${theme.text};
                font-size: 12px;
                opacity: 0.6;
                margin-top: 10px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            ">
                ${isReversed ? 'Reversed' : 'Upright'}
            </div>
        </div>
    `;
}

/**
 * 카드 기본 이미지 생성 (플레이스홀더)
 * @param {object} card - 카드 객체
 * @returns {string} 카드 이미지 HTML
 */
function getCardDefaultImage(card) {
    const theme = getCardColorTheme(card.name, card.suit);
    const displayName = card.name || 'Unknown Card';
    const displaySuit = card.suit ? ` of ${card.suit}` : '';
    const displayNumber = card.number !== null ? ` (${card.number})` : '';
    
    return `
        <div class="card-placeholder" style="
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, ${theme.bg}, ${theme.bg}dd);
            border: 2px solid ${theme.text};
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            margin-bottom: 10px;
        ">
            <div style="
                color: ${theme.text};
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 5px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            ">
                ${displayName}
            </div>
            <div style="
                color: ${theme.text};
                font-size: 12px;
                opacity: 0.8;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            ">
                ${displaySuit}${displayNumber}
            </div>
        </div>
    `;
}

// 카드 이름 포맷팅
function formatCardName(card) {
    if (card.major_minor === 'major') {
        return card.name;
    } else {
        const numberNames = {
            1: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
            6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
            11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King'
        };
        const suitNames = {
            'wands': 'Wands',
            'cups': 'Cups',
            'swords': 'Swords',
            'pentacles': 'Pentacles'
        };
        return `${numberNames[card.number]} of ${suitNames[card.suit]}`;
    }
}

// 카드 타입 표시
function getCardTypeDisplay(card) {
    if (card.major_minor === 'major') {
        return '메이저 아르카나';
    } else {
        const suitNames = {
            'wands': '완드',
            'cups': '컵',
            'swords': '검',
            'pentacles': '펜타클'
        };
        return `마이너 아르카나 - ${suitNames[card.suit]}`;
    }
}

// 목적별 아이콘
function getPurposeIcon(purposeCode) {
    const icons = {
        'love': '💕',
        'career': '💼',
        'daily': '☀️',
        'health': '🌿',
        'money': '💰',
        'family': '🏠',
        'study': '📚',
        'travel': '✈️'
    };
    return icons[purposeCode] || '🎯';
}

// 목적별 이름
function getPurposeName(purposeCode) {
    const names = {
        'love': '연애/사랑',
        'career': '직장/일',
        'daily': '오늘의 운세',
        'health': '건강',
        'money': '금전',
        'family': '가족',
        'study': '학업',
        'travel': '여행'
    };
    return names[purposeCode] || purposeCode;
}

// 카드 조합 해시 생성
function generateCombinationHash(card1, card2, card3, reversed1, reversed2, reversed3) {
    const cards = [card1, card2, card3].sort((a, b) => a.id - b.id);
    const reversed = [reversed1, reversed2, reversed3];
    
    return `${cards[0].id}-${cards[1].id}-${cards[2].id}-${reversed.join('')}`;
}

// 카드 필터링
function filterCards(cards, filter) {
    if (!filter || filter === 'all') {
        return cards;
    }
    
    if (filter === 'major') {
        return cards.filter(card => card.major_minor === 'major');
    }
    
    if (filter === 'minor') {
        return cards.filter(card => card.major_minor === 'minor');
    }
    
    // 수트별 필터링
    if (['wands', 'cups', 'swords', 'pentacles'].includes(filter)) {
        return cards.filter(card => card.suit === filter);
    }
    
    return cards;
}

// 카드 검색
function searchCards(cards, searchTerm) {
    if (!searchTerm) {
        return cards;
    }
    
    const term = searchTerm.toLowerCase();
    return cards.filter(card => 
        card.name.toLowerCase().includes(term) ||
        card.keywords.toLowerCase().includes(term) ||
        (card.suit && card.suit.toLowerCase().includes(term))
    );
}

// 카드 정렬
function sortCards(cards, sortBy = 'id') {
    const sorted = [...cards];
    
    switch (sortBy) {
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'type':
            return sorted.sort((a, b) => {
                if (a.major_minor !== b.major_minor) {
                    return a.major_minor === 'major' ? -1 : 1;
                }
                return a.id - b.id;
            });
        case 'suit':
            return sorted.sort((a, b) => {
                if (a.major_minor !== b.major_minor) {
                    return a.major_minor === 'major' ? -1 : 1;
                }
                if (a.suit !== b.suit) {
                    return (a.suit || '').localeCompare(b.suit || '');
                }
                return a.number - b.number;
            });
        default:
            return sorted.sort((a, b) => a.id - b.id);
    }
}

// 로컬 스토리지 캐싱
const CardCache = {
    set(key, data) {
        try {
            localStorage.setItem(`tarot_${key}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('로컬 스토리지 저장 실패:', error);
        }
    },
    
    get(key, maxAge = 3600000) { // 기본 1시간
        try {
            const cached = localStorage.getItem(`tarot_${key}`);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > maxAge) {
                localStorage.removeItem(`tarot_${key}`);
                return null;
            }
            
            return data;
        } catch (error) {
            console.warn('로컬 스토리지 읽기 실패:', error);
            return null;
        }
    },
    
    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('tarot_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('로컬 스토리지 정리 실패:', error);
        }
    }
};

// 모든 함수와 상수를 한 번에 export
export {
    CARD_GROUPS,
    MINOR_SUITS,
    findCardGroup,
    findSuitGroup,
    getCardImageUrl,
    getCardColorTheme,
    generateCardPlaceholder,
    getCardDefaultImage,
    formatCardName,
    getCardTypeDisplay,
    getPurposeIcon,
    getPurposeName,
    generateCombinationHash,
    filterCards,
    searchCards,
    sortCards,
    CardCache
};
