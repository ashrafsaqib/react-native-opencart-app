import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ProductOptionsProps {
  options: any[];
  onChange?: (selected: Record<string, any>, isValid: boolean) => void;
  onQuantityChange?: (quantity: number) => void;
  initialQuantity?: number;
}

const ProductOptions = React.forwardRef<{ validateOptions: () => boolean }, ProductOptionsProps>((
  { 
    options = [], 
    onChange,
    onQuantityChange,
    initialQuantity = 1 
  },
  ref
) => {
  // Expose validateOptions method through ref
  React.useImperativeHandle(ref, () => ({
    validateOptions
  }));
  const [selected, setSelected] = useState<Record<string, any>>({});
  const [quantity, setQuantity] = useState(initialQuantity);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
  }, [options]);

  useEffect(() => {
    // Handle quantity change
    if (onQuantityChange) {
      onQuantityChange(quantity);
    }

    // Just pass the selected options without validation
    onChange?.(selected, true);
  }, [selected, quantity, options]);

  // Function to validate all required fields
  const validateOptions = () => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    options.forEach(opt => {
      if (opt.required === "1") {
        const value = selected[opt.product_option_id];
        let fieldValid = false;

        switch (opt.type) {
          case 'checkbox':
            fieldValid = Array.isArray(value) && value.length > 0;
            break;
          case 'radio':
          case 'select':
            fieldValid = value !== undefined && value !== '';
            break;
          case 'text':
          case 'textarea':
          case 'date':
          case 'time':
            fieldValid = value !== undefined && value !== '';
            break;
          case 'datetime':
            fieldValid = !!value && value.trim() !== '';
            break;
          case 'file':
            fieldValid = !!value;
            break;
          default:
            fieldValid = true;
        }

        newErrors[opt.product_option_id] = !fieldValid;
        if (!fieldValid) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const toggleCheckbox = (optId: string | number, valId: string) => {
    const key = String(optId);
    const prev = selected[key] || [];
    const exists = prev.includes(valId);
    const next = exists ? prev.filter((v: string) => v !== valId) : [...prev, valId];
    const nextState = { ...selected, [key]: next };
    setSelected(nextState);
  };

  const chooseSingle = (optId: string | number, valId: string) => {
    const key = String(optId);
    const nextState = { ...selected, [key]: valId };
    setSelected(nextState);
  };

  const setText = (optId: string | number, text: string) => {
    const key = String(optId);
    const nextState = { ...selected, [key]: text };
    setSelected(nextState);
  };

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const formatTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const formatDateTime = (d: Date) => `${formatDate(d)} ${formatTime(d)}`;

  const [pickerState, setPickerState] = useState<{ optId?: string; mode?: 'date' | 'time'; visible: boolean; date?: Date; originalType?: 'date' | 'time' | 'datetime'; tempDate?: Date }>({ visible: false });

  const parseDateFromValue = (type: string, value: any) => {
    if (!value) return new Date();
    try {
      if (type === 'date') {
        // expect YYYY-MM-DD
        const m = String(value).match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      }
      if (type === 'time') {
        // expect HH:MM
        const m = String(value).match(/(\d{1,2}):(\d{2})/);
        const now = new Date();
        if (m) {
          now.setHours(Number(m[1]), Number(m[2]), 0, 0);
          return now;
        }
      }
      if (type === 'datetime') {
        // accept YYYY-MM-DD HH:MM or ISO
        const m = String(value).match(/(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})/);
        if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) return parsed;
      }
      // fallback: try Date constructor
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    } catch (e) {
      // ignore and fallback
    }
    return new Date();
  };

  const openPicker = (optId: string | number, type: string) => {
    if (!DateTimePicker) {
      // no native picker - insert current time/date directly
      const now = new Date();
      const val = type === 'date' ? formatDate(now) : type === 'time' ? formatTime(now) : formatDateTime(now);
      setText(optId, val);
      return;
    }
    const current = selected[optId] ?? '';
    const date = parseDateFromValue(type, current);
    if (type === 'datetime') {
      // start with date, then time
      setPickerState({ visible: true, optId: String(optId), mode: 'date', date, originalType: 'datetime' });
    } else {
      setPickerState({ visible: true, optId: String(optId), mode: type === 'time' ? 'time' : 'date', date, originalType: type as any });
    }
  };

  // Handle quantity changes with validation
  const handleQuantityChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(num);
      onQuantityChange?.(num);
    }
  };

  const adjustQuantity = (increment: number) => {
    const newQuantity = quantity + increment;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      {/* Quantity Input */}
      <View style={styles.optionRow}>
        <Text style={styles.optionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => adjustQuantity(-1)}
            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
            disabled={quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.quantityInput}
            value={String(quantity)}
            onChangeText={handleQuantityChange}
            keyboardType="number-pad"
            selectTextOnFocus
          />
          
          <TouchableOpacity 
            onPress={() => adjustQuantity(1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Options */}
      {Array.isArray(options) && options.length > 0 && options.map((opt) => (
        <View key={String(opt.product_option_id || opt.option_id)} style={styles.optionRow}>
          <View style={styles.optionTitleRow}>
            <Text style={styles.optionTitle}>{opt.name}</Text>
            {opt.required === "1" && (
              <Text style={styles.requiredStar}>*</Text>
            )}
          </View>
          {errors[opt.product_option_id] && (
            <Text style={styles.errorText}>This field is required</Text>
          )}

          {(['radio', 'select'].includes(opt.type) && Array.isArray(opt.product_option_value)) && (
            <View style={styles.valuesRow}>
              {opt.product_option_value.map((val: any) => {
                const isSelected = selected[opt.product_option_id] === String(val.product_option_value_id || val.product_option_value_id);
                return (
                  <TouchableOpacity
                    key={String(val.product_option_value_id)}
                    style={[styles.valueButton, isSelected && styles.valueButtonActive]}
                    onPress={() => chooseSingle(opt.product_option_id || opt.option_id, String(val.product_option_value_id))}
                  >
                    <Text style={[styles.valueLabel, isSelected && styles.valueLabelActive]}>{val.name}{val.price ? ` (${val.price_prefix}${val.price})` : ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {opt.type === 'checkbox' && Array.isArray(opt.product_option_value) && (
            <View style={styles.valuesRow}>
              {opt.product_option_value.map((val: any) => {
                const sel = selected[opt.product_option_id] || [];
                const isSelected = sel.includes(String(val.product_option_value_id));
                return (
                  <TouchableOpacity
                    key={String(val.product_option_value_id)}
                    style={styles.checkboxRow}
                    onPress={() => toggleCheckbox(opt.product_option_id || opt.option_id, String(val.product_option_value_id))}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.valueLabel}>{val.name}{val.price ? ` (${val.price_prefix}${val.price})` : ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {(opt.type === 'text' || opt.type === 'textarea') && (
            <TextInput
            style={[styles.textInput, opt.type === 'textarea' && styles.textarea]}
              placeholder={opt.name}
              value={selected[opt.product_option_id] ?? ''}
              onChangeText={(t) => setText(opt.product_option_id || opt.option_id, t)}
              multiline={opt.type === 'textarea'}
            />
          )}

          {(opt.type === 'date' || opt.type === 'time' || opt.type === 'datetime') && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TextInput
                style={[styles.textInput, styles.dateInput]}
                placeholder={opt.type === 'date' ? 'YYYY-MM-DD' : opt.type === 'time' ? 'HH:MM' : 'YYYY-MM-DD HH:MM'}
                value={selected[opt.product_option_id] ?? ''}
                onChangeText={(t) => setText(opt.product_option_id || opt.option_id, t)}
                // when focused or pressed, open native picker instead of keyboard
                onFocus={() => openPicker(opt.product_option_id || opt.option_id, opt.type)}
                onPressIn={() => openPicker(opt.product_option_id || opt.option_id, opt.type)}
                // prevent soft keyboard on Android
                {...(Platform.OS === 'android' ? { showSoftInputOnFocus: false } : {})}
              />
              {Platform.OS === 'web' ? (
                <TouchableOpacity
                  onPress={() => {
                    const now = new Date();
                    const val = opt.type === 'date' ? formatDate(now) : opt.type === 'time' ? formatTime(now) : formatDateTime(now);
                    setText(opt.product_option_id || opt.option_id, val);
                  }}
                  style={styles.nowButton}
                >
                  <Ionicons name={opt.type === 'time' ? 'time' : 'calendar'} size={18} color="#0F172A" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => openPicker(opt.product_option_id || opt.option_id, opt.type)}
                  style={styles.nowButton}
                >
                  <Ionicons name={opt.type === 'time' ? 'time' : 'calendar'} size={18} color="#0F172A" />
                </TouchableOpacity>
              )}

              {pickerState.visible && pickerState.optId === String(opt.product_option_id || opt.option_id) && (
                Platform.OS === 'android' ? (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={pickerState.date || new Date()}
                    mode={pickerState.mode === 'time' ? 'time' : 'date'}
                    display="default"
                    onChange={(e: any, d?: Date) => {
                      // Android: onChange is called once and picker closes; handle two-stage datetime by reopening
                      if (!d) {
                        setPickerState({ visible: false });
                        return;
                      }
                      if (pickerState.originalType === 'datetime' && pickerState.mode === 'date') {
                        // keep date part and open time picker
                        setPickerState({ visible: true, optId: pickerState.optId, mode: 'time', date: d, originalType: 'datetime', tempDate: d });
                        return;
                      }
                      if (pickerState.originalType === 'datetime' && pickerState.mode === 'time' && pickerState.tempDate) {
                        // combine date and time
                        const datePart = pickerState.tempDate;
                        datePart.setHours(d.getHours(), d.getMinutes(), 0, 0);
                        setText(pickerState.optId!, formatDateTime(datePart));
                        setPickerState({ visible: false });
                        return;
                      }
                      // single mode
                      setText(pickerState.optId!, pickerState.mode === 'time' ? formatTime(d) : formatDate(d));
                      setPickerState({ visible: false });
                    }}
                  />
                ) : (
                  <DateTimePicker
                    value={pickerState.date || new Date()}
                    mode={pickerState.mode === 'time' ? 'time' : 'date'}
                    display="spinner"
                    onChange={(e: any, d?: Date) => {
                      if (!d) return;
                      if (pickerState.originalType === 'datetime' && pickerState.mode === 'date') {
                        // move to time selection
                        setPickerState({ visible: true, optId: pickerState.optId, mode: 'time', date: d, originalType: 'datetime', tempDate: d });
                        return;
                      }
                      if (pickerState.originalType === 'datetime' && pickerState.mode === 'time' && pickerState.tempDate) {
                        const datePart = pickerState.tempDate;
                        datePart.setHours(d.getHours(), d.getMinutes(), 0, 0);
                        setText(pickerState.optId!, formatDateTime(datePart));
                        setPickerState({ visible: false });
                        return;
                      }
                      // for single selection on iOS, set the value and close the picker
                      setText(pickerState.optId!, pickerState.mode === 'time' ? formatTime(d) : formatDate(d));
                      setPickerState({ visible: false });
                    }}
                    onTouchCancel={() => setPickerState({ visible: false })}
                  />
                )
              )}
            </View>
          )}

          {opt.type === 'file' && (
            <TouchableOpacity style={styles.uploadButton} onPress={() => {/* placeholder - implement file picker if needed */}}>
              <Text style={styles.uploadText}>Upload file</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  optionRow: {
    marginBottom: 16,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#FF0000',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 200,
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FF6B3E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  quantityInput: {
    width: 50,
    height: 36,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 8,
    textAlign: 'center',
    color: '#0F172A',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0F172A',
  },
  valuesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginRight: 8,
  },
  valueButtonActive: {
    backgroundColor: '#FF6B3E',
  },
  valueLabel: {
    color: '#0F172A',
  },
  valueLabelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxActive: {
    backgroundColor: '#FF6B3E',
    borderColor: '#FF6B3E',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  uploadText: {
    color: '#0F172A',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
  },
  datePickerText: {
    color: '#0F172A',
  },
  dateInput: {
    minWidth: 160,
  },
  nowButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
});

export default ProductOptions;
