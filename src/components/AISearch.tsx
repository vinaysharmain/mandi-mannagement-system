import React, { useState, useEffect, useRef } from 'react';
import { Search, Bot, Sparkles, TrendingUp, Package, Users, AlertTriangle, X, ArrowRight } from 'lucide-react';

interface SearchResult {
  type: 'inventory' | 'customer' | 'sale' | 'purchase' | 'insight' | 'action';
  title: string;
  description: string;
  data: any;
  relevance: number;
  action?: string;
}

interface SearchResponse {
  results: SearchResult[];
  summary: string;
  suggestions: string[];
}

interface AISearchProps {
  onResultSelect?: (result: SearchResult) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

const AISearch: React.FC<AISearchProps> = ({ onResultSelect, onSuggestionClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [summary, setSummary] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSummary('');
      setSuggestions([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: searchQuery,
          type: 'search'
        })
      });

      const data = await response.json();
      
      if (data.type === 'search') {
        setResults(data.results || []);
        setSummary(data.summary || '');
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setSummary('Search failed. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'customer':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'sale':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'purchase':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'insight':
        return <Sparkles className="w-4 h-4 text-orange-600" />;
      case 'action':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Search className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-emerald-100 text-emerald-800';
      case 'purchase':
        return 'bg-purple-100 text-purple-800';
      case 'insight':
        return 'bg-orange-100 text-orange-800';
      case 'action':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
          placeholder="Ask AI anything about your mandi..."
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            isExpanded ? 'bg-white shadow-lg' : 'bg-gray-50'
          }`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setSummary('');
              setSuggestions([]);
              setShowResults(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600 animate-pulse" />
                <span className="text-gray-600">AI is searching...</span>
              </div>
            </div>
          ) : (
            <>
              {summary && (
                <div className="p-4 border-b border-gray-100 bg-blue-50">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">AI Summary</h3>
                      <p className="text-sm text-blue-700">{summary}</p>
                    </div>
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  <h4 className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Search Results
                  </h4>
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (onResultSelect) {
                          onResultSelect(result);
                        }
                        setShowResults(false);
                      }}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {result.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(result.type)}`}>
                              {result.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {result.relevance}% match
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {result.description}
                          </p>
                          {result.action && (
                            <div className="mt-2 flex items-center space-x-1 text-blue-600">
                              <ArrowRight className="w-3 h-3" />
                              <span className="text-xs">{result.action}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Suggested Queries
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="inline-flex items-center px-3 py-1 text-sm bg-white text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && results.length === 0 && query && (
                <div className="p-4 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords or ask a specific question</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearch;