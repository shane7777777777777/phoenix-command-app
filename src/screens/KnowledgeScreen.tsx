// ============================================================================
// PHOENIX COMMAND -- Knowledge Screen
// NEC 2023 code search + Rexel product search
// ============================================================================

import React, { useState } from 'react';
import { Search, Book, Package, ChevronRight, ExternalLink } from 'lucide-react';
import { colors, gradients, shadows, borderRadius, touchTarget, spacing } from '../theme/tokens';
import { glassCard, screenContainer, redGlowOverlay, screenTitle, sectionHeader } from '../theme/styles';
import type { KnowledgeResult, NECCode, RexelProduct } from '../types';

// TODO(gateway): Import and use echo-api searchKnowledge()
// import { searchKnowledge } from '../api/echo-api';

const KnowledgeScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'nec-code' | 'product'>('all');
  const [results, setResults] = useState<KnowledgeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // TODO(gateway): Replace with searchKnowledge(query, searchType === 'all' ? undefined : searchType)
      // Simulated delay for stub
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock results for demonstration
      const mockResults: KnowledgeResult[] = [
        {
          type: 'nec-code',
          title: 'NEC 210.8(A) - GFCI Protection for Personnel',
          content:
            'Ground-fault circuit-interrupter protection for personnel shall be provided for all 125V through 250V receptacles installed in bathrooms, garages, outdoors, crawl spaces, basements, kitchens, sinks, boathouses, bathtubs/showers, laundry areas.',
          relevance: 0.95,
          source: 'NEC 2023',
          data: {
            article: '210',
            section: '8(A)',
            title: 'GFCI Protection for Personnel',
            content: 'Ground-fault circuit-interrupter protection...',
            year: 2023,
            tags: ['GFCI', 'receptacles', 'residential', 'safety'],
          } as NECCode,
        },
        {
          type: 'product',
          title: 'Eaton BR 200A Main Breaker Panel',
          content: 'Eaton BR 200A 30-Space 40-Circuit Indoor Main Breaker Load Center. Compatible with BR series breakers.',
          relevance: 0.82,
          source: 'Rexel Catalog',
          data: {
            sku: 'BR3040B200V',
            name: 'Eaton BR 200A Main Breaker Panel',
            description: '200A 30-Space 40-Circuit Indoor Main Breaker Load Center',
            category: 'Panels & Load Centers',
            price: 189.99,
            inStock: true,
            manufacturer: 'Eaton',
          } as RexelProduct,
        },
      ];

      setResults(mockResults);
    } catch (err) {
      console.error('[Knowledge] Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const typeButtons: { id: 'all' | 'nec-code' | 'product'; label: string }[] = [
    { id: 'all', label: 'ALL' },
    { id: 'nec-code', label: 'NEC CODES' },
    { id: 'product', label: 'PRODUCTS' },
  ];

  return (
    <div style={screenContainer}>
      <div style={redGlowOverlay} />
      <h2 style={screenTitle}>KNOWLEDGE BASE</h2>

      {/* Search Card */}
      <div style={glassCard}>
        <h3 style={sectionHeader}>
          <Search size={18} color={colors.accent} />
          SEARCH
        </h3>

        <div style={{ display: 'flex', gap: `${spacing.sm}px`, marginBottom: `${spacing.md}px` }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search NEC codes, products, electrical knowledge..."
            style={{
              flex: 1,
              padding: '14px',
              background: colors.glassWhite,
              border: `1px solid ${colors.borderGold}`,
              borderRadius: `${borderRadius.lg}px`,
              fontSize: '13px',
              outline: 'none',
              color: colors.text,
              minHeight: touchTarget.minHeight,
            }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            style={{
              padding: '14px 20px',
              background: gradients.redButton,
              color: colors.text,
              border: 'none',
              borderRadius: `${borderRadius.lg}px`,
              fontSize: '13px',
              fontWeight: '700',
              cursor: isSearching ? 'wait' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: shadows.redButton,
              minHeight: touchTarget.minHeight,
              opacity: isSearching || !query.trim() ? 0.7 : 1,
            }}
          >
            {isSearching ? '...' : 'SEARCH'}
          </button>
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {typeButtons.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSearchType(id)}
              style={{
                padding: '8px 16px',
                background: searchType === id ? colors.primary + '30' : colors.glassWhite,
                border: `1px solid ${searchType === id ? colors.primary + '60' : colors.border}`,
                borderRadius: `${borderRadius.pill}px`,
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                color: searchType === id ? colors.primary : colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results.map((result, idx) => (
        <div key={idx} style={{ ...glassCard, borderColor: result.type === 'nec-code' ? colors.accent + '40' : colors.primary + '30' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: `${borderRadius.md}px`,
                background: result.type === 'nec-code' ? colors.accent + '20' : colors.primary + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {result.type === 'nec-code' ? (
                <Book size={18} color={colors.accent} />
              ) : (
                <Package size={18} color={colors.primary} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: result.type === 'nec-code' ? colors.accent : colors.primary,
                  }}
                >
                  {result.type === 'nec-code' ? 'NEC 2023' : 'REXEL'}
                </span>
                <span style={{ fontSize: '10px', color: colors.textTertiary }}>
                  {Math.round(result.relevance * 100)}% match
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '6px' }}>
                {result.title}
              </div>
              <div style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: '1.5' }}>
                {result.content}
              </div>

              {/* Product-specific details */}
              {result.type === 'product' && result.data && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {(result.data as RexelProduct).price && (
                    <span style={{ fontSize: '16px', fontWeight: '700', color: colors.accent }}>
                      ${(result.data as RexelProduct).price?.toFixed(2)}
                    </span>
                  )}
                  {(result.data as RexelProduct).inStock !== undefined && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: (result.data as RexelProduct).inStock ? colors.success : colors.danger,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {(result.data as RexelProduct).inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: colors.textTertiary }}>
                    SKU: {(result.data as RexelProduct).sku}
                  </span>
                </div>
              )}

              {/* NEC-specific details */}
              {result.type === 'nec-code' && result.data && (
                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(result.data as NECCode).tags?.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        padding: '2px 8px',
                        background: colors.accent + '15',
                        border: `1px solid ${colors.accent}30`,
                        borderRadius: `${borderRadius.pill}px`,
                        fontSize: '10px',
                        color: colors.accent,
                        fontWeight: '600',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* No Results */}
      {hasSearched && results.length === 0 && !isSearching && (
        <div style={{ ...glassCard, textAlign: 'center', padding: '40px 24px' }}>
          <Search size={40} color={colors.textTertiary} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text, marginBottom: '4px' }}>
            No Results Found
          </div>
          <div style={{ fontSize: '13px', color: colors.textSecondary }}>
            Try a different search term or category
          </div>
        </div>
      )}

      {/* Quick Links */}
      {!hasSearched && (
        <div style={glassCard}>
          <h3 style={sectionHeader}>
            <Book size={18} color={colors.accent} />
            QUICK REFERENCES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'NEC 210 - Branch Circuits',
              'NEC 220 - Branch-Circuit Load Calculations',
              'NEC 230 - Services',
              'NEC 240 - Overcurrent Protection',
              'NEC 250 - Grounding and Bonding',
              'NEC 300 - General Requirements for Wiring',
            ].map((ref, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(ref);
                  setSearchType('nec-code');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: colors.glassWhite,
                  border: `1px solid ${colors.borderWhiteSubtle}`,
                  borderRadius: `${borderRadius.md}px`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: colors.text,
                  fontSize: '13px',
                  fontWeight: '500',
                  textAlign: 'left',
                }}
              >
                {ref}
                <ChevronRight size={14} color={colors.textTertiary} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeScreen;
