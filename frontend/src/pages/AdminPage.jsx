import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './AdminPage.css';

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeToReject, setRecipeToReject] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(); 
          
          const response = await axios.get('/api/admin/pending', {
            headers: { Authorization: `Bearer ${token}` } 
          });
          setPendingRecipes(response.data);
        } catch (err) {
          console.error('Error fetching recipes:', err);
          setPendingRecipes([]);
          setError('Failed to load pending recipes. Please try again later.');
        } finally { 
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (recipeId) => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.put(`/api/admin/approve/${recipeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      
      setPendingRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeId));
      
      setSelectedRecipe(null);
      
    } catch (err) {
      console.error('Error approving recipe:', err);
      alert('Failed to approve recipe.');
    }
  };

  const confirmReject = async () => {
    if (!recipeToReject) return;
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();

      await axios.delete(`/api/admin/reject/${recipeToReject.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPendingRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.id !== recipeToReject.id));
      
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

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRecipe(null)}>×</button>
            
            <h2>{selectedRecipe.title}</h2>
            <p className="modal-author">Submitted by: {selectedRecipe.author}</p>
            
            {selectedRecipe.image && (
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title} 
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
              />
            )}
            
            {/* 1. Added Ingredients Section */}
            <div className="modal-section" style={{ marginTop: '20px' }}>
              <h4>Ingredients</h4>
              <ul style={{ paddingLeft: '24px', listStyleType: 'disc' }}>
                {selectedRecipe.ingredients?.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {/* This handles both simple strings and complex Spoonacular database objects */}
                    {typeof ing === 'string' ? ing : `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()}
                  </li>
                )) || <li>No ingredients listed.</li>}
              </ul>
            </div>

            {/* 2. Fixed Instructions Section Numbering */}
            <div className="modal-section" style={{ marginTop: '20px' }}>
              <h4>Instructions</h4>
              {/* Added paddingLeft and listStyleType to override the Vite CSS reset */}
              <ol style={{ paddingLeft: '24px', listStyleType: 'decimal' }}>
                {selectedRecipe.instructions?.map((inst, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{inst}</li>
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