import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css'; 

function AdminPage() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/admin/pending');
        setPendingRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingRecipes();
  }, []);

  const handleApprove = async (recipeId) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/approve/${recipeId}`);
      // Remove the approved recipe from the screen
      setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <h2>Pending Recipe Approvals</h2>
      
      {isLoading ? <p>Loading recipes...</p> : (
        <div className="recipe-grid">
          {pendingRecipes.length === 0 ? <p>No recipes pending review!</p> : null}
          
          {pendingRecipes.map((recipe) => (
            <div key={recipe.id} className="admin-recipe-card">
              <h3>{recipe.title}</h3>
              <p><strong>Submitted by:</strong> {recipe.author}</p>
              <div className="admin-actions">
                <button onClick={() => handleApprove(recipe.id)} className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;