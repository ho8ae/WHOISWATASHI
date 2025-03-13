const searchService = require('./search.service');

/**
 * 상품 검색 및 필터링
 */
async function searchProducts(req, res, next) {
  try {
    const searchParams = {
      keyword: req.query.keyword,
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: req.query.page,
      limit: req.query.limit
    };
    
    // 속성 필터 처리 (속성 필드는 attributes[color]=red,blue 형태로 전달)
    const attributes = {};
    for (const key in req.query) {
      if (key.startsWith('attributes[') && key.endsWith(']')) {
        const attrName = key.substring(11, key.length - 1); // 'attributes[color]' -> 'color'
        const values = req.query[key].split(',');
        attributes[attrName] = values;
      }
    }
    
    searchParams.attributes = attributes;
    
    const result = await searchService.searchProducts(searchParams);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 검색어 자동완성 제안
 */
async function getSearchSuggestions(req, res, next) {
  try {
    const { keyword, limit } = req.query;
    
    const suggestions = await searchService.getSearchSuggestions(keyword, limit);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 인기 검색어 목록
 */
async function getPopularSearchTerms(req, res, next) {
  try {
    const { limit } = req.query;
    
    const popularTerms = await searchService.getPopularSearchTerms(limit);
    
    res.json({
      success: true,
      data: popularTerms
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  searchProducts,
  getSearchSuggestions,
  getPopularSearchTerms
};