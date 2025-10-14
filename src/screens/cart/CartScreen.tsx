import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import SafeScreen from '../../components/SafeScreen';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { removeFromCart, addToCart } from '../../redux/slices/cartSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchWithCurrency } from '../../utils/api';

type RootStackParamList = {
  MainTabs: undefined;
  Product: { product_id: string };
  Wishlist: undefined;
  CheckoutWebView: { sessionId: string; url?: string };
  OrderSuccess: undefined;
  CartScreen: undefined;
};

const CartScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const syncCartWithServer = async () => {
    try {
      const savedSessionId = await AsyncStorage.getItem('checkout_session_id');
      if (!savedSessionId) return;

      const url = `${BASE_URL}.syncCart`;
      const resp = await fetchWithCurrency(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: savedSessionId }),
      });

      const res = await resp.json();
      console.log('sync cart response', res);
      if (res && res.success) {
        if (res.all_product_ids && Array.isArray(res.all_product_ids)) {
          // Convert all_product_ids to integers for comparison
          const validProductIds = res.all_product_ids.map((id: string) => parseInt(id));
          cartItems.forEach(cartItem => {
            if (!validProductIds.includes(parseInt(cartItem.id))) {
              dispatch(removeFromCart({ id: cartItem.id, options: cartItem.options }));
            }
          });
        }

        if (res.update_ids && Object.keys(res.update_ids).length > 0) {
          Object.entries(res.update_ids).forEach(([id, quantity]) => {
            const cartItem = cartItems.find(item => parseInt(item.id) === parseInt(id));
            if (cartItem) {
              if (cartItem.quantity !== quantity) {
                dispatch(removeFromCart({ id: cartItem.id, options: cartItem.options }));
                dispatch(addToCart({
                  id: cartItem.id,
                  name: cartItem.name,
                  image: cartItem.image,
                  options: cartItem.options,
                  basePrice: cartItem.price,
                  specialPrice: cartItem.special,
                  quantityToAdd: Number(quantity)
                }));
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('sync cart error', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      prepareCheckoutSession();

      return () => {
        setSessionId(null);
        syncCartWithServer();
      };
    }, [cartItems])
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Shopping Cart</Text>
      <View style={{ width: 24 }} />
    </View>
  );

  const prepareCheckoutSession = async () => {
    if (cartItems.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if there's an existing session_id
      const existingSessionId = await AsyncStorage.getItem('checkout_session_id');

      const cart = cartItems.map(item => {
        const obj: any = { product_id: Number(item.id), quantity: item.quantity };
        if (item.options && item.options.length > 0) {
          const optionObj: any = {};
          item.options.forEach(opt => {
            const key = opt.optionId;
            if (opt.optionValueId) {
              optionObj[key] = opt.optionValueId;
            } else {
              let val: any = opt.optionValue;
              try {
                val = JSON.parse(opt.optionValue);
              } catch {
                val = opt.optionValue; // Keep as string if not JSON
              }
              optionObj[key] = val;
            }
          });
          obj.option = optionObj;
        }
        return obj;
      });

      // Get user credentials from storage
      const userEmail = await AsyncStorage.getItem('user_email');
      const userPassword = await AsyncStorage.getItem('user_password');

      const payload: any = {
        cart
      };

      // Add credentials if they exist
      if (userEmail && userPassword) {
        payload.email = userEmail;
        payload.password = userPassword;
      }

      // Add session_id to payload if it exists
      if (existingSessionId) {
        payload.session_id = existingSessionId;
      }

      const url = `${BASE_URL}.prepareCheckoutSession`;
      const resp = await fetchWithCurrency(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const res = await resp.json();

      if (res && res.success && res.session_id) {
        // Save session_id to AsyncStorage and state
        await AsyncStorage.setItem('checkout_session_id', res.session_id);
        setSessionId(res.session_id);
      } else {
        console.warn('Failed to prepare session', res);
      }
    } catch (error) {
      console.error('checkout error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    if (navState.url.includes('success') || navState.url.includes('checkout/success')) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderSuccess' }],
      });
    }
  };

  const injectedJavaScript = `
  (function() {
    function applyCustomizations() {
      if (typeof window.jQuery === 'undefined') return;

      $("#top, header, #menu, .breadcrumb, footer").hide();

      if (!document.getElementById('customStyle')) {
        $('<style id="customStyle">')
          .prop('type', 'text/css')
          .html('button:not(.btn-close):not(.accordion-button) { background-color: #FF6B3E !important; border-color: #FF6B3E !important; color: white !important; }')
          .appendTo('head');
      }

      $("#content").css({
        "padding-bottom": "0px",
        "padding": "20px"
      }).find("h1").hide();

      $("a.btn:contains('Continue Shopping')").hide();
      $("a.btn-primary:contains('Checkout')").css({
        "background-color": "#FF6B3E",
        "border-color": "#FF6B3E",
        "color": "white"
      });

      // Detect empty cart
      if ($("#content").text().includes("Your shopping cart is empty")) {
        window.ReactNativeWebView.postMessage("cart_empty");
      }
    }

    function init() {
      if (window.jQuery) {
        applyCustomizations();
      } else {
        var script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        script.onload = applyCustomizations;
        document.head.appendChild(script);
      }
    }

    init();

    const observer = new MutationObserver(() => {
      applyCustomizations();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    true; // required for iOS
  })();
`;



  return (
    <SafeScreen>
      {renderHeader()}
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B3E" />
            </View>
          ) : sessionId ? (
            <WebView
              source={{
                uri: 'https://opencartmobileapp.iextendlabs.com/index.php?route=checkout/cart',
                headers: {
                  Cookie: `OCSESSID=${sessionId}`
                }
              }}
              style={{ flex: 1 }}
              onNavigationStateChange={handleNavigationStateChange}
              injectedJavaScript={injectedJavaScript}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              renderLoading={() => <ActivityIndicator style={styles.loader} size="large" />}
              onMessage={async (event) => {
                const message = event.nativeEvent.data;

                if (message === 'cart_empty') {
                  console.log('🛒 Cart is empty, syncing with server...');
                  try {
                    await syncCartWithServer();
                    console.log('✅ Cart sync completed');
                  } catch (error) {
                    console.error('❌ Sync failed', error);
                  }

                  // Clear cart items and refresh the current screen
                  cartItems.forEach(item => {
                    dispatch(removeFromCart({ id: item.id, options: item.options }));
                  });
                  setIsLoading(false);
                }
              }}
            />
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load cart. Please try again.</Text>
            </View>
          )}
        </View>
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B3E',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
  },
  loader: {
    flex: 1
  },
});

export default CartScreen;