/**
 * Screenplay Pattern - Main Export File
 * Provides easy access to all Screenplay Pattern components
 */

// Actors
import { ActorManager } from './actors/ActorManager.js';
import { Actor } from './actors/Actor.js';

// Abilities
import { BrowseTheWeb } from './abilities/BrowseTheWeb.js';

// Interactions
import { Navigate } from './interactions/Navigate.js';
import { Click } from './interactions/Click.js';
import { Enter } from './interactions/Enter.js';

// Questions
import { Text } from './questions/Text.js';
import { Visibility } from './questions/Visibility.js';
import { PageTitle } from './questions/PageTitle.js';
import { CurrentUrl } from './questions/CurrentUrl.js';
import { CartBadge } from './questions/CartBadge.js';
import { CartItems } from './questions/CartItems.js';
import { ProductDetailPage } from './questions/ProductDetailPage.js';
import { CheckoutPage } from './questions/CheckoutPage.js';
import { OrderSummary } from './questions/OrderSummary.js';
import { ProductSorting } from './questions/ProductSorting.js';
import { ProductList } from './questions/ProductList.js';
import { ProductDetailButton } from './questions/ProductDetailButton.js';

// Tasks
import { Login } from './tasks/Login.js';
import { AddToCart } from './tasks/AddToCart.js';
import { ViewCart } from './tasks/ViewCart.js';
import { RemoveFromCart } from './tasks/RemoveFromCart.js';
import { NavigateToCart } from './tasks/NavigateToCart.js';
import { NavigateToProductDetail } from './tasks/NavigateToProductDetail.js';
import { AddToCartFromDetail } from './tasks/AddToCartFromDetail.js';
import { StartCheckout } from './tasks/StartCheckout.js';
import { FillCheckoutInformation } from './tasks/FillCheckoutInformation.js';
import { CompleteCheckout } from './tasks/CompleteCheckout.js';
import { SortProducts } from './tasks/SortProducts.js';
import { RemoveFromCartOnDetail } from './tasks/RemoveFromCartOnDetail.js';

// Matchers/Assertions (converting progressively)
import { Ensure } from './matchers/Ensure.js';

export {
  // Actors
  ActorManager,
  Actor,
  
  // Abilities
  BrowseTheWeb,
  
  // Interactions
  Navigate,
  Click,
  Enter,
  
  // Questions
  Text,
  Visibility,
  PageTitle,
  CurrentUrl,
  CartBadge,
  CartItems,
  ProductDetailPage,
  CheckoutPage,
  OrderSummary,
  ProductSorting,
  ProductList,
  ProductDetailButton,
  
  // Tasks
  Login,
  AddToCart,
  ViewCart,
  RemoveFromCart,
  NavigateToCart,
  NavigateToProductDetail,
  AddToCartFromDetail,
  StartCheckout,
  FillCheckoutInformation,
  CompleteCheckout,
  SortProducts,
  RemoveFromCartOnDetail,
  
  // Assertions (converting progressively)
  Ensure
}; 