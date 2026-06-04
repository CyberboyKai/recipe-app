import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js';
import useAuth from '../hooks/useAuth.js';

const emptyIngredient = () => ({ name: '', amount: '' });

const CreateRecipePage = () => {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [healthScore, setHealthScore] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient()]);
  const [instructions, setInstructions] = useState(['']);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user === null) navigate('/login');
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

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
      let imageUrl = null;
      if (imageFile) {
        const imageRef = ref(storage, `recipes/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await addDoc(collection(db, 'recipes'), {
        title: title.trim(),
        description: description.trim(),
        prepTime: Number(prepTime) || 0,
        cookTime: Number(cookTime) || 0,
        servings: Number(servings) || 1,
        healthScore: Number(healthScore) || 0,
        ingredients: ingredients.filter((ing) => ing.name.trim()),
        instructions: instructions.filter((s) => s.trim()),
        authorId: user.uid,
        author: user.displayName || user.email,
        source: 'user',
        published: true,
        // RecipeCard display fields
        time: Number(prepTime) + Number(cookTime) || 0,
        level: Number(healthScore) || 0,
        image: imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'recipes', docRef.id), { id: docRef.id });
      navigate('/my-recipes');
    } catch (err) {
      console.error(err);
      setError('Failed to create recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user === undefined) {
    return <div className="app-shell" style={{ paddingTop: 80, textAlign: 'center' }}>Loading…</div>;
  }

  return (
    <div className="app-shell" style={{ paddingTop: 48, maxWidth: 680, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Create a New Recipe</h1>
      <p style={{ color: '#77736d', marginBottom: 32 }}>Fill in the details below to share your recipe with the community.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Recipe Name */}
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

        {/* Description */}
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

        {/* Image Upload */}
        <div className="form-field">
          <label className="form-label">Recipe Image</label>
          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #d5d0c8',
            borderRadius: 8,
            padding: 24,
            cursor: 'pointer',
            background: '#fafaf9',
            gap: 8,
          }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ maxHeight: 180, borderRadius: 6, objectFit: 'cover' }} />
            ) : (
              <>
                <span style={{ fontSize: 32 }}>📷</span>
                <span style={{ fontSize: 14, color: '#77736d' }}>Click to upload an image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
          {imagePreview && (
            <button type="button" className="button ghost compact" style={{ alignSelf: 'flex-start', marginTop: 6 }}
              onClick={() => { setImageFile(null); setImagePreview(null); }}>
              Remove image
            </button>
          )}
        </div>

        {/* Time + Servings + Health Score */}
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

        {/* Ingredients */}
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

        {/* Instructions */}
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

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="button dark" disabled={submitting}>
            {submitting ? 'Saving…' : 'Submit'}
          </button>
          <button type="button" className="button ghost" onClick={() => navigate('/my-recipes')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;
