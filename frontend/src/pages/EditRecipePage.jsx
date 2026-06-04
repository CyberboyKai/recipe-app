import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import useAuth from '../hooks/useAuth.js';

const emptyIngredient = () => ({ name: '', amount: '' });

const EditRecipePage = () => {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [healthScore, setHealthScore] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient()]);
  const [instructions, setInstructions] = useState(['']);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user === null) navigate('/login');
  }, [user, navigate]);

  // prefill form with existing recipe data
  useEffect(() => {
    if (!user || !id) return;
    const fetchRecipe = async () => {
      const snap = await getDoc(doc(db, 'recipes', id));
      if (!snap.exists()) {
        setError('Recipe not found.');
        setLoading(false);
        return;
      }
      const data = snap.data();
      // only the author can edit
      if (data.authorId !== user.uid) {
        navigate('/my-recipes');
        return;
      }
      setTitle(data.title || '');
      setDescription(data.description || '');
      setPrepTime(data.prepTime ?? '');
      setCookTime(data.cookTime ?? '');
      setServings(data.servings ?? '');
      setHealthScore(data.healthScore ?? '');
      setIngredients(data.ingredients?.length ? data.ingredients : [emptyIngredient()]);
      setInstructions(data.instructions?.length ? data.instructions : ['']);
      if (data.image) setImageUrl(data.image);
      setLoading(false);
    };
    fetchRecipe();
  }, [user, id, navigate]);

  const addIngredient = () => setIngredients((prev) => [...prev, emptyIngredient()]);
  const removeIngredient = (i) => setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i, field, value) =>
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing)));

  const addStep = () => setInstructions((prev) => [...prev, '']);
  const removeStep = (i) => setInstructions((prev) => prev.filter((_, idx) => idx !== i));
  const updateStep = (i, value) =>
    setInstructions((prev) => prev.map((s, idx) => (idx === i ? value : s)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Recipe name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'recipes', id), {
        title: title.trim(),
        description: description.trim(),
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        servings: Number(servings) || 1,
        healthScore: Number(healthScore) || 0,
        ingredients: ingredients.filter((ing) => ing.name.trim()),
        instructions: instructions.filter((s) => s.trim()),
        published: false,
        image: imageUrl.trim() || null,
        // RecipeCard display fields
        time: Number(prepTime) + Number(cookTime) || 0,
        level: Number(healthScore) || 0,
        updatedAt: serverTimestamp(),
      });
      navigate('/my-recipes');
    } catch (err) {
      console.error(err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user === undefined || loading) {
    return <div className="app-shell" style={{ paddingTop: 80, textAlign: 'center' }}>Loading…</div>;
  }

  return (
    <div className="app-shell" style={{ paddingTop: 48, maxWidth: 680, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Edit Recipe</h1>
      <p style={{ color: '#77736d', marginBottom: 32 }}>
        Saving changes will mark this recipe as <strong>unpublished</strong> for review.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Image URL */}
        <div className="form-field">
          <label className="form-label">Recipe Image URL</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl.trim() && (
            <img src={imageUrl.trim()} alt="Preview" style={{ marginTop: 10, maxHeight: 180, borderRadius: 6, objectFit: 'cover' }} />
          )}
        </div>

        <div className="form-field">
          <label className="form-label">Recipe Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Spicy Garlic Noodles"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className="form-label">Description</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Short description of the recipe"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div className="form-field">
            <label className="form-label">Prep Time (min)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              placeholder="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Cook Time (min)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              placeholder="0"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Servings</label>
            <input
              className="form-input"
              type="number"
              min={1}
              placeholder="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Health Score (0–100)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={healthScore}
              onChange={(e) => setHealthScore(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Ingredients</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  className="form-input"
                  style={{ flex: 2 }}
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                />
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18, padding: '0 4px' }}
                    aria-label="Remove ingredient"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="button ghost compact" onClick={addIngredient} style={{ marginTop: 10, alignSelf: 'flex-start' }}>
            + Add Ingredient
          </button>
        </div>

        <div className="form-field">
          <label className="form-label">Directions</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {instructions.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ paddingTop: 10, color: '#77736d', fontSize: 14, minWidth: 52 }}>Step {i + 1}</span>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ flex: 1, resize: 'vertical' }}
                  placeholder={`Describe step ${i + 1}`}
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18, padding: '8px 4px' }}
                    aria-label="Remove step"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="button ghost compact" onClick={addStep} style={{ marginTop: 10, alignSelf: 'flex-start' }}>
            + Add Step
          </button>
        </div>

        {error && <p style={{ color: '#c0392b', margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="button dark" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="button ghost" onClick={() => navigate('/my-recipes')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipePage;
