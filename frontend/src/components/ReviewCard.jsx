const ReviewCard = ({ name, quote, position }) => {
  return (
    <article className={`review-card review-card-${position}`}>
      <div className="stars">★★★★★</div>
      <p>{quote}</p>
      <span>{name}</span>
    </article>
  );
};

export default ReviewCard;
