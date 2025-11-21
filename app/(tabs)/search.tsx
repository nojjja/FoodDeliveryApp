import CartButton from '@/components/CartButton';
import Filter from '@/components/Filter';
import MenuCard from '@/components/MenuCard';
import SearchBar from '@/components/SearchBar';
import { getCategories, getMenu } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { Category, MenuItem } from '@/type';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const bucketId = 'YOUR_BUCKET_ID'; // <-- вставь сюда bucketId Appwrite
const projectId = 'YOUR_PROJECT_ID'; // <-- вставь сюда projectId Appwrite

const Search = () => {
  const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

  // Получаем меню
  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  // Получаем категории
  const { data: categoriesData } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query, limit: 6 });
  }, [category, query]);

  // Преобразуем меню в MenuItem с публичным URL картинок
  const menuItems: MenuItem[] = data?.map((doc: any) => ({
    $id: doc.$id,
    $collectionId: doc.$collectionId,
    $databaseId: doc.$databaseId,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
    $permissions: doc.$permissions || [],
    $sequence: doc.$sequence || 0,
    name: doc.name,
    price: doc.price,
    description: doc.description,
    calories: doc.calories,
    protein: doc.protein,
    rating: doc.rating,
    type: doc.type,
    image_url: doc.image_id
      ? `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${doc.image_id}/view?project=${projectId}`
      : '', // пустая строка, если картинки нет
  })) || [];

  const categories: Category[] = categoriesData?.map((doc: any) => ({
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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={menuItems}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View style={[styles.menuItemWrapper, !isFirstRightColItem && { marginTop: 10 }]}>
              {/* Если хочешь, можешь заменить MenuCard на кастомный <View> с Image */}
              <MenuCard item={item} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={() => (
          <View style={styles.headerWrapper}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.searchTitle}>Search</Text>
                <Text style={styles.searchSubtitle}>Find your favorite food</Text>
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

const styles = StyleSheet.create({
  safeArea: { backgroundColor: 'white', flex: 1 },
  menuItemWrapper: { flex: 1, maxWidth: '48%' },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 7 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 32, gap: 7 },
  headerWrapper: { marginVertical: 20, gap: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  searchTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', color: '#0d6efd' },
  searchSubtitle: { fontSize: 16, fontWeight: '600', color: '#333333', marginTop: 2 },
});
