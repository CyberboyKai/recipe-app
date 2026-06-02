import { Link, NavLink } from 'react-router-dom';

const recipes = [
  {
    title: 'Creamy Salad',
    time: '10 Mins',
    servings: '2 Serving',
    level: 'Easy',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Tofu Tomato Soup',
    time: '15 Mins',
    servings: '3 Serving',
    level: 'Easy',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Crunchy Potatoes',
    time: '10 Mins',
    servings: '2 Serving',
    level: 'Easy',
    image:
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Mushroom Soup',
    time: '25 Mins',
    servings: '2 Serving',
    level: 'Medium',
    image:
      'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Raspberry Pancake',
    time: '30 Mins',
    servings: '1 Serving',
    level: 'Easy',
    image:
      'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Beef Teriyaki',
    time: '20 Mins',
    servings: '1 Serving',
    level: 'Medium',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
  },
];

const navItems = ['Home', 'Recipe', 'My Recipe', 'Create Recipe'];

const Home = () => {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/">
          RECIPE-APP
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive && item === 'Home' ? 'nav-link active' : 'nav-link'
              }
              key={item}
              to={item === 'Home' ? '/' : '#'}
            >
              {item}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="button ghost" to="/login">
            Sign in
          </Link>
          <Link className="button dark" to="/login">
            Register
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Fresh ideas for every table</p>
            <h1 id="hero-title">Easy recipes for any occasion</h1>
            <p>
              Discover simple meals, save your favorites, and share new recipes
              with the team.
            </p>
            <Link className="button primary" to="/login">
              Start cooking
            </Link>
          </div>

          <div className="hero-visual" aria-label="Featured meal">
            <img
              src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80"
              alt="A colorful healthy meal on a plate"
            />
            <article className="review-card review-card-left">
              <div className="stars">★★★★★</div>
              <p>The recipes here are quick, clear, and easy to follow.</p>
              <span>Sarah M.</span>
            </article>
            <article className="review-card review-card-right">
              <div className="stars">★★★★★</div>
              <p>I found weeknight meals that actually fit my schedule.</p>
              <span>Farellin J.</span>
            </article>
          </div>
        </section>

        <section className="recipes-section" aria-labelledby="recipes-title">
          <div className="section-heading">
            <div>
              <h2 id="recipes-title">Discover, Create, Share</h2>
              <p>Check our most popular recipes of this week</p>
            </div>
            <Link className="button primary compact" to="#">
              See All
            </Link>
          </div>

          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.title}>
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipe-meta">
                  <span>{recipe.time}</span>
                  <span>{recipe.servings}</span>
                  <span>{recipe.level}</span>
                </div>
                <div className="recipe-body">
                  <h3>{recipe.title}</h3>
                  <Link to="#">View Recipe</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
