import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language.code);
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === selectedLanguage && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text
        style={[
          styles.languageName,
          item.code === selectedLanguage && styles.selectedLanguageName,
        ]}
      >
        {item.name}
      </Text>
      {item.code === selectedLanguage && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{selectedLang.flag}</Text>
        <Text style={styles.selectedText}>{selectedLang.code.toUpperCase()}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir la langue</Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginRight: 6,
  },
  arrow: {
    fontSize: 10,
    color: '#8E8E93',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageList: {
    maxHeight: 200,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedLanguageItem: {
    backgroundColor: '#E3F2FD',
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  selectedLanguageName: {
    fontWeight: '600',
    color: '#007AFF',
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
