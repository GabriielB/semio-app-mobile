import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";

interface CategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryDropdown({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryDropdownProps) {
  const data = categories.map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Escolher Categoria"
        searchPlaceholder="Buscar..."
        value={selectedCategory}
        onChange={(item) => {
          onSelectCategory(item.value);
        }}
        renderLeftIcon={() => (
          <Ionicons
            name="chevron-down"
            size={20}
            color="#31144B"
            style={styles.icon}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#A3A3A3",
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#31144B",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 10,
  },
});
