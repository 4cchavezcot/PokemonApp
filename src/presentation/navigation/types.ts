import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { PokemonTypeName } from '@domain/enums/PokemonTypeName';

export type RootStackParamList = {
  Home: undefined;
  Detail: {
    id: number;
    name: string;
    primaryType?: PokemonTypeName;
    imageUrl?: string | null;
  };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'Detail'>;
