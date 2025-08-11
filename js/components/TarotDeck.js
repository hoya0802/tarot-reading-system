// 타로 덱 컴포넌트
import { filterCards, searchCards, sortCards, getCardDefaultImage, getCardTypeDisplay } from '../utils/cardUtils.js';

const TarotDeck = {
    props: ['cards'],
    data() {
        return {
            currentFilter: 'all',
            searchTerm: '',
            sortBy: 'id',
            selectedCards: [],
            filters: [
                { value: 'all', label: '전체' },
                { value: 'major', label: '메이저 아르카나' },
                { value: 'minor', label: '마이너 아르카나' },
                { value: 'wands', label: '완드' },
                { value: 'cups', label: '컵' },
                { value: 'swords', label: '검' },
                { value: 'pentacles', label: '펜타클' }
            ],
            sortOptions: [
                { value: 'id', label: '번호순' },
                { value: 'name', label: '이름순' },
                { value: 'type', label: '타입순' },
                { value: 'suit', label: '수트순' }
            ]
        };
    },
    computed: {
        filteredCards() {
            let cards = this.cards || [];
            
            // 필터링
            cards = filterCards(cards, this.currentFilter);
            
            // 검색
            cards = searchCards(cards, this.searchTerm);
            
            // 정렬
            cards = sortCards(cards, this.sortBy);
            
            return cards;
        },
        
        selectedCardIds() {
            return this.selectedCards.map(card => card.id);
        }
    },
    template: `
        <div class="section tarot-deck">
            <h2>🃏 타로 카드 선택</h2>
            <p class="text-center mb-3">3장의 카드를 선택해주세요</p>
            
            <!-- 필터 및 검색 -->
            <div class="deck-controls">
                <div class="filter-section">
                    <h4>카드 필터</h4>
                    <div class="filter-buttons">
                        <button 
                            v-for="filter in filters" 
                            :key="filter.value"
                            class="filter-btn"
                            :class="{ 'active': currentFilter === filter.value }"
                            @click="currentFilter = filter.value">
                            {{ filter.label }}
                        </button>
                    </div>
                </div>
                
                <div class="search-section">
                    <h4>카드 검색</h4>
                    <input 
                        type="text" 
                        v-model="searchTerm"
                        placeholder="카드 이름이나 키워드로 검색..."
                        class="search-input">
                </div>
                
                <div class="sort-section">
                    <h4>정렬</h4>
                    <select v-model="sortBy" class="sort-select">
                        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
            
            <!-- 선택된 카드 표시 -->
            <div v-if="selectedCards.length > 0" class="selected-cards-display">
                <h4>선택된 카드 ({{ selectedCards.length }}/3)</h4>
                <div class="selected-cards-grid">
                    <div 
                        v-for="(card, index) in selectedCards" 
                        :key="card.id"
                        class="selected-card-item">
                        <div class="card-image">
                            <span>{{ getCardDefaultImage(card) }}</span>
                        </div>
                        <div class="card-name">{{ card.name }}</div>
                        <button @click="removeCard(index)" class="remove-btn">제거</button>
                    </div>
                </div>
            </div>
            
            <!-- 카드 그리드 -->
            <div class="cards-container">
                <div class="cards-grid">
                    <div 
                        v-for="card in filteredCards" 
                        :key="card.id"
                        class="tarot-card"
                        :class="{ 'selected': selectedCardIds.includes(card.id) }"
                        @click="selectCard(card)">
                        
                        <div class="card-image">
                            <span>{{ getCardDefaultImage(card) }}</span>
                        </div>
                        
                        <div class="card-name">{{ card.name }}</div>
                        <div class="card-type">{{ getCardTypeDisplay(card) }}</div>
                        
                        <div v-if="selectedCardIds.includes(card.id)" class="selected-indicator">
                            ✓ 선택됨
                        </div>
                    </div>
                </div>
                
                <div v-if="filteredCards.length === 0" class="no-cards">
                    <p>검색 조건에 맞는 카드가 없습니다.</p>
                </div>
            </div>
            
            <!-- 선택 완료 버튼 -->
            <div v-if="selectedCards.length === 3" class="selection-complete">
                <button @click="completeSelection" class="btn btn-secondary">
                    카드 선택 완료 (3/3)
                </button>
            </div>
        </div>
    `,
    methods: {
        selectCard(card) {
            if (this.selectedCards.length >= 3) {
                alert('이미 3장의 카드를 선택했습니다.');
                return;
            }
            
            if (this.selectedCardIds.includes(card.id)) {
                alert('이미 선택된 카드입니다.');
                return;
            }
            
            this.selectedCards.push({
                ...card,
                reversed: Math.random() > 0.5 // 랜덤 역방향
            });
            
            this.$emit('card-selected', card);
        },
        
        removeCard(index) {
            this.selectedCards.splice(index, 1);
        },
        
        completeSelection() {
            if (this.selectedCards.length === 3) {
                this.$emit('selection-complete', this.selectedCards);
            }
        },
        
        getCardDefaultImage(card) {
            return getCardDefaultImage(card);
        },
        
        getCardTypeDisplay(card) {
            return getCardTypeDisplay(card);
        },
        
        clearSelection() {
            this.selectedCards = [];
        }
    }
};

// Vue 컴포넌트 등록
if (typeof Vue !== 'undefined') {
    Vue.createApp({}).component('tarot-deck', TarotDeck);
}
