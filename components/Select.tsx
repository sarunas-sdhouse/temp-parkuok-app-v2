import { useState } from 'react';
import { View, Text, ViewStyle, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppTheme } from 'theme/theme';

interface Item {
  label: string;
  value: string;
}

interface ISelectProps {
  defaultValue?: string;
  data: Item[];
  label: string;
  style?: ViewStyle;
  placeholder: string;
  onValueChange: (value: any) => void;
}

const Select = ({ defaultValue, data, label, style, placeholder, onValueChange }: ISelectProps) => {
  const { colors, text } = useAppTheme();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || null);
  const [items, setItems] = useState<Item[]>(data);

  return (
    <View style={{ ...style, zIndex: 10 }}>
      <Text style={{ ...text.regular, color: colors.black, marginBottom: 4, fontSize: 14 }}>{label}</Text>
      <DropDownPicker
        // listMode={Platform.OS === 'ios' ? 'MODAL' : 'SCROLLVIEW'}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={onValueChange}
        dropDownContainerStyle={{
          borderColor: colors.grey,
        }}
        textStyle={{ fontFamily: 'MontserratMedium' }}
        style={{
          backgroundColor: colors.white,
          borderColor: colors.grey,
          borderWidth: 1,
          borderRadius: 14,
        }}
        labelStyle={{
          color: colors.black,
          fontFamily: 'MontserratMedium',
        }}
        // modalContentContainerStyle={{
        //   backgroundColor: colors.primary
        // }}
        placeholder={placeholder}
        placeholderStyle={{ color: colors.black }}
        arrowIconStyle={{ tintColor: colors.black } as any}
      />
    </View>
  );
};

export default Select;
