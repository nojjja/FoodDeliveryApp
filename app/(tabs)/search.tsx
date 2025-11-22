import CartButton from '@/components/CartButton';
import MenuCard from '@/components/MenuCard';
import { getCategories, getMenu } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { Category, MenuItem } from '@/type';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Filter from '@/components/Filter';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  const { data: categoriesData } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  // Преобразуем меню в MenuItem
  const menuItems: MenuItem[] =
    data?.map((doc: any) => ({
      ...doc,
      image_url: doc.image_url || '',
    })) || [];

  // Преобразуем категории в Category[]
  const categories: Category[] =
    categoriesData?.map((doc: any) => ({
      $id: doc.$id,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions || [],
      $sequence: doc.$sequence || 0,
      name: doc.name,
      description: doc.description,
    })) || [];

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={menuItems}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              style={{
                flex: 1,
                maxWidth: '48%',
                marginTop: !isFirstRightColItem ? 10 : 0,
              }}
            >
              <MenuCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', gap: 7 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 7 }}
        ListHeaderComponent={() => (
          <View style={{ marginVertical: 20, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', textTransform: 'uppercase', color: '#0d6efd' }}>Search</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 }}>
                  Find your favorite food
                </Text>
              </View>
              <CartButton />
            </View>

            <SearchBar />
            <Filter categories={categories} />
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results</Text>}
      />
    </SafeAreaView>
  );
};

export default Search;
