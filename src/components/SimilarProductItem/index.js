// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachItem} = props
  const {imageUrl, title, brand, price, rating} = eachItem

  return (
    <li className="similar-item">
      <img
        src={imageUrl}
        className="similar-image"
        alt={`similar product ${title}`}
      />
      <p className="title-similar">{title}</p>
      <p className="brand-name">by {brand}</p>
      <div className="bottom-div">
        <p className="price-bottom">Rs {price} /-</p>
        <p className="rating-bottom">
          <span>{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="star-img"
            alt="star"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
