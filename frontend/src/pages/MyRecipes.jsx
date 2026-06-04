import heroDish from '../assets/salad.png';
import ReviewCard from '../components/ReviewCard.jsx';

const placeholderReviews = [
  {
    name: 'Sarah M.',
    quote: 'The recipes here are not only delicious but also easy to follow.',
    position: 'left',
  },
  {
    name: 'Farellin J.',
    quote: "I've discovered a treasure trove of meatless recipes that have made my meals.",
    position: 'right',
  },
];

const MyRecipes = () => {
  return (
    <div className="app-shell">
      <main>
        <section className="hero-section" aria-labelledby="my-recipes-title">
          <div className="hero-copy">
            <div className="hero-text">
              <h1 id="my-recipes-title">Easy recipes for any occasion</h1>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured dish">
            <img src={heroDish} alt="Avocado egg bowl with broccoli and toast" />
            {placeholderReviews.map((review) => (
              <ReviewCard
                key={review.name}
                name={review.name}
                quote={review.quote}
                position={review.position}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyRecipes;
