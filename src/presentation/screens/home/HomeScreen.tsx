import {StyleSheet, View} from 'react-native'
import {FAB, Text, useTheme} from 'react-native-paper'
import {getPokemons} from '../../../actions/pokemons'
import {useInfiniteQuery} from '@tanstack/react-query'
import {PokeballBg} from '../../components/ui/PokeballBg'
import {FlatList} from 'react-native-gesture-handler'
import {globalTheme} from '../../../config/theme/global-theme'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {PokemonCard} from '../../components/pokemons/PokemonCard'
import {StackScreenProps} from '@react-navigation/stack'
import {RootStackParams} from '../../navigator/StackNavigator'

interface Props extends StackScreenProps<RootStackParams, 'HomeScreen'> {}

export const HomeScreen = ({navigation}: Props) => {
    const {top} = useSafeAreaInsets()
    const theme = useTheme()

    // Forma tradicional de una peticion http
    /* const {isLoading, data: pokemons = []} = useQuery({
        queryKey: ['pokemons'],
        queryFn: () => getPokemons(0),
        staleTime: 1000 * 60 * 60, // 60 minutos
    }) */

    const {isLoading, data, fetchNextPage} = useInfiniteQuery({
        queryKey: ['pokemons', 'infinite'],
        initialPageParam: 0,
        queryFn: params => getPokemons(params.pageParam),
        getNextPageParam: (lastPage, pages) => pages.length,
        staleTime: 1000 * 60 * 60, // 60 minutos
    })

    return (
        <View style={globalTheme.globalMargin}>
            <PokeballBg style={styles.imgPosition} />
            <FlatList
                data={data?.pages.flat() ?? []}
                keyExtractor={(pokemon, index) => `${pokemon.id}-${index}`}
                numColumns={2}
                style={{paddingTop: top + 20}}
                ListHeaderComponent={() => (
                    <Text variant="displayMedium">Pokedex</Text>
                )}
                renderItem={({item}) => <PokemonCard pokemon={item} />}
                onEndReachedThreshold={0.6}
                onEndReached={() => fetchNextPage()}
                showsVerticalScrollIndicator={false}
            />
            <FAB
                label="Buscar"
                style={[
                    globalTheme.fab,
                    {backgroundColor: theme.colors.primary},
                ]}
                mode="elevated"
                color={theme.dark ? 'black' : 'white'}
                onPress={() => navigation.push('SearchScreen')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    imgPosition: {
        position: 'absolute',
        top: -10,
        right: -100,
    },
})
