import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import SafeScreen from '../../components/SafeScreen';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
    MainTabs: undefined;
    Product: { product_id: string };
    Wishlist: undefined;
    CheckoutWebView: { sessionId: string; url?: string };
    OrderSuccess: undefined;
};

type RouteParams = {
    CheckoutWebView: {
        sessionId: string;
        url?: string;
    };
};

const CheckoutWebViewScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RouteParams, 'CheckoutWebView'>>();
    const { sessionId, url } = route.params || {};

    const checkoutUrl = url || 'https://opencartmobileapp.iextendlabs.com/index.php?route=checkout/checkout';

    const handleNavigationStateChange = (navState: WebViewNavigation) => {
        // Check if the URL contains success indicators
        if (navState.url.includes('success') || navState.url.includes('checkout/success')) {
            // Navigate to success screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'OrderSuccess' }],
            });
        }
    };

    // JavaScript to be injected after page loads
    const injectedJavaScript = `
        if (window.jQuery) {
            $("#top").hide();
            $("header").hide();
            $("#menu").hide();
            $(".breadcrumb").hide();
            $("footer").hide();
            $('<style>')
                .prop('type', 'text/css')
                .html('button:not(.btn-close) { background-color: #FF6B3E !important; border-color: #FF6B3E !important; color: white !important; }')
                .appendTo('head');
            $("#content").css("padding-bottom", "0px");
            $("#content").css("padding", "20px");
            $("#content").find("h1").hide();
        } else {
            // If jQuery is not available, create a script tag to load it
            var script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = function() {
                $("#top").hide();
                $("header").hide();
                $("#menu").hide();
                $(".breadcrumb").hide();
                $("footer").hide();
                $('<style>')
                    .prop('type', 'text/css')
                    .html('button:not(.btn-close) { background-color: #FF6B3E !important; border-color: #FF6B3E !important; color: white !important; }')
                    .appendTo('head');
                $("#content").css("padding-bottom", "0px");
                $("#content").css("padding", "20px");
                $("#content").find("h1").hide();
            };
            document.head.appendChild(script);
        }
        true; // Note: needed for iOS
    `;

    // Provide the OCSESSID cookie in headers for the initial request
    const source = {
        uri: checkoutUrl,
        headers: {
            Cookie: `OCSESSID=${sessionId}`,
        },
    };

    return (
        <SafeScreen>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.container}>
                {!sessionId ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <WebView
                        source={source}
                        startInLoadingState
                        onNavigationStateChange={handleNavigationStateChange}
                        renderLoading={() => <ActivityIndicator style={styles.loader} size="large" />}
                        injectedJavaScript={injectedJavaScript}
                        onMessage={(event) => {
                            console.log('Message from WebView:', event.nativeEvent.data);
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                )}
            </View>
        </SafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loader: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CheckoutWebViewScreen;
