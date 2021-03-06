import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'proptypes';

const RecipeItem = ({ recipe }) =>
  (<div className="col l6">
    <div className="card views-small">
      <div className="card-image">
        <Link to={`/recipes/${recipe.id}`}>
          <img
            src={recipe.image ? `../uploads/${recipe.image}`
              : './css/img/spice.jpg'}
            alt={recipe.recipeName}
          />
        </Link>
        <span className="card-title">{recipe.views} Views</span>
      </div>
      <div className="card-content small-cards">
        <span className="card-title">
          <strong>{recipe.recipeName}</strong>
        </span>
        <span className="right">
          <i
            className="material-icons tiny reaction"
          >thumb_down</i>{recipe.downvote}
        </span>
        <span className="right">
          <i
            className="material-icons tiny reaction"
          >thumb_up</i>{recipe.upvote}
        </span>
        <Link
          to={`/recipes/${recipe.id}`}
          className="chip teal white-text"
        >{recipe.category}
        </Link>
      </div>
    </div>
  </div>);

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number,
    views: PropTypes.number,
    upvote: PropTypes.number,
    downvote: PropTypes.number,
    recipeName: PropTypes.string,
    category: PropTypes.string,
    ingredients: PropTypes.string,
    instructions: PropTypes.string,
    image: PropTypes.string
  }).isRequired
};

export default RecipeItem;
