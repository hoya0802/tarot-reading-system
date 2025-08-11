// 타로 카드 스프레드 컴포넌트
import { getCardColorTheme } from '../utils/cardUtils.js';

const CardSpread = {
    props: ['selectedCards'],
    data() {
        return {
            positions: [
                { name: '과거', description: '지나간 일들, 기반이 되는 상황' },
                { name: '현재', description: '현재 상황, 당면한 문제' },
                { name: '미래', description: '앞으로의 전개, 가능성' }
            ]
        };
    },
    template: `
        <div class="section card-spread" v-if="selectedCards && selectedCards.length === 3">
            <h2>🔮 카드 스프레드</h2>
            <p class="text-center mb-4">선택된 3장의 카드로 과거-현재-미래를 읽어보세요</p>
            
            <div class="spread-container">
                <div class="spread-grid">
                    <div 
                        v-for="(card, index) in selectedCards" 
                        :key="card.id"
                        class="spread-position"
                        :class="'position-' + (index + 1)">
                        
                        <div class="position-info">
                            <h3>{{ positions[index].name }}</h3>
                            <p>{{ positions[index].description }}</p>
                        </div>
                        
                        <div class="card-display" v-html="getCardDisplay(card, index)"></div>
                        
                        <div class="card-details">
                            <h4>{{ card.name }}</h4>
                            <p class="card-type">{{ getCardTypeDisplay(card) }}</p>
                            <p class="card-orientation" :class="{ 'reversed': card.reversed }">
                                {{ card.reversed ? '역방' : '정방' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="spread-actions">
                <button @click="startReading" class="btn btn-primary">
                    🔮 리딩 시작하기
                </button>
                <button @click="reshuffle" class="btn btn-secondary">
                    🔄 다시 섞기
                </button>
            </div>
        </div>
    `,
    methods: {
        getCardDisplay(card, positionIndex) {
            const theme = getCardColorTheme(card.name, card.suit);
            const displayName = card.name || 'Unknown Card';
            const displaySuit = card.suit ? ` of ${card.suit}` : '';
            const displayNumber = card.number !== null ? ` (${card.number})` : '';
            
            return `
                <div class="spread-card-placeholder" style="
                    width: 280px;
                    height: 450px;
                    background: linear-gradient(135deg, ${theme.bg}, ${theme.bg}dd);
                    border: 3px solid ${theme.text};
                    border-radius: 15px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 20px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.3);
                    transform: ${card.reversed ? 'rotate(180deg)' : 'rotate(0deg)'};
                    transition: transform 0.3s ease;
                    margin: 0 auto;
                ">
                    <div style="
                        color: ${theme.text};
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 10px;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
                    <div style="
                        color: ${theme.text};
                        font-size: 10px;
                        opacity: 0.6;
                        margin-top: 10px;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                    ">
                        ${card.reversed ? 'Reversed' : 'Upright'}
                    </div>
                </div>
            `;
        },
        
        getCardTypeDisplay(card) {
            if (card.major_minor === 'major') {
                return '메이저 아르카나';
            } else {
                const suitNames = {
                    'wands': '완드',
                    'cups': '컵',
                    'swords': '검',
                    'pentacles': '펜타클'
                };
                return `마이너 아르카나 - ${suitNames[card.suit] || card.suit}`;
            }
        },
        
        startReading() {
            this.$emit('start-reading', this.selectedCards);
        },
        
        reshuffle() {
            this.$emit('reshuffle');
        }
    }
};

// Vue 컴포넌트 등록
if (typeof Vue !== 'undefined') {
    Vue.createApp({}).component('card-spread', CardSpread);
}
