import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPlusSquare} from 'react-icons/bs'
import {FiMinusSquare} from 'react-icons/fi'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatus1 = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productItem: {},
    similarProducts: [],
    apiStatus: apiStatus1.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatus1.loading,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    console.log(response)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const newProduct = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        totalReviews: data.total_reviews,
        title: data.title,
      }
      const newSimilarProducts = data.similar_products.map(eachItem => ({
        title: eachItem.title,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        brand: eachItem.brand,
        id: eachItem.id,
      }))
      console.log(newSimilarProducts)
      console.log(newProduct)
      this.setState({
        productItem: newProduct,
        similarProducts: newSimilarProducts,
        apiStatus: apiStatus1.success,
      })
    } else if (response.status === 404) {
      return this.setState({
        apiStatus: apiStatus1.failure,
      })
    }
    return null
  }

  decreaseQuantity = () => {
    const {quantity} = this.state

    this.setState(prevState => ({
      quantity: prevState.quantity - 1,
    }))
    if (quantity === 1) {
      return this.setState({
        quantity: 1,
      })
    }
    return null
  }

  increaseQuantity = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  renderProductItem = () => {
    const {productItem, quantity, similarProducts} = this.state
    const {
      imageUrl,
      title,
      brand,
      description,
      rating,
      totalReviews,
      price,
      availability,
    } = productItem
    return (
      <>
        <Header />
        <div className="product-main-container">
          <div className="product-container">
            <img src={imageUrl} alt={title} className="product-item" />
            <div className="content-container">
              <h1>{title}</h1>
              <p className="bold-text">
                Rs <span>{price}</span>/-
              </p>
              <div className="rating-review">
                <div className="rating-container1">
                  <p>{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="rating-img"
                  />
                </div>
                <p>{totalReviews} Reviews</p>
              </div>
              <p>{description}</p>
              <p className="bold-text">
                Availability: <span>{availability}</span>
              </p>
              <p className="bold-text">
                Brand:<span> {brand}</span>
              </p>
              <hr />
              <div className="quantity-container">
                <button
                  type="button"
                  className="button"
                  onClick={this.decreaseQuantity}
                >
                  <FiMinusSquare />
                </button>
                <p className="bold-text">{quantity}</p>
                <button
                  type="button"
                  className="button"
                  onClick={this.increaseQuantity}
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1 className="similar-heading1">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(eachItem => (
              <SimilarProductItem eachItem={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoading = () => (
    <>
      <Header />
      <div className="loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </>
  )

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureImage = () => (
    <>
      <Header />
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="img-failure"
        />
        <h1>Product Not Found</h1>
        <button
          type="button"
          onClick={this.continueShopping}
          className="cart-button"
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatus1.success:
        return this.renderProductItem()
      case apiStatus1.loading:
        return this.renderLoading()
      case apiStatus1.failure:
        return this.renderFailureImage()
      default:
        return null
    }
  }
}

export default ProductItemDetails
