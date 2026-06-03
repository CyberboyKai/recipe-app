import { Link } from 'react-router-dom';

import saladImage from '../assets/salad.png';
import ReviewCard from './ReviewCard.jsx';

const HeroSection = ({ reviews }) => {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Fresh ideas for every table</p>
        <h1 id="hero-title">Easy recipes for any occasion</h1>
        <p>
          Discover simple meals, save your favorites, and share new recipes with
          the team.
        </p>
        <Link className="button primary" to="/login">
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
