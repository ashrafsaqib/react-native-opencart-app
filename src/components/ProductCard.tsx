import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WishlistButton from './WishlistButton';

type Product = {
    id?: string;
    name?: string;
    price?: string | number;
    special?: string | number;
    image?: string;
    options?: boolean;
};

type Props = {
    product: Product;
    onPress?: () => void;
    onAdd?: () => void;
    badge?: React.ReactNode;
    containerStyle?: any;
    imageStyle?: any;
    infoStyle?: any;
};

const ProductCard: React.FC<Props> = ({
    product,
    onPress,
    onAdd,
    badge,
    containerStyle,
    imageStyle,
    infoStyle,
}) => {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.gridCard, containerStyle]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {badge ? <View style={styles.badgeContainer}>{badge}</View> : null}

            <WishlistButton
                product={{
                    id: product.id ?? '',
                    name: product.name ?? '',
                    price: Number(String(product.special ?? product.price).replace(/[^0-9.-]+/g, '')) || 0,
                    image: product.image ?? '',
                }}
                size={20}
                style={styles.wishlistOverlay}
            />

            {product.image && !imageFailed ? (
                <Image
                    source={{ uri: product.image }}
                    style={[styles.gridImage, imageStyle]}
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <View style={[styles.gridImage, styles.fallback, imageStyle]}>
                    <Ionicons name="play" size={40} color="#FF6B3E" />
                </View>
            )}

            <View style={[styles.gridInfo, infoStyle]}>
                <Text style={styles.gridName} numberOfLines={2}>
                    {product.name}
                </Text>

                <View style={styles.gridPriceRow}>
                    <View style={styles.priceWrap}>
                        <Text style={styles.price}>{product.special ?? product.price}</Text>
                        {product.special && <Text style={styles.oldPrice}>{product.price}</Text>}
                    </View>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={(e: any) => {
                            // prevent parent TouchableOpacity from triggering
                            if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
                            onAdd && onAdd();
                        }}
                    >
                        <Ionicons name="cart-outline" size={20} color="#FF6B3E" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gridCard: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gridImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    gridInfo: {
        padding: 12,
    },
    gridName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        lineHeight: 18,
        maxHeight: 40,
    },
    gridPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6B3E',
    },
    oldPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    fallback: {
        backgroundColor: '#FFF5F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 2,
    },
    wishlistOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 3,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        padding: 6,
    },
    cartButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF0EC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProductCard;
