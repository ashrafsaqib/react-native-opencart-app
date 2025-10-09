import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeScreen from '../../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/slices/cartSlice';

type RootStackParamList = {
    MainTabs: undefined;
    Product: { product_id: string };
    Wishlist: undefined;
    CheckoutWebView: { sessionId: string; url?: string };
    OrderSuccess: undefined;
};

const OrderSuccessScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    useEffect(() => {
        const cleanup = async () => {
            dispatch(clearCart());
            await AsyncStorage.removeItem('checkout_session_id');
        };
        
        cleanup();
    }, []);

    return (
        <SafeScreen>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                })}>
                    <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Confirmation</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.container}>
                <View style={styles.content}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                    <Text style={styles.title}>Thank You!</Text>
                    <Text style={styles.message}>Your order has been placed successfully</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'MainTabs' }],
                        })}
                    >
                        <Text style={styles.buttonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#FF6B3E',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OrderSuccessScreen;