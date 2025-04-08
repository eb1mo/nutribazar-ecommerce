import { useEffect } from 'react';
import { useSearch } from '../Context/SearchContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchResults = () => {
  const { searchResults, searchQuery } = useSearch();

  useEffect(() => {
    if (!searchQuery) {
      toast.info('Please enter a search term');
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Search Results for "{searchQuery}"
        </h1>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your search.</p>
            <Link
              to="/shop"
              className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/singleproduct/${product._id}`}>
                  <img
                    src={`http://localhost:5000/${product.productImage}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-medium">
                      NPR {product.price}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 