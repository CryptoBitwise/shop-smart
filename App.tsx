import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Share,
    StatusBar,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import SplashScreen from './components/SplashScreen';

const { width } = Dimensions.get('window');

interface ShoppingItem {
    id: number;
    name: string;
    checked: boolean;
    quantity: number;
}

// Common grocery items for autocomplete suggestions
const COMMON_ITEMS: string[] = [
    'Apples', 'Avocado', 'Bananas', 'Basil', 'Beef', 'Bell Peppers', 'Blueberries', 'Bread', 'Broccoli', 'Butter',
    'Carrots', 'Celery', 'Cheddar Cheese', 'Chicken', 'Cilantro', 'Cinnamon', 'Coffee', 'Corn', 'Cottage Cheese', 'Cucumber',
    'Eggs', 'Flour', 'Garlic', 'Grapes', 'Greek Yogurt', 'Green Onions', 'Ground Beef', 'Ham', 'Honey', 'Hot Dogs',
    'Juice', 'Ketchup', 'Lemons', 'Lettuce', 'Limes', 'Milk', 'Mozzarella', 'Mushrooms', 'Mustard', 'Oats',
    'Olive Oil', 'Onions', 'Oranges', 'Pasta', 'Peanut Butter', 'Pork Chops', 'Potatoes', 'Rice', 'Salmon', 'Salt',
    'Sausage', 'Spinach', 'Strawberries', 'Sugar', 'Tomatoes', 'Tortillas', 'Turkey', 'Vanilla', 'Yogurt'
];

const templates = {
    essentials: [
        'Milk', 'Bread', 'Eggs', 'Cheese', 'Butter',
        'Chicken', 'Ground Beef', 'Rice', 'Pasta',
        'Onions', 'Garlic', 'Salt'
    ],
    produce: [
        'Bananas', 'Apples', 'Oranges', 'Grapes',
        'Lettuce', 'Tomatoes', 'Carrots', 'Broccoli',
        'Potatoes', 'Bell Peppers'
    ],
    bbq: [
        'Burger Patties', 'Hot Dogs', 'Buns', 'Ketchup',
        'Mustard', 'Cheese Slices', 'Lettuce', 'Tomatoes',
        'Pickles', 'Chips', 'Soda', 'Beer', 'Charcoal',
        'BBQ Sauce', 'Aluminum Foil'
    ],
    breakfast: [
        'Eggs', 'Bacon', 'Sausage', 'Pancake Mix',
        'Syrup', 'Orange Juice', 'Coffee', 'Cereal'
    ],
    snacks: [
        'Chips', 'Cookies', 'Crackers', 'Popcorn',
        'Candy', 'Nuts', 'Granola Bars', 'Fruit Snacks',
        'Pretzels', 'Ice Cream'
    ],
    healthy: [
        'Salad Mix', 'Chicken Breast', 'Salmon', 'Quinoa',
        'Greek Yogurt', 'Almonds', 'Avocado', 'Spinach',
        'Blueberries', 'Sweet Potatoes', 'Olive Oil', 'Green Tea'
    ]
};

