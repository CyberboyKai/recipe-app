import { Link } from 'react-router-dom';

import saladImage from '../assets/salad.png';
import ReviewCard from './ReviewCard.jsx';

import useAuth from '../hooks/useAuth.js';

const HeroSection = ({ reviews }) => {
  const { currentUser } = useAuth();

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-text">
          <p className="eyebrow">Fresh ideas for every table</p>
          <h1 id="hero-title">Easy recipes for any occasion</h1>
          <p>
            Discover simple meals, save your favorites, and share new recipes with
            the team.
          </p>
        </div>
        <Link className="button primary" to={currentUser ? '/recipes' : '/signup'}>
          Start cooking
        </Link>
      </div>

      <div className="hero-visual" aria-label="Featured meal">
        <img
          src={saladImage}
          alt="Avocado toast with egg on a plate"
        />
        {reviews.map((review) => (
          <ReviewCard
            key={review.name}
            name={review.name}
            position={review.position}
            quote={review.quote}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
