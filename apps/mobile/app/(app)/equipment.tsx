import { EquipmentScreen } from '@/screens/EquipmentScreen';
import { useNavigation } from 'expo-router';

export default function EquipmentRoute() {
  const navigation = useNavigation();
  return <EquipmentScreen navigation={navigation} />;
}