const App: React.FC = () => {
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [itemInput, setItemInput] = useState('');
    const [itemCount, setItemCount] = useState(0);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSplash, setShowSplash] = useState(true);
    const scrollRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        loadShoppingList();
    }, []);

    useEffect(() => {
        updateItemCount();
    }, [shoppingList]);

    const loadShoppingList = async () => {
        try {
            const stored = await AsyncStorage.getItem('shoppingList');
            if (stored) {
                setShoppingList(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading shopping list:', error);
        }
    };

    const saveShoppingList = async (list: ShoppingItem[]) => {
        try {
            await AsyncStorage.setItem('shoppingList', JSON.stringify(list));
        } catch (error) {
            console.error('Error saving shopping list:', error);
        }
    };

    const updateItemCount = () => {
        const uncheckedCount = shoppingList.filter(item => !item.checked).length;
        setItemCount(uncheckedCount);
    };

    const addItem = () => {
        const itemName = itemInput.trim();

        if (!itemName) return;

        // Check if item already exists
        if (shoppingList.some(item => item.name.toLowerCase() === itemName.toLowerCase())) {
            Alert.alert('Item already exists', 'This item is already in your list!');
            return;
        }

        const newItem: ShoppingItem = {
            id: Date.now(),
            name: itemName,
            checked: false,
            quantity: 1
        };

        const updatedList = [newItem, ...shoppingList];
        setShoppingList(updatedList);
        saveShoppingList(updatedList);
        setItemInput('');
        setSuggestions([]);

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const quickAdd = (itemName: string) => {
        setItemInput(itemName);
        addItem();
    };

    const onChangeInput = (text: string) => {
        setItemInput(text);
        const q = text.trim().toLowerCase();
        if (q.length === 0) {
            setSuggestions([]);
            return;
        }
        // Filter common items by startsWith first, then includes; limit to 8
        const starts = COMMON_ITEMS.filter(i => i.toLowerCase().startsWith(q));
        const contains = COMMON_ITEMS.filter(
            i => !starts.includes(i) && i.toLowerCase().includes(q)
        );
        const filtered = [...starts, ...contains].slice(0, 8);
        setSuggestions(filtered);
    };

    const chooseSuggestion = (name: string) => {
        setItemInput(name);
        setSuggestions([]);
    };

    const loadTemplate = (templateName: string) => {
        const items = templates[templateName as keyof typeof templates];

        Alert.alert(
            'Load Template',
            `Load ${templateName} template? This will replace your current list.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Load',
                    onPress: () => {
                        const newList = items.map((item, index) => ({
                            id: Date.now() + index,
                            name: item,
                            checked: false,
                            quantity: 1
                        }));

                        setShoppingList(newList);
                        saveShoppingList(newList);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                }
            ]
        );
    };

    const toggleItem = (id: number) => {
        const updatedList = shoppingList.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setShoppingList(updatedList);
        saveShoppingList(updatedList);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const deleteItem = (id: number) => {
        const updatedList = shoppingList.filter(item => item.id !== id);
        setShoppingList(updatedList);
        saveShoppingList(updatedList);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const clearChecked = () => {
        const checkedCount = shoppingList.filter(item => item.checked).length;

        if (checkedCount === 0) {
            Alert.alert('No checked items', 'No checked items to clear!');
            return;
        }

        Alert.alert(
            'Clear Checked Items',
            `Clear ${checkedCount} checked items?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    onPress: () => {
                        const updatedList = shoppingList.filter(item => !item.checked);
                        setShoppingList(updatedList);
                        saveShoppingList(updatedList);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    }
                }
            ]
        );
    };

    const shareList = async () => {
        const uncheckedItems = shoppingList.filter(item => !item.checked);

        if (uncheckedItems.length === 0) {
            Alert.alert('No items to share', 'No items to share!');
            return;
        }

        const text = `Shopping List (${uncheckedItems.length} items):\n\n` +
            uncheckedItems.map(item => `• ${item.name}`).join('\n');

        try {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(text, {
                    mimeType: 'text/plain',
                    dialogTitle: 'Share Shopping List'
                });
            } else {
                await Share.share({
                    message: text,
                    title: 'Shopping List'
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const renderTemplateButton = (emoji: string, name: string, count: number, templateKey: string) => (
        <TouchableOpacity
            key={templateKey}
            style={styles.templateBtn}
            onPress={() => loadTemplate(templateKey)}
        >
            <Text style={styles.templateEmoji}>{emoji}</Text>
            <Text style={styles.templateName}>{name}</Text>
            <Text style={styles.templateCount}>{count} items</Text>
        </TouchableOpacity>
    );

    const renderShoppingItem = (item: ShoppingItem) => (
        <TouchableOpacity
            key={item.id}
            style={[styles.listItem, item.checked && styles.listItemChecked]}
            onPress={() => toggleItem(item.id)}
        >
            <View style={[styles.checkbox, item.checked && styles.checkboxChecked]}>
                {item.checked && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={[styles.itemName, item.checked && styles.itemNameChecked]}>
                {item.name}
            </Text>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteItem(item.id)}
            >
                <Text style={styles.deleteBtnText}>×</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (showSplash) {
        return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#3B82F6" />

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appTitle}>
                        🛒 ShopSmart
                    </Text>
                </View>

                {/* Counter */}
                <View style={styles.counter}>
                    <Text style={styles.counterNumber}>{itemCount}</Text>
                    <Text style={styles.counterLabel}>items</Text>
                </View>

                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets
                >
                    {/* Templates Section */}
                    <View style={styles.templatesSection}>
                        <Text style={styles.sectionTitle}>Quick Templates</Text>
                        <View style={styles.templateGrid}>
                            {renderTemplateButton('🥛', 'Essentials', 12, 'essentials')}
                            {renderTemplateButton('🥬', 'Produce', 10, 'produce')}
                            {renderTemplateButton('🍔', 'BBQ Party', 15, 'bbq')}
                            {renderTemplateButton('🥞', 'Breakfast', 8, 'breakfast')}
                            {renderTemplateButton('🍿', 'Snacks', 10, 'snacks')}
                            {renderTemplateButton('🥗', 'Healthy', 12, 'healthy')}
                        </View>
                    </View>

                    {/* Add Item Section */}
                    <View style={styles.addSection}>
                        <View style={styles.addContainer}>
                            <View style={styles.addInputGroup}>
                                <TextInput
                                    style={[
                                        styles.addInput,
                                        suggestions.length > 0 && styles.addInputWithSuggestions
                                    ]}
                                    value={itemInput}
                                    onChangeText={onChangeInput}
                                    placeholder="Add item..."
                                    placeholderTextColor="#9CA3AF"
                                    onSubmitEditing={addItem}
                                    returnKeyType="done"
                                    onFocus={() => {
                                        // Ensure the input area stays visible when keyboard opens
                                        scrollRef.current?.scrollTo({ y: 0, animated: true });
                                    }}
                                />
                                <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                                    <Text style={styles.addBtnText}>+ Add</Text>
                                </TouchableOpacity>
                            </View>
                            {suggestions.length > 0 && (
                                <View style={styles.suggestionsBox}>
                                    <View style={styles.suggestionsHeader}>
                                        <Text style={styles.suggestionsHeaderText}>
                                            💡 {suggestions.length} suggestions
                                        </Text>
                                    </View>
                                    {suggestions.map(name => (
                                        <TouchableOpacity
                                            key={name}
                                            style={styles.suggestionItem}
                                            onPress={() => chooseSuggestion(name)}
                                        >
                                            <Text style={styles.suggestionText}>{name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View style={styles.quickAdds}>
                                {['Milk', 'Bread', 'Eggs', 'Cheese', 'Butter'].map(item => (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.quickPill}
                                        onPress={() => quickAdd(item)}
                                    >
                                        <Text style={styles.quickPillText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Shopping List */}
                    <View style={styles.listSection}>
                        <View style={styles.listContainer}>
                            <Text style={styles.sectionTitle}>Shopping List</Text>
                            {shoppingList.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyEmoji}>🛒</Text>
                                    <Text style={styles.emptyText}>Your cart is empty</Text>
                                    <Text style={styles.emptySubtext}>
                                        Add items or choose a template above
                                    </Text>
                                </View>
                            ) : (
                                <View>
                                    {shoppingList
                                        .sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1))
                                        .map(renderShoppingItem)}
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Actions */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.clearBtn} onPress={clearChecked}>
                        <Text style={styles.clearBtnText}>🧹 Clear Checked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn} onPress={shareList}>
                        <Text style={styles.shareBtnText}>📤 Share List</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBF5',
    },
    header: {
        backgroundColor: '#3B82F6',
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
    },
    counter: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    counterNumber: {
        color: '#3B82F6',
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    counterLabel: {
        color: '#6B7280',
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
        paddingBottom: 100,
    },
    templatesSection: {
        padding: 20,
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#6B7280',
        marginBottom: 15,
        fontWeight: '600',
    },
    templateGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    templateBtn: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: (width - 80) / 2,
        marginBottom: 12,
    },
    templateEmoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    templateName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 2,
    },
    templateCount: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    addSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    addContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    addInputGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    addInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
    addInputWithSuggestions: {
        borderColor: '#3B82F6',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    addBtn: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionsBox: {
        marginTop: 8,
        borderWidth: 2,
        borderColor: '#3B82F6',
        borderRadius: 12,
        backgroundColor: 'white',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        maxHeight: 200,
    },
    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: 'white',
    },
    suggestionText: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    suggestionsHeader: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    suggestionsHeaderText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
    },
    addBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    quickAdds: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 8,
    },
    quickPill: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    quickPillText: {
        color: '#92400E',
        fontSize: 12,
        fontWeight: '500',
    },
    listSection: {
        paddingHorizontal: 20,
    },
    listContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 10,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 16,
        color: '#9CA3AF',
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFBF5',
        borderRadius: 10,
        marginBottom: 8,
    },
    listItemChecked: {
        opacity: 0.5,
        backgroundColor: '#F3F4F6',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 3,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    checkboxCheck: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    itemNameChecked: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    deleteBtn: {
        padding: 5,
    },
    deleteBtnText: {
        color: '#EF4444',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    clearBtn: {
        flex: 1,
        backgroundColor: '#FEF3C7',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    clearBtnText: {
        color: '#92400E',
        fontSize: 14,
        fontWeight: '600',
    },
    shareBtn: {
        flex: 1,
        backgroundColor: '#DBEAFE',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    shareBtnText: {
        color: '#1E40AF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default App;
