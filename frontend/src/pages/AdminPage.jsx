import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the review modal and the delete confirmation modal
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeToReject, setRecipeToReject] = useState(null);

  useEffect(() => {
    const fetchPendingRecipes = async () => {
        const response = await axios.get('/api/admin/pending');
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setPendingRecipes([]);
        setError('Failed to load pending recipes. Please try again later.');
      }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingRecipes();
  }, []);

  const handleApprove = async (recipeId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${recipeId}`);
      setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== recipeId));
      setSelectedRecipe(null); 
    } catch (err) {
      console.error('Error approving recipe:', err);
      alert('Failed to approve recipe.');
    }
  };

  // Triggers the custom confirmation modal instead of Chrome's native alert
  const confirmReject = async () => {
    if (!recipeToReject) return;
    
      await axios.delete(`/api/admin/reject/${recipeToReject.id}`);
      setPendingRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeToReject.id));
      // Close all modals
      setRecipeToReject(null);
      setSelectedRecipe(null); 
    } catch (err) {
      console.error('Error rejecting recipe:', err);
      alert('Backend failed to delete. Check your terminal.');
      setRecipeToReject(null);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Review and manage user-submitted recipes.</p>
      </header>

      {isLoading && <div className="loading-state">Loading pending recipes...</div>}
      {error && pendingRecipes.length === 0 && <div className="error-state">{error}</div>}

      {!isLoading && (
        <div className="recipe-grid">
          {pendingRecipes.length === 0 && !error ? (
            <div className="empty-state">
              <h3>All caught up!</h3>
              <p>No recipes are currently pending review.</p>
            </div>
          ) : (
            pendingRecipes.map((recipe) => (
              <div key={recipe.id} className="admin-recipe-card">
                <div className="card-content">
                  <h3>{recipe.title}</h3>
                  <p className="author-tag">By {recipe.author}</p>
                </div>
                <div className="admin-actions">
                  <button onClick={() => setSelectedRecipe(recipe)} className="view-btn">
                    Review Details
                  </button>
                  <div className="action-group">
                    <button onClick={() => handleApprove(recipe.id)} className="approve-btn">Approve</button>
                    {/* Opens the custom rejection modal */}
                    <button onClick={() => setRecipeToReject(recipe)} className="reject-btn">Reject</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 1. Modal for reviewing full recipe details */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRecipe(null)}>×</button>
            <h2>{selectedRecipe.title}</h2>
            <p className="modal-author">Submitted by: {selectedRecipe.author}</p>
            
            <div className="modal-section">
              <h4>Ingredients</h4>
              <ul>
                {selectedRecipe.ingredients?.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                )) || <li>No ingredients listed.</li>}
              </ul>
            </div>

            <div className="modal-section">
              <h4>Instructions</h4>
              <ol>
                {selectedRecipe.instructions?.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                )) || <li>No instructions listed.</li>}
              </ol>
            </div>

            <div className="modal-actions">
              <button onClick={() => handleApprove(selectedRecipe.id)} className="approve-btn large">
                Publish Recipe
              </button>
              {/* Opens the custom rejection modal */}
              <button onClick={() => setRecipeToReject(selectedRecipe)} className="reject-btn large">
                Reject & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Confirmation Modal for Deletion */}
      {recipeToReject && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="confirm-modal">
            <h3>Are you sure?</h3>
            <p>You are about to permanently delete <strong>{recipeToReject.title}</strong>. This action cannot be undone.</p>
            <div className="confirm-actions">
              <button onClick={() => setRecipeToReject(null)} className="cancel-btn">Cancel</button>
              <button onClick={confirmReject} className="confirm-delete-btn">Yes, Delete Recipe</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;