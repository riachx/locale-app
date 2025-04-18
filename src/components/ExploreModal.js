import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import ExploreStyle from '../styles/explore.js';
import CustomButton from '../components/CustomButton';
/**
 * ExploreModal component with button
 * @param {Object} props - Component props
 * @returns {JSX.Element} ExploreModal component
 */
const ExploreModal = props => {
  const { visible, onClose, onSortChange } = props;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectMode, setSelectMode] = React.useState('timestamp');
  const [selectOrder, setSelectOrder] = React.useState('desc');

  React.useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setIsModalVisible(false);
    onClose();
    onSortChange(selectMode, selectOrder);
  };

  /**
   * Icon button component
   * @param {Object} props - Component props
   * @returns {JSX.Element} Icon button component
   */
  const IconButton = props => {
    const { text, mode, modeState, setModeState } = props;

    return (
      <Icon.Button
        name={modeState === mode ? 'radio-btn-active' : 'radio-btn-passive'}
        size={20}
        backgroundColor="white"
        color="black"
        onPress={() => setModeState(mode)}
      >
        <Text style={ExploreStyle.modalOption}>{text}</Text>
      </Icon.Button>
    );
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onDismiss={onClose}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={ExploreStyle.modalContainer}>
        <View style={ExploreStyle.modalContent}>
          <Text style={ExploreStyle.modalTitle}>Sort By</Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={ExploreStyle.modalLabel}>Mode:</Text>
            {IconButton({
              text: 'Time',
              mode: 'timestamp',
              modeState: selectMode,
              setModeState: setSelectMode,
            })}
            {IconButton({
              text: 'Popularity',
              mode: 'score',
              modeState: selectMode,
              setModeState: setSelectMode,
            })}
          </View>
          <View>
            <Text style={ExploreStyle.modalLabel}>Order:</Text>
            {IconButton({
              text: 'Ascending',
              mode: 'asc',
              modeState: selectOrder,
              setModeState: setSelectOrder,
            })}
            {IconButton({
              text: 'Descending',
              mode: 'desc',
              modeState: selectOrder,
              setModeState: setSelectOrder,
            })}
          </View>
          <CustomButton
            style={{
              marginTop: 20,
              marginBottom: 10,
              paddingTop: 10,
              paddingBottom: 10,
              width: 200,
            }}
            onPress={handleClose}
            title={'Submit'}
          ></CustomButton>
        </View>
      </View>
    </Modal>
  );
};

export default ExploreModal;
